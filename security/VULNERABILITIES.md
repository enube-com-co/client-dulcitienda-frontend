# Dulcitienda Vulnerabilities Report

**Report Date:** 2026-03-05  
**Classification:** Internal - Security Team  
**Affected System:** Dulcitienda E-commerce Platform  

---

## Vulnerability Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 0 | - |
| High | 2 | Open |
| Medium | 5 | Open |
| Low | 8 | Open |
| **Total** | **15** | **All Open** |

---

## High Severity

### VULN-001: Missing Security Headers

**Severity:** HIGH  
**CVSS Score:** 7.5 (High)  
**Status:** Open  
**CWE:** CWE-693: Protection Mechanism Failure  

**Description:**
The application does not implement essential HTTP security headers, leaving it vulnerable to various attacks including clickjacking, MIME-type sniffing, and XSS.

**Affected Files:**
- `next.config.ts`

**Evidence:**
```typescript
// Current next.config.ts
const nextConfig: NextConfig = {
  /* config options here */
};
```

**Missing Headers:**
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `X-XSS-Protection`

**Impact:**
- Clickjacking attacks possible
- XSS through MIME-type confusion
- Information leakage via referrer
- Feature abuse via unrestricted permissions

**Remediation:**
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://*.unsplash.com https://*.pexels.com data:; font-src 'self'; connect-src 'self' https://*.convex.cloud;"
          },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
```

**References:**
- OWASP: https://owasp.org/www-project-secure-headers/
- MDN: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

---

### VULN-002: Missing Authentication and Authorization

**Severity:** HIGH  
**CVSS Score:** 8.1 (High)  
**Status:** Open  
**CWE:** CWE-306: Missing Authentication for Critical Function  

**Description:**
The application lacks proper authentication and authorization mechanisms. A mock user ID is hardcoded, and no permission checks exist for sensitive operations.

**Affected Files:**
- `app/pedidos/page.tsx` (line 16)
- `convex/orders.ts` (all mutations)
- `convex/products.ts` (all queries)

**Evidence:**
```typescript
// app/pedidos/page.tsx
const mockUserId = "mock-user-id";
const orders = useQuery(api.orders.getCustomerOrders, { customerId: mockUserId as any });
```

```typescript
// convex/orders.ts - No auth check
export const createOrder = mutation({
  args: { ... },
  handler: async (ctx, args) => {
    // No authentication check
    // No authorization check
    // Anyone can create orders
  },
});
```

**Impact:**
- Unauthorized access to customer orders
- Anyone can create orders impersonating others
- No audit trail of who performed actions
- Potential data leakage between customers

**Remediation:**
1. Implement Convex Auth:
```typescript
// Install: npm install @convex-dev/auth

// convex/auth.ts
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
});
```

2. Add authentication checks:
```typescript
export const getCustomerOrders = query({
  args: { customerId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    // Verify user can only access their own orders
    if (identity.subject !== args.customerId) {
      throw new Error("Unauthorized");
    }
    
    return await ctx.db.query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .take(50);
  },
});
```

**References:**
- Convex Auth: https://labs.convex.dev/auth
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

---

## Medium Severity

### VULN-003: Potential XSS via dangerouslySetInnerHTML

**Severity:** MEDIUM  
**CVSS Score:** 6.1 (Medium)  
**Status:** Open  
**CWE:** CWE-79: Cross-site Scripting (XSS)  

**Description:**
The application uses `dangerouslySetInnerHTML` to inject JSON-LD structured data. While currently static, any dynamic content injection could lead to XSS.

**Affected Files:**
- `app/layout.tsx` (lines 64-104)

**Evidence:**
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Dulcitienda",
      // ... more data
    }),
  }}
/>
```

**Impact:**
- Script injection if dynamic data is added
- Potential for SEO manipulation
- XSS attacks if user input is ever included

**Remediation:**
```typescript
// Option 1: Use a sanitization library
import DOMPurify from 'isomorphic-dompurify';

const jsonLd = JSON.stringify(structuredData);
const sanitized = DOMPurify.sanitize(jsonLd);

// Option 2: Remove dangerouslySetInnerHTML entirely
<script type="application/ld+json">
  {JSON.stringify(structuredData)}
</script>
```

---

### VULN-004: No Rate Limiting on API Endpoints

**Severity:** MEDIUM  
**CVSS Score:** 5.3 (Medium)  
**Status:** Open  
**CWE:** CWE-770: Allocation of Resources Without Limits or Throttling  

**Description:**
No rate limiting is implemented on Convex queries or mutations, making the application susceptible to DoS attacks and abuse.

**Affected Files:**
- `convex/products.ts` (all functions)
- `convex/orders.ts` (all mutations)

**Evidence:**
```typescript
// Search function can be called unlimited times
export const searchProducts = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const allProducts = await ctx.db.query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(500); // High limit, no rate limiting
    // ...
  },
});
```

**Impact:**
- DoS attacks possible
- Database exhaustion
- API abuse for data scraping
- Order spam

**Remediation:**
```typescript
// convex/lib/rateLimit.ts
export async function rateLimit(
  ctx: QueryCtx | MutationCtx,
  identifier: string,
  maxRequests: number,
  windowMs: number
) {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  
  const record = await ctx.db.query("rateLimits")
    .withIndex("by_key", (q) => q.eq("key", key))
    .first();
    
  if (record && record.count >= maxRequests) {
    throw new Error("Rate limit exceeded");
  }
  
  // Update or create rate limit record
  // ... implementation
}

// Usage in query
export const searchProducts = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    await rateLimit(ctx, args.query, 10, 60000); // 10 searches per minute
    // ... rest of handler
  },
});
```

---

### VULN-005: LocalStorage Data Integrity Issues

**Severity:** MEDIUM  
**CVSS Score:** 5.0 (Medium)  
**Status:** Open  
**CWE:** CWE-345: Insufficient Verification of Data Authenticity  

**Description:**
Cart data stored in localStorage is not validated when loaded, potentially causing application errors or unexpected behavior if data is corrupted or manipulated.

**Affected Files:**
- `app/carrito/page.tsx` (lines 30-33)
- `app/catalogo/page.tsx` (lines 46-50)
- `app/producto/[sku]/page.tsx` (lines 34-38)

**Evidence:**
```typescript
const saved = localStorage.getItem('dulcitienda-cart');
if (saved) {
  setCart(JSON.parse(saved)); // No validation!
}
```

**Impact:**
- Application crashes from malformed data
- Potential for price manipulation (client-side only)
- Data corruption across sessions

**Remediation:**
```typescript
import { z } from 'zod';

const CartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  sku: z.string(),
  price: z.number().positive(),
  quantity: z.number().positive().int(),
  packSize: z.number().positive().int(),
});

const CartSchema = z.array(CartItemSchema);

function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  useEffect(() => {
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
  
  // ... rest of hook
}
```

---

### VULN-006: Insufficient Input Validation

**Severity:** MEDIUM  
**CVSS Score:** 5.3 (Medium)  
**Status:** Open  
**CWE:** CWE-20: Improper Input Validation  

**Description:**
User inputs lack proper validation, allowing potentially invalid or malicious data.

**Affected Files:**
- `app/catalogo/page.tsx` (quantity inputs)
- `app/buscar/page.tsx` (search query)
- `app/producto/[sku]/page.tsx` (quantity input)

**Evidence:**
```typescript
// No max length, no sanitization
<input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Buscar por nombre o SKU..."
/>

// Quantity can be manipulated
onChange={(e) => setQuantities(prev => ({ 
  ...prev, 
  [product._id]: parseInt(e.target.value) || product.minimumOrderQuantity 
}))}
```

**Impact:**
- Search query DoS (very long strings)
- Invalid quantity values
- Client-side manipulation

**Remediation:**
```typescript
// Search input with limits
const MAX_SEARCH_LENGTH = 100;

onChange={(e) => {
  const value = e.target.value.slice(0, MAX_SEARCH_LENGTH);
  setSearchQuery(value);
}}

// Quantity with constraints
const updateQuantity = (productId: string, value: string, min: number, max: number) => {
  const num = parseInt(value) || min;
  const clamped = Math.max(min, Math.min(max, num));
  setQuantities(prev => ({ ...prev, [productId]: clamped }));
};
```

---

## Low Severity

### VULN-007: Outdated Dependencies

**Severity:** LOW  
**CVSS Score:** 3.7 (Low)  
**Status:** Open  
**CWE:** CWE-1104: Use of Unmaintained Third Party Components  

**Description:**
Two dependencies are outdated and may contain unpatched security vulnerabilities.

**Affected Packages:**
| Package | Current | Latest | Location |
|---------|---------|--------|----------|
| @types/node | 24.11.0 | 25.3.3 | devDependencies |
| eslint | 9.39.3 | 10.0.2 | devDependencies |

**Remediation:**
```bash
npm update @types/node eslint
npm audit fix
```

---

### VULN-008: Missing Vercel Configuration

**Severity:** LOW  
**CVSS Score:** 3.1 (Low)  
**Status:** Open  
**CWE:** CWE-16: Configuration  

**Description:**
No `vercel.json` configuration file exists, relying on default settings which may not be optimal for security.

**Remediation:**
Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ],
  "github": {
    "silent": true
  }
}
```

---

### VULN-009: Public Convex URL Exposure

**Severity:** LOW  
**CVSS Score:** 3.1 (Low)  
**Status:** Open - Accepted Risk  
**CWE:** CWE-200: Exposure of Sensitive Information to an Unauthorized Actor  

**Description:**
The Convex URL is exposed to the client via `NEXT_PUBLIC_CONVEX_URL`. This is required for Convex but should be noted.

**Affected Files:**
- `app/ConvexClientProvider.tsx`

**Evidence:**
```typescript
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
```

**Impact:**
- Low - Convex URLs are designed to be public
- Abuse possible if rate limiting not implemented

**Remediation:**
- Implement rate limiting (see VULN-004)
- Monitor usage in Convex dashboard

---

### VULN-010: Missing Privacy Policy

**Severity:** LOW  
**CVSS Score:** 2.3 (Low)  
**Status:** Open  
**CWE:** CWE-359: Exposure of Private Personal Information to an Unauthorized Actor  

**Description:**
No privacy policy page exists, which is required for GDPR compliance and user trust.

**Remediation:**
Create `/app/privacidad/page.tsx` with privacy policy content.

---

### VULN-011: Missing Image Domain Configuration

**Severity:** LOW  
**CVSS Score:** 2.3 (Low)  
**Status:** Open  
**CWE:** CWE-16: Configuration  

**Description:**
External images are loaded without explicit domain configuration in Next.js.

**Affected Files:**
- `next.config.ts`

**Remediation:**
```typescript
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
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
```

---

### VULN-012: Missing Error Tracking

**Severity:** LOW  
**CVSS Score:** 2.3 (Low)  
**Status:** Open  
**CWE:** CWE-778: Insufficient Logging  

**Description:**
No error tracking service (Sentry, LogRocket, etc.) is configured, making it difficult to detect and respond to security incidents.

**Remediation:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

### VULN-013: Phone Number Exposure in Source

**Severity:** LOW  
**CVSS Score:** 2.0 (Low)  
**Status:** Open - Accepted Risk  
**CWE:** CWE-200: Information Exposure  

**Description:**
Business phone numbers are hardcoded in the source code.

**Affected Files:**
- Multiple files with `+57 313 2309867`

**Impact:**
- Low - Business contact numbers are public information
- Potential for spam/scam calls

---

### VULN-014: Missing Bot Protection

**Severity:** LOW  
**CVSS Score:** 2.3 (Low)  
**Status:** Open  
**CWE:** CWE-799: Improper Control of Interaction Frequency  

**Description:**
No bot protection (reCAPTCHA, hCaptcha, etc.) is implemented for form submissions or order creation.

**Remediation:**
- Implement reCAPTCHA v3 for order creation
- Add honeypot fields to forms

---

### VULN-015: Missing Security.txt

**Severity:** LOW  
**CVSS Score:** 1.8 (Low)  
**Status:** Open  
**CWE:** CWE-1059: Incomplete Documentation  

**Description:**
No `security.txt` file exists to provide contact information for security researchers.

**Remediation:**
Create `public/.well-known/security.txt`:
```
Contact: mailto:security@dulcitienda.com
Expires: 2027-03-05T00:00:00.000Z
Preferred-Languages: es, en
Canonical: https://dulcitienda.com.co/.well-known/security.txt
Policy: https://dulcitienda.com.co/security-policy
```

---

## Appendix A: CWE Mapping

| CWE ID | Description | Count |
|--------|-------------|-------|
| CWE-693 | Protection Mechanism Failure | 1 |
| CWE-306 | Missing Authentication | 1 |
| CWE-79 | Cross-site Scripting | 1 |
| CWE-770 | Allocation Without Throttling | 1 |
| CWE-345 | Insufficient Data Verification | 1 |
| CWE-20 | Improper Input Validation | 1 |
| CWE-1104 | Unmaintained Components | 1 |
| CWE-16 | Configuration | 2 |
| CWE-200 | Information Exposure | 2 |
| CWE-359 | Private Information Exposure | 1 |
| CWE-778 | Insufficient Logging | 1 |
| CWE-799 | Interaction Frequency Control | 1 |
| CWE-1059 | Incomplete Documentation | 1 |

---

## Appendix B: OWASP Top 10 2021 Mapping

| Rank | Category | Status | Related Vulns |
|------|----------|--------|---------------|
| A01 | Broken Access Control | ⚠️ | VULN-002 |
| A02 | Cryptographic Failures | ✅ | N/A |
| A03 | Injection | ⚠️ | VULN-003 |
| A04 | Insecure Design | ⚠️ | VULN-004, VULN-006 |
| A05 | Security Misconfiguration | ❌ | VULN-001, VULN-008 |
| A06 | Vulnerable Components | ⚠️ | VULN-007 |
| A07 | Auth Failures | ❌ | VULN-002 |
| A08 | Software/Data Integrity | ⚠️ | VULN-005 |
| A09 | Logging Failures | ⚠️ | VULN-012 |
| A10 | SSRF | ✅ | N/A |

Legend: ✅ Secure | ⚠️ Partial | ❌ At Risk

---

*Report generated on 2026-03-05. Vulnerabilities should be remediated according to severity.*
