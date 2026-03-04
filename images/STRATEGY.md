# Dulcitienda Image Strategy

## Overview
This document outlines the comprehensive image strategy for Dulcitienda's e-commerce platform, covering 550+ products across 10 categories.

## Best Sources for Product Images

### 1. Free Stock Photo Platforms (Primary)
- **Unsplash** (unsplash.com) - CC0 license, high quality, no attribution required
- **Pexels** (pexels.com) - Free commercial use, large collection
- **Pixabay** (pixabay.com) - CC0 license, includes vectors
- **Freepik** (freepik.com) - Free with attribution, premium available

### 2. Official Brand Resources (Secondary)
- Coca-Cola Company Media Library
- PepsiCo Press Center
- Nestlé Media Room
- Mondelēz International Media
- Local Colombian brand websites (Jet, Chocoramo, etc.)

### 3. AI-Generated Images (Tertiary)
- DALL-E 3 / Midjourney for generic product mockups
- Freepik AI Image Generator
- Canva AI (Magic Media)

### 4. Custom Photography (Long-term)
- Professional product photography studio
- Consistent white background setup
- 360-degree product views

## Image Specifications

### Technical Requirements
| Specification | Value |
|--------------|-------|
| Primary Format | WebP (with JPEG fallback) |
| Resolution | 1200x1200px (square) |
| Aspect Ratio | 1:1 (square) for consistency |
| Color Space | sRGB |
| Max File Size | 200KB per image |
| DPI | 72 (web optimized) |

### Image Variants
| Variant | Dimensions | Purpose |
|---------|-----------|---------|
| Thumbnail | 300x300px | Grid listings, carts |
| Medium | 600x600px | Product cards |
| Large | 1200x1200px | Detail view |
| Zoom | 2000x2000px | High-res zoom |

### Quality Standards
- White or transparent background preferred
- Consistent lighting across all products
- No watermarks or text overlays
- Product centered with 10% padding
- Sharp focus, no blur
- Accurate color representation

## Naming Conventions

### File Naming Pattern
```
{category}-{brand}-{product-name}-{sku}-{variant}.{ext}
```

### Examples
```
gaseosas-coca-cola-original-350ml-GAS001-thumb.webp
gaseosas-coca-cola-original-350ml-GAS001-medium.webp
gaseosas-coca-cola-original-350ml-GAS001-large.webp
snacks-sabritas-naturales-45g-SNA015-thumb.webp
chocolates-jet-leche-12g-CHO032-thumb.webp
```

### Category Codes
| Category | Code |
|----------|------|
| Gaseosas | GAS |
| Snacks | SNA |
| Dulces | DUL |
| Gomas | GOM |
| Chocolates | CHO |
| Ancheteía | ANC |
| Confitería | CON |
| Licores | LIC |
| Galletas | GAL |
| Lácteos | LAC |

## Copyright Considerations

### License Types
1. **CC0 (Public Domain)** - No restrictions
2. **CC-BY** - Attribution required
3. **Commercial Free** - Free for commercial use
4. **Editorial Use Only** - NOT suitable for product sales
5. **Premium/Paid** - Licensed for commercial use

### Compliance Checklist
- [ ] Verify license allows commercial use
- [ ] Check if attribution is required
- [ ] Confirm no model releases needed
- [ ] Document source for each image
- [ ] Keep license records in `images/licenses/`

### Risk Mitigation
- Prioritize CC0 and free commercial use images
- Use generic product shots over branded packaging
- When in doubt, use AI-generated generic images
- Maintain documentation of all image sources

## Category-Specific Guidelines

### Gaseosas (Sodas)
- Show bottles/cans at 45° angle
- Include condensation for cold drinks
- Transparent background or white
- Avoid showing competitor brands

### Snacks
- Show open bag with contents visible
- Include product texture detail
- Natural lighting preferred
- Show portion size reference

### Chocolates & Dulces
- High contrast against background
- Show wrapper and unwrapped (if applicable)
- Highlight texture (glossy, matte, etc.)
- Temperature-appropriate appearance

### Gomas (Gummies)
- Bright, vibrant colors
- Show multiple pieces
- Transparent background ideal
- Glossy finish emphasis

### Licores
- Elegant, premium presentation
- Dark or gradient backgrounds
- Show bottle label clearly
- Age restriction badge (18+)

## Implementation Priority

### Phase 1: Core Products (Week 1-2)
- Top 50 best-selling items
- All Coca-Cola products
- Major snack brands (Sabritas, Doritos)

### Phase 2: Category Completion (Week 3-4)
- Complete remaining products per category
- Focus on chocolates and dulces

### Phase 3: Quality Enhancement (Week 5-6)
- Replace low-quality images
- Add zoom variants
- Optimize file sizes

### Phase 4: Advanced Features (Ongoing)
- 360-degree views
- Lifestyle/context images
- Video shorts

## Tools & Resources

### Image Processing
- **Squoosh** (squoosh.app) - WebP conversion
- **ImageMagick** - Batch processing
- **Photoshop/GIMP** - Advanced editing

### CDN Options
- Cloudinary (recommended for transformations)
- AWS S3 + CloudFront (cost-effective)
- Vercel Edge Network (if hosted on Vercel)

### Validation
- Lighthouse image audits
- WebPageTest visual comparison
- Browser DevTools Network tab
