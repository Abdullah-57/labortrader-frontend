# Home Page Overrides

> **PROJECT:** LaborTrader
> **Generated:** 2026-10-19 18:21:29
> **Page Type:** Landing / Marketing

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px (standard)
- **Layout:** Full-width sections, centered content
- **Sections:** 1. Hero with countdown, 2. Product teaser/preview, 3. Email capture form, 4. Social proof (waitlist count)

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Anticipation: Dark + accent highlights. Countdown in brand color. Urgency indicators.

### Component Overrides

- Avoid: Invisible text during font load
- Avoid: Large blocking CSS files
- Avoid: Synchronous third-party scripts

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: Large sections (48px+ gaps), animated patterns, bold hover (color shift), scroll-snap, large type (32px+), 200-300ms
- Performance: Use font-display swap or optional
- Performance: Inline critical CSS defer non-critical
- Performance: Load non-critical scripts async/defer
- CTA Placement: Email form prominent (above fold) + Sticky form on scroll
