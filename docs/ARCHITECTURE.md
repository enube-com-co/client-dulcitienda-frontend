# 🏗️ Arquitectura Dulcitienda

Documentación técnica completa de la arquitectura.

---

## 📊 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTE                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     Navegador Web                                │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐   │   │
│  │  │  Next.js   │  │   React    │  │    Tailwind + shadcn   │   │   │
│  │  │  (Pages)   │  │   (UI)     │  │      (Styling)         │   │   │
│  │  └────────────┘  └────────────┘  └────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         VERCEL EDGE NETWORK                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  • Static Site Generation (SSG)                                  │   │
│  │  • Incremental Static Regeneration (ISR)                         │   │
│  │  • Edge Functions (Middleware)                                   │   │
│  │  • Global CDN (Cache)                                            │   │
│  │  • Auto-scaling                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ WebSocket / HTTP
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      CONVEX (Backend Serverless)                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐   │   │
│  │  │  Queries   │  │  Mutations │  │    Real-time Subs      │   │   │
│  │  └────────────┘  └────────────┘  └────────────────────────┘   │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │                   Database (NoSQL)                        │   │   │
│  │  │  • products (550 docs)                                    │   │   │
│  │  │  • categories (10 docs)                                   │   │   │
│  │  │  • orders (variable)                                      │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ (Futuro)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      SERVICIOS EXTERNOS                                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────┐   │
│  │  WhatsApp  │  │ Cloudinary │  │   Google   │  │   Analytics    │   │
│  │    API     │  │  (Images)  │  │    OAuth   │  │   (Vercel)     │   │
│  └────────────┘  └────────────┘  └────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1. Página de Producto (SSG)

```
Usuario → Vercel CDN → Next.js (Static) → Convex (initial data)
                                              ↓
                    Real-time updates ← WebSocket ←
```

### 2. Checkout (WhatsApp)

```
Carrito → Validación → Generar mensaje → API WhatsApp → Redirección
   ↓           ↓             ↓                ↓
  Zod      TypeScript    Template          wa.me/link
```

### 3. Actualización de Inventario

```
Admin (futuro) → Convex Mutation → DB Update → Real-time Push → Cliente
```

---

## 🗄️ Estructura de Datos

### Relaciones entre Entidades

```
┌─────────────────┐
│    categories   │
│  ─────────────  │
│  _id: ID        │◄──────┐
│  name: string   │       │
│  slug: string   │       │
│  order: number  │       │
└─────────────────┘       │
                          │
         1:N              │
                          │
┌─────────────────┐       │
│    products     │       │
│  ─────────────  │       │
│  _id: ID        │       │
│  sku: string    │       │
│  name: string   │       │
│  categoryId: ID │───────┘
│  basePrice: num │
│  stock: number  │
│  images: []     │
└─────────────────┘
         │
         │ N:M (embedded)
         ▼
┌─────────────────┐
│     orders      │
│  ─────────────  │
│  _id: ID        │
│  items: [       │
│    {            │
│      productId  │
│      name       │
│      price      │
│      quantity   │
│    }            │
│  ]              │
│  total: number  │
│  status: enum   │
└─────────────────┘
```

---

## 🛠️ Stack Tecnológico Detallado

### Capa de Presentación

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16.1.6 | Framework React, App Router |
| React | 19.2.4 | Biblioteca UI |
| React DOM | 19.2.4 | Renderizador |
| TypeScript | 5.x | Tipado estático |

### Capa de Estilos

| Tecnología | Uso |
|------------|-----|
| Tailwind CSS | Utility-first styling |
| PostCSS | Procesamiento CSS |
| shadcn/ui | Componentes base accesibles |
| Lucide React | Iconografía |
| class-variance-authority | Variantes de componentes |
| clsx + tailwind-merge | Merge de clases |

### Capa de Datos

| Tecnología | Uso |
|------------|-----|
| Convex | Backend serverless + DB |
| convex/react | Hooks para React |
| Zod | Validación de schemas |

### Capa de Build/Dev

| Tecnología | Uso |
|------------|-----|
| Turbopack | Bundler rápido (Next.js 16) |
| ESLint | Linting |
| @convex-dev/eslint-plugin | Reglas específicas Convex |

---

## 🌐 Routing (Next.js App Router)

```
app/
├── page.tsx                 # / (Home)
├── layout.tsx               # Root layout
├── globals.css              # Estilos globales
│
├── catalogo/
│   └── page.tsx             # /catalogo (Catálogo)
│
├── producto/
│   └── [sku]/
│       └── page.tsx         # /producto/GAS001 (Producto dinámico)
│
├── carrito/
│   └── page.tsx             # /carrito (Carrito)
│
├── buscar/
│   └── page.tsx             # /buscar (Búsqueda)
│
└── pedidos/
    └── page.tsx             # /pedidos (Historial)
```

### Estrategia de Renderizado

| Ruta | Estrategia | Razón |
|------|------------|-------|
| `/` | SSG | Home estática, datos de Convex en cliente |
| `/catalogo` | SSG + Client Fetch | Listado con filtros dinámicos |
| `/producto/[sku]` | SSG (550 páginas) | Pre-renderizado de todos los productos |
| `/carrito` | CSR | Datos de localStorage |
| `/buscar` | CSR | Búsqueda en tiempo real |

---

## 🔒 Seguridad en Arquitectura

### Capas de Seguridad

```
┌─────────────────────────────────────┐
│  1. Edge (Vercel)                   │
│     • DDoS protection               │
│     • HTTPS only                    │
│     • WAF (Web Application Firewall)│
├─────────────────────────────────────┤
│  2. Application (Next.js)           │
│     • CSP Headers                   │
│     • XSS Protection                │
│     • Input sanitization            │
├─────────────────────────────────────┤
│  3. API (Convex)                    │
│     • Type-safe queries             │
│     • Schema validation (Zod)       │
│     • No SQL injection              │
├─────────────────────────────────────┤
│  4. Data (Convex DB)                │
│     • Encrypted at rest             │
│     • Access control (futuro)       │
│     • Audit logs                    │
└─────────────────────────────────────┘
```

---

## ⚡ Performance Optimizations

### Implementadas

| Optimización | Implementación | Impacto |
|--------------|----------------|---------|
| SSG | `generateStaticParams` | ⚡ Tiempo de carga |
| Image Optimization | `next/image` equivalent | 📦 Tamaño |
| Code Splitting | Next.js automático | 📦 Bundle |
| Lazy Loading | Dynamic imports | ⚡ Initial load |
| CDN Caching | Vercel Edge | ⚡ Global speed |
| Real-time | Convex WebSocket | 🔄 Live updates |

### Por implementar

| Optimización | Prioridad |
|--------------|-----------|
| Service Worker | Medium |
| Prefetching | Low |
| Edge Functions | Medium |
| Image CDN (Cloudinary) | High |

---

## 📈 Escalabilidad

### Horizontal (Más usuarios)

```
Vercel: Auto-scaling ✓
Convex: Auto-scaling ✓
No action needed
```

### Vertical (Más features)

```
Fase 1: Admin panel (CRUD productos)
Fase 2: Auth de usuarios (Convex Auth)
Fase 3: Pasarela de pagos (Wompi/MercadoPago)
Fase 4: Analytics avanzado
```

---

## 🔗 Integraciones Externas

### Activas

| Servicio | Uso | Status |
|----------|-----|--------|
| WhatsApp API | Checkout | ✅ Activo |
| Unsplash/Pexels | Imágenes de ejemplo | ✅ Activo |

### Planificadas

| Servicio | Uso | Prioridad |
|----------|-----|-----------|
| Cloudinary | Upload de imágenes | High |
| Google OAuth | Login de clientes | Medium |
| Wompi/MercadoPago | Pagos online | High |
| Google Analytics | Tracking | Medium |

---

## 📝 Decisiones de Arquitectura

### Por qué Next.js + App Router

| Alternativa | Por qué no elegimos | Por qué Next.js |
|-------------|--------------------|-----------------|
| Create React App | No SSR, SEO difícil | SSG/SSR nativo |
| Gatsby | Build lento con 550 páginas | ISR, más rápido |
| Remix | Menos maduro | Ecosistema más grande |
| Astro | Menos interactivo | React nativo |

### Por qué Convex

| Alternativa | Por qué no elegimos | Por qué Convex |
|-------------|--------------------|----------------|
| Supabase | PostgreSQL complejo | Serverless simple |
| Firebase | Vendor lock-in Google | Mejor DX |
| PlanetScale | MySQL, más config | Zero config |
| AWS Lambda | Mucha config | Todo en uno |

### Por qué Vercel

| Alternativa | Por qué no elegimos | Por qué Vercel |
|-------------|--------------------|----------------|
| Netlify | Menos optimizado Next.js | Creadores de Next.js |
| AWS Amplify | Complejo | Zero config |
| Cloudflare Pages | Menos features | Mejor integración |

---

## 📚 Recursos

- [Next.js Architecture](https://nextjs.org/docs/architecture)
- [Convex Docs](https://docs.convex.dev)
- [Vercel Edge Network](https://vercel.com/docs/edge-network)

---

<p align="center">
  <strong>Arquitectura diseñada para escalar 🚀</strong>
</p>
