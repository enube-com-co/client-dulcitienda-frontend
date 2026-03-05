# Schema Documentation

> Complete reference for Dulcitienda database schema

## Table of Contents

1. [Overview](#overview)
2. [Products](#products)
3. [Categories](#categories)
4. [Inventory](#inventory)
5. [Warehouses](#warehouses)
6. [Orders](#orders)
7. [Users](#users)
8. [Companies](#companies)
9. [Tier Prices](#tier-prices)
10. [Indexes Reference](#indexes-reference)

---

## Overview

The Dulcitienda schema consists of **9 tables** designed to support a B2B wholesale distribution platform:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  products   │────>│ categories  │     │  warehouses │
└──────┬──────┘     └─────────────┘     └──────┬──────┘
       │                                         │
       │    ┌─────────────┐     ┌─────────────┐  │
       └───>│  inventory  │<────┘             │
            └─────────────┘                    │
                                               │
┌─────────────┐     ┌─────────────┐     ┌──────┴──────┐
│ tierPrices  │<────│  products   │     │   orders    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
┌─────────────┐     ┌─────────────┐     ┌──────┴──────┐
│  companies  │<────│    users    │<────│   orders    │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Products

**Table ID**: `products`

Core product catalog with 5000+ SKUs spanning beverages, snacks, confectionery, and more.

### Schema

```typescript
{
  sku: string;                    // Unique stock-keeping unit
  name: string;                   // Product display name
  description?: string;           // Optional product description
  categoryId: Id("categories");   // Reference to category
  brand?: string;                 // Optional brand name
  basePrice: number;              // Base unit price (COP)
  unitOfMeasure: string;          // "unit", "case", "pallet"
  packSize: number;               // Units per pack/case
  minimumOrderQuantity: number;   // Minimum orderable quantity
  images: string[];               // Array of image URLs
  isActive: boolean;              // Soft delete flag
  isFeatured: boolean;            // Featured product flag
}
```

### Example Document

```json
{
  "_id": "k56e8q1h3q2h3q2h3q2h3q2h3",
  "sku": "COCA-2L",
  "name": "Coca-Cola 2L",
  "description": "Gaseosa Coca-Cola botella 2 litros",
  "categoryId": "k56e8q1h3q2h3q2h3q2h3q2h",
  "brand": "Coca-Cola",
  "basePrice": 8500,
  "unitOfMeasure": "unidad",
  "packSize": 6,
  "minimumOrderQuantity": 6,
  "images": ["https://cdn.example.com/coca-2l.jpg"],
  "isActive": true,
  "isFeatured": true
}
```

### Indexes

| Index Name | Fields | Purpose |
|------------|--------|---------|
| `by_sku` | `sku` | SKU lookups (unique constraint) |
| `by_category` | `categoryId` | Category filtering |
| `by_active` | `isActive` | Active product filtering |
| `search_name` | `name` | Full-text search on product names |

### Field Constraints

- **sku**: Unique identifier, uppercase alphanumeric with hyphens
- **basePrice**: Positive number (Colombian Pesos)
- **packSize**: Positive integer, typically 6, 12, 24
- **minimumOrderQuantity**: Must be ≤ packSize, typically matches packSize for B2B

---

## Categories

**Table ID**: `categories`

Product categorization with hierarchical support.

### Schema

```typescript
{
  name: string;                   // Category display name
  slug: string;                   // URL-friendly identifier
  parentId?: Id("categories");    // Optional parent category
  description?: string;           // Category description
  imageUrl?: string;              // Category image
  sortOrder: number;              // Display ordering
  isActive: boolean;              // Visibility flag
}
```

### Example Document

```json
{
  "_id": "k56e8q1h3q2h3q2h3q2h3q2h",
  "name": "Gaseosas",
  "slug": "gaseosas",
  "description": "Bebidas gaseosas y refrescos",
  "imageUrl": "https://cdn.example.com/gaseosas.jpg",
  "sortOrder": 1,
  "isActive": true
}
```

### Categories in Production

| Name | Slug | Description |
|------|------|-------------|
| Gaseosas | `gaseosas` | Soft drinks and sodas |
| Snacks | `snacks` | Chips and savory snacks |
| Dulces | `dulces` | Sweet treats and cakes |
| Licores | `licores` | Alcoholic beverages |
| Gomas | `gomas` | Gummy candies |
| Chocolates | `chocolates` | Chocolate products |
| Ancheteía | `ancheteria` | Gourmet snacks and nuts |
| Confitería | `confiteria` | Confectionery items |
| Galletas | `galletas` | Cookies and biscuits |
| Lácteos | `lacteos` | Dairy products |

### Indexes

| Index Name | Fields | Purpose |
|------------|--------|---------|
| `by_parent` | `parentId` | Hierarchical queries |
| `by_slug` | `slug` | URL lookups |

---

## Inventory

**Table ID**: `inventory`

Real-time inventory tracking per product per warehouse.

### Schema

```typescript
{
  productId: Id("products");      // Reference to product
  warehouseId: Id("warehouses");  // Reference to warehouse
  quantityAvailable: number;      // Units available for sale
  quantityReserved: number;       // Units reserved in orders
  reorderLevel: number;           // Low stock threshold
  lastUpdated: number;            // Unix timestamp (ms)
}
```

### Calculated Fields

```
quantityOnHand = quantityAvailable + quantityReserved
quantitySellable = quantityAvailable
isLowStock = quantityAvailable <= reorderLevel
```

### Example Document

```json
{
  "_id": "k56e8q1h3q2h3q2h3q2h3q2j",
  "productId": "k56e8q1h3q2h3q2h3q2h3q2h3",
  "warehouseId": "k56e8q1h3q2h3q2h3q2h3q2k",
  "quantityAvailable": 450,
  "quantityReserved": 50,
  "reorderLevel": 50,
  "lastUpdated": 1704067200000
}
```

### Indexes

| Index Name | Fields | Purpose |
|------------|--------|---------|
| `by_product` | `productId` | Product inventory lookup |
| `by_warehouse` | `warehouseId` | Warehouse inventory queries |

### Business Logic

- When an order is created, `quantityAvailable` decreases and `quantityReserved` increases
- When an order is shipped, `quantityReserved` decreases
- When an order is cancelled, reserved stock returns to available

---

## Warehouses

**Table ID**: `warehouses`

Storage locations for inventory management.

### Schema

```typescript
{
  name: string;                   // Warehouse name
  code: string;                   // Internal code (e.g., "BDG-001")
  address: {                      // Structured address
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  isActive: boolean;              // Operational status
}
```

### Example Document

```json
{
  "_id": "k56e8q1h3q2h3q2h3q2h3q2k",
  "name": "Bodega Principal",
  "code": "BDG-001",
  "address": {
    "street": "Calle 123 # 45-67",
    "city": "Neiva",
    "state": "Cundinamarca",
    "zip": "110111"
  },
  "isActive": true
}
```

---

## Orders

**Table ID**: `orders`

B2B order management with full lifecycle tracking.

### Schema

```typescript
{
  orderNumber: string;            // Human-readable order ID (ORD-...)
  customerId: Id("users");        // Ordering user
  companyId?: Id("companies");    // Optional company account
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "partial" | "failed";
  items: OrderItem[];             // Line items
  subtotal: number;               // Sum of line items
  discountAmount: number;         // Applied discounts
  taxAmount: number;              // Tax (VAT)
  shippingAmount: number;         // Shipping cost
  totalAmount: number;            // Final total
  shippingAddress: Address;       // Delivery address
  deliveryDate?: number;          // Promised delivery (timestamp)
  notes?: string;                 // Customer notes
  whatsappPhone?: string;         // Contact for notifications
  createdAt: number;              // Order creation timestamp
}
```

### OrderItem Type

```typescript
{
  productId: Id("products");
  sku: string;                    // Denormalized for history
  name: string;                   // Denormalized product name
  quantity: number;
  unitPrice: number;              // Price at time of order
  totalPrice: number;             // quantity * unitPrice
}
```

### Address Type

```typescript
{
  name: string;                   // Recipient name
  street: string;
  city: string;
  state: string;
  zip: string;
}
```

### Example Document

```json
{
  "_id": "k56e8q1h3q2h3q2h3q2h3q2m",
  "orderNumber": "ORD-1704067200000-42",
  "customerId": "k56e8q1h3q2h3q2h3q2h3q2n",
  "companyId": "k56e8q1h3q2h3q2h3q2h3q2p",
  "status": "confirmed",
  "paymentStatus": "pending",
  "items": [
    {
      "productId": "k56e8q1h3q2h3q2h3q2h3q2h3",
      "sku": "COCA-2L",
      "name": "Coca-Cola 2L",
      "quantity": 12,
      "unitPrice": 8500,
      "totalPrice": 102000
    }
  ],
  "subtotal": 102000,
  "discountAmount": 0,
  "taxAmount": 0,
  "shippingAmount": 0,
  "totalAmount": 102000,
  "shippingAddress": {
    "name": "Tienda La Esquina",
    "street": "Carrera 10 # 20-30",
    "city": "Bogotá",
    "state": "Cundinamarca",
    "zip": "110111"
  },
  "whatsappPhone": "+573001234567",
  "notes": "Entregar después de las 2pm",
  "createdAt": 1704067200000
}
```

### Order Status Flow

```
pending → confirmed → processing → shipped → delivered
   ↓
cancelled
```

### Indexes

| Index Name | Fields | Purpose |
|------------|--------|---------|
| `by_customer` | `customerId` | Customer order history |
| `by_status` | `status` | Status-based queries |
| `by_order_number` | `orderNumber` | Order lookup |

---

## Users

**Table ID**: `users`

B2B customer accounts with role-based access.

### Schema

```typescript
{
  email: string;                  // Login email (unique)
  name: string;                   // Display name
  phone?: string;                 // Contact phone
  role: "admin" | "customer" | "sales_rep";
  customerTier?: "bronze" | "silver" | "gold" | "platinum";
  companyId?: Id("companies");    // Linked company
  isActive: boolean;              // Account status
  createdAt: number;              // Registration timestamp
}
```

### Customer Tiers

| Tier | Benefits |
|------|----------|
| Bronze | Standard pricing |
| Silver | 5% discount |
| Gold | 10% discount |
| Platinum | 15% discount + priority support |

### Example Document

```json
{
  "_id": "k56e8q1h3q2h3q2h3q2h3q2n",
  "email": "admin@dulcitienda.com",
  "name": "Juan Pérez",
  "phone": "+573001234567",
  "role": "admin",
  "customerTier": "platinum",
  "companyId": "k56e8q1h3q2h3q2h3q2h3q2p",
  "isActive": true,
  "createdAt": 1704067200000
}
```

### Indexes

| Index Name | Fields | Purpose |
|------------|--------|---------|
| `by_email` | `email` | Login/authentication |
| `by_company` | `companyId` | Company user listing |

---

## Companies

**Table ID**: `companies`

B2B client organizations with credit management.

### Schema

```typescript
{
  name: string;                   // Company legal name
  taxId?: string;                 // NIT (Colombian tax ID)
  businessType?: string;          // Industry/type
  billingAddress?: Address;       // Invoice address
  shippingAddresses?: Address[];  // Multiple delivery addresses
  creditLimit?: number;           // Maximum credit (COP)
  currentBalance: number;         // Outstanding balance
  paymentTerms?: string;          // e.g., "Net 30"
  assignedSalesRepId?: Id("users");
  isActive: boolean;
}
```

### Example Document

```json
{
  "_id": "k56e8q1h3q2h3q2h3q2h3q2p",
  "name": "Distribuidora El Éxito S.A.S.",
  "taxId": "900123456-7",
  "businessType": "Distribuidora mayorista",
  "billingAddress": {
    "name": "Distribuidora El Éxito",
    "street": "Avenida Principal 100",
    "city": "Bogotá",
    "state": "Cundinamarca",
    "zip": "110111"
  },
  "shippingAddresses": [
    {
      "name": "Bodega Norte",
      "street": "Calle 50 # 10-20",
      "city": "Bogotá",
      "state": "Cundinamarca",
      "zip": "110111"
    }
  ],
  "creditLimit": 50000000,
  "currentBalance": 12500000,
  "paymentTerms": "Net 30",
  "assignedSalesRepId": "k56e8q1h3q2h3q2h3q2h3q2s",
  "isActive": true
}
```

---

## Tier Prices

**Table ID**: `tierPrices`

Volume-based and tier-based pricing rules.

### Schema

```typescript
{
  productId: Id("products");      // Product reference
  customerTier: "bronze" | "silver" | "gold" | "platinum";
  minQuantity: number;            // Minimum quantity for this price
  unitPrice: number;              // Special unit price
  validFrom?: number;             // Start date (timestamp)
  validUntil?: number;            // End date (timestamp)
}
```

### Example Document

```json
{
  "_id": "k56e8q1h3q2h3q2h3q2h3q2r",
  "productId": "k56e8q1h3q2h3q2h3q2h3q2h3",
  "customerTier": "gold",
  "minQuantity": 50,
  "unitPrice": 7800,
  "validFrom": 1704067200000,
  "validUntil": 1735689600000
}
```

### Indexes

| Index Name | Fields | Purpose |
|------------|--------|---------|
| `by_product_tier` | `productId`, `customerTier` | Price rule lookup |

### Price Calculation Logic

```typescript
function calculatePrice(product, user, quantity) {
  // 1. Check tier prices
  const tierPrice = await db.query("tierPrices")
    .withIndex("by_product_tier", q => 
      q.eq("productId", product._id)
       .eq("customerTier", user.customerTier)
    )
    .filter(q => q.gte(q.field("minQuantity"), quantity))
    .first();
  
  if (tierPrice) return tierPrice.unitPrice;
  
  // 2. Apply tier discount to base price
  const discounts = {
    bronze: 0,
    silver: 0.05,
    gold: 0.10,
    platinum: 0.15
  };
  
  return product.basePrice * (1 - discounts[user.customerTier]);
}
```

---

## Indexes Reference

### Complete Index Summary

| Table | Index Name | Fields | Type | Description |
|-------|------------|--------|------|-------------|
| products | `by_sku` | `sku` | btree | SKU lookup |
| products | `by_category` | `categoryId` | btree | Category filter |
| products | `by_active` | `isActive` | btree | Active products |
| products | `search_name` | `name` | search | Full-text search |
| categories | `by_parent` | `parentId` | btree | Hierarchy queries |
| categories | `by_slug` | `slug` | btree | Slug lookup |
| inventory | `by_product` | `productId` | btree | Product inventory |
| inventory | `by_warehouse` | `warehouseId` | btree | Warehouse stock |
| orders | `by_customer` | `customerId` | btree | Customer orders |
| orders | `by_status` | `status` | btree | Status filtering |
| orders | `by_order_number` | `orderNumber` | btree | Order lookup |
| users | `by_email` | `email` | btree | Email lookup |
| users | `by_company` | `companyId` | btree | Company users |
| tierPrices | `by_product_tier` | `productId`, `customerTier` | btree | Price rules |

### Index Usage Best Practices

1. **Always use indexes for filtered queries** - Convex queries without indexes load all documents
2. **Compound indexes** - Use for multi-field queries (e.g., `by_product_tier`)
3. **Search indexes** - Use for text search fields (e.g., `search_name`)
4. **Index cardinality** - High cardinality fields (SKU, email) make better indexes

### Query Examples with Indexes

```typescript
// Using by_sku index
const product = await ctx.db.query("products")
  .withIndex("by_sku", q => q.eq("sku", "COCA-2L"))
  .first();

// Using by_category + filter
const products = await ctx.db.query("products")
  .withIndex("by_category", q => q.eq("categoryId", catId))
  .filter(q => q.eq(q.field("isActive"), true))
  .take(100);

// Using search index
const results = await ctx.db.query("products")
  .withSearchIndex("search_name", q => q.search("name", "coca"))
  .take(20);
```

---

## TypeScript Types

Generated types are available in `convex/_generated/dataModel.d.ts`:

```typescript
import { Doc, Id } from "./_generated/dataModel";

// Type for a product document
type Product = Doc<"products">;

// Type for a product ID
type ProductId = Id<"products">;
```
