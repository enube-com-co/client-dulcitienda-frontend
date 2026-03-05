# 🗄️ Dulcitienda Backend

<p align="center">
  <img src="https://img.shields.io/badge/Convex-Serverless-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Real--time-Sync-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/No--SQL-Database-yellow?style=for-the-badge" />
</p>

<p align="center">
  <strong>Backend serverless para Dulcitienda con Convex</strong>
</p>

---

## 📋 Tabla de Contenidos

- [🌐 URLs](#-urls)
- [🏗️ Arquitectura](#️-arquitectura)
- [📊 Database Schema](#-database-schema)
- [🔌 API Reference](#-api-reference)
- [⚡ Real-time Sync](#-real-time-sync)
- [🔒 Seguridad](#-seguridad)
- [🚀 Deployment](#-deployment)
- [📈 Monitoreo](#-monitoreo)
- [🔗 Frontend Integration](#-frontend-integration)

---

## 🌐 URLs

| Entorno | URL | Descripción |
|---------|-----|-------------|
| **Production** | [ceaseless-ibis-857.convex.cloud](https://ceaseless-ibis-857.convex.cloud) | Backend API |
| **Dashboard** | [dashboard.convex.dev](https://dashboard.convex.dev/dulcitienda) | Admin UI |
| **Frontend** | [dulcitienda-app.vercel.app](https://dulcitienda-app.vercel.app) | Web client |

---

## 🏗️ Arquitectura

### Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Next.js)                      │
│                   React + Convex React                   │
└─────────────────────────┬───────────────────────────────┘
                          │ WebSocket / HTTP
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    CONVEX PLATFORM                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Queries   │  │  Mutations  │  │  Real-time Subs │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐│
│  │              DATABASE (NoSQL Document)               ││
│  │  • products (550 docs)                              ││
│  │  • categories (10 docs)                             ││
│  │  • orders (variable)                                ││
│  │  • users (future)                                   ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### ¿Por qué Convex?

| Feature | Beneficio |
|---------|-----------|
| **Serverless** | No servers que administrar |
| **Real-time** | Datos sincronizados instantáneamente |
| **TypeScript** | Type safety end-to-end |
| **Edge Deployed** | Baja latencia global |
| **Auto-scaling** | Escala automáticamente |

---

## 📊 Database Schema

### Collections

#### 1. Products (550 documentos)

```typescript
{
  _id: Id<"products">;
  sku: string;                    // "GAS001", "SNK001", etc.
  name: string;                   // "Coca-Cola Original 350ml"
  categoryId: Id<"categories">;
  basePrice: number;              // Precio en COP
  minimumOrderQuantity: number;   // Cantidad mínima para venta
  stock: number;                  // Unidades disponibles
  isActive: boolean;              // Visible en catálogo?
  isFeatured: boolean;            // Destacado en home?
  images?: string[];              // URLs de imágenes
  description?: string;           // Descripción del producto
  createdAt: number;              // Timestamp
  updatedAt: number;              // Timestamp
}
```

**Índices:**
- `by_sku`: Único, para búsqueda por SKU
- `by_category`: Para filtrar por categoría
- `by_featured`: Para productos destacados

#### 2. Categories (10 documentos)

```typescript
{
  _id: Id<"categories">;
  name: string;                   // "Gaseosas"
  slug: string;                   // "gaseosas" (URL-friendly)
  description?: string;           // Descripción
  imageUrl?: string;              // Imagen de categoría
  order: number;                  // Orden de visualización
  isActive: boolean;              // ¿Activa?
}
```

#### 3. Orders (Variable)

```typescript
{
  _id: Id<"orders">;
  orderNumber: string;            // "ORD-20240305-001"
  customerName: string;           // Nombre del cliente
  customerPhone: string;          // Teléfono
  customerEmail?: string;         // Email opcional
  customerId?: Id<"users">;       // Referencia a usuario (futuro)
  items: OrderItem[];             // Items del pedido
  subtotal: number;               // Subtotal
  shipping: number;               // Costo de envío
  total: number;                  // Total
  status: OrderStatus;            // Estado del pedido
  whatsappMessage: string;        // Mensaje pre-generado
  notes?: string;                 // Notas adicionales
  createdAt: number;
  updatedAt: number;
}

type OrderStatus = 
  | "pending"      // Pendiente
  | "processing"   // Procesando
  | "shipped"      // Enviado
  | "delivered"    // Entregado
  | "cancelled";   // Cancelado

interface OrderItem {
  productId: Id<"products">;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}
```

#### 4. Users (Futuro - Auth)

```typescript
{
  _id: Id<"users">;
  email: string;
  name: string;
  phone?: string;
  googleId?: string;              // Para OAuth
  role: "customer" | "admin";
  shippingAddresses: Address[];
  createdAt: number;
  lastLoginAt: number;
}

interface Address {
  id: string;
  name: string;                   // "Casa", "Oficina"
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}
```

---

## 🔌 API Reference

### Products

#### Queries (Lectura)

```typescript
// Listar productos con filtros opcionales
api.products.getProducts(args: {
  categoryId?: Id<"categories">;  // Filtrar por categoría
  searchQuery?: string;           // Búsqueda por nombre
  minPrice?: number;              // Precio mínimo
  maxPrice?: number;              // Precio máximo
  isFeatured?: boolean;           // Solo destacados
  limit?: number;                 // Límite de resultados
  cursor?: string;                // Para paginación
})

// Obtener producto por SKU
api.products.getProductBySku(args: {
  sku: string;                    // Ej: "GAS001"
})

// Obtener productos destacados
api.products.getFeaturedProducts(args: {
  limit?: number;                 // Default: 8
})

// Obtener todas las categorías
api.products.getCategories()
```

#### Mutations (Escritura)

```typescript
// Crear producto (requiere auth)
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
  // Campos a actualizar (todos opcionales)
  name?: string;
  basePrice?: number;
  stock?: number;
  isActive?: boolean;
  // ... etc
})

// Eliminar producto
api.products.deleteProduct(args: {
  productId: Id<"products">;
})
```

### Orders

#### Queries

```typescript
// Obtener orden por ID
api.orders.getOrderById(args: {
  orderId: Id<"orders">;
})

// Obtener órdenes de un cliente (futuro auth)
api.orders.getCustomerOrders(args: {
  customerId: Id<"users">;
})
```

#### Mutations

```typescript
// Crear orden (checkout)
api.orders.createOrder(args: {
  items: {
    productId: Id<"products">;
    quantity: number;
  }[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress?: string;
})

// Actualizar estado de orden
api.orders.updateOrderStatus(args: {
  orderId: Id<"orders">;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
})

// Actualizar estado de pago
api.orders.updatePaymentStatus(args: {
  orderId: Id<"orders">;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
})
```

---

## ⚡ Real-time Sync

### ¿Cómo funciona?

Convex mantiene una conexión WebSocket con el cliente. Cuando los datos cambian en el servidor, se actualizan automáticamente en el cliente.

### Ejemplo en React

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function ProductList() {
  // Esta query se actualiza automáticamente cuando cambian los datos
  const products = useQuery(api.products.getFeaturedProducts, { limit: 8 });
  
  if (products === undefined) {
    return <Loading />;
  }
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### Beneficios

| Escenario | Tradicional | Convex |
|-----------|-------------|--------|
| Admin actualiza stock | Refresh manual | Auto-actualiza en todos los clientes |
| Nuevo pedido | Polling cada 30s | Notificación instantánea |
| Producto agotado | Puede venderse doble | Stock en tiempo real |

---

## 🔒 Seguridad

### Modelo de Seguridad

Convex no tiene auth nativo. Implementamos seguridad en múltiples capas:

```
┌─────────────────────────────────────────┐
│  1. Validación de Input (Zod)           │
│     - Todos los inputs validados        │
│     - Tipos estrictos                   │
├─────────────────────────────────────────┤
│  2. Row-level Security (futuro)         │
│     - Users solo ven sus órdenes        │
│     - Admin ve todo                     │
├─────────────────────────────────────────┤
│  3. Rate Limiting (futuro)              │
│     - Prevenir abuso de API             │
└─────────────────────────────────────────┘
```

### Validación con Zod

```typescript
import { z } from "zod";

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
  })).min(1),
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().regex(/^\+?[\d\s-]{10,}$/),
  customerEmail: z.string().email().optional(),
});

export const createOrder = mutation({
  args: { ...createOrderSchema.shape },
  handler: async (ctx, args) => {
    const data = createOrderSchema.parse(args);
    // ... lógica
  },
});
```

---

## 🚀 Deployment

### Desarrollo Local

```bash
# Instalar Convex CLI
npm install -g convex

# Login
npx convex login

# Iniciar dev server (conecta a cloud)
npx convex dev

# Esto:
# 1. Inicia el dev server
# 2. Genera tipos TypeScript automáticamente
# 3. Sincroniza cambios en tiempo real
```

### Production Deploy

```bash
# Deploy a producción
npx convex deploy

# O con deploy key (para CI/CD)
npx convex deploy --cmd 'npx convex deploy'
```

### Variables de Entorno

```bash
# Para desarrollo (local)
CONVEX_DEPLOY_KEY=dev:ceaseless-ibis-857|...

# Para frontend (Vercel)
NEXT_PUBLIC_CONVEX_URL=https://ceaseless-ibis-857.convex.cloud
```

---

## 📈 Monitoreo

### Convex Dashboard

Acceder: [dashboard.convex.dev](https://dashboard.convex.dev)

#### Métricas disponibles

| Métrica | Descripción |
|---------|-------------|
| **Function Calls** | Cantidad de llamadas a queries/mutations |
| **Execution Time** | Tiempo de ejecución de funciones |
| **Error Rate** | Porcentaje de errores |
| **Database Usage** | Storage y operaciones de DB |
| **Active Connections** | Conexiones WebSocket activas |

#### Logs

```
Dashboard → Logs → Functions
```

### Alertas (configurar)

| Alerta | Umbral |
|--------|--------|
| Error rate > 5% | Notificar |
| Function duration > 2s | Investigar |
| DB operations spike | Revisar queries |

---

## 🔗 Frontend Integration

### Setup

```bash
npm install convex
```

### Configuración

```typescript
// convex/_generated/api.ts (auto-generado)
// No editar manualmente

// Provider en layout.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({ children }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
```

### Uso

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Query (lectura, auto-actualizable)
const products = useQuery(api.products.getProducts, { limit: 20 });

// Mutation (escritura)
const createOrder = useMutation(api.orders.createOrder);

// Llamar mutation
await createOrder({
  items: [{ productId: "xxx", quantity: 2 }],
  customerName: "Juan Pérez",
  customerPhone: "+573132309867",
});
```

---

## 📁 Estructura de Archivos

```
convex/
├── _generated/              # ⚠️ Auto-generado (no tocar)
│   ├── api.d.ts            # Tipos de API
│   └── dataModel.d.ts      # Tipos de datos
│
├── schema.ts               # Definición de tablas
├── products.ts             # Queries/mutations de productos
├── orders.ts               # Queries/mutations de órdenes
├── users.ts                # Queries/mutations de usuarios (futuro)
├── seed.ts                 # Datos iniciales (categorías)
├── seedMassive.ts          # Seed de 550 productos
└── README.md               # Esta documentación
```

---

## 🆘 Troubleshooting

### Problema: Tipos no se generan

```bash
# Solución: Reiniciar convex dev
npx convex dev --reset
```

### Problema: Cambios no se reflejan

```bash
# Verificar que convex dev esté corriendo
npx convex dev

# Verificar URL en .env.local
NEXT_PUBLIC_CONVEX_URL=https://ceaseless-ibis-857.convex.cloud
```

### Problema: Error "Function not found"

```bash
# Regenerar tipos
npx convex dev

# Verificar que la función esté exportada en el archivo
```

---

## 📚 Recursos

- [Convex Docs](https://docs.convex.dev)
- [Convex Best Practices](https://docs.convex.dev/understanding/best-practices)
- [Convex Dashboard](https://dashboard.convex.dev)
- [Frontend README](../dulcitienda-app/README.md)

---

## 👥 Equipo

| Rol | Contacto |
|-----|----------|
| Backend Lead | Andres Monje |
| Platform | Convex (externo) |

---

<p align="center">
  <strong>Powered by Convex 🚀</strong>
</p>
