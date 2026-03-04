# Dulcitienda - Design System

## Overview
Dulcitienda is a B2B wholesale distributor of candies, snacks, beverages, and liquor. The design evokes warmth, sweetness, and trustworthiness using a warm color palette inspired by candies and treats.

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Orange | `#E85D04` | CTAs, highlights, accents |
| Primary Yellow | `#F4A900` | Buttons, badges, highlights |
| Warm Brown | `#8B4513` | Headings, strong text |

### Secondary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Cream | `#FFF8E7` | Backgrounds, cards |
| Soft Peach | `#FFDAB9` | Section backgrounds |
| Light Orange | `#FFA07A` | Hover states |

### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| Dark Brown | `#3D2914` | Primary text |
| Medium Brown | `#6B4423` | Secondary text |
| Light Brown | `#A0826D` | Muted text, borders |
| Off White | `#FDF6E3` | Page background |
| White | `#FFFFFF` | Card backgrounds |

### Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| Candy Pink | `#FF6B9D` | Special badges, highlights |
| Mint Green | `#98D8C8` | Success states |
| Sky Blue | `#87CEEB` | Info badges |

---

## Typography

### Font Families
- **Headings**: `Poppins` - Bold, modern, friendly
- **Body**: `Inter` - Clean, highly readable
- **Accent/Display**: `Pacifico` - Playful, for special headings

### Type Scale
| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| H1 | 48px / 3rem | 700 | 1.2 | Hero headlines |
| H2 | 36px / 2.25rem | 600 | 1.3 | Section titles |
| H3 | 28px / 1.75rem | 600 | 1.4 | Card titles |
| H4 | 22px / 1.375rem | 500 | 1.4 | Subsection titles |
| H5 | 18px / 1.125rem | 500 | 1.5 | Small headings |
| Body Large | 18px / 1.125rem | 400 | 1.6 | Featured text |
| Body | 16px / 1rem | 400 | 1.6 | Regular text |
| Body Small | 14px / 0.875rem | 400 | 1.5 | Captions, metadata |
| Tiny | 12px / 0.75rem | 400 | 1.5 | Labels, tags |

---

## Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Tight spacing |
| space-2 | 8px | Icon gaps, small padding |
| space-3 | 12px | Button padding, small gaps |
| space-4 | 16px | Standard padding |
| space-5 | 20px | Card padding |
| space-6 | 24px | Section gaps |
| space-8 | 32px | Large gaps |
| space-10 | 40px | Section padding |
| space-12 | 48px | Large section padding |
| space-16 | 64px | Hero spacing |
| space-20 | 80px | Major section breaks |

### Container
- Max width: 1280px
- Padding: 16px (mobile), 24px (tablet), 32px (desktop)

---

## Component Styles

### Buttons

#### Primary Button
```
Background: #E85D04
Text: #FFFFFF
Padding: 12px 24px
Border-radius: 8px
Font-weight: 600
Hover: darken 10%, scale 1.02
Shadow: 0 4px 12px rgba(232, 93, 4, 0.3)
```

#### Secondary Button
```
Background: #F4A900
Text: #3D2914
Padding: 12px 24px
Border-radius: 8px
Font-weight: 600
Hover: darken 10%
```

#### Outline Button
```
Background: transparent
Border: 2px solid #E85D04
Text: #E85D04
Padding: 10px 22px
Border-radius: 8px
Hover: Background #E85D04, Text white
```

### Cards

#### Category Card
```
Background: #FFFFFF
Border-radius: 16px
Padding: 24px
Shadow: 0 4px 20px rgba(0, 0, 0, 0.08)
Hover: translateY(-4px), shadow increase
Icon size: 64px
```

#### Product Card
```
Background: #FFFFFF
Border-radius: 12px
Overflow: hidden
Shadow: 0 2px 12px rgba(0, 0, 0, 0.06)
Image aspect: 4:3
Hover: scale 1.02, shadow increase
```

### Badges

#### Category Badge
```
Background: #FFF8E7
Text: #8B4513
Padding: 4px 12px
Border-radius: 20px
Font-size: 12px
Font-weight: 500
```

#### Stats Badge
```
Background: #E85D04
Text: #FFFFFF
Padding: 8px 16px
Border-radius: 8px
Font-size: 14px
Font-weight: 600
```

---

## Layout Patterns

### Hero Section
- Full width with gradient overlay on background image
- Content centered or left-aligned
- Stats displayed in horizontal row with dividers
- Min-height: 500px (desktop), 400px (mobile)

### Grid Patterns
- Category Grid: 4 columns (desktop), 2 columns (tablet), 1 column (mobile)
- Product Grid: 4 columns (desktop), 3 columns (tablet), 2 columns (mobile)
- Gap: 24px

### Section Spacing
- Standard section padding: 80px 0
- Alternating background colors for visual separation

---

## Effects & Animations

### Transitions
- Default: `all 0.3s ease`
- Hover scale: `transform 0.2s ease`
- Color transitions: `color 0.2s ease, background-color 0.2s ease`

### Shadows
| Name | Value |
|------|-------|
| sm | 0 1px 3px rgba(0,0,0,0.08) |
| md | 0 4px 12px rgba(0,0,0,0.1) |
| lg | 0 8px 24px rgba(0,0,0,0.12) |
| xl | 0 12px 40px rgba(0,0,0,0.15) |
| colored | 0 4px 20px rgba(232, 93, 4, 0.25) |

### Hover Effects
- Cards: translateY(-4px) + shadow increase
- Buttons: brightness(1.1) + slight scale
- Images: scale(1.05) with overflow hidden

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Small desktop |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large desktop |
