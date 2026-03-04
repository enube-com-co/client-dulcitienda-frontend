import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get products with pagination
export const getProducts = query({
  args: { 
    categoryId: v.optional(v.id("categories")),
    cursor: v.optional(v.string()),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("products")
      .filter((q) => q.eq(q.field("isActive"), true));
    
    if (args.categoryId) {
      q = q.filter((q) => q.eq(q.field("categoryId"), args.categoryId));
    }
    
    return await q.paginate({ numItems: args.limit, cursor: args.cursor || null });
  },
});

// Search products (fallback without search index)
export const searchProducts = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const searchTerm = args.query.toLowerCase();
    
    // Get all active products and filter in memory
    const allProducts = await ctx.db.query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(500);
    
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.sku.toLowerCase().includes(searchTerm)
    ).slice(0, 20);
  },
});

// Get single product with inventory
export const getProduct = query({
  args: { sku: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db.query("products")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .first();
    
    if (!product) return null;
    
    const inventory = await ctx.db.query("inventory")
      .withIndex("by_product", (q) => q.eq("productId", product._id))
      .first();
    
    return { ...product, inventory };
  },
});

// Get featured products
export const getFeaturedProducts = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .take(args.limit);
  },
});

// Get categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .take(100);
  },
});
