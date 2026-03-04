import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Products (5000+ SKUs)
  products: defineTable({
    sku: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.id("categories"),
    brand: v.optional(v.string()),
    basePrice: v.number(),
    unitOfMeasure: v.string(), // unit, case, pallet
    packSize: v.number(),
    minimumOrderQuantity: v.number(),
    images: v.array(v.string()),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
  })
    .index("by_sku", ["sku"])
    .index("by_category", ["categoryId"])
    .index("by_active", ["isActive"])
    .searchIndex("search_name", { searchField: "name" }),

  // Categories
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    parentId: v.optional(v.id("categories")),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    sortOrder: v.number(),
    isActive: v.boolean(),
  })
    .index("by_parent", ["parentId"])
    .index("by_slug", ["slug"]),

  // Inventory (real-time)
  inventory: defineTable({
    productId: v.id("products"),
    warehouseId: v.id("warehouses"),
    quantityAvailable: v.number(),
    quantityReserved: v.number(),
    reorderLevel: v.number(),
    lastUpdated: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_warehouse", ["warehouseId"]),

  // Warehouses
  warehouses: defineTable({
    name: v.string(),
    code: v.string(),
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    }),
    isActive: v.boolean(),
  }),

  // Orders
  orders: defineTable({
    orderNumber: v.string(),
    customerId: v.id("users"),
    companyId: v.optional(v.id("companies")),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("partial"),
      v.literal("failed")
    ),
    items: v.array(v.object({
      productId: v.id("products"),
      sku: v.string(),
      name: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      totalPrice: v.number(),
    })),
    subtotal: v.number(),
    discountAmount: v.number(),
    taxAmount: v.number(),
    shippingAmount: v.number(),
    totalAmount: v.number(),
    shippingAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    }),
    deliveryDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    whatsappPhone: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_customer", ["customerId"])
    .index("by_status", ["status"])
    .index("by_order_number", ["orderNumber"]),

  // Users (B2B customers)
  users: defineTable({
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("customer"), v.literal("sales_rep")),
    customerTier: v.optional(v.union(
      v.literal("bronze"), 
      v.literal("silver"), 
      v.literal("gold"), 
      v.literal("platinum")
    )),
    companyId: v.optional(v.id("companies")),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_company", ["companyId"]),

  // Companies (B2B clients)
  companies: defineTable({
    name: v.string(),
    taxId: v.optional(v.string()),
    businessType: v.optional(v.string()),
    billingAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    })),
    shippingAddresses: v.optional(v.array(v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    }))),
    creditLimit: v.optional(v.number()),
    currentBalance: v.number(),
    paymentTerms: v.optional(v.string()),
    assignedSalesRepId: v.optional(v.id("users")),
    isActive: v.boolean(),
  }),

  // Tier Pricing
  tierPrices: defineTable({
    productId: v.id("products"),
    customerTier: v.union(
      v.literal("bronze"), 
      v.literal("silver"), 
      v.literal("gold"), 
      v.literal("platinum")
    ),
    minQuantity: v.number(),
    unitPrice: v.number(),
    validFrom: v.optional(v.number()),
    validUntil: v.optional(v.number()),
  })
    .index("by_product_tier", ["productId", "customerTier"]),
});
