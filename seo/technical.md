# Dulcitienda - Technical SEO

## 1. Schema.org Markup

### 1.1 Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dulcitienda",
  "alternateName": "Dulcitienda Distribuidora Mayorista",
  "url": "https://dulcitienda.com",
  "logo": "https://dulcitienda.com/logo.png",
  "description": "Distribuidora mayorista de dulces, snacks y licores en Neiva, Huila. Venta al por mayor para tiendas y negocios.",
  "foundingDate": "2010",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Dirección completa]",
    "addressLocality": "Neiva",
    "addressRegion": "Huila",
    "postalCode": "410002",
    "addressCountry": "CO"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+57-[número de teléfono]",
    "contactType": "sales",
    "availableLanguage": ["Spanish"],
    "areaServed": "CO-HUI"
  },
  "sameAs": [
    "https://facebook.com/dulcitienda",
    "https://instagram.com/dulcitienda",
    "https://wa.me/57[número WhatsApp]"
  ]
}
```

### 1.2 LocalBusiness Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WholesaleStore",
  "name": "Dulcitienda",
  "image": "https://dulcitienda.com/store-front.jpg",
  "@id": "https://dulcitienda.com",
  "url": "https://dulcitienda.com",
  "telephone": "+57-[número de teléfono]",
  "priceRange": "$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Dirección completa]",
    "addressLocality": "Neiva",
    "addressRegion": "Huila",
    "postalCode": "410002",
    "addressCountry": "CO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 2.935,
    "longitude": -75.280
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "14:00"
    }
  ],
  "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Bank Transfer"],
  "currenciesAccepted": "COP",
  "areaServed": {
    "@type": "State",
    "name": "Huila",
    "containedInPlace": {
      "@type": "Country",
      "name": "Colombia"
    }
  }
}
```

### 1.3 Product Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Chocolates Jet",
  "image": [
    "https://dulcitienda.com/images/products/jet-1.jpg",
    "https://dulcitienda.com/images/products/jet-2.jpg"
  ],
  "description": "Chocolates Jet al por mayor. Caja display con 24 unidades de 12g cada una.",
  "sku": "JET-24-12",
  "brand": {
    "@type": "Brand",
    "name": "Jet"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Compañía Nacional de Chocolates"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://dulcitienda.com/producto/chocolates-jet",
    "priceCurrency": "COP",
    "price": "[precio]",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Dulcitienda"
    },
    "eligibleQuantity": {
      "@type": "QuantitativeValue",
      "minValue": 1,
      "unitCode": "C62"
    },
    "businessFunction": "http://purl.org/goodrelations/v1#Sell"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

### 1.4 Product Schema for Variable Products

```json
{
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  "name": "Aguardiente Antioqueño",
  "description": "Aguardiente Antioqueño sin azúcar al por mayor",
  "brand": {
    "@type": "Brand",
    "name": "Antioqueño"
  },
  "hasVariant": [
    {
      "@type": "Product",
      "name": "Aguardiente Antioqueño 375ml",
      "sku": "ANT-375",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "COP",
        "price": "[precio]",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@type": "Product",
      "name": "Aguardiente Antioqueño 750ml",
      "sku": "ANT-750",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "COP",
        "price": "[precio]",
        "availability": "https://schema.org/InStock"
      }
    }
  ]
}
```

### 1.5 BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://dulcitienda.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Dulces",
      "item": "https://dulcitienda.com/categoria/dulces"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Chocolates",
      "item": "https://dulcitienda.com/categoria/dulces/chocolates"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Chocolates Jet",
      "item": "https://dulcitienda.com/producto/chocolates-jet"
    }
  ]
}
```

### 1.6 WebSite Schema (with Search)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Dulcitienda",
  "url": "https://dulcitienda.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://dulcitienda.com/buscar?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### 1.7 FAQPage Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuál es el mínimo de compra en Dulcitienda?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El mínimo de compra es de $[monto] COP para envíos gratuitos en Neiva. Para municipios del Huila, el mínimo es de $[monto] COP."
      }
    },
    {
      "@type": "Question",
      "name": "¿Hacen envíos a municipios del Huila?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, realizamos envíos a todos los municipios del departamento del Huila incluyendo Garzón, Pitalito, La Plata, Campoalegre y más."
      }
    },
    {
      "@type": "Question",
      "name": "¿Necesito RUT para comprar al por mayor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Para acceder a precios mayoristas es necesario estar registrado como empresa o comerciante. Puedes comprar sin RUT pero los precios pueden variar."
      }
    }
  ]
}
```

### 1.8 Article Schema (Blog)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cómo Surtir tu Tienda por Primera Vez",
  "description": "Guía completa para surtir tu tienda de barrio o minimarket por primera vez.",
  "image": "https://dulcitienda.com/blog/surtir-tienda.jpg",
  "author": {
    "@type": "Organization",
    "name": "Dulcitienda"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Dulcitienda",
    "logo": {
      "@type": "ImageObject",
      "url": "https://dulcitienda.com/logo.png"
    }
  },
  "datePublished": "2026-03-01",
  "dateModified": "2026-03-01"
}
```

---

## 2. Sitemap Structure

### 2.1 Main Sitemap Index

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://dulcitienda.com/sitemap-pages.xml</loc>
    <lastmod>2026-03-01</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://dulcitienda.com/sitemap-categories.xml</loc>
    <lastmod>2026-03-01</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://dulcitienda.com/sitemap-products.xml</loc>
    <lastmod>2026-03-01</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://dulcitienda.com/sitemap-blog.xml</loc>
    <lastmod>2026-03-01</lastmod>
  </sitemap>
</sitemapindex>
```

### 2.2 Pages Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dulcitienda.com</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://dulcitienda.com/nosotros</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dulcitienda.com/contacto</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dulcitienda.com/como-comprar</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://dulcitienda.com/preguntas-frecuentes</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://dulcitienda.com/blog</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 2.3 Categories Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dulcitienda.com/categoria/dulces</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://dulcitienda.com/categoria/snacks</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://dulcitienda.com/categoria/licores</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://dulcitienda.com/categoria/importados</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dulcitienda.com/categoria/surtido</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Subcategories -->
  <url>
    <loc>https://dulcitienda.com/categoria/dulces/caramelos</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://dulcitienda.com/categoria/dulces/chocolates</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- Add more subcategories as needed -->
</urlset>
```

### 2.4 Products Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dulcitienda.com/producto/chocolates-jet</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://dulcitienda.com/producto/aguardiente-antioqueno</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <!-- Add all products dynamically -->
</urlset>
```

### 2.5 Image Sitemap (Optional but Recommended)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://dulcitienda.com/producto/chocolates-jet</loc>
    <image:image>
      <image:loc>https://dulcitienda.com/images/products/jet-display.jpg</image:loc>
      <image:title>Chocolates Jet Display 24 unidades</image:title>
      <image:caption>Caja display con 24 unidades de Chocolates Jet de 12g</image:caption>
    </image:image>
  </url>
</urlset>
```

---

## 3. Robots.txt Recommendations

```
# robots.txt for Dulcitienda
# https://dulcitienda.com/robots.txt

User-agent: *
Allow: /

# Sitemap
Sitemap: https://dulcitienda.com/sitemap.xml

# Disallow private/admin areas
Disallow: /admin/
Disallow: /administrador/
Disallow: /login/
Disallow: /registro/
Disallow: /cuenta/
Disallow: /carrito/
Disallow: /checkout/
Disallow: /api/
Disallow: /private/

# Disallow search results
Disallow: /buscar?
Disallow: /search?
Disallow: /*?q=
Disallow: /*?buscar=

# Disallow filtered results (use canonical instead)
Disallow: /*?precio_min=
Disallow: /*?precio_max=
Disallow: /*?ordenar=
Disallow: /*?marca=

# Disallow print versions
Disallow: /*?print=1
Disallow: /print/

# Crawl delay for aggressive bots
User-agent: AhrefsBot
Crawl-delay: 2

User-agent: SemrushBot
Crawl-delay: 2

User-agent: MJ12bot
Crawl-delay: 5
```

---

## 4. Core Web Vitals Optimization

### 4.1 LCP (Largest Contentful Paint) - Target: < 2.5s

**Optimizations:**

1. **Image Optimization**
   ```html
   <!-- Use WebP format with fallbacks -->
   <picture>
     <source srcset="image.webp" type="image/webp">
     <source srcset="image.jpg" type="image/jpeg">
     <img src="image.jpg" alt="Descripción" width="800" height="600" loading="lazy">
   </picture>
   ```

2. **Preload Critical Resources**
   ```html
   <link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin>
   <link rel="preload" href="/css/critical.css" as="style">
   <link rel="preload" href="/images/hero-image.webp" as="image">
   ```

3. **Optimize Hero Image**
   - Use WebP format
   - Implement responsive images with srcset
   - Compress to < 200KB
   - Dimensions: 1920x1080 max

4. **Server Response Time**
   - Enable gzip/brotli compression
   - Use CDN for static assets
   - Implement server-side caching

### 4.2 FID/INP (Interaction to Next Paint) - Target: < 200ms

**Optimizations:**

1. **Code Splitting**
   ```javascript
   // Lazy load non-critical components
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

2. **Defer Non-Critical JavaScript**
   ```html
   <script src="analytics.js" defer></script>
   <script src="chat-widget.js" async></script>
   ```

3. **Optimize Event Handlers**
   - Use passive event listeners
   - Debounce scroll/resize handlers
   - Minimize main thread work

4. **Third-Party Scripts**
   - Load analytics after user interaction
   - Use facades for embeds (YouTube, Maps)
   - Preconnect to required origins

### 4.3 CLS (Cumulative Layout Shift) - Target: < 0.1

**Optimizations:**

1. **Set Image Dimensions**
   ```html
   <img src="product.jpg" width="400" height="400" alt="Producto">
   ```

2. **Reserve Space for Dynamic Content**
   ```css
   .ad-container {
     min-height: 250px;
     width: 100%;
   }
   ```

3. **Font Loading Strategy**
   ```css
   @font-face {
     font-family: 'CustomFont';
     src: url('font.woff2') format('woff2');
     font-display: swap;
   }
   ```

4. **Avoid Inserting Content Above Existing Content**
   - Reserve space for banners/notifications
   - Use skeleton screens for loading states

### 4.4 Additional Performance Optimizations

**CSS Optimization:**
```html
<!-- Critical CSS inline -->
<style>
  /* Critical styles here */
</style>

<!-- Non-critical CSS async -->
<link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/css/main.css"></noscript>
```

**JavaScript Optimization:**
```javascript
// Use Intersection Observer for lazy loading
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
});
```

**Resource Hints:**
```html
<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">

<!-- Preconnect -->
<link rel="preconnect" href="https://cdn.dulcitienda.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Prefetch next page -->
<link rel="prefetch" href="/categoria/dulces">
```

---

## 5. URL Structure Best Practices

### Recommended URL Patterns

```
# Homepage
/

# Categories
/categoria/[category-slug]
/categoria/dulces
/categoria/dulces/chocolates

# Products
/producto/[product-slug]
/producto/chocolates-jet

# Static pages
/nosotros
/contacto
/como-comprar
/preguntas-frecuentes

# Blog
/blog
/blog/[post-slug]
/blog/como-surtir-tu-tienda

# Search (noindex)
/buscar?q=[query]

# Account (noindex)
/cuenta
/cuenta/pedidos
/cuenta/perfil

# Cart/Checkout (noindex)
/carrito
/checkout
```

### URL Guidelines

- Use hyphens (-) not underscores (_)
- Keep URLs lowercase
- Avoid special characters
- Include target keywords naturally
- Maximum 60 characters
- Use Spanish slugs

---

## 6. Internal Linking Strategy

### Priority Link Structure

1. **Homepage Links To:**
   - All main categories
   - Featured products
   - About page
   - Contact page

2. **Category Pages Link To:**
   - Subcategories
   - Featured products
   - Related categories
   - Parent category

3. **Product Pages Link To:**
   - Parent category
   - Related products
   - "Frequently bought together"
   - Brand page (if exists)

4. **Blog Posts Link To:**
   - Relevant products
   - Related posts
   - Category pages
   - Contact/CTA

### Anchor Text Guidelines

- Use descriptive anchor text
- Include keywords naturally
- Avoid "click here"
- Vary anchor text for same target

---

## 7. Technical Checklist

### Pre-Launch

- [ ] SSL certificate installed (HTTPS)
- [ ] XML sitemap created and submitted
- [ ] Robots.txt configured
- [ ] Canonical tags on all pages
- [ ] Schema.org markup implemented
- [ ] Mobile-friendly (responsive design)
- [ ] Page speed < 3s on mobile
- [ ] Core Web Vitals passing
- [ ] 404 page customized
- [ ] 301 redirects for old URLs (if migrating)

### Post-Launch Monitoring

- [ ] Google Search Console connected
- [ ] Google Analytics 4 configured
- [ ] Bing Webmaster Tools connected
- [ ] Core Web Vitals monitoring
- [ ] Server uptime monitoring
- [ ] Broken link checker
- [ ] Log file analysis

---

*Document created: March 2026*
