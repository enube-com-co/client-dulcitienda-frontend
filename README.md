# 🍬 Dulcitienda - E-commerce B2B

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Convex-Backend-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" />
</p>

<p align="center">
  <strong>Distribuidora mayorista de dulces, chocolates, gomas y licores en Colombia</strong>
</p>

---

## 📋 Tabla de Contenidos

- [🌐 Live Demo](#-live-demo)
- [🏗️ Arquitectura](#️-arquitectura)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Deployment](#-deployment)
- [🔒 Seguridad](#-seguridad)
- [📊 Performance](#-performance)
- [📝 Documentación](#-documentación)
- [👥 Equipo](#-equipo)

---

## 🌐 Live Demo

| Entorno | URL | Estado |
|---------|-----|--------|
| **Producción** | [dulcitienda-app.vercel.app](https://dulcitienda-app.vercel.app) | ✅ Online |
| **Preview** | [dulcitienda-dvt1cnohw-enube-com-co.vercel.app](https://dulcitienda-dvt1cnohw-enube-com-co.vercel.app) | ✅ Online |

### Validación de URLs

```bash
# Verificar estado del sitio
curl -I https://dulcitienda-app.vercel.app

# Verificar CSP headers
curl -I https://dulcitienda-app.vercel.app | grep -i content-security
```

---

## 🏗️ Arquitectura

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Next.js    │  │  React 19    │  │    Tailwind CSS      │  │
│  │   (App Router)│  │  (UI)        │  │    (Styling)         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL (Edge Network)                       │
│  • Static Site Generation (SSG)                                 │
│  • Serverless Functions                                         │
│  • Edge Caching                                                 │
│  • Auto-scaling                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ WebSocket/HTTP
┌─────────────────────────────────────────────────────────────────┐
│                    CONVEX (Backend Serverless)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Real-time  │  │   Database   │  │    File Storage      │  │
│  │   Sync       │  │   (NoSQL)    │  │    (opcional)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Por qué esta arquitectura

| Componente | Elección | Razón |
|------------|----------|-------|
| **Frontend** | Next.js 16 | App Router, SSG, SSR, optimización automática |
| **Backend** | Convex | Real-time sync, serverless, TypeScript nativo |
| **Hosting** | Vercel | CDN global, edge functions, CI/CD integrado |
| **Estilos** | Tailwind + shadcn | Componentes accesibles, consistentes, rápidos |
| **Checkout** | WhatsApp API | Sin comisiones, familiar en Colombia, rápido |

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 16.1.6 | Framework React con App Router |
| React | 19.2.4 | Biblioteca UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Utility-first CSS |
| shadcn/ui | Latest | Componentes accesibles |
| Lucide React | Latest | Iconos |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Convex | 1.31.7 | Backend serverless + DB |
| Zod | 4.x | Validación de schemas |

### DevOps
| Tecnología | Propósito |
|------------|-----------|
| Vercel | Hosting + CI/CD |
| GitHub | Control de versiones |
| GitHub Actions | CI/CD workflows (futuro) |

---

## 📁 Estructura del Proyecto

```
dulcitienda-app/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── catalogo/                 # Página de catálogo
│   ├── producto/[sku]/           # Página de producto dinámica
│   ├── carrito/                  # Carrito de compras
│   ├── buscar/                   # Búsqueda
│   └── pedidos/                  # Historial de pedidos
├── components/                   # Componentes React
│   ├── ui/                       # shadcn/ui components
│   ├── SearchDropdown.tsx        # Búsqueda con dropdown
│   └── ProductCard.tsx           # Tarjeta de producto
├── lib/                          # Utilidades
│   ├── utils.ts                  # Helpers (cn, etc.)
│   ├── validation.ts             # Zod schemas
│   ├── product-images.ts         # Mapeo de imágenes
│   └── product-image.ts          # Hook de imágenes
├── convex/                       # Backend Convex
│   ├── schema.ts                 # Database schema
│   ├── products.ts               # Queries/mutations productos
│   ├── orders.ts                 # Queries/mutations órdenes
│   └── seed.ts                   # Datos iniciales
├── public/                       # Assets estáticos
├── docs/                         # Documentación
│   ├── ARCHITECTURE.md
│   ├── API_INTEGRATION.md
│   ├── DEPLOYMENT.md
│   └── SECURITY_AUDIT.md
└── next.config.ts                # Configuración Next.js
```

---

## 🚀 Deployment

### Environments

| Environment | Branch | URL | Propósito |
|-------------|--------|-----|-----------|
| Production | `main` | [dulcitienda-app.vercel.app](https://dulcitienda-app.vercel.app) | Sitio público |
| Preview | PRs | `*.vercel.app` | Testing de features |

### Cómo deployar

```bash
# 1. Instalar dependencias
npm install

# 2. Desarrollo local
npm run dev          # Frontend + Backend concurrently

# 3. Build de producción
npm run build

# 4. Deploy a Vercel
vercel --prod
```

### Variables de Entorno

```bash
# .env.local (no commitear)
NEXT_PUBLIC_CONVEX_URL=https://ceaseless-ibis-857.convex.cloud

# Convex (backend)
CONVEX_DEPLOY_KEY=dev:ceaseless-ibis-857|...
```

---

## 🔒 Seguridad

### Implementaciones

| Feature | Implementación | Estado |
|---------|---------------|--------|
| CSP Headers | `next.config.ts` | ✅ Activo |
| XSS Protection | Sanitización de input | ✅ Activo |
| Input Validation | Zod schemas | ✅ Activo |
| HTTPS Only | Vercel default | ✅ Forzado |
| Secure Cookies | `Secure`, `HttpOnly` | ✅ Listo para auth |

### Reporte de Seguridad

Ver [`docs/SECURITY_AUDIT.md`](./docs/SECURITY_AUDIT.md) para auditoría completa.

---

## 📊 Performance

### Métricas objetivo

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| First Contentful Paint | < 1.5s | 🎯 |
| Time to Interactive | < 3.5s | 🎯 |
| Lighthouse Performance | > 90 | 🎯 |
| Lighthouse Accessibility | > 90 | 🎯 |

### Optimizaciones implementadas

- ✅ Static Site Generation (SSG) para páginas estáticas
- ✅ Lazy loading de imágenes
- ✅ Optimización de imágenes (WebP)
- ✅ Code splitting automático
- ✅ Edge caching en Vercel

---

## 📝 Documentación

| Documento | Descripción |
|-----------|-------------|
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Arquitectura técnica detallada |
| [`docs/API_INTEGRATION.md`](./docs/API_INTEGRATION.md) | Integraciones externas |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Guía de deployment |
| [`docs/SECURITY_AUDIT.md`](./docs/SECURITY_AUDIT.md) | Auditoría de seguridad |
| [`docs/STYLING.md`](./docs/STYLING.md) | Guía de estilos |
| [`docs/COMPONENTS.md`](./docs/COMPONENTS.md) | Documentación de componentes |

---

## 👥 Equipo

| Rol | Responsable |
|-----|-------------|
| **Product Owner** | Dulcitienda JM |
| **Tech Lead** | Andres Monje |
| **Development** | OpenClaw + Kimi K2.5 |
| **Design** | shadcn/ui + Tailwind |

---

## 📞 Contacto

| Canal | Información |
|-------|-------------|
| **Email** | dulcitiendajm@gmail.com |
| **Teléfono** | 313 2309867 |
| **Ubicación** | Neiva, Huila, Colombia |
| **Facebook** | [Dulcitienda](https://facebook.com) |
| **Instagram** | [@dulcitienda](https://instagram.com) |

---

## 📄 Licencia

Proyecto privado - Dulcitienda JM

---

<p align="center">
  <strong>🍬 Dulcitienda - Endulzando tus momentos especiales 🍬</strong>
</p>
