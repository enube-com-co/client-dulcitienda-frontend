# Dulcitienda Backend Vulnerabilities

**Document ID:** DUL-SEC-VULN-001  
**Date:** March 5, 2026  
**Classification:** INTERNAL - HIGH PRIORITY  
**Affected System:** Dulcitienda Convex Backend  

---

## Vulnerability Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 7 | Open |
| 🟠 High | 5 | Open |
| 🟡 Medium | 8 | Open |
| 🟢 Low | 4 | Open |
| **Total** | **24** | **All Open** |

---

## 🔴 Critical Vulnerabilities

### VULN-001: Missing Authentication on All Operations

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-001 |
| **Severity** | Critical |
| **CVSS Score** | 9.8 |
| **Category** | Authentication |
| **Affected Files** | `orders.ts`, `products.ts`, `seed.ts`, `seedMassive.ts` |

**Description:**
No authentication mechanism is implemented in any Convex query or mutation. All functions are publicly accessible without verifying the identity of the caller.

**Impact:**
- Any user can perform any operation
- No accountability for actions
- Complete data exposure

**Affected Functions:**
```typescript
// orders.ts - All functions
export const createOrder = mutation({...})      // No auth
export const getCustomerOrders = query({...})   // No auth
export const getOrderByNumber = query({...})    // No auth
export const updateOrderStatus = mutation({...}) // No auth

// products.ts - All functions (acceptable for public catalog)
export const getProducts = query({...})         // Public - OK
export const searchProducts = query({...})      // Public - OK

// seed.ts - All functions
export const seedCategories = mutation({...})   // No auth - CRITICAL
export const seedProducts = mutation({...})     // No auth - CRITICAL
export const seedAll = mutation({...})          // No auth - CRITICAL

// seedMassive.ts
export const seedMassive = mutation({...})      // No auth - CRITICAL
```

**Reproduction:**
```bash
# Any HTTP client can call these
 curl -X POST https://<convex-deployment>.convex.site/api/seed.seedAll
```

**Remediation:**
Implement Convex Auth or Clerk authentication and add `ctx.auth` checks to all mutations.

---

### VULN-002: Horizontal Privilege Escalation - Order Access

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-002 |
| **Severity** | Critical |
| **CVSS Score** | 8.5 |
| **Category** | Authorization |
| **Affected Files** | `orders.ts` |

**Description:**
The `getCustomerOrders` and `getOrderByNumber` functions do not verify that the requesting user is authorized to access the requested data. Any user can view any other user's orders.

**Vulnerable Code:**
```typescript
// orders.ts lines 76-82
export const getCustomerOrders = query({
  args: { customerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .take(50);  // 🔴 No auth check - returns ANY customer's orders
  },
});
```

**Attack Scenario:**
1. Attacker knows or guesses a customerId
2. Attacker calls `getCustomerOrders({ customerId: "target-id" })`
3. Attacker receives complete order history including shipping addresses

**Impact:**
- Customer data breach (GDPR/CCPA violation)
- Business intelligence exposure
- Customer relationship damage

**Remediation:**
```typescript
export const getCustomerOrders = query({
  args: { customerId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    // Verify user can only access their own orders
    const user = await ctx.db.query("users")
      .withIndex("by_email", q => q.eq("email", identity.email))
      .first();
    
    if (!user || user._id !== args.customerId) {
      throw new Error("Unauthorized");
    }
    
    return await ctx.db.query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .take(50);
  },
});
```

---

### VULN-003: Unauthenticated Order Creation

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-003 |
| **Severity** | Critical |
| **CVSS Score** | 9.1 |
| **Category** | Business Logic |
| **Affected Files** | `orders.ts` |

**Description:**
The `createOrder` mutation allows creating orders for any customer without authentication. This enables:
- Fraudulent orders
- Inventory manipulation
- Denial of inventory attacks

**Vulnerable Code:**
```typescript
// orders.ts lines 10-75
export const createOrder = mutation({
  args: {
    customerId: v.id("users"),  // 🔴 Can specify ANY customer
    items: v.array(...),
    shippingAddress: v.object(...),
    // ...
  },
  handler: async (ctx, args) => {
    // No auth check - proceeds with order creation
    const orderNumber = `ORD-${Date.now()}-${orderCount.length + 1}`;
    // ... creates order and updates inventory
  },
});
```

**Attack Scenarios:**
1. **Fraudulent Orders:** Attacker creates orders on behalf of legitimate customers
2. **Inventory Exhaustion:** Attacker creates massive orders to reserve inventory
3. **Data Poisoning:** Invalid shipping addresses added to customer records

**Remediation:**
1. Require authentication
2. Derive customerId from authenticated user, not from args
3. Validate inventory before reservation
4. Add order limits per customer

---

### VULN-004: Public Data Destruction Functions

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-004 |
| **Severity** | Critical |
| **CVSS Score** | 9.9 |
| **Category** | Access Control |
| **Affected Files** | `seed.ts`, `seedMassive.ts` |

**Description:**
All seed functions are publicly exposed through the Convex API and can delete all production data without authentication.

**Vulnerable Code:**
```typescript
// seed.ts lines 180-189
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // 🔴 DELETES ALL EXISTING PRODUCTS
    const existingProducts = await ctx.db.query("products").collect();
    for (const p of existingProducts) {
      await ctx.db.delete(p._id);
    }
    
    // 🔴 DELETES ALL EXISTING CATEGORIES
    const existingCats = await ctx.db.query("categories").collect();
    for (const c of existingCats) {
      await ctx.db.delete(c._id);
    }
    // ... re-seeds with test data
  },
});
```

**Impact:**
- Complete data loss with single API call
- No recovery mechanism shown
- Business continuity destroyed

**Reproduction:**
```javascript
// From any browser console or HTTP client
fetch('https://<deployment>.convex.site/api/seed.seedAll', {
  method: 'POST',
  body: '{}'
});
```

**Remediation:**
1. Remove seed functions from production deployment
2. Or convert to internal functions only
3. Add admin-only authentication
4. Add environment checks (block in production)

---

### VULN-005: Missing Authorization on Status Updates

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-005 |
| **Severity** | Critical |
| **CVSS Score** | 8.2 |
| **Category** | Authorization |
| **Affected Files** | `orders.ts` |

**Description:**
The `updateOrderStatus` function allows changing order status without authentication or authorization. Only admins should be able to update order status.

**Vulnerable Code:**
```typescript
// orders.ts lines 93-107
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(...),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { status: args.status });
    // 🔴 No auth check, no role check
  },
});
```

**Attack Scenarios:**
1. Customer marks their own order as "delivered" before actual delivery
2. Attacker cancels legitimate orders
3. Attacker marks pending orders as "shipped" to disrupt fulfillment

**Remediation:**
```typescript
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(...),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const user = await ctx.db.query("users")
      .withIndex("by_email", q => q.eq("email", identity.email))
      .first();
    
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }
    
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});
```

---

### VULN-006: Inventory Manipulation Without Validation

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-006 |
| **Severity** | Critical |
| **CVSS Score** | 8.0 |
| **Category** | Business Logic |
| **Affected Files** | `orders.ts` |

**Description:**
Order creation reduces inventory without validating:
- Sufficient inventory exists
- Quantity is reasonable
- Product is active

**Vulnerable Code:**
```typescript
// orders.ts lines 60-72
for (const item of args.items) {
  const inventory = await ctx.db.query("inventory")
    .withIndex("by_product", (q) => q.eq("productId", item.productId))
    .first();
  
  if (inventory) {
    await ctx.db.patch(inventory._id, {
      quantityAvailable: inventory.quantityAvailable - item.quantity,  // 🔴 No check for negative
      quantityReserved: inventory.quantityReserved + item.quantity,
      lastUpdated: Date.now(),
    });
  }
}
```

**Attack Scenarios:**
1. Order more than available inventory → negative stock
2. Order inactive products → inventory drift
3. Massive quantity orders → integer overflow potential

**Remediation:**
```typescript
for (const item of args.items) {
  const product = await ctx.db.get(item.productId);
  if (!product || !product.isActive) {
    throw new Error(`Product ${item.sku} not available`);
  }
  
  const inventory = await ctx.db.query("inventory")
    .withIndex("by_product", (q) => q.eq("productId", item.productId))
    .first();
  
  if (!inventory || inventory.quantityAvailable < item.quantity) {
    throw new Error(`Insufficient inventory for ${item.sku}`);
  }
  
  if (item.quantity > 10000) {
    throw new Error("Quantity exceeds maximum order limit");
  }
  
  await ctx.db.patch(inventory._id, {
    quantityAvailable: inventory.quantityAvailable - item.quantity,
    quantityReserved: inventory.quantityReserved + item.quantity,
    lastUpdated: Date.now(),
  });
}
```

---

### VULN-007: Price Manipulation in Orders

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-007 |
| **Severity** | Critical |
| **CVSS Score** | 9.3 |
| **Category** | Business Logic |
| **Affected Files** | `orders.ts` |

**Description:**
The `createOrder` mutation accepts `unitPrice` from client input without validating against the actual product price. Clients can specify any price.

**Vulnerable Code:**
```typescript
// orders.ts lines 15-22
args: {
  items: v.array(v.object({
    productId: v.id("products"),
    sku: v.string(),
    name: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),  // 🔴 Client-controlled price
  })),
  // ...
},
handler: async (ctx, args) => {
  for (const item of args.items) {
    const totalPrice = item.quantity * item.unitPrice;  // 🔴 Uses client price
    // ...
  }
}
```

**Attack Scenario:**
```javascript
// Attacker sets unitPrice to 0 or very low
{
  items: [{
    productId: "product-id",
    sku: "COCA-2L",
    name: "Coca-Cola 2L",
    quantity: 100,
    unitPrice: 1  // 🔴 Actual price is 8500
  }]
}
// Total: 100 instead of 850,000
```

**Remediation:**
```typescript
handler: async (ctx, args) => {
  for (const item of args.items) {
    // Fetch actual product price
    const product = await ctx.db.get(item.productId);
    if (!product) throw new Error(`Product ${item.sku} not found`);
    
    // Verify price matches (allow small float variance)
    if (Math.abs(item.unitPrice - product.basePrice) > 0.01) {
      throw new Error(`Price mismatch for ${item.sku}`);
    }
    
    const totalPrice = item.quantity * product.basePrice;
    // ...
  }
}
```

---

## 🟠 High Severity Vulnerabilities

### VULN-008: Email Enumeration via User Queries

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-008 |
| **Severity** | High |
| **CVSS Score** | 7.5 |
| **Category** | Information Disclosure |
| **Affected Files** | Schema design |

**Description:**
The `users` table has an index on email (`by_email`) which will be useful for authentication, but without rate limiting, attackers can enumerate valid email addresses.

**Impact:**
- User enumeration for targeted attacks
- Privacy violation
- Pharming attack preparation

**Remediation:**
- Implement rate limiting on authentication endpoints
- Add CAPTCHA after failed attempts
- Use generic error messages

---

### VULN-009: Order Number Enumeration

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-009 |
| **Severity** | High |
| **CVSS Score** | 7.0 |
| **Category** | Information Disclosure |
| **Affected Files** | `orders.ts` |

**Description:**
Order numbers use a predictable format: `ORD-${Date.now()}-${count}`. This sequential pattern allows attackers to guess order numbers.

**Vulnerable Code:**
```typescript
const orderNumber = `ORD-${Date.now()}-${orderCount.length + 1}`;
```

**Impact:**
- Easy enumeration of all orders
- Access to order details via `getOrderByNumber`
- Business intelligence leakage

**Remediation:**
```typescript
// Use UUID or cryptographically secure random
import { v4 as uuidv4 } from 'uuid';
const orderNumber = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
```

---

### VULN-010: Missing Input Sanitization

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-010 |
| **Severity** | High |
| **CVSS Score** | 7.2 |
| **Category** | Input Validation |
| **Affected Files** | `orders.ts`, `products.ts` |

**Description:**
Multiple fields accept string input without length limits or sanitization:
- Order notes
- Shipping address fields
- Search queries

**Potential Issues:**
- NoSQL injection (though Convex is protected)
- Storage exhaustion
- Log poisoning
- XSS if data displayed without escaping

**Remediation:**
```typescript
// Add validators for string length
const safeString = v.string();  // Should use: v.string().maxLength(1000)

// Or validate in handler
if (args.notes && args.notes.length > 1000) {
  throw new Error("Notes exceed maximum length");
}
```

---

### VULN-011: Missing Referential Integrity

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-011 |
| **Severity** | High |
| **CVSS Score** | 7.0 |
| **Category** | Data Integrity |
| **Affected Files** | All schema files |

**Description:**
No validation ensures referenced IDs exist before insertion or prevent orphaned records on deletion.

**Examples:**
```typescript
// Can insert order with non-existent customerId
await ctx.db.insert("orders", {
  customerId: "non-existent-id",  // No error
  // ...
});
```

**Remediation:**
Add validation in all create/update handlers:
```typescript
// Validate customer exists
const customer = await ctx.db.get(args.customerId);
if (!customer) throw new Error("Customer not found");

// Validate products exist
for (const item of args.items) {
  const product = await ctx.db.get(item.productId);
  if (!product) throw new Error(`Product ${item.sku} not found`);
}
```

---

### VULN-012: Warehouse Duplication

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-012 |
| **Severity** | High |
| **CVSS Score** | 6.8 |
| **Category** | Data Integrity |
| **Affected Files** | `seed.ts`, `seedMassive.ts` |

**Description:**
Seed functions create a new warehouse for every product, creating duplicate entries.

**Vulnerable Code:**
```typescript
await ctx.db.insert("inventory", {
  productId,
  warehouseId: (await ctx.db.insert("warehouses", {
    name: "Bodega Principal",  // 🔴 Same name, new ID each time
    code: "BDG-001",           // 🔴 Same code
    // ...
  })),
  // ...
});
```

**Impact:**
- Database pollution
- Query performance degradation
- Inventory tracking confusion

**Remediation:**
Create warehouse once, reuse ID:
```typescript
const warehouse = await ctx.db.insert("warehouses", {...});
for (const prod of products) {
  const productId = await ctx.db.insert("products", {...});
  await ctx.db.insert("inventory", {
    productId,
    warehouseId: warehouse._id,  // Reuse same warehouse
    // ...
  });
}
```

---

## 🟡 Medium Severity Vulnerabilities

### VULN-013: No Rate Limiting

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-013 |
| **Severity** | Medium |
| **CVSS Score** | 6.5 |
| **Category** | Availability |
| **Affected Files** | All API files |

**Description:**
No rate limiting implemented on any endpoint, allowing:
- Brute force attacks
- Data scraping
- DoS attacks

**Remediation:**
Implement Convex rate limiting or use API gateway:
```typescript
import { RateLimiter } from "./rateLimiter";

export const createOrder = mutation({
  handler: async (ctx, args) => {
    await RateLimiter.check(ctx, "createOrder", { max: 10, window: 60000 });
    // ...
  }
});
```

---

### VULN-014: Search Performance DoS

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-014 |
| **Severity** | Medium |
| **CVSS Score** | 6.0 |
| **Category** | Availability |
| **Affected Files** | `products.ts` |

**Description:**
`searchProducts` loads up to 500 products into memory for client-side filtering.

**Vulnerable Code:**
```typescript
const allProducts = await ctx.db.query("products")
  .filter((q) => q.eq(q.field("isActive"), true))
  .take(500);  // 🔴 Loads 500 docs into memory
```

**Remediation:**
Use Convex search index properly or implement server-side filtering with limits.

---

### VULN-015: No Audit Logging

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-015 |
| **Severity** | Medium |
| **CVSS Score** | 6.0 |
| **Category** | Accountability |
| **Affected Files** | All mutation files |

**Description:**
No audit trail for:
- Who created orders
- Who updated order status
- When inventory changed

**Remediation:**
Create audit log table and log all mutations.

---

### VULN-016: Missing Business Rule Validation

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-016 |
| **Severity** | Medium |
| **CVSS Score** | 5.8 |
| **Category** | Business Logic |
| **Affected Files** | `orders.ts`, `schema.ts` |

**Missing Validations:**
- Price must be positive
- Quantity must be at least minimumOrderQuantity
- Order status transitions must follow workflow
- Credit limit checks for companies

---

### VULN-017: Shipping Address Validation Missing

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-017 |
| **Severity** | Medium |
| **CVSS Score** | 5.5 |
| **Category** | Data Quality |
| **Affected Files** | `orders.ts` |

**Description:**
Shipping addresses accept any string values without validation:
- No zip code format check
- No state/region validation
- No address normalization

---

### VULN-018: No CORS Configuration

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-018 |
| **Severity** | Medium |
| **CVSS Score** | 5.3 |
| **Category** | Configuration |
| **Affected Files** | Project configuration |

**Description:**
No CORS configuration found for Convex HTTP actions. Default Convex CORS may be too permissive.

---

### VULN-019: Hardcoded Test Data

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-019 |
| **Severity** | Medium |
| **CVSS Score** | 5.0 |
| **Category** | Data Exposure |
| **Affected Files** | `seed.ts`, `seedMassive.ts` |

**Description:**
Test addresses and data may leak information about development location (Colombia addresses).

---

### VULN-020: No Environment Separation

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-020 |
| **Severity** | Medium |
| **CVSS Score** | 5.5 |
| **Category** | Configuration |
| **Affected Files** | `seed.ts`, `seedMassive.ts` |

**Description:**
Seed functions don't check environment before executing destructive operations.

---

## 🟢 Low Severity Issues

### VULN-021: Missing Index on Companies

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-021 |
| **Severity** | Low |
| **CVSS Score** | 3.5 |
| **Category** | Performance |
| **Affected Files** | `schema.ts` |

**Description:**
The `companies` table has no indexes, causing full table scans on lookups.

---

### VULN-022: Unbounded Array Fields

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-022 |
| **Severity** | Low |
| **CVSS Score** | 3.0 |
| **Category** | Data Integrity |
| **Affected Files** | `schema.ts` |

**Description:**
Array fields (images, items, shippingAddresses) have no size limits.

---

### VULN-023: Optional Sensitive Fields

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-023 |
| **Severity** | Low |
| **CVSS Score** | 2.5 |
| **Category** | Data Quality |
| **Affected Files** | `schema.ts` |

**Description:**
Sensitive fields like `taxId` and `creditLimit` are optional, allowing incomplete business records.

---

### VULN-024: Missing Product Description

| Attribute | Value |
|-----------|-------|
| **ID** | VULN-024 |
| **Severity** | Low |
| **CVSS Score** | 2.0 |
| **Category** | Data Quality |
| **Affected Files** | `schema.ts` |

**Description:**
Product descriptions are optional, leading to incomplete catalog data.

---

## Vulnerability Timeline

| Date | Action |
|------|--------|
| 2026-03-05 | Vulnerabilities discovered during security audit |
| 2026-03-05 | Report generated |
| TBD | Remediation planned |
| TBD | Verification testing |

---

## References

- [OWASP Top 10 2025](https://owasp.org/Top10/)
- [Convex Security Documentation](https://docs.convex.dev/security)
- [CVSS 3.1 Calculator](https://www.first.org/cvss/calculator/3.1)

---

*Document generated by Security Auditor Sub-agent*  
*Dulcitienda Security Assessment - March 2026*
