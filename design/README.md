# Dulcitienda - UX/UI Design Documentation

## Project Overview
Complete UX/UI redesign for Dulcitienda, a B2B wholesale distributor of candies, snacks, beverages, and liquor based in Colombia.

## Reference
Based on https://candyjobs.com.co/ - A Colombian candy distributor

## Design Philosophy
- **Warm & Inviting**: Colors inspired by sweets and treats (oranges, yellows, browns)
- **Trustworthy**: Professional yet approachable for B2B clients
- **Modern**: Clean layouts with smooth interactions
- **Accessible**: Clear hierarchy and readable typography

## File Structure

```
design/
├── DESIGN_SYSTEM.md          # Complete design system documentation
├── tailwind.config.js        # Tailwind CSS configuration
├── styles.css               # Global CSS styles with Tailwind directives
├── README.md                # This file
├── App.jsx                  # Main App component
└── components/
    ├── Header.jsx           # Navigation header with scroll effects
    ├── Hero.jsx             # Hero section with stats
    ├── CategoryGrid.jsx     # Category cards (Gaseosas, Snacks, Dulces, Licores)
    ├── ProductGrid.jsx      # Featured products grid
    ├── AboutSection.jsx     # Company mission and values
    └── Footer.jsx           # Contact footer
```

## Color Palette

### Primary
- **Primary Orange**: `#E85D04` - CTAs, highlights
- **Primary Yellow**: `#F4A900` - Buttons, badges
- **Warm Brown**: `#8B4513` - Headings

### Backgrounds
- **Cream**: `#FFF8E7` - Main background
- **Soft Peach**: `#FFDAB9` - Section backgrounds
- **Off White**: `#FDF6E3` - Alternative background

### Text
- **Dark Brown**: `#3D2914` - Primary text
- **Medium Brown**: `#6B4423` - Secondary text
- **Light Brown**: `#A0826D` - Muted text

## Typography

### Fonts
- **Headings**: Poppins (600-700 weight)
- **Body**: Inter (400-500 weight)
- **Display**: Pacifico (accent/decorative)

### Scale
- H1: 48px/3rem (Hero)
- H2: 36px/2.25rem (Sections)
- H3: 28px/1.75rem (Cards)
- Body: 16px/1rem

## Components

### Header
- Fixed position with scroll effect
- Logo + Navigation + Actions
- Mobile responsive hamburger menu
- Changes background on scroll

### Hero
- Full viewport height
- Background image with gradient overlay
- Stats display (385 clients, 1460 products, 535 deliveries)
- Two CTA buttons
- Scroll indicator

### CategoryGrid
- 4 category cards in responsive grid
- Icons: Wine, Cookie, Candy, CupSoda
- Hover effects with color accents
- Featured brands section

### ProductGrid
- 8 featured products
- Product cards with image, rating, price
- Quick action buttons (wishlist, quick view)
- Add to cart on hover
- "Load more" button

### AboutSection
- Two-column layout (image + content)
- Company mission statement
- Values checklist
- 4 feature cards

### Footer
- 4-column layout
- Contact information
- Quick links
- Social media links
- Copyright bar

## Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Installation

1. Install dependencies:
```bash
npm install lucide-react
```

2. Configure Tailwind with the provided config file

3. Import global styles in your entry file

4. Use components as needed

## Dependencies
- React
- Tailwind CSS
- lucide-react (icons)

## Notes
- All components use Tailwind utility classes
- Custom CSS variables defined in styles.css
- Smooth scroll behavior enabled
- Custom scrollbar styling included
