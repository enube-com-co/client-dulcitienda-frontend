# Image Implementation Guide

## Overview
This guide covers the technical implementation of the Dulcitienda image system, from download to deployment.

## CDN Options Comparison

### Option 1: Cloudinary (Recommended for Startups)

**Pros:**
- Built-in image transformations (resize, format, quality)
- Automatic WebP/AVIF conversion
- Global CDN included
- Easy React/Next.js integration
- Free tier: 25GB storage, 25GB bandwidth

**Cons:**
- More expensive at scale ($224+/month for Advanced)
- Vendor lock-in

**Pricing:**
| Plan | Price | Storage | Bandwidth | Transformations |
|------|-------|---------|-----------|-----------------|
| Free | $0 | 25GB | 25GB | 25,000 |
| Plus | $25/mo | 100GB | 100GB | 100,000 |
| Advanced | $224/mo | 500GB | 500GB | 500,000 |

**Best for:** Teams wanting quick setup with minimal maintenance

---

### Option 2: AWS S3 + CloudFront (Cost-Effective)

**Pros:**
- Lowest cost at scale
- Full control over infrastructure
- Integrates with AWS ecosystem
- Pay-per-use pricing

**Cons:**
- Requires setup and maintenance
- No built-in image transformations
- Need Lambda@Edge for optimization

**Pricing (estimated for 50K images, 2M pageviews):**
| Component | Monthly Cost |
|-----------|-------------|
| S3 Storage (100GB) | $2.30 |
| CloudFront Bandwidth (1.8TB) | $153 |
| Lambda@Edge | $6 |
| S3 Requests | $5 |
| **Total** | **~$166** |

**Best for:** Cost-conscious teams with DevOps capacity

---

### Option 3: Vercel Edge Network (If hosted on Vercel)

**Pros:**
- Zero configuration
- Automatic optimization
- Included with Vercel Pro
- Perfect for Next.js apps

**Cons:**
- Requires Vercel hosting
- Limited to Next.js Image component

**Pricing:**
- Included in Vercel Pro ($20/mo)
- Fair use limits apply

**Best for:** Next.js apps already hosted on Vercel

---

### Option 4: Bytescale (Modern Alternative)

**Pros:**
- Cheaper than Cloudinary
- Modern API
- Built-in transformations
- Good developer experience

**Cons:**
- Smaller ecosystem
- Newer company

**Pricing:**
| Plan | Price | Bandwidth |
|------|-------|-----------|
| Free | $0 | 10GB |
| Starter | $15/mo | 100GB |
| Growth | $49/mo | 500GB |

**Best for:** Modern apps wanting Cloudinary features at lower cost

---

## Recommended Setup: Cloudinary + Next.js

### Step 1: Cloudinary Setup

1. Create account at https://cloudinary.com
2. Get credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret

3. Configure upload preset:
```javascript
// In Cloudinary Dashboard > Settings > Upload
// Create unsigned upload preset for client-side uploads
{
  "name": "dulcitienda_products",
  "folder": "products",
  "allowed_formats": ["jpg", "png", "webp"],
  "transformation": [
    { "width": 1200, "height": 1200, "crop": "limit" }
  ]
}
```

### Step 2: Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dulcitienda_products
```

### Step 3: Next.js Image Component Setup

```typescript
// components/ProductImage.tsx
import { CldImage } from 'next-cloudinary';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ProductImage({ 
  src, 
  alt, 
  width = 600, 
  height = 600,
  priority = false 
}: ProductImageProps) {
  return (
    <CldImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      transformations={{
        quality: 'auto:good',
        fetch_format: 'auto',
        crop: 'pad',
        background: 'white'
      }}
    />
  );
}
```

### Step 4: Install Dependencies

```bash
npm install next-cloudinary
# or
yarn add next-cloudinary
```

### Step 5: Configure next.config.js

```javascript
// next.config.js
const { withNextVideo } = require('next-video/process');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/your_cloud_name/**',
      },
    ],
  },
};

module.exports = nextConfig;
```

## Image Upload Workflow

### Batch Upload Script

```typescript
// scripts/upload-images.ts
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(filePath: string, folder: string) {
  const fileName = path.basename(filePath, path.extname(filePath));
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `dulcitienda/${folder}`,
      public_id: fileName,
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good', fetch_format: 'auto' }
      ]
    });
    
    console.log(`✓ Uploaded: ${fileName}`);
    return result.secure_url;
  } catch (error) {
    console.error(`✗ Failed: ${fileName}`, error);
    throw error;
  }
}

async function batchUpload(category: string) {
  const imagesDir = path.join(process.cwd(), 'images', category);
  const files = fs.readdirSync(imagesDir).filter(f => 
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  );
  
  console.log(`Uploading ${files.length} images for ${category}...`);
  
  for (const file of files) {
    await uploadImage(path.join(imagesDir, file), category);
  }
}

// Run: npx ts-node scripts/upload-images.ts gaseosas
const category = process.argv[2];
if (category) {
  batchUpload(category);
}
```

## Fallback Strategies

### 1. Placeholder Images

```typescript
// lib/image-utils.ts
const PLACEHOLDER_URLS = {
  gaseosas: '/placeholders/soda-can.svg',
  snacks: '/placeholders/snack-bag.svg',
  chocolates: '/placeholders/chocolate-bar.svg',
  gomas: '/placeholders/gummy-candy.svg',
  licores: '/placeholders/bottle.svg',
  galletas: '/placeholders/cookie.svg',
  lacteos: '/placeholders/milk.svg',
  default: '/placeholders/product.svg'
};

export function getPlaceholder(category: string): string {
  return PLACEHOLDER_URLS[category as keyof typeof PLACEHOLDER_URLS] 
    || PLACEHOLDER_URLS.default;
}
```

### 2. Error Handling Component

```typescript
// components/SafeImage.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getPlaceholder } from '@/lib/image-utils';

interface SafeImageProps {
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
}

export function SafeImage({ src, alt, category, width, height }: SafeImageProps) {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className="bg-gray-100 flex items-center justify-center" 
           style={{ width, height }}>
        <Image
          src={getPlaceholder(category)}
          alt={alt}
          width={width}
          height={height}
          className="opacity-50"
        />
      </div>
    );
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={() => setError(true)}
    />
  );
}
```

### 3. Blur Placeholder

```typescript
// Generate blur data URL for Next.js Image
import { getPlaiceholder } from 'plaiceholder';

export async function getBlurDataUrl(imageUrl: string): Promise<string> {
  try {
    const buffer = await fetch(imageUrl).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    );
    
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (err) {
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }
}
```

## Performance Optimization

### 1. Image Preloading for Critical Images

```typescript
// app/layout.tsx
import Head from 'next/head';

export default function RootLayout({ children }) {
  return (
    <html>
      <Head>
        {/* Preload hero/critical images */}
        <link 
          rel="preload" 
          href="https://res.cloudinary.com/your_cloud/image/upload/hero-banner"
          as="image"
          type="image/webp"
        />
      </Head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. Lazy Loading with Intersection Observer

```typescript
// Already built into Next.js Image component
// Just use the 'loading' prop:
<Image
  src="/product.jpg"
  alt="Product"
  width={600}
  height={600}
  loading="lazy" // Lazy load below-fold images
/>
```

### 3. Responsive Images

```typescript
// Use sizes prop for responsive images
<Image
  src="/product.jpg"
  alt="Product"
  width={1200}
  height={1200}
  sizes="(max-width: 640px) 100vw, 
         (max-width: 1024px) 50vw, 
         33vw"
/>
```

## Monitoring & Analytics

### Cloudinary Analytics

```typescript
// Track image loading performance
import { useEffect } from 'react';

export function useImageAnalytics(publicId: string) {
  useEffect(() => {
    // Log to your analytics service
    analytics.track('Image Loaded', {
      publicId,
      timestamp: Date.now()
    });
  }, [publicId]);
}
```

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'
```

## Backup Strategy

### 1. Local Backup

```bash
# scripts/backup-images.sh
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="backups/$DATE"

mkdir -p $BACKUP_DIR

# Download all images from Cloudinary
cloudinary-cli sync --pull "dulcitienda/*" $BACKUP_DIR

# Compress
tar -czf "$BACKUP_DIR.tar.gz" $BACKUP_DIR

# Upload to S3 (optional backup)
aws s3 cp "$BACKUP_DIR.tar.gz" s3://dulcitienda-backups/images/
```

### 2. Version Control for Image URLs

```typescript
// Store image mappings in database
// migrations/001_add_product_images.sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_sku VARCHAR(50) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  cloudinary_public_id VARCHAR(200),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Testing

### Visual Regression Testing

```typescript
// tests/image-regression.test.ts
import { test, expect } from '@playwright/test';

test('product images load correctly', async ({ page }) => {
  await page.goto('/products/GAS001');
  
  const image = page.locator('[data-testid="product-image"]');
  await expect(image).toBeVisible();
  
  // Check image loaded successfully
  const imgElement = await image.elementHandle();
  const naturalWidth = await imgElement?.evaluate(el => 
    (el as HTMLImageElement).naturalWidth
  );
  expect(naturalWidth).toBeGreaterThan(0);
});
```

## Deployment Checklist

- [ ] All images uploaded to CDN
- [ ] Environment variables configured
- [ ] Fallback placeholders created
- [ ] Image optimization enabled
- [ ] Responsive sizes configured
- [ ] Lazy loading implemented
- [ ] Error boundaries tested
- [ ] Performance audited (Lighthouse)
- [ ] Backup strategy in place
- [ ] Analytics tracking enabled

## Cost Monitoring

Set up billing alerts:
- Cloudinary: Alert at 80% of plan limits
- AWS: Alert at $50/month threshold
- Vercel: Monitor fair use limits
