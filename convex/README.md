# 🗄️ Dulcitienda Backend - Convex

<p align="center">
  <img src="https://img.shields.io/badge/Convex-Backend-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Real--time-Sync-green?style=for-the-badge" />
</p>

<p align="center">
  <strong>Backend serverless para Dulcitienda con Convex</strong>
</p>

---

## 📋 Tabla de Contenidos

- [🔗 URLs del Backend](#-urls-del-backend)
- [🏗️ Arquitectura](#️-arquitectura)
- [📊 Database Schema](#-database-schema)
- [🔌 API Reference](#-api-reference)
- [🚀 Deployment](#-deployment)
- [🔒 Seguridad](#-seguridad)

---

## 🔗 URLs del Backend

| Entorno | URL | Estado |
|---------|-----|--------|
| **Production** | [ceaseless-ibis-857.convex.cloud](https://ceaseless-ibis-857.convex.cloud) | ✅ Online |
| **Dashboard** | [convex.dev/dulcitienda](https://dashboard.convex.dev/dulcitienda) | ✅ Access |

---

## 🏗️ Arquitectura

### Por qué Convex

| Feature | Beneficio para Dulcitienda |
|---------|---------------------------|
| **Real-time Sync** | Inventario actualizado instantáneamente |
| **Serverless** | No servers que administrar, auto-scaling |
| **TypeScript** | Type safety end-to-end |
| **Edge Deployed** | Baja latencia en Colombia |

### Diagrama de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                      CONVEX DATABASE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌──────────────┐  │
│  │  products   │────▶│ categories  │     │    orders    │  │
│  │  (550 docs) │     │  (10 docs)  │     │  (variable)  │  │
│  └─────────────┘     └─────────────┘     └──────────────┘  │
│         │                                           │       │
│         │                                           │       │
│         ▼                                           ▼       │
│  ┌─────────────┐                           ┌──────────────┐ │
│  │   images    │                           │ order_items  │ │
│  │ (URLs ref)  │                           │  (embedded)  │ │
│  └─────────────┘                           └──────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### Products
```typescript
{
  _id: Id<"products">;
  sku: string;              // "GAS001"
  name: string;             // "Coca-Cola Original 350ml"
  categoryId: Id<"categories">;
  basePrice: number;        // COP
  minimumOrderQuantity: number;  // Min para venta mayorista
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images?: string[];        // URLs de imágenes
  description?: string;
  createdAt: number;
  updatedAt: number;
}
```

### Categories
```typescript
{
  _id: Id<"categories">;
  name: string;             // "Gaseosas"
  slug: string;             // "gaseosas"
  description?: string;
  imageUrl?: string;
  order: number;            // Para ordenar en UI
  isActive: boolean;
}
```

### Orders
```typescript
{
  _id: Id<"orders">;
  orderNumber: string;      // "ORD-20240305-001"
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  whatsappMessage: string;  // Mensaje pre-generado
  createdAt: number;
  updatedAt: number;
}

interface OrderItem {
  productId: Id<"products">;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}
```

---

## 🔌 API Reference

### Products

#### Queries

```typescript
// Listar productos con filtros
api.products.getProducts(args: {
  categoryId?: Id<"categories">;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  limit?: number;
  cursor?: string;
})

// Producto por SKU
api.products.getProductBySku(args: {
  sku: string;
})

// Productos destacados
api.products.getFeaturedProducts(args: {
  limit?: number;
})

// Categorías
api.products.getCategories()
```

#### Mutations

```typescript
// Crear producto (futuro admin)
api.products.createProduct(args: {
  sku: string;
  name: string;
  categoryId: Id<"categories">;
  basePrice: number;
  minimumOrderQuantity?: number;
  stock?: number;
  description?: string;
  images?: string[];
})

// Actualizar producto
api.products.updateProduct(args: {
  productId: Id<"products">;
  // campos a actualizar
})
```

### Orders

#### Queries

```typescript
// Orden por ID
api.orders.getOrderById(args: {
  orderId: Id<"orders">;
})

// Órdenes por cliente (futuro auth)
api.orders.getCustomerOrders(args: {
  customerId: Id<"users">;
})
```

#### Mutations

```typescript
// Crear orden (checkout)
api.orders.createOrder(args: {
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress?: string;
})

// Actualizar estado de orden (admin)
api.orders.updateOrderStatus(args: {
  orderId: Id<"orders">;
  status: OrderStatus;
})
```

---

## 🚀 Deployment

### Desarrollo local

```bash
# Iniciar Convex dev server
npx convex dev

# Esto:
# 1. Inicia el dev server local
# 2. Genera tipos de TypeScript
# 3. Sincroniza cambios en tiempo real
```

### Deploy a producción

```bash
# Deploy functions y schema
npx convex deploy

# O con deploy key (CI/CD)
npx convex deploy --cmd 'npx convex deploy'
```

### Variables de Entorno

```bash
# Convex deploy key (para CI/CD)
CONVEX_DEPLOY_KEY=dev:ceaseless-ibis-857|...

# URL del backend (para frontend)
NEXT_PUBLIC_CONVEX_URL=https://ceaseless-ibis-857.convex.cloud
```

---

## 🔒 Seguridad

### Auth Model

```typescript
// Convex no tiene auth nativo, implementamos:
// 1. Row-level security en queries
// 2. Validación con Zod en todas las mutations
// 3. Rate limiting (futuro)
```

### Validación

Todas las mutations usan Zod para validación:

```typescript
import { z } from "zod";

const createProductSchema = z.object({
  sku: z.string().min(3).max(20),
  name: z.string().min(2).max(200),
  basePrice: z.number().positive(),
  // ...
});
```

---

## 📈 Monitoreo

### Convex Dashboard

Acceder a: [dashboard.convex.dev](https://dashboard.convex.dev)

| Métrica | Dónde ver |
|---------|-----------|
| Function calls | Dashboard → Functions |
| Database usage | Dashboard → Data |
| Errors | Dashboard → Logs |
| Performance | Dashboard → Performance |

---

## 🔗 Integraciones

### Frontend
El frontend se conecta via `convex/react`:

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function ProductList() {
  const products = useQuery(api.products.getFeaturedProducts, { limit: 8 });
  // Real-time sync automático!
}
```

### WhatsApp (Checkout)
Las órdenes generan mensajes de WhatsApp:

```typescript
const whatsappMessage = `🛒 *Nuevo Pedido*

${items.map(...)}

*Total: $${total}*`;

// Link: https://wa.me/573132309867?text=${encodedMessage}
```

---

## 📁 Estructura

```
convex/
├── _generated/          # Código auto-generado (no tocar)
│   ├── api.d.ts        # Tipos de API
│   └── dataModel.d.ts  # Tipos de datos
├── schema.ts           # Definición de tablas
├── products.ts         # Queries/mutations de productos
├── orders.ts           # Queries/mutations de órdenes
├── seed.ts             # Datos iniciales
├── seedMassive.ts      # Seed de 550 productos
└── README.md           # Este archivo
```

---

## 📝 Notas

- ⚠️ Nunca editar archivos en `_generated/`
- ⚠️ Siempre correr `npx convex dev` después de cambiar `schema.ts`
- ✅ Usar `npx convex dashboard` para UI de administración
- ✅ Backup: Convex tiene backups automáticos diarios

---

<p align="center">
  <strong>Powered by Convex 🚀</strong>
</p>
