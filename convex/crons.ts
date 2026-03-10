import { query, mutation, internalAction } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// Send notification (internal function used by cron)
export const sendNotification = internalAction({
  args: {
    type: v.union(v.literal("new_order"), v.literal("low_stock"), v.literal("new_customer")),
    title: v.string(),
    message: v.string(),
    details: v.optional(v.any()),
    orderId: v.optional(v.id("orders")),
    productId: v.optional(v.id("products")),
    customerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Create web notification
    await ctx.runMutation(api.notifications.createNotification, {
      type: args.type,
      title: args.title,
      message: args.message,
      orderId: args.orderId,
      customerEmail: args.details?.customerEmail,
      customerPhone: args.details?.customerPhone,
      read: false,
    });

    // Get notification settings
    const settings = await ctx.runQuery(api.notifications.getSettings);
    
    if (!settings) return;

    // Send email if enabled
    if (settings.emailEnabled && settings.email && settings.resendApiKey) {
      try {
        await sendEmail({
          to: settings.email,
          subject: args.title,
          text: args.message,
          apiKey: settings.resendApiKey,
        });
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    }

    // Send WhatsApp if enabled
    if (settings.whatsappEnabled && settings.whatsappNumber && settings.metaApiKey) {
      try {
        await sendWhatsAppMeta({
          to: settings.whatsappNumber,
          message: args.message,
          apiKey: settings.metaApiKey,
          phoneNumberId: settings.metaPhoneNumberId,
        });
      } catch (error) {
        console.error("Failed to send WhatsApp:", error);
      }
    }
  },
});

// Check for new events (called by cron)
export const checkNewEvents = internalAction({
  args: {},
  handler: async (ctx) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const settings = await ctx.runQuery(api.notifications.getSettings);
    
    if (!settings) return;

    // 1. Check for new orders
    if (settings.notifyOnNewOrder !== false) {
      const newOrders = await ctx.runQuery(api.orders.getRecentOrders, { since: fiveMinutesAgo });
      
      for (const order of newOrders) {
        const customer = await ctx.db.get(order.customerId);
        
        // Format items list
        const itemsList = order.items.map((item: any) => 
          `• ${item.quantity}x ${item.name} - $${item.totalPrice.toLocaleString()}`
        ).join('\n');
        
        const message = `🛒 NUEVO PEDIDO\n\n` +
          `Orden: ${order.orderNumber}\n` +
          `Cliente: ${customer?.name || 'N/A'}\n` +
          `Tel: ${customer?.phone || order.whatsappPhone || 'N/A'}\n\n` +
          `📦 PRODUCTOS:\n${itemsList}\n\n` +
          `💰 TOTAL: $${order.totalAmount.toLocaleString()}`;

        await ctx.runAction(api.crons.sendNotification, {
          type: "new_order",
          title: `Nuevo pedido: ${order.orderNumber}`,
          message,
          details: {
            orderNumber: order.orderNumber,
            items: order.items,
            total: order.totalAmount,
            customerName: customer?.name,
            customerEmail: customer?.email,
            customerPhone: customer?.phone || order.whatsappPhone,
          },
          orderId: order._id,
        });
      }
    }

    // 2. Check for low stock
    const lowStockItems = await ctx.runQuery(api.inventory.getLowStock, { threshold: 10 });
    
    for (const item of lowStockItems) {
      // Check if we already notified about this product recently (last hour)
      const recentNotifications = await ctx.db
        .query("notifications")
        .filter((q) => q.and(
          q.eq(q.field("type"), "low_stock"),
          q.gt(q.field("createdAt"), Date.now() - 60 * 60 * 1000)
        ))
        .collect();
      
      const alreadyNotified = recentNotifications.some(
        (n: any) => n.details?.productId === item.productId
      );
      
      if (!alreadyNotified) {
        const product = await ctx.db.get(item.productId);
        
        const message = `⚠️ STOCK BAJO\n\n` +
          `Producto: ${product?.name || 'N/A'}\n` +
          `SKU: ${product?.sku || 'N/A'}\n` +
          `Stock actual: ${item.quantityAvailable} unidades\n` +
          `Umbral mínimo: 10 unidades\n\n` +
          `📦 Reabastecer urgentemente`;

        await ctx.runAction(api.crons.sendNotification, {
          type: "low_stock",
          title: `Stock bajo: ${product?.name}`,
          message,
          details: {
            productName: product?.name,
            productSku: product?.sku,
            currentStock: item.quantityAvailable,
            threshold: 10,
            productId: item.productId,
          },
          productId: item.productId,
        });
      }
    }

    // 3. Check for new customers
    if (settings.notifyOnNewCustomer !== false) {
      const newCustomers = await ctx.db
        .query("users")
        .filter((q) => q.gt(q.field("createdAt"), fiveMinutesAgo))
        .collect();
      
      for (const customer of newCustomers) {
        const message = `👤 NUEVO CLIENTE REGISTRADO\n\n` +
          `Nombre: ${customer.name}\n` +
          `Email: ${customer.email}\n` +
          `Empresa: ${customer.company || 'No especificada'}\n` +
          `Tel: ${customer.phone || 'No proporcionado'}\n\n` +
          `Tier: ${customer.customerTier || 'Bronce'} (auto-asignado)`;

        await ctx.runAction(api.crons.sendNotification, {
          type: "new_customer",
          title: `Nuevo cliente: ${customer.name}`,
          message,
          details: {
            customerName: customer.name,
            customerEmail: customer.email,
            customerCompany: customer.company,
            customerPhone: customer.phone,
            customerTier: customer.customerTier,
          },
          customerId: customer._id,
        });
      }
    }
  },
});

// Helper: Send email via Resend
async function sendEmail({ to, subject, text, apiKey }: { 
  to: string; 
  subject: string; 
  text: string; 
  apiKey: string;
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Dulcitienda <notificaciones@dulcitienda.com>',
      to,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
}

// Helper: Send WhatsApp via Meta Business API
async function sendWhatsAppMeta({ 
  to, 
  message, 
  apiKey,
  phoneNumberId,
}: { 
  to: string; 
  message: string; 
  apiKey: string;
  phoneNumberId: string;
}) {
  // Format phone number (remove + and spaces)
  const formattedPhone = to.replace(/\+/g, '').replace(/\s/g, '');
  
  const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'text',
      text: {
        body: message,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Meta WhatsApp API error: ${error}`);
  }

  return await response.json();
}
