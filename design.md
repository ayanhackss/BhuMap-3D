# Design — 3D-BhuMap

A locked design system for this app. Every page redesign reads this file before emitting code. Do not regenerate per page — extend or amend this file when the system needs to grow.

## Genre
modern-minimal

## Macrostructure family
Pick one base macrostructure for marketing pages, one for app pages. Pages within a family share the family's shape; they vary only in component archetypes.

- Marketing pages: Marquee Hero
- App pages: Workbench

## Theme
- `--color-paper`: oklch(14% 0.008 240)
- `--color-paper-2`: oklch(18% 0.010 240)
- `--color-rule`: oklch(30% 0.008 240)
- `--color-neutral`: oklch(58% 0.008 240)
- `--color-muted`: oklch(72% 0.006 240)
- `--color-ink`: oklch(94% 0.006 240)
- `--color-accent`: #3b82f6 /* signal blue */
- `--color-focus`: oklch(70% 0.19 240)

## Typography
- Display: Bricolage Grotesque, weight 600, style normal
- Body: Bricolage Grotesque, weight 400
- Mono: Geist Mono, weight 400
- Display tracking: -0.02em
- Type scale anchor: clamp(2.5rem, 5vw + 0.5rem, 4.75rem)

## Spacing
4-point named scale.
- 3xs: 0.25rem, 2xs: 0.5rem, xs: 0.75rem
- sm: 1rem, md: 1.5rem, lg: 2rem
- xl: 3rem, 2xl: 4.5rem, 3xl: 7rem

## Motion
- Easings: cubic-bezier(0.16, 1, 0.3, 1)
- Reveal pattern: none (modern-minimal prefers composed pages)

## Microinteractions stance
- silent success
- hover delay 0 ms
- subtle border highlights on interactive surfaces

## CTA voice
- Primary CTA: Pill-rounded, filled black (or dark slate) with white text, or accent border.
- Secondary CTA: Pill-rounded, outlined.

## Per-page allowances
- Marketing pages MAY use UI mockups/screenshots for the Marquee Hero.
- App pages MUST NOT use enrichment — function carries the page.

## What pages MUST share
- The wordmark / logotype.
- The display + body fonts (Bricolage Grotesque).
- The CTA voice (pill shape).

## What pages MAY differ on
- Macrostructure within the page-type family.
