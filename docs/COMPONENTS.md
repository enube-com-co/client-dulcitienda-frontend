# Components Catalog

Complete documentation of all components in the Dulcitienda application.

---

## Table of Contents

1. [UI Components (shadcn/ui)](#ui-components)
2. [Custom Components](#custom-components)
3. [Layout Components](#layout-components)
4. [Page Components](#page-components)

---

## UI Components

Built with [shadcn/ui](https://ui.shadcn.com) and Tailwind CSS.

### Button

**File**: `components/ui/button.tsx`

Reusable button component with multiple variants and sizes.

#### Props Interface

```typescript
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

#### Usage Examples

```tsx
// Primary button
<Button>Click me</Button>

// Destructive (delete actions)
<Button variant="destructive">Eliminar</Button>

// Outline style
<Button variant="outline">Cancelar</Button>

// With icon
<Button>
  <ShoppingCart size={16} />
  Añadir al carrito
</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

#### Styling

Uses `class-variance-authority` for variant management:
- **Default**: `bg-primary text-primary-foreground`
- **Destructive**: `bg-destructive text-white`
- **Outline**: `border bg-background shadow-xs`

---

### Card

**File**: `components/ui/card.tsx`

Container component for grouping related content.

#### Sub-components

| Component | Purpose |
|-----------|---------|
| `Card` | Main container |
| `CardHeader` | Header section with title/action |
| `CardTitle` | Heading text |
| `CardDescription` | Subtitle text |
| `CardAction` | Action button in header |
| `CardContent` | Main content area |
| `CardFooter` | Bottom section |

#### Usage Example

```tsx
<Card>
  <CardHeader>
    <CardTitle>Producto Destacado</CardTitle>
    <CardDescription>Los más vendidos</CardDescription>
  </CardHeader>
  <CardContent>
    {products.map(p => <ProductItem key={p.id} {...p} />)}
  </CardContent>
  <CardFooter>
    <Button>Ver todos</Button>
  </CardFooter>
</Card>
```

---

### Input

**File**: `components/ui/input.tsx`

Styled text input component.

#### Props Interface

```typescript
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}
```

#### Usage Example

```tsx
<Input 
  type="text" 
  placeholder="Buscar productos..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```

---

### Badge

**File**: `components/ui/badge.tsx`

Small label for statuses, categories, or counts.

#### Variants

- `default` - Primary style
- `secondary` - Muted style
- `destructive` - Error/warning style
- `outline` - Border-only style

#### Usage Example

```tsx
<Badge>Nuevo</Badge>
<Badge variant="destructive">Agotado</Badge>
<Badge variant="secondary">En stock: 45</Badge>
```

---

## Custom Components

### SearchDropdown

**File**: `components/SearchDropdown.tsx`

Real-time product search with autocomplete dropdown.

#### Props Interface

```typescript
interface SearchDropdownProps {
  onClose?: () => void;  // Callback when search is closed/selected
}
```

#### Features

- Real-time search with Convex
- Product thumbnails in results
- Keyboard navigation support
- Click-outside to close
- Shows price and SKU

#### Data Flow

```
User types → Debounce → Convex query → Display results
```

#### Usage Example

```tsx
import SearchDropdown from "@/components/SearchDropdown";

function Header() {
  return (
    <div className="flex-1 max-w-xl">
      <SearchDropdown onClose={() => setMobileMenuOpen(false)} />
    </div>
  );
}
```

#### Component Relationships

- **Parent**: Header component
- **Dependencies**: `api.products.searchProducts`, `product-images.ts`
- **Children**: None (self-contained)

---

### Header

**File**: `components/Header.jsx` (legacy) | Inline in pages (current)

Main navigation header with logo, search, and cart.

#### Features

- Responsive design (mobile hamburger menu)
- Sticky positioning
- Logo with brand gradient
- Search dropdown integration
- Cart counter badge
- Category navigation

#### Structure

```
Header
├── TopBar (promotional banner)
└── Main Header
    ├── Logo + Brand
    ├── SearchDropdown (desktop)
    └── Actions (Cart icon)
```

---

### Footer

**File**: `components/Footer.jsx` (legacy) | Inline in pages (current)

Site footer with links and contact info.

#### Sections

- Brand info and slogan
- Category links
- Contact information
- Social media links
- Copyright

---

## Layout Components

### ConvexClientProvider

**File**: `app/ConvexClientProvider.tsx`

Wraps the application with Convex React context.

#### Usage

```tsx
// In app/layout.tsx
<ConvexClientProvider>{children}</ConvexClientProvider>
```

#### Implementation

```typescript
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export function ConvexClientProvider({ children }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

---

### RootLayout

**File**: `app/layout.tsx`

Root layout providing fonts, metadata, and global structure.

#### Features

- Geist font loading via `next/font`
- Comprehensive SEO metadata
- Schema.org JSON-LD structured data
- Language setting (es)

#### SEO Configuration

```typescript
export const metadata: Metadata = {
  title: "Dulcitienda | Distribuidora Mayorista...",
  description: "...",
  keywords: ["distribuidora mayorista Neiva", "venta de dulces..."],
  openGraph: { ... },
  twitter: { ... },
};
```

---

## Page Components

### Home Page

**File**: `app/page.tsx`

Landing page with hero, categories, and featured products.

#### Sections

| Section | Component | Data Source |
|---------|-----------|-------------|
| Top Bar | Inline | Static |
| Header | Inline | - |
| Hero | Inline | Static |
| Features | Inline | Static |
| Categories | Inline | `getCategories` query |
| Featured Products | Product Grid | `getFeaturedProducts` query |
| About | Inline | Static |
| CTA | Inline | Static |
| Footer | Inline | - |

#### State

```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [mounted, setMounted] = useState(false);
```

#### Queries

```typescript
const products = useQuery(api.products.getFeaturedProducts, { limit: 8 });
const categories = useQuery(api.products.getCategories);
```

---

### Catalog Page

**File**: `app/catalogo/page.tsx`

Product browsing with filters and grid/list views.

#### Features

- Category filtering sidebar
- Grid/List view toggle
- Product cards with add-to-cart
- Quantity selectors
- Pagination (via Convex)

#### State

```typescript
const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);
const [quantities, setQuantities] = useState<Record<string, number>>({});
```

#### Custom Hook: useCart

```typescript
function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const addToCart = (item: CartItem) => { ... };
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return { cart, addToCart, cartCount, mounted };
}
```

#### Product Card Structure

```
ProductCard
├── Image (with gradient background)
├── Badge (Featured)
├── Title
├── SKU
├── Price
├── Quantity Selector (+/-)
└── Add to Cart Button
```

---

### Product Detail Page

**File**: `app/producto/[sku]/page.tsx`

Individual product page with details and related products.

#### Route Parameters

```typescript
const params = useParams();
const sku = params.sku as string;  // Dynamic route param
```

#### Features

- Product image gallery
- Price display with unit breakdown
- Stock availability indicator
- Quantity selector
- Add to cart with visual feedback
- Related products carousel

#### Loading States

```typescript
// Loading
if (product === undefined) return <LoadingSpinner />;

// Not found
if (product === null) return <NotFound />;
```

---

### Cart Page

**File**: `app/carrito/page.tsx`

Shopping cart with item management and checkout.

#### Features

- Item list with thumbnails
- Quantity adjustment
- Item removal
- Cart total calculation
- Free shipping threshold indicator
- WhatsApp checkout integration

#### Cart Item Structure

```typescript
interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  packSize: number;
}
```

#### Checkout Flow

```typescript
const whatsappMessage = encodeURIComponent(
  `¡Hola! Quiero hacer un pedido...`
);

<a 
  href={`https://wa.me/573132309867?text=${whatsappMessage}`}
  target="_blank"
>
  <Button>Enviar pedido por WhatsApp</Button>
</a>
```

---

## Component Relationships

### Dependency Graph

```
ConvexClientProvider
└── RootLayout
    └── Page Components
        ├── SearchDropdown
        │   └── Convex Query (searchProducts)
        ├── UI Components
        │   ├── Button
        │   ├── Card
        │   ├── Input
        │   └── Badge
        └── Custom Components
            ├── Product Grid
            ├── Category Grid
            └── Cart Components
```

### Data Flow Between Components

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Catalog Page   │────▶│    useCart()    │────▶│   localStorage  │
│  (Add to cart)  │     │  (Cart state)   │     │  (Persistence)  │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Cart Page     │
                        │  (Display cart) │
                        └─────────────────┘
```

---

## Style Patterns

### Common Tailwind Patterns

```typescript
// Card pattern
"bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"

// Button primary pattern  
"bg-pink-500 text-white hover:bg-gradient-to-r from-pink-600 via-pink-500 to-yellow-400"

// Gradient text pattern
"bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"

// Input focus pattern
"border-2 border-gray-200 rounded-full focus:border-pink-500 focus:outline-none"
```

### Responsive Patterns

```typescript
// Mobile-first grid
"grid-cols-2 md:grid-cols-3 lg:grid-cols-4"

// Responsive padding
"px-4 sm:px-6 lg:px-8"

// Responsive text
"text-2xl md:text-3xl lg:text-4xl"

// Hide on mobile
"hidden md:block"
```

---

## Adding New Components

### For UI Components (shadcn)

```bash
npx shadcn add <component-name>
```

### For Custom Components

1. Create file in `components/` directory
2. Export component as default
3. Add Props interface
4. Document in this file
5. Use in pages

### Example Template

```typescript
// components/MyComponent.tsx
"use client";

import { useState } from "react";

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="...">
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```
