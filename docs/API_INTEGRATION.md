# API Integration Documentation

Complete guide to Convex backend integration for Dulcitienda.

---

## Table of Contents

1. [Convex Overview](#convex-overview)
2. [Data Models](#data-models)
3. [Queries](#queries)
4. [Mutations](#mutations)
4. [Error Handling](#error-handling)
5. [Caching Strategy](#caching-strategy)

---

## Convex Overview

[Convex](https://convex.dev) is the backend-as-a-service platform used for:
- Real-time database
- Serverless functions
- File storage
- Scheduled jobs

### Project Setup

```typescript
// convex.json (auto-generated)
{
  "project": "dulcitienda",
  "team": "your-team",
  "prodUrl": "https://your-deployment.convex.cloud"
}
```

### Directory Structure

```
convex/
├── _generated/           # Auto-generated (DO NOT EDIT)
│   ├── api.d.ts
│   ├── api.js
│   ├── dataModel.d.ts
│   └── server.d.ts
├── schema.ts             # Database schema
├── products.ts           # Product queries/mutations
├── orders.ts             # Order queries/mutations
├── seed.ts               # Database seeding
└── tsconfig.json         # Convex TypeScript config
```

### Client Configuration

```typescript
// app/ConvexClientProvider.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

---

## Data Models

### Schema Definition

**File**: `convex/schema.ts`

```typescript
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
```

### Table Relationships

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ categories  │────▶│  products   │◀────│  inventory  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ order_items │ (embedded in orders)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    orders   │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        ┌─────────────┐           ┌─────────────┐
        │    users    │◀─────────▶│  companies  │
        └─────────────┘           └─────────────┘
```

---

## Queries

### Product Queries

**File**: `convex/products.ts`

#### getProducts

Paginated product list with optional category filter.

```typescript
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
    
    return await q.paginate({ 
      numItems: args.limit, 
      cursor: args.cursor || null 
    });
  },
});
```

**Usage**:
```typescript
const products = useQuery(api.products.getProducts, { 
  categoryId: selectedCategory,
  limit: 100 
});
```

#### searchProducts

Search products by name or SKU.

```typescript
export const searchProducts = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const searchTerm = args.query.toLowerCase();
    
    const allProducts = await ctx.db.query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(500);
    
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.sku.toLowerCase().includes(searchTerm)
    ).slice(0, 20);
  },
});
```

**Usage**:
```typescript
const results = useQuery(api.products.searchProducts, 
  query.length >= 2 ? { query } : { query: "" }
);
```

#### getProduct

Single product with inventory.

```typescript
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
```

#### getFeaturedProducts

```typescript
export const getFeaturedProducts = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .take(args.limit);
  },
});
```

#### getCategories

```typescript
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .take(100);
  },
});
```

---

## Mutations

### Order Mutations

**File**: `convex/orders.ts`

#### createOrder

```typescript
export const createOrder = mutation({
  args: {
    customerId: v.id("users"),
    items: v.array(v.object({
      productId: v.id("products"),
      sku: v.string(),
      name: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
    })),
    shippingAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    }),
    whatsappPhone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate order number
    const orderCount = await ctx.db.query("orders").collect();
    const orderNumber = `ORD-${Date.now()}-${orderCount.length + 1}`;
    
    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of args.items) {
      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;
      orderItems.push({ ...item, totalPrice });
    }
    
    const totalAmount = subtotal;
    
    // Create order
    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      customerId: args.customerId,
      status: "pending",
      paymentStatus: "pending",
      items: orderItems,
      subtotal,
      discountAmount: 0,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount,
      shippingAddress: args.shippingAddress,
      whatsappPhone: args.whatsappPhone,
      notes: args.notes,
      createdAt: Date.now(),
    });
    
    // Update inventory
    for (const item of args.items) {
      const inventory = await ctx.db.query("inventory")
        .withIndex("by_product", (q) => q.eq("productId", item.productId))
        .first();
      
      if (inventory) {
        await ctx.db.patch(inventory._id, {
          quantityAvailable: inventory.quantityAvailable - item.quantity,
          quantityReserved: inventory.quantityReserved + item.quantity,
          lastUpdated: Date.now(),
        });
      }
    }
    
    return { orderId, orderNumber };
  },
});
```

#### getCustomerOrders

```typescript
export const getCustomerOrders = query({
  args: { customerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .take(50);
  },
});
```

#### updateOrderStatus

```typescript
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});
```

---

## Error Handling

### Query Error Patterns

```typescript
// Loading state
const products = useQuery(api.products.getProducts, { limit: 20 });

if (products === undefined) {
  return <LoadingSpinner />;  // Still loading
}

if (products === null) {
  return <ErrorMessage />;  // Error occurred
}

// Render products
return <ProductGrid products={products} />;
```

### Mutation Error Handling

```typescript
const createOrder = useMutation(api.orders.createOrder);

const handleSubmit = async () => {
  try {
    const result = await createOrder({
      customerId: user._id,
      items: cartItems,
      shippingAddress: address,
    });
    
    toast.success(`Pedido ${result.orderNumber} creado`);
    router.push(`/pedidos/${result.orderNumber}`);
  } catch (error) {
    console.error("Order creation failed:", error);
    toast.error("Error al crear el pedido. Intente nuevamente.");
  }
};
```

### Convex Error Types

| Error | Cause | Handling |
|-------|-------|----------|
| `QueryError` | Invalid query args | Validate inputs client-side |
| `MutationError` | Constraint violation | Check business logic |
| `NetworkError` | Connection issue | Retry with backoff |
| `AuthError` | Unauthorized | Redirect to login |

---

## Caching Strategy

### Automatic Caching

Convex provides automatic caching:

```typescript
// This query is automatically cached
const products = useQuery(api.products.getProducts, { limit: 20 });

// Cache key includes function name + args
// Re-fetches only when data changes
```

### Cache Invalidation

```typescript
// Convex automatically invalidates when:
// 1. A mutation modifies related data
// 2. Real-time updates are pushed

// Manual refetch (rarely needed)
const products = useQuery(api.products.getProducts, args);

// To force refresh, change args slightly
const [refreshKey, setRefreshKey] = useState(0);
const products = useQuery(api.products.getProducts, { ...args, refreshKey });
```

### Optimistic Updates

```typescript
const createOrder = useMutation(api.orders.createOrder);

const handleCreate = () => {
  // Optimistic UI update
  setLocalOrders(prev => [...prev, optimisticOrder]);
  
  createOrder(args)
    .then(() => {
      // Success - Convex will update real data
    })
    .catch(() => {
      // Revert optimistic update
      setLocalOrders(prev => prev.filter(o => o.id !== optimisticId));
    });
};
```

---

## API Endpoints Summary

### Products

| Endpoint | Type | Args | Returns |
|----------|------|------|---------|
| `products.getProducts` | Query | `{ categoryId?, cursor?, limit }` | Paginated products |
| `products.searchProducts` | Query | `{ query }` | Array of products |
| `products.getProduct` | Query | `{ sku }` | Product + inventory |
| `products.getFeaturedProducts` | Query | `{ limit }` | Featured products array |
| `products.getCategories` | Query | `{}` | Categories array |

### Orders

| Endpoint | Type | Args | Returns |
|----------|------|------|---------|
| `orders.createOrder` | Mutation | `{ customerId, items, shippingAddress, ... }` | `{ orderId, orderNumber }` |
| `orders.getCustomerOrders` | Query | `{ customerId }` | Orders array |
| `orders.getOrderByNumber` | Query | `{ orderNumber }` | Order object |
| `orders.updateOrderStatus` | Mutation | `{ orderId, status }` | void |

---

## Development Commands

```bash
# Start Convex dev server
npx convex dev

# Deploy to production
npx convex deploy

# Open dashboard
npx convex dashboard

# Generate types after schema changes
npx convex dev  # Auto-generates
```
