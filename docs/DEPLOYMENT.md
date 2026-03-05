# Deployment Documentation

Complete guide for deploying Dulcitienda to production.

---

## Table of Contents

1. [Overview](#overview)
2. [Vercel Deployment](#vercel-deployment)
3. [Convex Deployment](#convex-deployment)
4. [Environment Setup](#environment-setup)
5. [Build Process](#build-process)
6. [Troubleshooting](#troubleshooting)

---

## Overview

Dulcitienda is deployed across two platforms:

| Platform | Purpose | URL |
|----------|---------|-----|
| **Vercel** | Frontend hosting | `https://dulcitienda.com.co` |
| **Convex** | Backend & database | `https://unique-id.convex.cloud` |

### Deployment Architecture

```
User Request
     │
     ▼
┌─────────────┐
│   Vercel    │  (Next.js App)
│   Edge      │  - Static files
│   Network   │  - Server components
└──────┬──────┘  - API routes
       │
       │ Convex Client
       ▼
┌─────────────┐
│   Convex    │  (Backend)
│   Cloud     │  - Database
└─────────────┘  - Functions
```

---

## Vercel Deployment

### Initial Setup

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import from GitHub
   - Select `dulcitienda-app` repository

3. **Configure Project**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Environment Variables**
   Add in Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically

### Production Domain

To use custom domain (`dulcitienda.com.co`):

1. **In Vercel Dashboard**:
   - Go to Project → Settings → Domains
   - Add `dulcitienda.com.co`

2. **DNS Configuration** (at domain registrar):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Vercel automatically provisions SSL
   - May take a few minutes

### Branch Deployments

Every push creates a deployment:

| Branch | URL Pattern |
|--------|-------------|
| `main` | `dulcitienda.com.co` |
| `develop` | `dulcitienda-git-develop.vercel.app` |
| PR #123 | `dulcitienda-git-feat-123.vercel.app` |

---

## Convex Deployment

### Initial Deployment

1. **Login to Convex**
   ```bash
   npx convex login
   ```

2. **Initialize Project**
   ```bash
   npx convex init
   # Creates convex.json with project details
   ```

3. **Deploy**
   ```bash
   npx convex deploy
   ```
   
   Or with deploy key (CI/CD):
   ```bash
   npx convex deploy --code-based --cmd 'npm run build'
   ```

### Deployment Options

```bash
# Deploy to production
npx convex deploy

# Deploy with specific key
CONVEX_DEPLOY_KEY=xxx npx convex deploy

# Preview deployment (for PRs)
npx convex deploy --preview
```

### Production Deploy Key

For CI/CD environments:

1. **Generate Key** (in Convex Dashboard)
   - Go to Settings → Deploy Keys
   - Create Production Deploy Key

2. **Add to CI/CD**
   ```bash
   # GitHub Actions example
   CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
   ```

### Database Seeding

```bash
# Seed initial data
npx convex run seed:seedProducts

# Mass seed (development)
npx convex run seedMassive:seedAllProducts
```

---

## Environment Setup

### Required Variables

| Variable | Environment | Description |
|----------|-------------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | All | Convex deployment URL |
| `CONVEX_DEPLOY_KEY` | Production | Deploy key for CI/CD |

### Environment Files

```
.env.local          # Local development (gitignored)
.env.production     # Production (optional)
.env.example        # Template for new developers
```

### Variable Values by Environment

**Development**:
```env
NEXT_PUBLIC_CONVEX_URL=http://localhost:3210
```

**Production**:
```env
NEXT_PUBLIC_CONVEX_URL=https://cheerful-parakeet-123.convex.cloud
CONVEX_DEPLOY_KEY=your_deploy_key_here
```

---

## Build Process

### Local Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output in .next/ directory
```

### Build Steps

1. **TypeScript Compilation**
   ```
   Checking validity of types...
   ```

2. **Convex Code Generation**
   ```
   Generating Convex types...
   ```

3. **Next.js Build**
   ```
   Creating an optimized production build...
   ✓ Compiled successfully
   ✓ Linting and checking validity of types
   ✓ Collecting page data
   ✓ Generating static pages
   ✓ Finalizing page optimization
   ```

4. **Output**
   ```
   .next/
   ├── static/           # Static assets
   ├── server/           # Server components
   ├── chunks/           # JavaScript chunks
   └── build-manifest.json
   ```

### Convex Build

```bash
# During build, Convex:
1. Validates schema.ts
2. Compiles functions
3. Deploys to cloud
4. Updates generated types
```

---

## Continuous Deployment

### GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Deploy Convex
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
        run: npx convex deploy
        
      - name: Build Next.js
        run: npm run build
        
      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### Deployment Checklist

Before deploying:

- [ ] All tests passing
- [ ] Environment variables set
- [ ] Convex schema valid
- [ ] No console errors
- [ ] Images optimized
- [ ] SEO meta tags correct

After deploying:

- [ ] Site loads correctly
- [ ] Convex queries working
- [ ] Cart functionality works
- [ ] WhatsApp link works
- [ ] Mobile responsive
- [ ] Performance acceptable

---

## Troubleshooting

### Common Issues

#### Build Failures

**Error**: `Cannot find module 'convex/react'`
```bash
# Solution: Install dependencies
npm install
```

**Error**: `NEXT_PUBLIC_CONVEX_URL is not set`
```bash
# Solution: Set environment variable
export NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

**Error**: `Type error in convex/schema.ts`
```bash
# Solution: Check schema syntax
npx convex dev  # Run locally to see errors
```

#### Runtime Issues

**Error**: `Failed to fetch` (Convex)
- Check `NEXT_PUBLIC_CONVEX_URL` is correct
- Verify Convex deployment is active
- Check network connectivity

**Error**: Cart not persisting
- Check localStorage is enabled
- Verify no quota exceeded
- Check for JavaScript errors

**Error**: Images not loading
- Check image URLs are valid
- Verify CORS headers
- Check network tab for 404s

### Convex-Specific Issues

**Error**: `Query rate limit exceeded`
```typescript
// Solution: Add pagination
const products = useQuery(api.products.getProducts, { 
  limit: 50  // Reduce from 500
});
```

**Error**: `Schema validation failed`
```bash
# Solution: Reset and redeploy
npx convex dev --reset
npx convex deploy
```

**Error**: `Function timeout`
```typescript
// Solution: Optimize query
// Use indexes, reduce data processed
```

### Performance Issues

**Slow initial load**:
- Enable Next.js image optimization
- Use `next/font` for fonts
- Implement code splitting

**Slow queries**:
- Add Convex indexes
- Reduce query complexity
- Use pagination

**Large bundle size**:
- Analyze with `@next/bundle-analyzer`
- Tree-shake unused imports
- Dynamic import heavy components

### Debug Commands

```bash
# Check Convex status
npx convex status

# View logs
npx convex logs

# Local development with hot reload
npx convex dev

# Test build locally
npm run build && npm start
```

### Getting Help

| Resource | Link |
|----------|------|
| Convex Docs | [docs.convex.dev](https://docs.convex.dev) |
| Next.js Docs | [nextjs.org/docs](https://nextjs.org/docs) |
| Vercel Docs | [vercel.com/docs](https://vercel.com/docs) |
| Tailwind Docs | [tailwindcss.com/docs](https://tailwindcss.com/docs) |

---

## Rollback Procedure

If deployment fails:

1. **Vercel Rollback**:
   - Go to Vercel Dashboard
   - Find previous deployment
   - Click "Promote to Production"

2. **Convex Rollback**:
   ```bash
   # Deploy previous version
   git checkout <previous-commit>
   npx convex deploy
   ```

3. **Database Rollback**:
   - Convex keeps history
   - Contact Convex support for data restore
