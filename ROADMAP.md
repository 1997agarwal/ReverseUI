# ReverseUI Roadmap 🔍

**Vision:** "Reverse Engineer Any Web Experience into Clean React + Tailwind"

---

## 🚀 Phase 1: Core 4-Stage REA Engine (Shipped ✅)
- [x] **Engine 1: AST Ingestion & DOM Normalizer**:
  - Browser-native `DOMParser` with `<style>` stylesheet extraction.
  - Flattens redundant single-child passthrough `<div>` wrappers.
  - Semantic tag reconstruction (`<button>`, `<input>`, `<nav>`, `<aside>`, `<header>`, `<footer>`, `<search>`).
- [x] **Engine 2: Design Token & Boundary Extractor**:
  - Redmean Euclidean distance color quantization against the standard Tailwind CSS palette.
  - Preserves alpha/opacity channels (e.g. `bg-slate-900/50`).
  - Typography matrix (font sizes, weights, line heights, letter spacings).
  - Elevation & radius tokens (`rounded-*`, `shadow-*`, `backdrop-blur-*`).
- [x] **Engine 3: Motion & Physics Decompiler**:
  - Analytical cubic-bezier solver with peak overshoot detection.
  - Framer Motion spring physics calculator (`stiffness`, `damping`, `mass`, $\zeta$).
  - Tailwind animation & transition utility class mapper.
- [x] **Engine 4: Semantic JSX Synthesizer**:
  - Emits clean, linted React 18 TypeScript JSX.
  - Auto-detects hover transforms and generates `whileHover={{ scale: ... }}` and `whileTap={{ scale: ... }}`.
  - Sanitizes JSX attributes (`class` → `className`, SVG camelCase properties).

---

## 🎨 Phase 2: Interactive Studio & Showcase Presets (Shipped ✅)
- [x] **3-Column / Tabbed Studio Layout**:
  - Column 1: Raw code editor with file upload, clipboard paste, and preset quick toolbar.
  - Column 2: Isolated iframe Live Sandbox with Mobile (375px), Tablet (768px), and Desktop (100%) viewport toggles, alignment grid, and light/dark canvas.
  - Column 3: Tabbed evidence panel with PrismJS code highlighting, interactive design token chips, and motion physics curve inspector.
- [x] **4 Ready-to-Test Showcase Presets**:
  - Linear Command Palette
  - Stripe Radiant Card
  - Apple Dynamic Island
  - Vercel Sliding Navigation Bar
- [x] **1-Click Browser Bookmarklet**:
  - Captures any inspected element on any webpage and loads it directly into ReverseUI via URL query parameters.
- [x] **$0/mo Static GitHub Pages Deployment**:
  - Automated CI/CD workflow via `.github/workflows/deploy.yml`.

---

## 🔮 Phase 3: Advanced Tokens & Component Flavors (Upcoming)
- [ ] **Shadcn/UI & Radix Primitive Export**:
  - Option to generate code configured with `@/components/ui/...` primitives.
- [ ] **Framer Motion Layout Animations**:
  - Detect magnetic tab sliding indicators and emit `layoutId="..."` for shared layout animations.
- [ ] **Tokens Studio / Figma JSON Export**:
  - 1-click export of extracted design tokens into standard Figma Tokens / W3C Design Tokens JSON format.

---

## 🌐 Phase 4: Browser Extension & Chrome DevTools Side-Panel (Future)
- [ ] **ReverseUI Chrome Extension**:
  - Right-click element → "Decompile into React + Tailwind".
  - Inspect computed styles and keyframes directly within Chrome DevTools.
- [ ] **SVG to Lucide / Heroicon Matcher**:
  - Vector similarity search mapping inline SVG path definitions to standard Lucide React icons.
