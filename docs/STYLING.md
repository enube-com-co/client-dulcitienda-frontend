# Styling Documentation

Complete guide to the Dulcitienda visual design system.

---

## Table of Contents

1. [Tailwind Configuration](#tailwind-configuration)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Component Styling Patterns](#component-styling-patterns)
5. [Responsive Breakpoints](#responsive-breakpoints)
6. [Spacing System](#spacing-system)

---

## Tailwind Configuration

### Tailwind CSS v4 Setup

**File**: `app/globals.css`

Dulcitienda uses Tailwind CSS v4 with the new CSS-first configuration approach.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Theme tokens mapped to CSS variables */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  
  /* Design system colors */
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  
  /* Card and popover */
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  
  /* Border radius */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### PostCSS Configuration

**File**: `postcss.config.mjs`

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

---

## Color System

### Brand Colors

**File**: `lib/brand.ts`

The Dulcitienda brand uses a vibrant candy-inspired palette:

```typescript
export const brandColors = {
  // Primary - Rosa/Magenta
  primary: {
    DEFAULT: '#EC4899', // Pink-500
    light: '#F472B6',   // Pink-400
    dark: '#DB2777',    // Pink-600
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899',
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },
  // Secondary - Blue
  secondary: {
    DEFAULT: '#1E40AF', // Blue-800
    light: '#3B82F6',   // Blue-500
    dark: '#1E3A8A',    // Blue-900
    candy: '#60A5FA',   // Blue-400
  },
  // Accent - Yellow
  accent: {
    DEFAULT: '#FCD34D', // Yellow-300
    light: '#FDE68A',   // Yellow-200
    dark: '#F59E0B',    // Yellow-500
  },
  // Background
  background: {
    DEFAULT: '#EFF6FF', // Blue-50
    dark: '#1E3A8A',    // Blue-900
  }
};
```

### Tailwind Theme Classes

```typescript
export const theme = {
  // Header/Top bar - pink to yellow gradient
  topBar: 'bg-gradient-to-r from-pink-500 via-pink-400 to-yellow-300',
  header: 'bg-white shadow-lg',
  
  // Buttons
  buttonPrimary: 'bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg',
  buttonSecondary: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full',
  
  // Hero - blue gradient like the logo
  hero: 'bg-gradient-to-br from-blue-800 via-blue-700 to-pink-500',
  
  // Cards
  card: 'bg-white rounded-2xl shadow-lg border border-pink-100',
  
  // Text
  textPrimary: 'text-pink-500',
  textSecondary: 'text-blue-800',
  
  // Category gradient backgrounds
  categoryColors: {
    "gaseosas": "from-red-500 to-pink-500",
    "snacks": "from-yellow-400 to-orange-500",
    "dulces": "from-pink-400 to-pink-600",
    "gomas": "from-purple-500 to-pink-500",
    "chocolates": "from-amber-600 to-yellow-400",
    "ancheteria": "from-green-400 to-yellow-400",
    "confiteria": "from-cyan-400 to-pink-400",
    "licores": "from-blue-700 to-pink-600",
    "galletas": "from-orange-300 to-yellow-400",
    "lacteos": "from-blue-300 to-pink-300",
  },
};
```

### Color Usage Patterns

| Element | Class | Hex |
|---------|-------|-----|
| Primary buttons | `bg-pink-500` | #EC4899 |
| Secondary buttons | `bg-yellow-400` | #FCD34D |
| Hero background | `bg-gradient-to-br from-blue-800 via-blue-700 to-pink-500` | Various |
| Top bar | `bg-gradient-to-r from-pink-500 via-pink-400 to-yellow-300` | Various |
| Text links | `text-pink-600 hover:text-pink-700` | #DB2777 |
| Card borders | `border-pink-100` | #FCE7F3 |
| Feature icons | `text-pink-500` | #EC4899 |

---

## Typography

### Font Family

The application uses **Geist** font (from Vercel):

```typescript
// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Usage in classes
// font-sans (uses --font-geist-sans)
// font-mono (uses --font-geist-mono)
```

### Type Scale

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Hero Title | `text-4xl md:text-6xl` | `font-bold` | Homepage hero |
| Section Title | `text-3xl md:text-4xl` | `font-bold` | Section headers |
| Card Title | `text-xl font-bold` | `font-bold` | Product names |
| Body | `text-base` | `font-normal` | Paragraphs |
| Small | `text-sm` | `font-normal` | Captions, SKU |
| Price | `text-2xl font-bold text-pink-600` | `font-bold` | Product prices |

### Typography Patterns

```css
/* Gradient text (logo style) */
.text-gradient {
  @apply bg-gradient-to-r from-pink-500 via-pink-400 to-yellow-400 
         bg-clip-text text-transparent;
}

/* Section headings */
.section-title {
  @apply text-3xl md:text-4xl font-bold text-gray-800;
}

/* Product names */
.product-title {
  @apply font-bold text-gray-800 line-clamp-2;
}

/* Price display */
.price {
  @apply text-xl font-bold text-pink-600;
}
```

---

## Component Styling Patterns

### Card Pattern

```css
/* Standard card */
.card {
  @apply bg-white rounded-2xl shadow-sm border border-gray-100 
         hover:shadow-xl transition-all duration-300;
}

/* Featured card with gradient border effect */
.card-featured {
  @apply bg-white rounded-2xl shadow-lg border-2 border-pink-200
         hover:shadow-2xl hover:border-pink-300 transition-all;
}
```

### Button Patterns

```css
/* Primary button (pink) */
.btn-primary {
  @apply bg-pink-500 hover:bg-pink-600 text-white 
         rounded-full font-bold shadow-lg
         hover:shadow-xl hover:scale-105 
         transition-all flex items-center justify-center gap-2;
}

/* Secondary button (yellow) */
.btn-secondary {
  @apply bg-yellow-400 hover:bg-yellow-500 text-blue-900
         rounded-full font-bold shadow-lg
         hover:shadow-xl hover:scale-105
         transition-all;
}

/* Outline button */
.btn-outline {
  @apply border-2 border-pink-500 text-pink-500
         hover:bg-pink-500 hover:text-white
         rounded-full font-medium
         transition-all;
}

/* Ghost button */
.btn-ghost {
  @apply text-gray-600 hover:text-pink-600
         hover:bg-pink-50 rounded-lg
         transition-colors;
}
```

### Input Patterns

```css
/* Standard input */
.input {
  @apply w-full px-4 py-3 border-2 border-gray-200 
         rounded-full focus:border-pink-500 
         focus:outline-none transition-colors;
}

/* Search input with icon button */
.search-input {
  @apply w-full pl-4 pr-12 py-3 border-2 border-gray-200 
         rounded-full focus:border-pink-500 
         focus:outline-none transition-colors;
}
```

### Badge Patterns

```css
/* Featured badge */
.badge-featured {
  @apply px-3 py-1 bg-gradient-to-r from-pink-500 to-yellow-400 
         text-white text-xs font-bold rounded-full;
}

/* Stock badge - in stock */
.badge-stock {
  @apply px-3 py-1 bg-green-100 text-green-700 
         rounded-full text-sm font-medium;
}

/* Stock badge - out of stock */
.badge-out-of-stock {
  @apply px-3 py-1 bg-red-100 text-red-700 
         rounded-full text-sm font-medium;
}
```

### Layout Patterns

```css
/* Container */
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Section spacing */
.section {
  @apply py-16;
}

/* Grid layouts */
.grid-products {
  @apply grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6;
}

.grid-categories {
  @apply grid grid-cols-2 md:grid-cols-4 gap-6;
}

/* Flex patterns */
.flex-center {
  @apply flex items-center justify-center;
}

.flex-between {
  @apply flex items-center justify-between;
}
```

---

## Responsive Breakpoints

Tailwind's default breakpoints are used:

| Breakpoint | Prefix | Width | Usage |
|------------|--------|-------|-------|
| sm | `sm:` | 640px | Large phones |
| md | `md:` | 768px | Tablets |
| lg | `lg:` | 1024px | Small laptops |
| xl | `xl:` | 1280px | Desktops |
| 2xl | `2xl:` | 1536px | Large screens |

### Responsive Patterns

```css
/* Grid columns */
.responsive-grid {
  @apply grid-cols-2 md:grid-cols-3 lg:grid-cols-4;
}

/* Font sizes */
.responsive-heading {
  @apply text-2xl md:text-3xl lg:text-4xl;
}

/* Padding */
.responsive-padding {
  @apply px-4 md:px-6 lg:px-8;
}

/* Hide/Show */
.mobile-only {
  @apply md:hidden;
}

.desktop-only {
  @apply hidden md:block;
}
```

### Mobile-First Approach

All styles are mobile-first by default:

```html
<!-- Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns -->
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  ...
</div>

<!-- Mobile: hidden, Desktop: visible -->
<nav class="hidden md:flex">... Desktop nav ...</nav>
<nav class="md:hidden">... Mobile nav ...</nav>
```

---

## Spacing System

### Tailwind Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| 1 | 0.25rem (4px) | Tight spacing |
| 2 | 0.5rem (8px) | Small gaps |
| 3 | 0.75rem (12px) | Button padding |
| 4 | 1rem (16px) | Standard padding |
| 5 | 1.25rem (20px) | Card padding |
| 6 | 1.5rem (24px) | Section gaps |
| 8 | 2rem (32px) | Large gaps |
| 10 | 2.5rem (40px) | Section padding |
| 12 | 3rem (48px) | Hero padding |
| 16 | 4rem (64px) | Major sections |

### Custom Spacing Patterns

```css
/* Section vertical spacing */
.section-sm { @apply py-8; }
.section { @apply py-16; }
.section-lg { @apply py-24; }

/* Component gaps */
.gap-cards { @apply gap-6; }
.gap-grid { @apply gap-4 md:gap-6; }

/* Container padding */
.page-padding { @apply px-4 sm:px-6 lg:px-8; }
```

---

## Animation & Transitions

### Standard Transitions

```css
/* All properties */
.transition-all {
  @apply transition-all duration-300 ease-in-out;
}

/* Colors only */
.transition-colors {
  @apply transition-colors duration-200;
}

/* Transform only */
.transition-transform {
  @apply transition-transform duration-200;
}
```

### Hover Effects

```css
/* Card lift effect */
.card-hover {
  @apply hover:-translate-y-1 hover:shadow-xl transition-all;
}

/* Scale on hover */
.scale-hover {
  @apply hover:scale-105 transition-transform;
}

/* Color shift */
.color-hover {
  @apply hover:text-pink-600 transition-colors;
}
```

### Loading Animations

```css
/* Spinner */
.spinner {
  @apply animate-spin rounded-full h-16 w-16 
         border-4 border-pink-500 border-t-transparent;
}

/* Pulse for skeletons */
.skeleton {
  @apply animate-pulse bg-gray-200 rounded;
}
```

---

## Utility Classes

### Common Combinations

```css
/* Center absolutely */
.center-absolute {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
}

/* Truncate text */
.truncate-text {
  @apply truncate whitespace-nowrap overflow-hidden;
}

/* Line clamp */
.line-clamp-2 {
  @apply line-clamp-2;
}

/* Aspect ratio */
.aspect-product {
  @apply aspect-square;
}

/* Blur backdrop */
.backdrop {
  @apply backdrop-blur-sm bg-white/80;
}
```

### cn() Utility

**File**: `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage**:
```tsx
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className  // allow override
)}>
```
