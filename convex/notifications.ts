import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
      v.literal("customer_message")
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
