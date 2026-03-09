import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current authenticated user
export const getCurrentUser = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

// Create or update user from login
export const createOrUpdateFromLogin = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const { email, name } = args;
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
    
    // Determine role based on email
    let role: "admin" | "power_user" | "customer" = "customer";
    if (normalizedEmail === "andres.monje@enube.com.co") {
      role = "admin";
    } else if (normalizedEmail.endsWith("@enube.com.co")) {
      role = "power_user";
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      email: normalizedEmail,
      name: name.trim(),
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

// Get current user by ID
export const getById = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { userId, name, phone } = args;
    
    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(userId, updates);
    }
    
    return null;
  },
});
