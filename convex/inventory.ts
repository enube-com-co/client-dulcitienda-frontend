import { query } from "./_generated/server";
import { v } from "convex/values";

// Get inventory items with low stock
export const getLowStock = query({
  args: {
    threshold: v.optional(v.number()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const threshold = args.threshold || 10;
    
    const inventory = await ctx.db.query("inventory").collect();
    
    const lowStock = inventory.filter(item => 
      item.quantityAvailable <= threshold
    );
    
    return lowStock;
  },
});

// Get inventory by product
export const getByProduct = query({
  args: {
    productId: v.id("products"),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("inventory")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .first();
  },
});
