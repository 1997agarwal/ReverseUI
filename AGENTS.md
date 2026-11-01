# AGENTS.md — Agent System Architecture & Operating Manual

## 1. Project Mission & Invariants

**ReverseUI** is a 100% client-side web application inspired by `morluto/rea` (Reverse Engineer Anything). It deconstructs raw HTML/CSS snippets, minified DOM trees, or CSS animations, extracts design tokens and motion physics, and decompiles them into clean, idiomatic React 18 + Tailwind CSS + Framer Motion components.

### Core Non-Negotiables:
1. **$0/mo Forever (Zero Backend Costs)**: Must run 100% in the browser (client-side DOMParser, Redmean color distance, analytical spring solver) and deploy statically to GitHub Pages.
2. **Instant Gratification**: All 4 showcase presets (Linear Command Palette, Stripe Radiant Card, Apple Dynamic Island, Vercel Sliding Navbar) must work offline and load with 0 external API keys.
3. **High-Fidelity Code Output**: Emits human-grade TypeScript JSX, never machine-garbled output.
4. **Constitutional Parity**: Preserve and synchronize `AGENTS.md`, `CLAUDE.md`, `ROADMAP.md`, `CONTRIBUTING.md`, `README.md`, and `LICENSE`.

---

## 2. The 4-Stage REA Reverse-Engineering Architecture

```
[Raw HTML/CSS or Minified DOM]
            │
            ▼
┌──────────────────────────────────────────────┐
│  Engine 1: AST Ingestion & DOM Normalizer    │
│  - Browser-native DOMParser                  │
│  - Flattens redundant single-child <div>s    │
│  - Inters semantic HTML5 tags (nav, button)  │
└──────────────────────┬───────────────────────┘
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
┌──────────────────────┐ ┌───────────────────────────────┐
│ Engine 2: Token &    │ │ Engine 3: Motion & Physics    │
│ Boundary Extractor   │ │ Decompiler                    │
│ - Euclidean RGB Dist │ │ - Cubic-Bezier Solver         │
│ - Typography Matrix  │ │ - Spring Physics (k, c, m, ζ) │
│ - Elevation & Radius │ │ - Tailwind Motion Classes     │
└──────────┬───────────┘ └───────────────┬───────────────┘
           │                             │
           └──────────┬──────────────────┘
                      ▼
┌──────────────────────────────────────────────┐
│  Engine 4: Semantic JSX Synthesizer          │
│  - Merges styles to Tailwind utilities       │
│  - Framer Motion whileHover/whileTap         │
│  - Formatted, linted TypeScript JSX output   │
└──────────────────────────────────────────────┘
```

### Module Responsibilities:
- `src/lib/domIngestor.ts`: Parses HTML with `<style>` tags, extracts stylesheet rules into base and `:hover` lookups, un-nests single-child passthrough wrappers, and infers semantic HTML5 elements.
- `src/lib/tailwindPalette.ts`: Complete RGB lookup dictionary for Tailwind CSS (shades 50–950 across all standard hues).
- `src/lib/tokenExtractor.ts`: Performs redmean Euclidean distance matching to map hex/rgb/hsl to standard Tailwind tokens; extracts typography scale, border radii, shadows, and blurs.
- `src/lib/motionDecompiler.ts`: Analytical solver translating `cubic-bezier(x1, y1, x2, y2)` curves and duration into Framer Motion spring physics (`stiffness`, `damping`, `mass`, damping ratio $\zeta$, overshoot).
- `src/lib/jsxSynthesizer.ts`: Emits idiomatic React 18 JSX with `className="..."`, Framer Motion tags, and sanitized attributes.
- `src/lib/reverseEngine.ts`: Facade uniting Engines 1–4 into an aggregate result with benchmark statistics.

---

## 3. Engineering Guidelines for AI Agents

1. **Strict TypeScript**: Do not use `any` unless absolutely necessary for external DOM APIs. All AST nodes, colors, and motion physics must be strictly typed.
2. **Deterministic Outputs**: Token extraction and spring solving must be analytical and deterministic. Avoid pseudo-random approximations.
3. **No External Network Dependencies in Engine**: The decompiler must never make runtime fetch requests for conversion. It runs synchronously in <5ms.
4. **Verification**: Always run `npm test` and `npm run build` after making modifications to ensure 100% test pass rate and static bundle generation.
