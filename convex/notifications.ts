import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// Notification settings for the store owner
export const getSettings = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const settings = await ctx.db.query("notificationSettings").first();
    return settings;
  },
});

// Update notification settings
export const updateSettings = mutation({
  args: {
    email: v.optional(v.string()),
    resendApiKey: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    metaApiKey: v.optional(v.string()),
    metaPhoneNumberId: v.optional(v.string()),
    emailEnabled: v.boolean(),
    whatsappEnabled: v.boolean(),
    webNotificationsEnabled: v.boolean(),
    notifyOnNewOrder: v.boolean(),
    notifyOnStatusChange: v.boolean(),
    notifyOnLowStock: v.boolean(),
    notifyOnNewCustomer: v.boolean(),
  },
  returns: v.id("notificationSettings"),
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("notificationSettings").first();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    
    return await ctx.db.insert("notificationSettings", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Create a notification
export const createNotification = mutation({
  args: {
    type: v.union(
      v.literal("new_order"),
      v.literal("order_status_change"),
      v.literal("low_stock"),
      v.literal("customer_message"),
      v.literal("new_customer")
    ),
    title: v.string(),
    message: v.string(),
    orderId: v.optional(v.id("orders")),
    customerEmail: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    read: v.boolean(),
  },
  returns: v.id("notifications"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get notifications (for web UI)
export const getNotifications = query({
  args: {
    limit: v.optional(v.number()),
    unreadOnly: v.optional(v.boolean()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    let query = ctx.db.query("notifications").order("desc");
    
    if (args.unreadOnly) {
      query = query.filter((q) => q.eq(q.field("read"), false));
    }
    
    return await query.take(args.limit || 50);
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
    return null;
  },
});

// Mark all as read
export const markAllAsRead = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    
    for (const notif of notifications) {
      await ctx.db.patch(notif._id, { read: true });
    }
    return null;
  },
});

// Get unread count
export const getUnreadCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    return notifications.length;
  },
});

// Get recent notifications by type
export const getRecentByType = query({
  args: {
    type: v.union(
      v.literal("new_order"),
      v.literal("order_status_change"),
      v.literal("low_stock"),
      v.literal("customer_message"),
      v.literal("new_customer")
    ),
    since: v.number(),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .filter((q) =>
        q.and(
          q.eq(q.field("type"), args.type),
          q.gt(q.field("createdAt"), args.since)
        )
      )
      .collect();
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
