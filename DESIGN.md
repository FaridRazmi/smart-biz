# DESIGN.md — SmartBiz

> Design direction and design system specification for SmartBiz, governing all UI craft, typography, layout, and visual identity under anti-slop rules.

## 1. Product Identity & Purpose
- **Product:** SmartBiz
- **Domain:** Everyday Sales & Inventory Ledger for retail stores, kiosk operators, market vendors, and small business owners.
- **Audience:** Busy shopkeepers who need to record a sale in 3 seconds, check if flour or sugar is low, and know their daily profit at closing time.
- **Personality:** Grounded, utilitarian, lightning-fast, and trustworthy. Feels like a precision trade tool, not an abstract tech startup landing page.

## 2. Color Palette & Tone
- **Neutrals:**
  - Page Background: `#f8fafc` (Warm Slate Light)
  - Card & Container Surface: `#ffffff`
  - Structural Border: `#e2e8f0` (1px solid hairline)
  - Subdued Surface / Table Header: `#f1f5f9`
- **Text & Contrast:**
  - Primary Headings & Totals: `#0f172a` (Deep Slate, WCAG AAA)
  - Body Text & Labels: `#334155` (Slate Gray)
  - Muted Captions & Meta: `#64748b`
- **Actions:**
  - Primary Action (Record Sale / Add Product / Submit): `#0f172a` (Solid Slate with `#ffffff` text, hover `#1e293b`)
  - Secondary Action (Cancel / Back / Filter): `#ffffff` background with `#e2e8f0` border and `#334155` text
- **Semantic Accents (Strictly restrained to data meaning):**
  - Growth / Revenue / In Stock: `#059669` (Emerald Green) / Badge surface `#ecfdf5`
  - Low Stock Warning: `#d97706` (Warm Ochre) / Badge surface `#fffbeb`
  - Critical Out-of-Stock / Danger: `#dc2626` (Crimson) / Badge surface `#fef2f2`
- **Banned:** No blue-to-purple gradients, no neon cyan, no full-page glassmorphism blur, no floating AI orbs.

## 3. Typography
- **Font Stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- **Tabular Figures:** Applied to all prices, quantities, and dates via `font-variant-numeric: tabular-nums;`
- **Type Scale:**
  - Metric Big Display: `2rem` (32px), `font-weight: 700`, `letter-spacing: -0.02em`
  - Section Title: `1.25rem` (20px), `font-weight: 600`, `letter-spacing: -0.01em`
  - Body & Table Text: `0.875rem` (14px), `font-weight: 400`, `line-height: 1.5`
  - Micro Tag / Badge: `0.75rem` (12px), `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.04em`

## 4. Layout, Spacing & Elevation
- **Spacing Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px
- **Corner Radii:**
  - Inputs & Controls: `6px`
  - Buttons & Selectors: `8px`
  - Cards, Panels & Modals: `12px`
  - Status Indicators: `9999px` (pills strictly for status tags only)
- **Shadows:** Restrained tactile lift: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04);`
- **Mobile First Navigation:** Top utility bar with store name + quick "+ Sale" action, clean drawer/sidebar on desktop, mobile-friendly bottom/drawer bar.
- **Card-Fallback Tables:** On screens under 640px, wide data tables switch to compact list cards to eliminate awkward horizontal overflow.
