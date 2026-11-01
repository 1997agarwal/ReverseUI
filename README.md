# ReverseUI 🔍

> **"Reverse Engineer Any Web Experience into Clean React + Tailwind"**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-0ea5e9?style=for-the-badge&logo=github)](https://1997agarwal.github.io/ReverseUI/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Server Cost](https://img.shields.io/badge/Server%20Cost-%240%2Fmo%20Forever-10b981?style=for-the-badge)](https://1997agarwal.github.io/ReverseUI/)
[![Stack](https://img.shields.io/badge/Stack-React%2018%20%2B%20Tailwind%20%2B%20Framer%20Motion-6366f1?style=for-the-badge)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-Vitest%20100%25%20Passing-emerald?style=for-the-badge)](https://vitest.dev/)

**ReverseUI** is a 100% client-side web application inspired by `morluto/rea` (Reverse Engineer Anything). It deconstructs any web UI snippet, minified DOM structure, or CSS animation, extracts its design tokens and motion physics, and decompiles it into clean, idiomatic **React 18 + Tailwind CSS + Framer Motion** components in under 5ms.

---

## ⚡ Key Highlights & Core Invariants

- **Zero Server Costs ($0/mo Forever)**: Runs 100% in the browser using web standards (`DOMParser`, `Canvas`/`SVG`, `performance.now()`) and deploys statically to GitHub Pages.
- **Instant Gratification**: 4 ready-to-test showcase presets (Linear, Stripe, Apple, Vercel) load immediately on page load with 0 external API keys.
- **4-Stage REA Architecture**: Dedicated decompiler engines for DOM Normalization, Token Quantization, Spring Motion Translation, and Semantic JSX Synthesis.
- **High-Fidelity Code Output**: Emits human-grade TypeScript JSX with automatic hover/focus physics and clean attribute sanitization.
- **1-Click Browser Bookmarklet**: Capture any button, card, modal, or navigation bar on any website and send it directly to ReverseUI for immediate decompilation.

---

## 🏗 The 4-Stage REA Reverse-Engineering Architecture

```
[Raw HTML/CSS Snippet or Minified DOM]
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Engine 1: AST Ingestion & DOM Normalizer               │
│  - Browser-native DOMParser                             │
│  - Flattens redundant single-child wrapper <div>s       │
│  - Inters semantic HTML5 tags (<button>, <nav>, etc.)   │
└────────────────────────────┬────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│ Engine 2: Design Token &  │ │ Engine 3: Motion &        │
│ Boundary Extractor        │ │ Physics Decompiler        │
│ - Euclidean RGB Distance  │ │ - Solves cubic-bezier     │
│ - Typography Matrix       │ │ - Framer Motion spring    │
│ - Elevation & Radius      │ │   physics (k, c, m, ζ)    │
└─────────────┬─────────────┘ └─────────────┬─────────────┘
              │                             │
              └──────────────┬──────────────┘
                             ▼
┌─────────────────────────────────────────────────────────┐
│  Engine 4: Semantic JSX Synthesizer                     │
│  - Merges CSS rules into unified Tailwind classes       │
│  - Generates whileHover / whileTap Framer Motion props  │
│  - Emits formatted, linted React 18 TypeScript code     │
└─────────────────────────────────────────────────────────┘
```

### Engine 1: AST Ingestion & DOM Normalizer (`src/lib/domIngestor.ts`)
- Uses browser-native `DOMParser` to parse HTML snippets and `<style>` blocks.
- Separates CSS rules into base styles and `:hover` pseudo-class dictionaries.
- Un-nests and flattens redundant single-child passthrough `<div>`s that carry no distinct styles.
- Reconstructs semantic tags (`<button>`, `<input>`, `<nav>`, `<aside>`, `<header>`, `<footer>`, `<search>`) from generic `div[role="..."]` or class markers.

### Engine 2: Design Token & Boundary Extractor (`src/lib/tokenExtractor.ts`)
- **Color Quantization**: Parses hex, rgb, rgba, and hsl color values; computes Redmean Euclidean distance to the standard Tailwind CSS color palette (e.g. `#0f172a` → `slate-900`), preserving alpha channels (`slate-900/50`).
- **Typography Matrix**: Detects font size, weight, line-height, and letter-spacing, converting to Tailwind typography utilities (`text-sm font-semibold tracking-tight`).
- **Elevation & Radius**: Computes `box-shadow` layers, `border-radius`, and `backdrop-filter: blur()`, outputting clean `shadow-*`, `rounded-*`, and `backdrop-blur-*` tokens.

### Engine 3: Motion & Physics Decompiler (`src/lib/motionDecompiler.ts`)
- Parses CSS `transition`, `animation`, and `@keyframes` blocks.
- Solves `cubic-bezier(x1, y1, x2, y2)` curves and translates them into:
  1. Equivalent Framer Motion spring physics (`stiffness`, `damping`, `mass`, damping ratio $\zeta$, overshoot percentage).
  2. Tailwind custom animation classes with duration and easing.

### Engine 4: Semantic JSX Synthesizer (`src/lib/jsxSynthesizer.ts`)
- Merges inline styles and CSS rules into unified Tailwind utility classes.
- Detects interactive hover/focus states and generates Framer Motion `whileHover={{ scale: 1.02 }}` or `hover:...` classes.
- Sanitizes JSX attributes (`class` → `className`, `for` → `htmlFor`, SVG camelCase properties).
- Returns formatted React 18 TypeScript component code with 1-click clipboard copy.

---

## 🎯 4 Showcase Presets (Ready-to-Test)

| Preset | Category | Key Decompiled Features |
|---|---|---|
| **Linear Command Palette** | Application UI | Backdrop blur (`backdrop-blur-lg`), subtle borders, `kbd` shortcut badges, semantic `<button>` inference. |
| **Stripe Radiant Card** | Marketing Card | Multi-stop gradient glow (`bg-gradient-to-br from-indigo-500/15 to-pink-500/15`), glassmorphism, spring physics. |
| **Apple Dynamic Island** | Motion Component | Smooth Apple spring curve (`cubic-bezier(0.16, 1, 0.3, 1)`), translating to `stiffness: 260`, `damping: 26`. |
| **Vercel Sliding Navbar** | Navigation | Magnetic tab pill indicator, dark-mode borders, semantic `<nav>` conversion. |

---

## 🖥 3-Column Studio Experience

- **Column 1: Input Studio**
  - Code editor for raw HTML/CSS input with line and character metrics.
  - 1-click preset selector buttons.
  - Snippet file upload and clipboard paste buttons.
  - Live auto-decompile toggle.
- **Column 2: Live Sandbox**
  - Isolated iframe sandbox ensuring zero CSS pollution and true rendering.
  - Viewport width controls: **Mobile (375px)**, **Tablet (768px)**, and **Desktop (100%)**.
  - Alignment grid toggle and Dark / Light canvas switcher.
- **Column 3: Decompiled Evidence & Output**
  - **Tab A (React 18 JSX)**: Syntax-highlighted clean TypeScript code with 1-click "Copy Code" and "Export .tsx" buttons.
  - **Tab B (Design Tokens)**: Interactive color swatch chips showing original color vs quantized Tailwind token, typography scale, border radii, and shadows.
  - **Tab C (Motion Physics)**: Interactive SVG cubic-bezier curve visualizer, solved spring parameters (`stiffness`, `damping`, `mass`), and side-by-side motion verification testbed.

---

## 🔖 1-Click Browser Bookmarklet

Capture any UI component while browsing any website:
1. Open ReverseUI and click **"Get Bookmarklet"**.
2. Drag the **"🔍 ReverseUI Inspector"** pill to your browser's bookmarks bar.
3. While browsing any website (Twitter, Linear, Stripe, Apple, etc.), hover over an interesting element and click the bookmarklet.
4. ReverseUI opens instantly with the extracted markup, tokens, and React code!

---

## 🚀 Quick Start & Local Development

```bash
# Clone the repository
git clone https://github.com/1997agarwal/ReverseUI.git
cd ReverseUI

# Install dependencies
npm install

# Start local dev server
npm run dev

# Run Vitest unit tests (all 5 engines)
npm test

# Build production bundle for GitHub Pages
npm run build
```

---

## 🧪 Testing & Verification

ReverseUI includes unit tests for every engine covering:
- Color parsing & quantization (hex, rgb, rgba, hsl, alpha channels)
- Typography matrix & sizing conversion
- Elevation, radius, and backdrop blur mapping
- Cubic-bezier curve sampling & spring physics calculation
- AST DOM parsing, wrapper flattening, and semantic tag inference
- End-to-end integration across all 4 showcase presets

```bash
$ npm test
 ✓ tests/motionDecompiler.test.ts (4 tests)
 ✓ tests/domIngestor.test.ts (5 tests)
 ✓ tests/tokenExtractor.test.ts (9 tests)
 ✓ tests/jsxSynthesizer.test.ts (3 tests)
 ✓ tests/reverseEngine.test.ts (3 tests)

 Test Files  5 passed (5)
      Tests  24 passed (24)
```

---

## 👤 Author

**Harshit Agarwal**  
*AI Product Manager & 0-to-1 Systems Builder*  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-181717?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/1997agarwal)
[![X](https://img.shields.io/badge/X-Follow_%401997agarwal-181717?style=flat-square&logo=x&logoColor=white)](https://x.com/1997agarwal)
[![GitHub](https://img.shields.io/badge/GitHub-Explore_Repos-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/1997agarwal)
[![Email](https://img.shields.io/badge/Email-Get_in_Touch-181717?style=flat-square&logo=gmail&logoColor=white)](mailto:agarwal.harshit97@gmail.com)

---

## 📄 License

MIT License — Copyright (c) 2026 Harshit Agarwal ([1997agarwal](https://github.com/1997agarwal)). See [LICENSE](./LICENSE) for details.
