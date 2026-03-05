# API Documentation

> Complete reference for all Convex queries and mutations

## Table of Contents

1. [Overview](#overview)
2. [Products API](#products-api)
3. [Orders API](#orders-api)
4. [Seed API](#seed-api)
5. [Error Handling](#error-handling)
6. [Usage Examples](#usage-examples)

---

## Overview

### Function Types

Convex functions are categorized into:

| Type | Decorator | Permissions | Use Case |
|------|-----------|-------------|----------|
| **Query** | `query({...})` | Read-only, cached | Data fetching |
| **Mutation** | `mutation({...})` | Read-write, transactional | Data modification |
| **Action** | `action({...})` | Can call external APIs | External integrations |

### Function Reference Format

```typescript
import { api } from "../convex/_generated/api";

// Using the function reference
const result = await convex.query(api.moduleName.functionName, args);
```

### Common Arguments

| Parameter | Type | Description |
|-----------|------|-------------|
| `ctx` | `QueryCtx` / `MutationCtx` | Convex context (db, auth, etc.) |
| `args` | Validated object | Function arguments (validated by schema) |

---

## Products API

**Module**: `products.ts`

### Queries

#### `getProducts`

Retrieve paginated list of active products with optional category filter.

```typescript
// Function Signature
getProducts: Query<{
  categoryId?: Id<"categories">;  // Optional category filter
  cursor?: string;                  // Pagination cursor
  limit: number;                    // Items per page
}, PaginatedResult<Product>>
```

**Returns**: Paginated result with `page` (products), `continueCursor`, `isDone`

**Example**:
```typescript
// Get first page
const page1 = await convex.query(api.products.getProducts, {
  limit: 20
});

// Get next page
const page2 = await convex.query(api.products.getProducts, {
  limit: 20,
  cursor: page1.continueCursor
});

// Filter by category
const categoryProducts = await convex.query(api.products.getProducts, {
  categoryId: "k56e8...",
  limit: 50
});
```

---

#### `searchProducts`

Search products by name or SKU (fallback text search).

```typescript
// Function Signature
searchProducts: Query<{
  query: string;  // Search term (case-insensitive)
}, Product[]>
```

**Returns**: Array of matching products (max 20)

**Behavior**:
- Searches in both `name` and `sku` fields
- Case-insensitive matching
- Returns up to 500 results filtered in memory
- Limited to 20 results returned

**Example**:
```typescript
const results = await convex.query(api.products.searchProducts, {
  query: "coca"
});
// Returns: [{ name: "Coca-Cola 2L", sku: "COCA-2L", ... }, ...]
```

**Note**: For production, consider using the `search_name` index for better performance.

---

#### `getProduct`

Get single product by SKU with inventory information.

```typescript
// Function Signature
getProduct: Query<{
  sku: string;
}, ProductWithInventory | null>
```

**Returns**: Product object with nested `inventory` field, or `null` if not found

**Example**:
```typescript
const product = await convex.query(api.products.getProduct, {
  sku: "COCA-2L"
});

// Response structure:
// {
//   _id: "...",
//   sku: "COCA-2L",
//   name: "Coca-Cola 2L",
//   basePrice: 8500,
//   inventory: {
//     quantityAvailable: 450,
//     quantityReserved: 50,
//     reorderLevel: 50
//   }
// }
```

---

#### `getFeaturedProducts`

Get featured products for homepage/display.

```typescript
// Function Signature
getFeaturedProducts: Query<{
  limit: number;
}, Product[]>
```

**Returns**: Array of featured active products

**Example**:
```typescript
const featured = await convex.query(api.products.getFeaturedProducts, {
  limit: 8
});
```

---

#### `getCategories`

Get all active categories.

```typescript
// Function Signature
getCategories: Query<{}, Category[]>
```

**Returns**: Array of active categories sorted by `sortOrder`

**Example**:
```typescript
const categories = await convex.query(api.products.getCategories, {});
// Returns: [
//   { name: "Gaseosas", slug: "gaseosas", sortOrder: 1, ... },
//   { name: "Snacks", slug: "snacks", sortOrder: 2, ... },
//   ...
// ]
```

---

## Orders API

**Module**: `orders.ts`

### Mutations

#### `createOrder`

Create a new order with inventory reservation.

```typescript
// Function Signature
createOrder: Mutation<{
  customerId: Id<"users">;
  items: Array<{
    productId: Id<"products">;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  whatsappPhone?: string;
  notes?: string;
}, { orderId: Id<"orders">; orderNumber: string }>
```

**Side Effects**:
1. Generates unique order number (`ORD-${timestamp}-${count}`)
2. Calculates subtotal and total
3. Creates order document
4. Reserves inventory (decreases `quantityAvailable`, increases `quantityReserved`)

**Example**:
```typescript
const { orderId, orderNumber } = await convex.mutation(api.orders.createOrder, {
  customerId: "k56e8...",
  items: [
    {
      productId: "k56e8...",
      sku: "COCA-2L",
      name: "Coca-Cola 2L",
      quantity: 12,
      unitPrice: 8500
    }
  ],
  shippingAddress: {
    name: "Tienda La Esquina",
    street: "Carrera 10 # 20-30",
    city: "Bogotá",
    state: "Cundinamarca",
    zip: "110111"
  },
  whatsappPhone: "+573001234567",
  notes: "Entregar después de las 2pm"
});

// Returns:
// {
//   orderId: "k56e8...",
//   orderNumber: "ORD-1704067200000-42"
// }
```

---

#### `updateOrderStatus`

Update the status of an existing order.

```typescript
// Function Signature
updateOrderStatus: Mutation<{
  orderId: Id<"orders">;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
}, void>
```

**Status Flow**:
```
pending → confirmed → processing → shipped → delivered
```

**Example**:
```typescript
await convex.mutation(api.orders.updateOrderStatus, {
  orderId: "k56e8...",
  status: "confirmed"
});
```

**Note**: This mutation does not currently handle inventory adjustments on cancellation. Consider adding:
- On `cancelled`: Return reserved inventory to available
- On `shipped`: Decrease reserved quantity

---

### Queries

#### `getCustomerOrders`

Get all orders for a specific customer.

```typescript
// Function Signature
getCustomerOrders: Query<{
  customerId: Id<"users">;
}, Order[]>
```

**Returns**: Array of orders sorted by `createdAt` descending (most recent first), limited to 50

**Example**:
```typescript
const orders = await convex.query(api.orders.getCustomerOrders, {
  customerId: "k56e8..."
});
```

---

#### `getOrderByNumber`

Lookup order by human-readable order number.

```typescript
// Function Signature
getOrderByNumber: Query<{
  orderNumber: string;
}, Order | null>
```

**Returns**: Order document or `null` if not found

**Example**:
```typescript
const order = await convex.query(api.orders.getOrderByNumber, {
  orderNumber: "ORD-1704067200000-42"
});
```

---

## Seed API

**Module**: `seed.ts`

### Mutations

#### `seedCategories`

Populate categories table with default categories.

```typescript
seedCategories: Mutation<{}, { success: boolean; count: number }>
```

**Creates**:
- Gaseosas
- Snacks
- Dulces
- Licores
- Gomas
- Chocolates
- Ancheteía
- Confitería

**Example**:
```typescript
const result = await convex.mutation(api.seed.seedCategories, {});
// Returns: { success: true, count: 8 }
```

---

#### `seedProducts`

Seed products with sample catalog (~60 products).

```typescript
seedProducts: Mutation<{}, { success: boolean; count: number }>
```

**Creates**: Products across all categories with inventory

**Example**:
```typescript
const result = await convex.mutation(api.seed.seedProducts, {});
// Returns: { success: true, count: 60 }
```

---

#### `seedAll`

Complete database seeding (categories + products).

```typescript
seedAll: Mutation<{}, { success: boolean; message: string; count: number }>
```

**Behavior**:
1. Clears existing products and categories
2. Seeds 8 categories
3. Seeds ~60 products with inventory

**Example**:
```bash
npx convex run seed:seedAll
```

---

## Seed Massive API

**Module**: `seedMassive.ts`

### Mutations

#### `seedMassive`

Generate a massive product catalog (500+ products).

```typescript
seedMassive: Mutation<{}, { success: boolean; count: number; categories: number }>
```

**Creates**:
- 10 categories (includes Galletas, Lácteos)
- 500+ products with randomized data
- Inventory for each product

**Distribution**:
| Category | Count |
|----------|-------|
| Gaseosas | 60 |
| Snacks | 60 |
| Dulces | 50 |
| Gomas | 60 |
| Chocolates | 50 |
| Ancheteía | 60 |
| Confitería | 50 |
| Licores | 60 |
| Galletas | 50 |
| Lácteos | 50 |

**Example**:
```bash
npx convex run seedMassive:seedMassive
```

**Use Case**: Load testing, pagination testing, search performance testing

---

## Error Handling

### Convex Error Types

| Error | Description | HTTP Equivalent |
|-------|-------------|-----------------|
| `ConvexError` | Generic Convex error | 500 |
| `UserError` | Validation/user input error | 400 |

### Common Error Scenarios

#### Product Not Found

```typescript
const product = await convex.query(api.products.getProduct, {
  sku: "NONEXISTENT"
});
// Returns: null
```

#### Invalid Arguments

```typescript
// Missing required field
await convex.mutation(api.orders.createOrder, {
  // missing customerId
  items: []
});
// Throws: ConvexError - Invalid arguments
```

#### Database Constraints

```typescript
// Duplicate SKU (if unique constraint added)
// Throws: ConvexError - Document already exists
```

### Error Handling Pattern

```typescript
try {
  const order = await convex.mutation(api.orders.createOrder, args);
} catch (error) {
  if (error.message.includes("Invalid arguments")) {
    // Handle validation error
  } else if (error.message.includes("Insufficient inventory")) {
    // Handle stock error
  } else {
    // Handle unexpected error
    console.error("Unexpected error:", error);
  }
}
```

---

## Usage Examples

### Example 1: Browse and Order Flow

```typescript
// 1. Get categories
const categories = await convex.query(api.products.getCategories, {});

// 2. Get products in category
const products = await convex.query(api.products.getProducts, {
  categoryId: categories[0]._id,
  limit: 20
});

// 3. Get product details with inventory
const product = await convex.query(api.products.getProduct, {
  sku: "COCA-2L"
});

// 4. Create order
const { orderId, orderNumber } = await convex.mutation(api.orders.createOrder, {
  customerId: userId,
  items: [{
    productId: product._id,
    sku: product.sku,
    name: product.name,
    quantity: 12,
    unitPrice: product.basePrice
  }],
  shippingAddress: {
    name: "My Store",
    street: "Calle 123",
    city: "Bogotá",
    state: "Cundinamarca",
    zip: "110111"
  }
});

// 5. Track order
const order = await convex.query(api.orders.getOrderByNumber, {
  orderNumber
});
```

### Example 2: Search and Filter

```typescript
// Search products
const searchResults = await convex.query(api.products.searchProducts, {
  query: "coca"
});

// Get featured products
const featured = await convex.query(api.products.getFeaturedProducts, {
  limit: 8
});
```

### Example 3: Order Management

```typescript
// Get customer order history
const orders = await convex.query(api.orders.getCustomerOrders, {
  customerId: userId
});

// Update order status (admin)
await convex.mutation(api.orders.updateOrderStatus, {
  orderId: order._id,
  status: "shipped"
});
```

### Example 4: React Hook Usage

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

// In a React component
function ProductList() {
  const products = useQuery(api.products.getProducts, { limit: 20 });
  
  if (products === undefined) return <div>Loading...</div>;
  
  return (
    <ul>
      {products.page.map(p => (
        <li key={p._id}>{p.name} - ${p.basePrice}</li>
      ))}
    </ul>
  );
}

function CreateOrderButton({ items, customerId }) {
  const createOrder = useMutation(api.orders.createOrder);
  
  const handleClick = async () => {
    const { orderNumber } = await createOrder({
      customerId,
      items,
      shippingAddress: { /* ... */ }
    });
    alert(`Order ${orderNumber} created!`);
  };
  
  return <button onClick={handleClick}>Place Order</button>;
}
```

---

## API Summary

| Module | Function | Type | Purpose |
|--------|----------|------|---------|
| products | `getProducts` | Query | Paginated product list |
| products | `searchProducts` | Query | Text search |
| products | `getProduct` | Query | Single product by SKU |
| products | `getFeaturedProducts` | Query | Featured products |
| products | `getCategories` | Query | All categories |
| orders | `createOrder` | Mutation | Create new order |
| orders | `updateOrderStatus` | Mutation | Update order status |
| orders | `getCustomerOrders` | Query | Customer's orders |
| orders | `getOrderByNumber` | Query | Order lookup |
| seed | `seedCategories` | Mutation | Seed categories |
| seed | `seedProducts` | Mutation | Seed products |
| seed | `seedAll` | Mutation | Complete seed |
| seedMassive | `seedMassive` | Mutation | Massive catalog |
