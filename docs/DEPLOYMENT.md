# 🚀 Deployment Guide - Dulcitienda

Guía completa para deployar Dulcitienda en producción.

---

## 📋 Requisitos

- [ ] Cuenta en GitHub
- [ ] Cuenta en Vercel
- [ ] Cuenta en Convex
- [ ] Git instalado
- [ ] Node.js 20+

---

## 🏗️ Arquitectura de Deployments

```
┌──────────────────────────────────────────────────────────────┐
│                      GITHUB REPOS                             │
│  ┌──────────────────┐        ┌──────────────────┐           │
│  │   Frontend       │        │   Backend        │           │
│  │   (Next.js)      │        │   (Convex)       │           │
│  └────────┬─────────┘        └────────┬─────────┘           │
└───────────┼──────────────────────────┼───────────────────────┘
            │                          │
            ▼                          ▼
┌──────────────────────┐    ┌──────────────────────┐
│       VERCEL         │    │       CONVEX         │
│  ┌────────────────┐  │    │  ┌────────────────┐  │
│  │  Production    │  │    │  │  Production    │  │
│  │  dulcitienda   │  │    │  │  ceaseless-   │  │
│  │  .vercel.app   │  │    │  │  ibis-857     │  │
│  └────────────────┘  │    │  └────────────────┘  │
└──────────────────────┘    └──────────────────────┘
```

---

## 🚀 Deployment Frontend (Vercel)

### 1. Configurar GitHub

```bash
# El repo ya está en GitHub
# https://github.com/enube-com-co/client-dulcitienda-frontend
```

### 2. Configurar Vercel

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Link proyecto (primera vez)
vercel link

# Deploy a preview
vercel

# Deploy a producción
vercel --prod
```

### 3. Variables de Entorno en Vercel

Ir a: [vercel.com/dashboard](https://vercel.com/dashboard) → Project → Settings → Environment Variables

| Variable | Valor | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | `https://ceaseless-ibis-857.convex.cloud` | Production, Preview |

### 4. Dominio Personalizado (Opcional)

```bash
# Configurar dominio en Vercel Dashboard
# Settings → Domains → Add

# Luego configurar DNS:
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🗄️ Deployment Backend (Convex)

### 1. Instalar Convex CLI

```bash
npm install -g convex
```

### 2. Login

```bash
npx convex login
```

### 3. Deploy

```bash
# Desarrollo (local)
npx convex dev

# Producción
npx convex deploy
```

### 4. Dashboard

Acceder a: [dashboard.convex.dev](https://dashboard.convex.dev)

---

## 🔄 CI/CD (Futuro)

### GitHub Actions Workflow

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.NEXT_PUBLIC_CONVEX_URL }}
      
      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🧪 Pre-deployment Checklist

### Antes de cada deploy a producción:

```bash
# 1. Tests (cuando estén listos)
npm run test

# 2. Build local
npm run build

# 3. Verificar no hay errores de TypeScript
npx tsc --noEmit

# 4. Verificar linting
npm run lint

# 5. Probar funcionalidad crítica
# - Búsqueda de productos
# - Agregar al carrito
# - Checkout de WhatsApp
```

---

## 🚨 Rollback

### Si algo sale mal:

```bash
# Ver commits anteriores
git log --oneline

# Revertir a commit anterior
git revert HEAD

# O resetear a commit específico
git reset --hard <commit-hash>
git push --force

# Vercel automáticamente redeploya
```

---

## 📊 Monitoreo Post-Deploy

### Vercel Analytics

- [vercel.com/analytics](https://vercel.com/analytics)
- Web Vitals
- Traffic
- Errors

### Convex Dashboard

- [dashboard.convex.dev](https://dashboard.convex.dev)
- Function calls
- Database usage
- Errors

### Manual Checks

```bash
# Verificar sitio
curl -I https://dulcitienda-app.vercel.app

# Verificar API
curl https://ceaseless-ibis-857.convex.cloud/api/version
```

---

## 🔐 Secrets Management

### No commitear nunca:

```bash
# .env.local (en .gitignore)
CONVEX_DEPLOY_KEY=xxx
VERCEL_TOKEN=xxx
```

### Almacenar en:

1. **Vercel**: Dashboard → Project → Settings → Environment Variables
2. **GitHub Secrets**: Settings → Secrets and variables → Actions
3. **Local**: `.env.local` (no commitear)

---

## 📞 Contacto para Soporte

| Plataforma | Soporte |
|------------|---------|
| Vercel | [vercel.com/support](https://vercel.com/support) |
| Convex | [docs.convex.dev](https://docs.convex.dev) |
| GitHub | [support.github.com](https://support.github.com) |

---

## ✅ URLs Importantes

| Recurso | URL |
|---------|-----|
| **Producción** | https://dulcitienda-app.vercel.app |
| **Backend** | https://ceaseless-ibis-857.convex.cloud |
| **GitHub Repo** | https://github.com/enube-com-co/client-dulcitienda-frontend |
| **Convex Dashboard** | https://dashboard.convex.dev/dulcitienda |
| **Vercel Dashboard** | https://vercel.com/dashboard |

---

<p align="center">
  <strong>Happy Deploying! 🚀</strong>
</p>
