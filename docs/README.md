# Dulcitienda - E-commerce Frontend

A modern, full-stack e-commerce platform for Dulcitienda, a wholesale distributor of candies, snacks, beverages, and liquor based in Neiva, Colombia.

> **Slogan**: *Surtiendo Felicidad!!!*

---

## 📋 Project Overview

Dulcitienda is a B2B/B2C wholesale e-commerce application that allows customers to browse a catalog of 500+ products, manage a shopping cart, and place orders via WhatsApp integration. The platform serves businesses and individuals in Neiva and the Huila region of Colombia.

### Key Features

- **Product Catalog**: Browse 500+ products across 10+ categories
- **Real-time Inventory**: Live stock tracking via Convex backend
- **WhatsApp Orders**: Seamless order placement through WhatsApp Business
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Search**: Product search with autocomplete
- **Cart Management**: Persistent shopping cart with localStorage
- **SEO Optimized**: Full meta tags and Schema.org structured data

---

## 🛠 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 16.1.6 |
| Language | TypeScript | 5.9.3 |
| Runtime | React | 19.2.4 |
| Styling | Tailwind CSS | 4.1.18 |
| UI Components | shadcn/ui | 3.8.5 |
| Backend | Convex | 1.31.7 |
| Icons | Lucide React | 0.577.0 |
| Font | Geist (Google Fonts) | - |

### Additional Dependencies

- `class-variance-authority` - Component variant management
- `clsx` + `tailwind-merge` - Utility class merging
- `radix-ui` - Headless UI primitives
- `tw-animate-css` - Tailwind animations

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Convex account (for backend)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dulcitienda-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Convex URL to .env.local
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Development

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start separately
npm run dev:frontend  # Next.js on http://localhost:3000
npm run dev:backend   # Convex dev server
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
dulcitienda-app/
├── app/                          # Next.js App Router
│   ├── ConvexClientProvider.tsx  # Convex React provider wrapper
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Home page (landing)
│   ├── catalogo/
│   │   └── page.tsx              # Product catalog page
│   ├── producto/
│   │   └── [sku]/
│   │       └── page.tsx          # Product detail page
│   ├── carrito/
│   │   └── page.tsx              # Shopping cart page
│   ├── buscar/
│   │   └── page.tsx              # Search results page
│   └── pedidos/
│       └── page.tsx              # Orders page
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── SearchDropdown.tsx        # Search with autocomplete
│   ├── Header.jsx                # App header (legacy)
│   ├── Footer.jsx                # App footer (legacy)
│   ├── Hero.jsx                  # Hero section
│   ├── ProductGrid.jsx           # Product grid component
│   ├── CategoryGrid.jsx          # Category grid component
│   └── AboutSection.jsx          # About section
├── convex/
│   ├── schema.ts                 # Database schema
│   ├── products.ts               # Product queries/mutations
│   ├── orders.ts                 # Order queries/mutations
│   ├── seed.ts                   # Database seeding
│   └── _generated/               # Auto-generated Convex code
├── lib/
│   ├── utils.ts                  # Utility functions (cn)
│   ├── brand.ts                  # Brand colors and constants
│   └── product-images.ts         # Product image mapping
├── design/                       # Design system documentation
│   ├── DESIGN_SYSTEM.md
│   └── components/               # Design prototypes
├── public/                       # Static assets
├── docs/                         # Documentation (this folder)
├── next.config.ts                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration (v4)
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
# Required - Convex deployment URL
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Optional - Production deploy key (for CI/CD)
CONVEX_DEPLOY_KEY=your_deploy_key_here
```

### Variable Descriptions

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Your Convex deployment URL (frontend) |
| `CONVEX_DEPLOY_KEY` | No | Deploy key for production/preview environments |

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend + backend concurrently |
| `npm run dev:frontend` | Start Next.js dev server only |
| `npm run dev:backend` | Start Convex dev server only |
| `npm run predev` | Setup Convex (runs before dev) |
| `npm run build` | Build production Next.js app |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🚀 Deployment

### Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Convex (Backend)

```bash
# Deploy to production
npx convex deploy

# Or use the dashboard
npx convex dashboard
```

### Environment Setup

1. **Development**: Use `convex dev` for local backend
2. **Preview**: Auto-deployed on pull requests
3. **Production**: Deploy via `npx convex deploy`

---

## 📚 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md) - System design and patterns
- [Components Catalog](./docs/COMPONENTS.md) - Component documentation
- [API Integration](./docs/API_INTEGRATION.md) - Convex backend integration
- [Styling Guide](./docs/STYLING.md) - Tailwind and brand styling
- [Deployment Guide](./docs/DEPLOYMENT.md) - Detailed deployment instructions
- [AI Context](./docs/AI_CONTEXT.md) - Guidelines for AI assistants

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Private - All rights reserved by Dulcitienda

---

## 📞 Support

- **Email**: dulcitiendajm@gmail.com
- **Phone**: +57 313 2309867
- **Address**: Cra 3 # 7-12 Centro, Neiva, Huila, Colombia
