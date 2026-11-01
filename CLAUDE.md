# CLAUDE.md — Developer Reference & Architecture Guide

## Build & Test Commands
```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Run Vitest unit tests
npm test

# Build production static bundle for GitHub Pages
npm run build

# Preview production build locally
npm run preview
```

---

## Architectural Invariants
- **Vite Base Path**: Configured as `base: '/ReverseUI/'` in `vite.config.ts` for GitHub Pages static deployment at `https://1997agarwal.github.io/ReverseUI/`.
- **Zero Server Overhead**: The entire AST decompiler runs synchronously in the browser using web standards (`DOMParser`, `Canvas`/`SVG`, `performance.now()`).
- **Color Quantization**: Uses the Redmean Euclidean color distance formula to accurately map human perceptual color differences between RGB colors and Tailwind CSS palettes.
- **Spring Physics**: Solves $\zeta$ (damping ratio) and $\omega_n$ (natural frequency) from cubic-bezier curves to derive `stiffness`, `damping`, and `mass` for Framer Motion.

---

## Directory Structure
```
ReverseUI/
├── .github/workflows/
│   └── deploy.yml              # Automated GitHub Pages static build & deploy
├── src/
│   ├── lib/
│   │   ├── tailwindPalette.ts  # Standard Tailwind color definitions & RGB values
│   │   ├── tokenExtractor.ts   # Engine 2: Color quantization & typography matrix
│   │   ├── motionDecompiler.ts # Engine 3: Cubic-bezier to spring physics solver
│   │   ├── domIngestor.ts      # Engine 1: AST ingestion & semantic tag normalizer
│   │   ├── jsxSynthesizer.ts   # Engine 4: React 18 + Tailwind JSX synthesizer
│   │   ├── presets.ts          # 4 Showcase presets (Linear, Stripe, Apple, Vercel)
│   │   └── reverseEngine.ts    # Main pipeline coordinating Engines 1–4
│   ├── components/
│   │   ├── Header.tsx          # Top bar with preset selector & actions
│   │   ├── BookmarkletModal.tsx# 1-click browser bookmarklet grabber
│   │   ├── InputPanel.tsx      # Column 1: Code editor & preset toolbar
│   │   ├── LiveSandbox.tsx     # Column 2: Isolated iframe preview & viewport toggles
│   │   ├── CodeOutputTab.tsx   # Tab A: PrismJS highlighted React 18 JSX output
│   │   ├── TokensTab.tsx       # Tab B: Extracted design tokens & color chips
│   │   ├── MotionPhysicsTab.tsx# Tab C: Interactive Bezier curve & spring testbed
│   │   ├── EvidencePanel.tsx   # Column 3: Tabbed evidence container
│   │   └── StatsBar.tsx        # Bottom latency & compression stats footer
│   ├── App.tsx                 # Studio orchestrator & 3-column responsive layout
│   ├── main.tsx                # React root mount
│   └── index.css               # Tailwind directives & developer studio scrollbars
├── tests/
│   ├── tokenExtractor.test.ts  # Color quantization & token tests
│   ├── motionDecompiler.test.ts# Bezier & spring physics solver tests
│   ├── domIngestor.test.ts     # AST normalization & wrapper flattening tests
│   ├── jsxSynthesizer.test.ts  # JSX code emission tests
│   └── reverseEngine.test.ts   # End-to-end preset integration tests
├── AGENTS.md
├── CLAUDE.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── README.md
├── LICENSE
└── vite.config.ts
```
