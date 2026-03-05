# 🗺️ Roadmap - Dulcitienda

Plan de desarrollo y futuras funcionalidades.

---

## 📊 Visión General

```
2026 Q1          2026 Q2          2026 Q3          2026 Q4
  │                │                │                │
  ▼                ▼                ▼                ▼
┌─────┐        ┌─────┐        ┌─────┐        ┌─────┐
│ 1.0 │───────▶│ 1.5 │───────▶│ 2.0 │───────▶│ 3.0 │
│ MVP │        │Auth │        │Pay  │        │App  │
└─────┘        └─────┘        └─────┘        └─────┘
```

---

## 🎯 Versiones

### ✅ v1.0 - MVP (Completado - Marzo 2026)

**Estado**: ✅ Lanzado

**Features**:
- [x] Catálogo 550 productos
- [x] Búsqueda en tiempo real
- [x] Carrito con localStorage
- [x] Checkout WhatsApp
- [x] Diseño responsive
- [x] SEO básico
- [x] Seguridad (CSP, Zod)

---

### 🚧 v1.5 - Admin & Auth (Abril 2026)

**Estado**: 🚧 En planificación
**Fecha estimada**: Abril 2026

**Features**:

#### Admin Panel
- [ ] Login con JWT (admin/admin123)
- [ ] Dashboard con stats
- [ ] CRUD Productos
  - [ ] Crear producto
  - [ ] Editar producto
  - [ ] Eliminar producto
  - [ ] Subir imágenes
- [ ] CRUD Categorías
- [ ] Gestión de órdenes
  - [ ] Listar órdenes
  - [ ] Actualizar estado
  - [ ] Ver detalle

#### User Auth
- [ ] Login con Google OAuth
- [ ] Perfil de usuario
- [ ] Historial de pedidos
- [ ] Direcciones guardadas

#### Testing
- [ ] Unit tests (Jest)
- [ ] E2E tests (Playwright)
- [ ] CI/CD GitHub Actions

---

### 📝 v2.0 - E-commerce Completo (Junio 2026)

**Estado**: 📋 Planificado
**Fecha estimada**: Junio 2026

**Features**:

#### Pasarela de Pagos
- [ ] Integración Wompi
- [ ] Integración MercadoPago
- [ ] Pagos con tarjeta de crédito
- [ ] PSE (Pagos electrónicos)
- [ ] Efecty / Baloto
- [ ] Confirmación automática de pagos

#### Inventario Avanzado
- [ ] Control de stock en tiempo real
- [ ] Alertas de stock bajo
- [ ] Variantes de productos (tamaños, sabores)
- [ ] Códigos de barras

#### Envíos
- [ ] Calculadora de envíos
- [ ] Integración con transportadoras
  - [ ] Servientrega
  - [ ] Interrapidísimo
  - [ ] Coordinadora
- [ ] Tracking de órdenes

#### Marketing
- [ ] Cupones de descuento
- [ ] Programa de puntos
- [ ] Email marketing (Mailchimp/SendGrid)
- [ ] Notificaciones push

---

### 🚀 v2.5 - Analytics & Optimización (Agosto 2026)

**Estado**: 📋 Planificado
**Fecha estimada**: Agosto 2026

**Features**:

#### Analytics
- [ ] Google Analytics 4
- [ ] Dashboard de métricas
  - [ ] Ventas por período
  - [ ] Productos más vendidos
  - [ ] Clientes frecuentes
  - [ ] Tasa de conversión
- [ ] Reportes exportables (PDF/Excel)

#### Optimizaciones
- [ ] Image CDN (Cloudinary/Cloudflare)
- [ ] Edge Functions
- [ ] Caching avanzado
- [ ] Bundle optimization

#### SEO Avanzado
- [ ] Sitemap dinámico
- [ ] Rich snippets
- [ ] Open Graph optimizado
- [ ] Blog integrado

---

### 📱 v3.0 - Multiplataforma (Octubre 2026)

**Estado**: 📋 Planificado
**Fecha estimada**: Octubre 2026

**Features**:

#### PWA (Progressive Web App)
- [ ] Offline support
- [ ] Instalación en home screen
- [ ] Push notifications
- [ ] Background sync

#### App Móvil (React Native)
- [ ] iOS app
- [ ] Android app
- [ ] Scan de códigos de barras
- [ ] Notificaciones nativas

#### Multi-tenant
- [ ] Soporte múltiples tiendas
- [ ] White-label solution
- [ ] API pública

---

## 🏗️ Mejoras Técnicas

### Performance

| Mejora | Prioridad | Estimación |
|--------|-----------|------------|
| Image CDN | Alta | 1 semana |
| Edge Functions | Media | 2 semanas |
| Service Worker | Media | 1 semana |
| Code splitting | Baja | 3 días |

### Seguridad

| Mejora | Prioridad | Estimación |
|--------|-----------|------------|
| Rate limiting | Alta | 3 días |
| 2FA para admin | Media | 1 semana |
| Audit logging | Media | 1 semana |
| Penetration testing | Baja | Contratar |

### Developer Experience

| Mejora | Prioridad | Estimación |
|--------|-----------|------------|
| Storybook | Media | 1 semana |
| MSW (mocking) | Baja | 3 días |
| Better error tracking | Alta | 3 días |
| Automated testing | Alta | 2 semanas |

---

## 📅 Timeline Visual

```
Mes:      Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
          ─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────
v1.0 MVP   ████│     │     │     │     │     │     │     │
v1.5 Auth       █████│     │     │     │     │     │     │
v2.0 Pay              █████│     │     │     │     │     │
v2.5 Analytics             █████│     │     │     │     │
v3.0 PWA                          █████│     │     │     │

Leyenda: ████ En desarrollo    ░░░░ Planificado
```

---

## 🎯 Prioridades

### Must Have (Q2 2026)
- Admin panel básico
- Login con Google
- Subida de imágenes

### Should Have (Q3 2026)
- Pasarela de pagos
- Control de inventario
- Tracking de envíos

### Nice to Have (Q4 2026)
- App móvil
- Multi-tenant
- API pública

---

## 💰 Costos Estimados

| Servicio | Mes | Año |
|----------|-----|-----|
| Vercel Pro | $20 | $240 |
| Convex Pro | $25 | $300 |
| Cloudinary | $25 | $300 |
| SendGrid | $15 | $180 |
| Analytics | $0 | $0 (Google) |
| **Total** | **$85/mes** | **$1,020/año** |

---

## 📝 Notas

- Las fechas son estimaciones y pueden cambiar
- Prioridades basadas en feedback de usuarios
- Recursos disponibles: 1-2 developers

---

## 🤝 Contribuir al Roadmap

¿Tienes ideas o sugerencias?

1. Abre un issue en GitHub
2. Discute en el equipo
3. Priorizamos juntos

Ver [CONTRIBUTING.md](./CONTRIBUTING.md)

---

<p align="center">
  <strong>El futuro de Dulcitienda 🚀</strong>
</p>
