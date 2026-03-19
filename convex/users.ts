import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user from login
export const createOrUpdateFromLogin = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const { email, name, phone, company } = args;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update last login
      await ctx.db.patch(existingUser._id, {
        lastLoginAt: now,
      });
      return existingUser._id;
    }

    // All new registrations start as customers.
    // Admin/power_user roles must be assigned manually by an existing admin
    // after the user's email has been verified through a proper auth provider.
    const role: "admin" | "power_user" | "customer" = "customer";

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: normalizedEmail,
      name: name.trim(),
      phone,
      company,
      role,
      customerTier: "bronze",
      isActive: true,
      createdAt: now,
      lastLoginAt: now,
    });

    return userId;
  },
});

// Get user by email
export const getByEmail = query({
  args: {
    email: v.string(),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    return user;
  },
});

// Get user by ID
export const getById = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get recent users (for notifications)
export const getRecentUsers = query({
  args: {
    since: v.number(),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.gt(q.field("createdAt"), args.since))
      .collect();
  },
});

// Make user admin - run manually from Convex dashboard
// Usage: npx convex run users:makeAdmin '{"email": "user@example.com"}'
export const makeAdmin = mutation({
  args: {
    email: v.string(),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    
    if (!user) {
      throw new Error(`User with email ${args.email} not found`);
    }
    
    await ctx.db.patch(user._id, {
      role: "admin",
    });
    
    return { success: true, userId: user._id, email: normalizedEmail };
  },
});
