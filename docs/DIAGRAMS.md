# 🏗️ Diagramas de Arquitectura

Diagramas visuales de la arquitectura de Dulcitienda.

---

## 📊 Diagrama General

```mermaid
graph TB
    User[👤 Usuario] -->|HTTPS| Vercel
    
    subgraph "Frontend"
        Vercel[🌐 Vercel Edge]
        Next[⚡ Next.js 16]
        React[⚛️ React 19]
        Tailwind[🎨 Tailwind CSS]
        Shadcn[🧩 shadcn/ui]
        
        Vercel --> Next
        Next --> React
        React --> Tailwind
        React --> Shadcn
    end
    
    Next -->|WebSocket/HTTP| Convex
    
    subgraph "Backend"
        Convex[🚀 Convex Serverless]
        DB[(🗄️ Database)]
        Queries[📖 Queries]
        Mutations[✏️ Mutations]
        
        Convex --> DB
        Convex --> Queries
        Convex --> Mutations
    end
    
    Convex -->|Checkout| WhatsApp[💬 WhatsApp API]
    
    subgraph "External Services"
        Unsplash[🖼️ Unsplash/Pexels]
        Cloudinary[☁️ Cloudinary - futuro]
        Google[🔐 Google OAuth - futuro]
    end
    
    Next -->|Images| Unsplash
    Next -.->|Upload| Cloudinary
    Next -.->|Auth| Google
```

---

## 🔄 Flujo de Compra

```mermaid
sequenceDiagram
    participant U as Usuario
    participant W as Web (Next.js)
    participant C as Convex
    participant WA as WhatsApp

    U->>W: Buscar producto
    W->>C: getProducts(query)
    C-->>W: Lista de productos
    W-->>U: Mostrar resultados

    U->>W: Ver producto
    W->>C: getProductBySku(sku)
    C-->>W: Detalles del producto
    W-->>U: Mostrar producto

    U->>W: Agregar al carrito
    W->>W: Guardar en localStorage
    W-->>U: Actualizar carrito

    U->>W: Ir a checkout
    W->>W: Generar mensaje WhatsApp
    W->>WA: Redirigir con mensaje
    WA-->>U: Abrir chat con Dulcitienda
```

---

## 🗄️ Esquema de Base de Datos

```mermaid
erDiagram
    CATEGORIES ||--o{ PRODUCTS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : includes
    ORDERS ||--o{ ORDER_ITEMS : contains

    CATEGORIES {
        string _id
        string name
        string slug
        string description
        number order
        boolean isActive
    }

    PRODUCTS {
        string _id
        string sku
        string name
        string categoryId
        number basePrice
        number minimumOrderQuantity
        number stock
        boolean isActive
        boolean isFeatured
        array images
    }

    ORDERS {
        string _id
        string orderNumber
        string customerName
        string customerPhone
        string status
        number subtotal
        number shipping
        number total
        number createdAt
    }

    ORDER_ITEMS {
        string productId
        string name
        string sku
        number price
        number quantity
    }
```

---

## 🏛️ Arquitectura de Capas

```mermaid
graph LR
    subgraph "Presentation Layer"
        Pages[📄 Pages]
        Components[🧩 Components]
        Hooks[⚓ Hooks]
    end

    subgraph "Business Logic"
        API[🔌 API Client]
        Validation[✅ Validation]
        State[💾 State Management]
    end

    subgraph "Data Layer"
        Convex[🚀 Convex]
        Queries[📖 Queries]
        Mutations[✏️ Mutations]
    end

    Pages --> Components
    Components --> Hooks
    Hooks --> API
    API --> Validation
    Validation --> State
    State --> Convex
    Convex --> Queries
    Convex --> Mutations
```

---

## 🚀 Pipeline de Deployment

```mermaid
graph LR
    Dev[💻 Dev Local] -->|git push| GitHub
    GitHub -->|trigger| Vercel
    
    subgraph "CI/CD"
        Build[🔨 Build]
        Test[🧪 Test]
        Deploy[🚀 Deploy]
    end
    
    Vercel --> Build
    Build --> Test
    Test --> Deploy
    
    Deploy -->|static files| CDN[🌐 CDN Global]
    Deploy -->|functions| Edge[⚡ Edge Functions]
    
    Convex[🚀 Convex] -->|sync| ProdDB[(🗄️ Production DB)]
```

---

## 📱 Responsive Design

```mermaid
graph TB
    subgraph "Breakpoints"
        Mobile[📱 Mobile
        < 640px]
        Tablet[📱 Tablet
        640px - 1024px]
        Desktop[💻 Desktop
        > 1024px]
    end

    subgraph "Components"
        Nav[Navigation]
        Grid[Product Grid]
        Card[Product Card]
        Cart[Cart]
    end

    Mobile -->|hamburger| Nav
    Mobile -->|1 column| Grid
    Mobile -->|stacked| Card
    Mobile -->|full screen| Cart

    Tablet -->|sidebar| Nav
    Tablet -->|2 columns| Grid
    Tablet -->|horizontal| Card
    Tablet -->|modal| Cart

    Desktop -->|navbar| Nav
    Desktop -->|4 columns| Grid
    Desktop -->|hover effects| Card
    Desktop -->|sidebar| Cart
```

---

## 🔒 Security Architecture

```mermaid
graph TB
    subgraph "Edge Security"
        HTTPS[🔒 HTTPS/TLS]
        DDoS[DDoS Protection]
        WAF[Web Application Firewall]
    end

    subgraph "Application Security"
        CSP[Content Security Policy]
        XSS[XSS Protection]
        CSRF[CSRF Tokens]
    end

    subgraph "Data Security"
        Input[Input Validation]
        Auth[Authentication]
        RLS[Row Level Security]
    end

    User --> HTTPS
    HTTPS --> DDoS
    DDoS --> WAF
    WAF --> CSP
    CSP --> XSS
    XSS --> CSRF
    CSRF --> Input
    Input --> Auth
    Auth --> RLS
```

---

## 🎯 Feature Roadmap

```mermaid
gantt
    title Dulcitienda Roadmap 2026
    dateFormat  YYYY-MM-DD
    section Q1
    MVP           :done, mvp, 2026-03-01, 2026-03-15
    
    section Q2
    Admin Panel   :active, admin, 2026-04-01, 30d
    Google Auth   :active, auth, 2026-04-15, 20d
    Testing       :test, 2026-04-20, 25d
    
    section Q3
    Payments      :pay, 2026-06-01, 45d
    Inventory     :inv, 2026-07-01, 30d
    Shipping      :ship, 2026-07-20, 35d
    
    section Q4
    Analytics     :ana, 2026-09-01, 30d
    PWA           :pwa, 2026-10-01, 45d
    Mobile App    :app, 2026-11-01, 60d
```

---

## 💰 Cost Architecture

```mermaid
pie title Cost Distribution (Monthly)
    "Vercel Pro" : 20
    "Convex Pro" : 25
    "Cloudinary" : 25
    "SendGrid" : 15
    "Misc" : 15
```

---

## 📊 Performance Metrics

```mermaid
graph LR
    subgraph "Core Web Vitals"
        LCP[LCP
        < 2.5s]
        FID[FID
        < 100ms]
        CLS[CLS
        < 0.1]
    end

    subgraph "Business Metrics"
        FCP[FCP
        < 1.8s]
        TTFB[TTFB
        < 600ms]
        TTI[TTI
        < 3.8s]
    end

    LCP --> FCP
    FID --> TTI
    CLS --> TTI
    FCP --> TTFB
```

---

**Nota**: Estos diagramas se renderizan automáticamente en GitHub con Mermaid.

Para verlos renderizados, visita:
- [GitHub Mermaid Docs](https://github.blog/developer-skills/github/include-diagrams-markdown-files-mermaid/)
