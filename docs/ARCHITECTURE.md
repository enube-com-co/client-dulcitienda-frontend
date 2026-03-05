# Architecture Documentation

## System Architecture

Dulcitienda follows a modern full-stack architecture using Next.js App Router with Convex as the backend-as-a-service platform.

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │   Mobile     │  │   Tablet     │      │
│  │   (Chrome)   │  │   (Safari)   │  │   (Any)      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼────────────────┼────────────────┼───────────────┘
          │                │                │
          └────────────────┴────────────────┘
                           │
                    ┌──────▼────────┐
                    │  Vercel Edge  │
                    │   Network     │
                    └──────┬────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   Next.js Application                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              App Router (Next.js 16)                │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────┐   │   │
│  │  │  Server    │ │   Client   │ │     RSC        │   │   │
│  │  │ Components │ │ Components │ │   (Static)     │   │   │
│  │  └────────────┘ └────────────┘ └────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │              Convex React Client                    │   │
│  │         (useQuery, useMutation hooks)               │   │
│  └──────────────────────┬──────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Convex Platform                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Convex Functions                       │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────┐   │   │
│  │  │  Queries   │ │ Mutations  │ │    Actions     │   │   │
│  │  │   (Read)   │ │  (Write)   │ │   (HTTP/Sync)  │   │   │
│  │  └────────────┘ └────────────┘ └────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │              Convex Database                        │   │
│  │         (Automatic Indexing & Search)               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### Page Structure

```
RootLayout
├── ConvexClientProvider (wraps all)
│   └── Page Content
│       ├── TopBar (promo banner)
│       ├── Header
│       │   ├── Logo
│       │   ├── SearchDropdown
│       │   ├── Navigation
│       │   └── Cart Icon
│       ├── Main Content (varies by page)
│       │   ├── Home: Hero → Categories → Featured → About → CTA
│       │   ├── Catalog: Filters → ProductGrid
│       │   ├── Product: ImageGallery → Details → Related
│       │   └── Cart: Items → Summary
│       └── Footer
```

### Component Tree by Page

#### Home Page (`/`)
```
Home (Server Component wrapper)
└── "use client" Home Component
    ├── TopBar
    ├── Header
    │   └── SearchDropdown (Convex query)
    ├── Hero Section
    ├── Features Bar
    ├── Categories Grid
    ├── Featured Products (Convex query: getFeaturedProducts)
    ├── About Section
    ├── CTA Section
    └── Footer
```

#### Catalog Page (`/catalogo`)
```
Catalogo (Client Component)
├── TopBar
├── Header
├── Breadcrumb
├── Sidebar (Filters)
│   └── Category Filter
└── ProductGrid (Convex query: getProducts)
    ├── Toolbar (View toggle, Sort)
    └── ProductCard (mapped from results)
```

#### Product Detail (`/producto/[sku]`)
```
ProductoPage (Client Component)
├── TopBar
├── Header
├── Breadcrumb
├── ProductLayout (2-column)
│   ├── ImageGallery
│   └── ProductDetails
│       ├── PriceCard
│       ├── Features Grid
│       ├── QuantitySelector
│       └── AddToCartButton
└── RelatedProducts (Convex query)
```

---

## Data Flow

### Product Browsing Flow

```
User Action          Client                    Convex
    │                  │                         │
    │ Navigate to /    │                         │
    │─────────────────▶│                         │
    │                  │ useQuery(getCategories) │
    │                  │────────────────────────▶│
    │                  │                         │ Query DB
    │                  │◀────────────────────────│
    │                  │                         │
    │                  │ useQuery(getFeatured)   │
    │                  │────────────────────────▶│
    │                  │                         │ Query DB
    │                  │◀────────────────────────│
    │ Render UI        │                         │
    │◀─────────────────│                         │
```

### Cart Addition Flow

```
User Action          Client                    localStorage
    │                  │                            │
    │ Click "Add"      │                            │
    │─────────────────▶│                            │
    │                  │ addToCart()                │
    │                  │ update state               │
    │                  │───────────────────────────▶│
    │                  │                            │ Save JSON
    │                  │◀───────────────────────────│
    │ UI Update        │                            │
    │◀─────────────────│                            │
```

### WhatsApp Order Flow

```
User Action          Cart Page                    WhatsApp
    │                  │                            │
    │ Click "Send"     │                            │
    │─────────────────▶│                            │
    │                  │ Format cart data           │
    │                  │ Encode message             │
    │                  │ Open wa.me link            │
    │                  │───────────────────────────▶│
    │                  │                            │ Redirect to
    │                  │                            │ WhatsApp app
```

---

## State Management

### Client State (React Hooks)

| State | Location | Type | Persistence |
|-------|----------|------|-------------|
| Cart | `useCart()` hook | Array of CartItem | localStorage |
| UI State | Component state | Boolean/Number | None |
| Search Query | SearchDropdown | String | None |
| Selected Filters | Catalog page | Object | URL params |

### Server State (Convex)

| Data | Query/Mutation | Real-time |
|------|----------------|-----------|
| Products | `products.getProducts` | ✅ Yes |
| Categories | `products.getCategories` | ✅ Yes |
| Product Detail | `products.getProduct` | ✅ Yes |
| Search Results | `products.searchProducts` | ✅ Yes |
| Orders | `orders.getCustomerOrders` | ✅ Yes |

### State Management Pattern

```typescript
// Custom hook pattern for cart
function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dulcitienda-cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);
  
  // Persist on change
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const newCart = /* logic */;
      localStorage.setItem('dulcitienda-cart', JSON.stringify(newCart));
      return newCart;
    });
  };
  
  return { cart, addToCart };
}
```

---

## API Integration (Convex)

### Connection Setup

```typescript
// app/ConvexClientProvider.tsx
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

### Query Usage Pattern

```typescript
// In components
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function ProductList() {
  const products = useQuery(api.products.getProducts, { limit: 20 });
  
  if (products === undefined) return <Loading />;
  return <ProductGrid products={products} />;
}
```

### Mutation Usage Pattern

```typescript
import { useMutation } from "convex/react";

function AddToCartButton({ product }) {
  const createOrder = useMutation(api.orders.createOrder);
  
  const handleClick = async () => {
    await createOrder({ items: [...], customerId: "..." });
  };
}
```

---

## Routing Structure

### App Router Structure

```
app/
├── layout.tsx          # Root layout (metadata, fonts, providers)
├── page.tsx            # / - Home/Landing
├── catalogo/
│   └── page.tsx        # /catalogo - Product catalog
├── producto/
│   └── [sku]/
│       └── page.tsx    # /producto/:sku - Product detail
├── carrito/
│   └── page.tsx        # /carrito - Shopping cart
├── buscar/
│   └── page.tsx        # /buscar?q= - Search results
└── pedidos/
    └── page.tsx        # /pedidos - Order history
```

### Route Types

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Pre-rendered at build time |
| `/catalogo` | Dynamic SSR | Server-side rendered with data |
| `/producto/[sku]` | Dynamic | Generated per product SKU |
| `/carrito` | Client-only | Uses localStorage, no SSR |

### Navigation Pattern

```typescript
// Using Next.js Link for client-side navigation
import Link from "next/link";

<Link href={`/producto/${product.sku}`}>
  <ProductCard product={product} />
</Link>
```

---

## Authentication Flow

### Current State

Authentication is currently **not implemented**. The application uses:
- Anonymous cart (localStorage-based)
- WhatsApp for order identity (phone number)
- No user accounts required

### Planned Authentication (Future)

```
Login Options:
├── Magic Link (Email)
├── Google OAuth
└── Phone (WhatsApp verification)

User Flow:
1. Browse anonymously
2. Cart persists in localStorage
3. Optional: Sign in to save cart
4. Checkout → WhatsApp (with user context)
```

### Authentication Architecture

```typescript
// Future: Convex Auth integration
// convex/auth.ts
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Google, Email],
});
```

---

## Performance Optimizations

### Implemented

| Optimization | Implementation |
|--------------|----------------|
| Image Optimization | Next.js Image component |
| Code Splitting | App Router automatic splitting |
| Data Fetching | Convex reactive queries |
| Caching | Convex automatic caching |
| Font Loading | `next/font` with Geist |

### Loading States

```typescript
// Pattern for loading UI
if (products === undefined) {
  return (
    <div className="flex justify-center">
      <Spinner />
    </div>
  );
}
```

---

## Error Handling

### Error Boundaries

Currently using default Next.js error handling. Future implementation:

```typescript
// app/error.tsx
"use client";

export default function Error({ error, reset }) {
  return (
    <div className="error-page">
      <h2>Algo salió mal</h2>
      <button onClick={reset}>Intentar de nuevo</button>
    </div>
  );
}
```

### Convex Error Handling

```typescript
// Pattern in components
try {
  await createOrder({ ...args });
} catch (error) {
  toast.error("Error al crear el pedido");
}
```
