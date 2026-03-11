import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// ANALYTICS APIs — Dashboard de Negocio
// ============================================

// Get dashboard overview stats
export const getDashboardStats = query({
  args: { 
    period: v.union(v.literal("7d"), v.literal("30d"), v.literal("90d")) 
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const periodMs = args.period === "7d" ? 7 * 24 * 60 * 60 * 1000 :
                     args.period === "30d" ? 30 * 24 * 60 * 60 * 1000 :
                     90 * 24 * 60 * 60 * 1000;
    const startDate = now - periodMs;

    // Get orders in period
    const orders = await ctx.db.query("orders")
      .filter((q) => q.gte(q.field("createdAt"), startDate))
      .collect();

    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Get new customers in period
    const newCustomers = await ctx.db.query("users")
      .filter((q) => q.gte(q.field("createdAt"), startDate))
      .collect();

    // Get top products by quantity sold
    const productSales: Record<string, { id: string; name: string; quantity: number; revenue: number }> = {};
    
    for (const order of orders) {
      for (const item of order.items) {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            id: item.productId,
            name: item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.totalPrice;
      }
    }

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Generate sales trend (daily buckets)
    const salesTrend: { date: string; amount: number }[] = [];
    const days = args.period === "7d" ? 7 : args.period === "30d" ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const dayStart = now - (i + 1) * 24 * 60 * 60 * 1000;
      const dayEnd = now - i * 24 * 60 * 60 * 1000;
      
      const daySales = orders
        .filter(o => o.createdAt >= dayStart && o.createdAt < dayEnd)
        .reduce((sum, o) => sum + o.totalAmount, 0);
      
      salesTrend.push({
        date: new Date(dayStart).toISOString().split('T')[0],
        amount: daySales
      });
    }

    return {
      totalSales,
      totalOrders,
      averageOrderValue: Math.round(avgOrderValue),
      newCustomers: newCustomers.length,
      topProducts,
      salesTrend
    };
  }
});

// Get inventory stats
export const getInventoryStats = query({
  args: {},
  handler: async (ctx) => {
    const inventory = await ctx.db.query("inventory").collect();
    const products = await ctx.db.query("products").collect();
    
    // Calculate inventory value
    let inventoryValue = 0;
    const lowStockProducts: { id: string; name: string; sku: string; quantity: number; reorderLevel: number }[] = [];
    
    for (const inv of inventory) {
      const product = products.find(p => p._id === inv.productId);
      if (product) {
        inventoryValue += inv.quantityAvailable * product.basePrice;
        
        if (inv.quantityAvailable <= inv.reorderLevel) {
          lowStockProducts.push({
            id: inv.productId,
            name: product.name,
            sku: product.sku,
            quantity: inv.quantityAvailable,
            reorderLevel: inv.reorderLevel
          });
        }
      }
    }

    return {
      totalSKUs: products.length,
      inventoryValue: Math.round(inventoryValue),
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 10)
    };
  }
});

// Get customer analytics
export const getCustomerStats = query({
  args: {},
  handler: async (ctx) => {
    const totalCustomers = await ctx.db.query("users").collect();
    const activeCustomers = totalCustomers.filter(c => c.isActive);
    
    // Get top customers by order value
    const orders = await ctx.db.query("orders").collect();
    
    const customerTotals: Record<string, { id: string; name: string; email: string; totalSpent: number; orders: number }> = {};
    
    for (const order of orders) {
      const customerId = order.customerId;
      if (!customerTotals[customerId]) {
        const customer = totalCustomers.find(c => c._id === customerId);
        customerTotals[customerId] = {
          id: customerId,
          name: customer?.name || "Unknown",
          email: customer?.email || "",
          totalSpent: 0,
          orders: 0
        };
      }
      customerTotals[customerId].totalSpent += order.totalAmount;
      customerTotals[customerId].orders += 1;
    }

    const topCustomers = Object.values(customerTotals)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return {
      totalCustomers: totalCustomers.length,
      activeCustomers: activeCustomers.length,
      topCustomers
    };
  }
});

// Get recent orders for admin
export const getRecentOrders = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    const orders = await ctx.db.query("orders")
      .order("desc")
      .take(limit);

    // Enrich with customer info
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const customer = await ctx.db.get(order.customerId);
        return {
          ...order,
          customerName: customer?.name || "Unknown",
          customerEmail: customer?.email || ""
        };
      })
    );

    return enrichedOrders;
  }
});

// ============================================
// ORIGINAL PRODUCTS API (mantenido)
// ============================================

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

// Get product by ID
export const getById = query({
  args: { id: v.id("products") },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
