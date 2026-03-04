import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});
