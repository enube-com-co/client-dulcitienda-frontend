# Dulcitienda Security Recommendations

**Date:** 2026-03-05  
**Priority:** High to Low  
**Effort Estimates:** Included  

---

## Immediate Actions (This Week)

### 1. Implement Security Headers

**Priority:** HIGH  
**Effort:** 1 hour  
**Impact:** Prevents clickjacking, XSS, MIME-type attacks

#### Implementation:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' https://images.unsplash.com https://images.pexels.com data:",
              "font-src 'self'",
              "connect-src 'self' https://*.convex.cloud https://*.convex.site",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
  
  // Add image domain configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
};

export default nextConfig;
```

#### Testing:
```bash
# After deployment, verify headers
curl -I https://dulcitienda.com.co
```

---

### 2. Add Input Validation with Zod

**Priority:** HIGH  
**Effort:** 2 hours  
**Impact:** Prevents injection attacks and data corruption

#### Implementation:

```bash
npm install zod
```

```typescript
// lib/validation.ts
import { z } from 'zod';

export const SearchQuerySchema = z.string()
  .min(2, 'La búsqueda debe tener al menos 2 caracteres')
  .max(100, 'La búsqueda no puede exceder 100 caracteres')
  .regex(/^[\w\s\-áéíóúÁÉÍÓÚñÑ]+$/, 'Caracteres no permitidos');

export const QuantitySchema = z.number()
  .int('Debe ser un número entero')
  .positive('Debe ser positivo')
  .max(10000, 'Cantidad máxima excedida');

export const CartItemSchema = z.object({
  productId: z.string(),
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().positive().int(),
  packSize: z.number().positive().int(),
});

export const CartSchema = z.array(CartItemSchema).max(100, 'Máximo 100 items en el carrito');

export type CartItem = z.infer<typeof CartItemSchema>;
```

```typescript
// Updated useCart hook with validation
import { CartSchema, CartItemSchema, type CartItem } from '@/lib/validation';

function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('dulcitienda-cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        const validated = CartSchema.parse(parsed);
        setCart(validated);
      }
    } catch (error) {
      console.error('Invalid cart data:', error);
      localStorage.removeItem('dulcitienda-cart');
      setCart([]);
    }
  }, []);
  
  const addToCart = (item: unknown) => {
    try {
      const validatedItem = CartItemSchema.parse(item);
      setCart(prev => {
        const existing = prev.find(i => i.productId === validatedItem.productId);
        let newCart;
        if (existing) {
          newCart = prev.map(i => 
            i.productId === validatedItem.productId 
              ? { ...i, quantity: i.quantity + validatedItem.quantity }
              : i
          );
        } else {
          newCart = [...prev, validatedItem];
        }
        localStorage.setItem('dulcitienda-cart', JSON.stringify(newCart));
        return newCart;
      });
    } catch (error) {
      console.error('Invalid cart item:', error);
    }
  };
  
  return { cart, addToCart, mounted };
}
```

---

### 3. Implement Convex Authentication

**Priority:** HIGH  
**Effort:** 4 hours  
**Impact:** Secures user data and orders

#### Implementation:

```bash
npm install @convex-dev/auth
```

```typescript
// convex/auth.ts
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
});
```

```typescript
// convex/schema.ts - Add auth tables
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  // ... existing tables
  orders: defineTable({
    // ... existing fields
    customerId: v.id("users"),
    // ...
  })
    .index("by_customer", ["customerId"]),
  
  // ... rest of schema
});
```

```typescript
// app/layout.tsx - Add AuthProvider
import { ConvexClientProvider } from "./ConvexClientProvider";
import { AuthProvider } from "@convex-dev/auth/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ConvexClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

```typescript
// convex/orders.ts - Add auth checks
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCustomerOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");
    
    return await ctx.db.query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", userId))
      .order("desc")
      .take(50);
  },
});

export const createOrder = mutation({
  args: {
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
    })),
    shippingAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");
    
    // Validate all products exist and are active
    const orderItems = [];
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product || !product.isActive) {
        throw new Error(`Producto no encontrado: ${item.productId}`);
      }
      
      // Validate inventory
      const inventory = await ctx.db.query("inventory")
        .withIndex("by_product", (q) => q.eq("productId", item.productId))
        .first();
        
      if (!inventory || inventory.quantityAvailable < item.quantity) {
        throw new Error(`Inventario insuficiente: ${product.name}`);
      }
      
      orderItems.push({
        productId: item.productId,
        sku: product.sku,
        name: product.name,
        quantity: item.quantity,
        unitPrice: product.basePrice, // Use server-side price!
        totalPrice: product.basePrice * item.quantity,
      });
    }
    
    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Create order
    const orderId = await ctx.db.insert("orders", {
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerId: userId,
      status: "pending",
      paymentStatus: "pending",
      items: orderItems,
      subtotal,
      discountAmount: 0,
      taxAmount: 0,
      shippingAmount: subtotal > 200000 ? 0 : 15000,
      totalAmount: subtotal + (subtotal > 200000 ? 0 : 15000),
      shippingAddress: args.shippingAddress,
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
    
    return { orderId };
  },
});
```

---

## Short Term (This Month)

### 4. Implement Rate Limiting

**Priority:** MEDIUM  
**Effort:** 3 hours  
**Impact:** Prevents DoS and abuse

```typescript
// convex/lib/rateLimit.ts
import { query, mutation, QueryCtx, MutationCtx } from "../_generated/server";
import { v } from "convex/values";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export async function rateLimit(
  ctx: QueryCtx | MutationCtx,
  identifier: string,
  maxRequests: number
): Promise<void> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean old entries and check current count
  const existing = await ctx.db.query("rateLimits")
    .withIndex("by_key", (q) => q.eq("key", key))
    .first();
    
  if (existing) {
    // Filter requests within the window
    const recentRequests = existing.requests.filter((time: number) => time > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((recentRequests[0] + RATE_LIMIT_WINDOW - now) / 1000)} seconds.`);
    }
    
    // Add new request
    await ctx.db.patch(existing._id, {
      requests: [...recentRequests, now],
    });
  } else {
    // Create new rate limit entry
    await ctx.db.insert("rateLimits", {
      key,
      requests: [now],
    });
  }
}
```

```typescript
// convex/schema.ts - Add rateLimits table
rateLimits: defineTable({
  key: v.string(),
  requests: v.array(v.number()),
})
  .index("by_key", ["key"]),
```

```typescript
// Usage in search
export const searchProducts = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    // Rate limit by IP (use session ID in practice)
    await rateLimit(ctx, `search:${args.query.slice(0, 20)}`, 10);
    
    // ... rest of search logic
  },
});
```

---

### 5. Add Error Tracking

**Priority:** MEDIUM  
**Effort:** 1 hour  
**Impact:** Enables incident detection and response

```bash
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

---

### 6. Create Vercel Configuration

**Priority:** MEDIUM  
**Effort:** 30 minutes  

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "github": {
    "silent": true,
    "autoJobCancelation": true
  },
  "functions": {
    "app/**/*": {
      "maxDuration": 30
    }
  }
}
```

---

### 7. Add Bot Protection

**Priority:** MEDIUM  
**Effort:** 1 hour  

```bash
npm install react-google-recaptcha-v3
```

```typescript
// app/providers.tsx
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
```

---

### 8. Add Privacy Policy

**Priority:** MEDIUM  
**Effort:** 2 hours  

```typescript
// app/privacidad/page.tsx
export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Información que Recopilamos</h2>
        <p className="text-gray-600 mb-4">
          Recopilamos información que usted nos proporciona directamente, 
          incluyendo nombre, dirección, teléfono y correo electrónico.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Uso de la Información</h2>
        <p className="text-gray-600 mb-4">
          Utilizamos su información para procesar pedidos, comunicarnos con usted 
          y mejorar nuestros servicios.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Contacto</h2>
        <p className="text-gray-600">
          Para preguntas sobre esta política, contáctenos en:{' '}
          <a href="mailto:privacy@dulcitienda.com" className="text-pink-600">
            privacy@dulcitienda.com
          </a>
        </p>
      </section>
    </div>
  );
}
```

---

## Long Term (Next Quarter)

### 9. Implement Comprehensive Logging

**Priority:** LOW  
**Effort:** 4 hours  

```typescript
// convex/lib/auditLog.ts
import { MutationCtx } from "../_generated/server";

export async function logAuditEvent(
  ctx: MutationCtx,
  event: {
    action: string;
    userId: string;
    resource: string;
    details?: Record<string, unknown>;
    ip?: string;
    userAgent?: string;
  }
) {
  await ctx.db.insert("auditLogs", {
    ...event,
    timestamp: Date.now(),
  });
}
```

```typescript
// convex/schema.ts
auditLogs: defineTable({
  action: v.string(),
  userId: v.id("users"),
  resource: v.string(),
  details: v.optional(v.record(v.string(), v.any())),
  ip: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  timestamp: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_timestamp", ["timestamp"]),
```

---

### 10. Add Security.txt

**Priority:** LOW  
**Effort:** 15 minutes  

```
# public/.well-known/security.txt
Contact: mailto:security@dulcitienda.com
Expires: 2027-03-05T00:00:00.000Z
Preferred-Languages: es, en
Canonical: https://dulcitienda.com.co/.well-known/security.txt
Policy: https://dulcitienda.com.co/privacidad
Hiring: https://dulcitienda.com.co/careers
```

---

### 11. Dependency Management Automation

**Priority:** LOW  
**Effort:** 30 minutes  

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-github-username"
    labels:
      - "dependencies"
      - "security"
```

---

### 12. Content Security Policy Reporting

**Priority:** LOW  
**Effort:** 2 hours  

```typescript
// next.config.ts - Add CSP report URI
{
  key: 'Content-Security-Policy',
  value: "...; report-uri https://your-csp-report-endpoint.com/report;",
},
{
  key: 'Content-Security-Policy-Report-Only',
  value: "...", // For testing before enforcement
}
```

---

## Security Checklist for Code Reviews

### Before Merging Any PR:

- [ ] No `console.log` with sensitive data
- [ ] All user inputs validated
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] Authentication checks for protected routes
- [ ] Authorization checks for sensitive operations
- [ ] Rate limiting for new endpoints
- [ ] Error handling without information leakage
- [ ] Dependencies reviewed
- [ ] No hardcoded secrets
- [ ] Security headers intact

---

## Monitoring & Alerting Setup

### Recommended Alerts:

```yaml
# Example alerting rules
alerts:
  - name: High Error Rate
    condition: error_rate > 5%
    duration: 5m
    
  - name: Suspicious Login Attempts
    condition: failed_logins > 10
    duration: 1m
    
  - name: Rate Limit Triggered
    condition: rate_limit_hits > 100
    duration: 5m
    
  - name: Large Response Size
    condition: response_size > 10MB
    duration: 1m
```

---

## Cost Estimates

| Recommendation | Time | Cost |
|----------------|------|------|
| Security Headers | 1h | Free |
| Input Validation | 2h | Free |
| Convex Auth | 4h | Free tier available |
| Rate Limiting | 3h | Free |
| Sentry Error Tracking | 1h | Free tier: 5k errors/month |
| reCAPTCHA | 1h | Free: 1M assessments/month |
| Privacy Policy | 2h | Legal review recommended |
| Audit Logging | 4h | Storage costs |
| **Total** | **18h** | **~$0-50/month** |

---

*Implement these recommendations in priority order. Review and update this document quarterly.*
