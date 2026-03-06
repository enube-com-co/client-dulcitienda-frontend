import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ============================================
// USER QUERIES
// ============================================

// Get user by ID
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get user by Google ID
export const getByGoogleId = query({
  args: { googleId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_googleId", (q) => q.eq("googleId", args.googleId))
      .first();
  },
});

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get current user with all data
export const getCurrentUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    
    // Get order count
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.userId))
      .collect();
    
    return {
      ...user,
      orderCount: orders.length,
      totalSpent: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    };
  },
});

// ============================================
// USER MUTATIONS
// ============================================

// Create or update user from Google OAuth
export const createOrUpdateFromOAuth = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    googleId: v.string(),
    photo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      // Update last login and photo
      await ctx.db.patch(existing._id, {
        lastLoginAt: Date.now(),
        photo: args.photo || existing.photo,
        googleId: args.googleId,
      });
      return existing._id;
    }
    
    // Determine role based on email
    // Admin: andres.monje@enube.com.co (control total)
    // Power User: otros emails de enube (gestionan pedidos)
    // Customer: todos los demás (solo compran)
    const email = args.email.toLowerCase();
    let role: "admin" | "power_user" | "customer" = "customer";
    
    if (email === "andres.monje@enube.com.co") {
      role = "admin";
    } else if (email.endsWith("@enube.com.co")) {
      role = "power_user";
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      googleId: args.googleId,
      photo: args.photo,
      role: role,
      customerTier: "bronze",
      isActive: true,
      lastLoginAt: Date.now(),
      createdAt: Date.now(),
    });
      customerTier: "bronze",
      isActive: true,
      lastLoginAt: Date.now(),
      createdAt: Date.now(),
    });
    
    return userId;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Partial<typeof args> = { ...args };
    delete (updates as any).userId;
    
    await ctx.db.patch(args.userId, updates);
    return await ctx.db.get(args.userId);
  },
});

// Add shipping address
export const addShippingAddress = mutation({
  args: {
    userId: v.id("users"),
    address: v.object({
      id: v.string(),
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      isDefault: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    
    const addresses = user.shippingAddresses || [];
    
    // If new address is default, unset others
    if (args.address.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    }
    
    addresses.push(args.address);
    
    await ctx.db.patch(args.userId, {
      shippingAddresses: addresses,
    });
    
    return addresses;
  },
});

// Delete shipping address
export const deleteShippingAddress = mutation({
  args: {
    userId: v.id("users"),
    addressId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    
    const addresses = (user.shippingAddresses || [])
      .filter(a => a.id !== args.addressId);
    
    await ctx.db.patch(args.userId, {
      shippingAddresses: addresses,
    });
    
    return addresses;
  },
});

// Set default shipping address
export const setDefaultShippingAddress = mutation({
  args: {
    userId: v.id("users"),
    addressId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    
    const addresses = (user.shippingAddresses || []).map(a => ({
      ...a,
      isDefault: a.id === args.addressId,
    }));
    
    await ctx.db.patch(args.userId, {
      shippingAddresses: addresses,
    });
    
    return addresses;
  },
});

// Get user's orders
export const getUserOrders = query({
  args: { 
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.userId))
      .order("desc")
      .take(args.limit || 10);
    
    return orders;
  },
});
