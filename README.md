# Bundle Builder

Configure your security system step by step — pick cameras, a plan, sensors, and accessories, and watch your order summary update live. Built with React, TypeScript, and Zustand.

## Demo

[Live Demo link](https://bundle-builder-takehome.vercel.app/)

[![Screenshot](./public/screenshot.png)](https://bundle-builder-takehome.vercel.app/)

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The app fetches the catalog from `/bundle-data.json` (served as a static asset by Vite).

## Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start Vite dev server         |
| `npm run build`   | TypeScript check + Vite build |
| `npm run lint`    | ESLint across the project     |
| `npm run preview` | Preview the production build  |

## Project Structure

```
src/
  data/
    bundle-data.json          Catalog source (also copied to public/)
  types/
    catalog.ts                TypeScript types for the full data model
  store/
    catalogStore.ts           Zustand store — loads catalog from endpoint
    bundleStore.ts            Zustand store — user selections + localStorage persistence
    selectors.ts              Pure selectors for review lines, totals, counts
  features/
    bundle-builder/           Accordion step builder (Cameras → Plan → Sensors → Accessories)
      BundleBuilder.tsx       Renders all steps
      AccordionStep.tsx       Expand/collapse step wrapper
      AccordionStepHeader.tsx Step header with "N selected" count
      AccordionStepPanel.tsx  Collapsible panel
      ProductCard.tsx         Product card with variant selector, stepper, pricing
      VariantSelector.tsx     Image-based variant picker (for multi-variant products)
      NextStepButton.tsx      Advances to the next step
    review-panel/             "Your security system" sidebar
      ReviewPanel.tsx         Groups review lines by category, renders totals
      ReviewLine.tsx          Single line item with stepper and pricing
      ReviewSummary.tsx       Totals, checkout, and save-for-later
  ui/
    QuantityStepper.tsx       Shared controlled +/- stepper
  pages/
    SystemBuilderPage.tsx     Composes builder + review panel, handles loading/error states
  services/
    apiBundleData.ts          Deprecated — replaced by catalogStore
  styles/
    globals.css               All styles (950+ lines)
```

## Architecture

### State Management — Zustand

Two stores, cleanly separated:

- **`catalogStore`** — read-only catalog data fetched from `/bundle-data.json`. Tracks `status` (`idle`/`loading`/`success`/`error`) so the app can show loading skeletons and error/retry states.
- **`bundleStore`** — user selections: `quantities`, `activeVariant`, `selectedPlanId`, `expandedStep`. Persisted to `localStorage` via explicit "Save my system for later". Initializes from the catalog's `initialQuantity` defaults when no saved state exists.

All totals, savings, and review lines are **derived selectors** over quantities — never stored directly, so they can't drift out of sync.

### Data Flow

```
bundle-data.json (public/)  ──fetch──▶  catalogStore  ──▶  useCatalogStore()
                                              │
                                              ▼
                                       bundleStore  ──▶  useBundleStore()
                                              │
                                              ▼
                                       selectors.ts  (pure functions over catalog + selections)
```

### Pricing Model

Each product has a `discount` percentage (e.g. `22` for 22% off). The variant's `price` is the **base/original price**, and the actual sale price is computed as `price * (1 - discount / 100)`. Savings are derived from `price * discount / 100 * quantity`.

## Key Features

- **4-step accordion** — Cameras → Plan → Sensors → Extra Protection, step 1 expanded on load
- **Variant switching** — products with multiple colors show an image-based selector; switching preserves each variant's quantity independently
- **Plan exclusivity** — selecting one plan zeros out the others (enforced in the store)
- **Locked items** — Sense Hub has `locked: true`, `minQuantity: 1`, `maxQuantity: 1`, rendering a disabled stepper
- **Live review panel** — grouped by category, quantities stay in sync in both directions
- **localStorage persistence** — explicit "Save my system for later" saves/restores the full configuration
- **Loading & error states** — skeleton shown during fetch, retry button on error
- **Scroll-to-step** — expanding an accordion step auto-scrolls it into view (instant jump on expand + smooth correction after panel animation finishes)
- **Responsive** — builder and review panel stack vertically on narrow screens

## Decisions & Tradeoffs

- **Zustand over Red Toolkit / Context** — Zustand's selector-based subscriptions avoid re-render cascading without the boilerplate of Redux or the manual scoping of Context+useReducer.
- **Explicit save over auto-persist** — the spec asks for "Save my system for later," so the save is explicit. The `persist` middleware was intentionally avoided to keep the save interaction visible and intentional.
- **Computed totals** — all pricing is derived from unit price × quantity × discount at read time, rather than stored. This guarantees the review panel and product cards never display stale or mismatched numbers.
- **Async catalog fetch** — the catalog is fetched from `/bundle-data.json` at startup rather than statically imported, so loading/error states are handled properly. The same JSON is copied to `public/` during development and can be swapped for a real backend endpoint later.
- **Catalog / selections separation** — catalog data lives in its own store (read-only), while user selections live in the bundle store. This keeps the data-access layer swappable without touching any component logic.
- **Required Sense Hub** — modeled as `locked: true, minQuantity: 1, maxQuantity: 1` on the variant, which disables the stepper. This avoids special-case logic in components.
- **Images** — variant and product images use placeholder paths (`/assets/products/*.png`). Swap in real assets when available.
- **Font** — the app expects Gilroy (`.ttf` files in `public/fonts/`). Falls back to system fonts if not present.
