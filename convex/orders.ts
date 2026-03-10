import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Create order
export const createOrder = mutation({
  args: {
    customerId: v.id("users"),
    items: v.array(v.object({
      productId: v.id("products"),
      sku: v.string(),
      name: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
    })),
    shippingAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    }),
    whatsappPhone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate order number
    const orderCount = await ctx.db.query("orders").collect();
    const orderNumber = `ORD-${Date.now()}-${orderCount.length + 1}`;
    
    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of args.items) {
      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;
      orderItems.push({
        ...item,
        totalPrice,
      });
    }
    
    const totalAmount = subtotal; // Add tax, shipping later
    
    // Get customer info
    const customer = await ctx.db.get(args.customerId);
    
    // Create order
    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      customerId: args.customerId,
      status: "pending",
      paymentStatus: "pending",
      items: orderItems,
      subtotal,
      discountAmount: 0,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount,
      shippingAddress: args.shippingAddress,
      whatsappPhone: args.whatsappPhone,
      notes: args.notes,
      createdAt: Date.now(),
    });
    
    // Create notification for new order
    await ctx.runMutation(api.notifications.createNotification, {
      type: "new_order",
      title: "Nuevo pedido recibido",
      message: `Pedido ${orderNumber} de ${customer?.name || 'Cliente'} por $${totalAmount.toLocaleString()}`,
      orderId,
      customerEmail: customer?.email,
      customerPhone: args.whatsappPhone || customer?.phone,
      read: false,
    });
    
    // Update inventory
    for (const item of args.items) {
      const inventory = await ctx.db.query("inventory")
        .withIndex("by_product", (q) => q.eq("productId", item.productId))
        .first();
      
      if (inventory) {
        await ctx.db.patch(inventory._id, {
          quantityAvailable: inventory.quantityAvailable - item.quantity,
          quantityReserved: inventory.quantityReserved + item.quantity,
          lastUpdated: Date.now(),
        });
      }
    }
    
    return { orderId, orderNumber };
  },
});

// Get customer orders
export const getCustomerOrders = query({
  args: { customerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .take(50);
  },
});

// Get order by number
export const getOrderByNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
  },
});

// Get recent orders (for notifications)
export const getRecentOrders = query({
  args: { 
    since: v.number(), // timestamp
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("orders")
      .filter((q) => q.gt(q.field("createdAt"), args.since))
      .order("desc")
      .take(10);
  },
});

// Get all orders (for admin)
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders")
      .order("desc")
      .take(100);
  },
});

// Update order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    
    const oldStatus = order.status;
    
    await ctx.db.patch(args.orderId, { status: args.status });
    
    // Get customer info
    const customer = await ctx.db.get(order.customerId);
    
    // Create notification for status change
    const statusLabels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      processing: "En proceso",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };
    
    await ctx.runMutation(api.notifications.createNotification, {
      type: "order_status_change",
      title: `Pedido ${order.orderNumber} actualizado`,
      message: `Estado cambiado de ${statusLabels[oldStatus]} a ${statusLabels[args.status]}`,
      orderId: args.orderId,
      customerEmail: customer?.email,
      customerPhone: order.whatsappPhone || customer?.phone,
      read: false,
    });
    
    // If delivered, release reserved inventory
    if (args.status === "delivered") {
      for (const item of order.items) {
        const inventory = await ctx.db.query("inventory")
          .withIndex("by_product", (q) => q.eq("productId", item.productId))
          .first();
        
        if (inventory) {
          await ctx.db.patch(inventory._id, {
            quantityReserved: Math.max(0, inventory.quantityReserved - item.quantity),
            lastUpdated: Date.now(),
          });
        }
      }
    }
    
    // If cancelled, return inventory
    if (args.status === "cancelled") {
      for (const item of order.items) {
        const inventory = await ctx.db.query("inventory")
          .withIndex("by_product", (q) => q.eq("productId", item.productId))
          .first();
        
        if (inventory) {
          await ctx.db.patch(inventory._id, {
            quantityAvailable: inventory.quantityAvailable + item.quantity,
            quantityReserved: Math.max(0, inventory.quantityReserved - item.quantity),
            lastUpdated: Date.now(),
          });
        }
      }
    }
  },
});
