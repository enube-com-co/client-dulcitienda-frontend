# 📋 Changelog - Dulcitienda

Todos los cambios notables de este proyecto serán documentados aquí.

Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Admin Panel (en desarrollo)
- Login con Google OAuth (en desarrollo)
- Sistema de subida de imágenes (en desarrollo)
- Testing suite completo (Jest + Playwright)

### Planned
- Pasarela de pagos (Wompi/MercadoPago)
- Panel de analytics
- App móvil (PWA)

---

## [1.0.0] - 2026-03-05

### 🎉 Primera versión estable

### Added
- **Catálogo completo**: 550 productos con imágenes de Unsplash/Pexels
- **Búsqueda en tiempo real**: Con dropdown de sugerencias
- **Carrito de compras**: Persistencia en localStorage
- **Checkout vía WhatsApp**: Sin comisiones, integración directa
- **Diseño responsive**: Mobile-first con Tailwind CSS
- **Categorías**: 10 categorías de productos
- **Páginas dinámicas**: /producto/[sku] para cada producto
- **SEO básico**: Meta tags, Schema.org JSON-LD
- **Seguridad**: CSP headers, Zod validation, XSS protection
- **Performance**: SSG para productos, lazy loading

### Technical
- Next.js 16.1.6 con App Router
- React 19.2.4
- TypeScript 5.x
- Tailwind CSS 4.x
- shadcn/ui components
- Convex 1.31.7 (backend)
- Zod 4.x (validación)
- Lucide React (iconos)

### Deployment
- Vercel: Frontend hosting + CDN
- Convex: Backend serverless + Database
- URLs:
  - Producción: https://dulcitienda-app.vercel.app
  - Backend: https://ceaseless-ibis-857.convex.cloud

### Data
- 550 productos seedeados
- 10 categorías
- Esquema de base de datos optimizado

### Documentation
- README completo
- Arquitectura técnica
- Guía de deployment
- Auditoría de seguridad

---

## [0.9.0] - 2026-03-04

### Added
- Seed masivo de 550 productos
- Imágenes desde Unsplash/Pexels
- Colores oficiales de Dulcitienda (rosa/magenta + amarillo)

### Fixed
- CSP headers restrictivos que bloqueaban carga
- Importaciones de imágenes de productos

---

## [0.8.0] - 2026-03-03

### Added
- Página de búsqueda (/buscar)
- SearchDropdown component
- Página de carrito (/carrito)
- Integración WhatsApp para checkout

### Security
- CSP headers implementados
- Zod validation schemas
- Cart sanitization

---

## [0.7.0] - 2026-03-02

### Added
- Convex backend setup
- Database schema (products, categories, orders)
- Queries básicas (getProducts, getCategories)
- Mutations (createOrder)

### Technical
- Convex dev environment
- Type generation

---

## [0.6.0] - 2026-03-01

### Added
- Next.js 16 setup
- Tailwind CSS configuration
- shadcn/ui initialization
- Estructura de carpetas App Router

---

## [0.5.0] - 2026-02-28

### Added
- Diseño de mockups en Figma (referencia)
- Definición de requerimientos
- Stack tecnológico seleccionado

---

## [0.1.0] - 2026-02-24

### Added
- Setup inicial del proyecto
- Repositorio GitHub creado
- Configuración de OpenClaw

---

## Notas de Versión

### Versionado Semántico

Formato: `MAJOR.MINOR.PATCH`

- **MAJOR**: Cambios breaking (incompatibles)
- **MINOR**: Nuevas features (compatibles)
- **PATCH**: Bug fixes (compatibles)

### Ejemplos

```
1.0.0 → 1.1.0: Nueva feature (minor)
1.0.0 → 1.0.1: Bug fix (patch)
1.0.0 → 2.0.0: Breaking change (major)
```

---

## Comparar Versiones

```bash
# Ver cambios entre versiones
git log v1.0.0..HEAD --oneline

# Ver cambios específicos de un archivo
git log v0.9.0..v1.0.0 --oneline -- convex/schema.ts
```

---

## Roadmap

Ver [ROADMAP.md](./ROADMAP.md) para futuras versiones.

---

<p align="center">
  <strong>Historial de cambios de Dulcitienda 🍬</strong>
</p>
