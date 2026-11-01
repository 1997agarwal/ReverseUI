# Contributing to ReverseUI 🔍

Thank you for your interest in contributing to **ReverseUI**! We are committed to keeping ReverseUI 100% client-side, zero-cost forever, and blazing fast.

---

## 🛠 Local Development Setup

### Prerequisites
- Node.js >= 18 (Node 20+ recommended)
- npm >= 9

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/1997agarwal/ReverseUI.git
cd ReverseUI

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Run tests
npm test
```

---

## 🧩 How to Add a New Showcase Preset

All showcase presets live in `src/lib/presets.ts`. To add a new preset:
1. Define a new entry inside `SHOWCASE_PRESETS`:
```typescript
{
  id: 'my-custom-component',
  name: 'My Component Name',
  category: 'Card / Modal / Nav',
  badge: 'Key Feature',
  description: 'Detailed description of what makes this component interesting.',
  rawSnippet: `<style>...</style>\n<div class="...">...</div>`,
}
```
2. Run `npm test` to verify that `reverseEngine.test.ts` validates your new preset without errors.

---

## 📐 Coding Standards & Guidelines

1. **Client-Side Invariant**: Never add backend dependencies, telemetry, or server requirements. The app must run completely offline in the browser.
2. **TypeScript Strictness**: Keep types strict and avoid using `any`.
3. **Vitest Unit Tests**: Every change to an engine (`domIngestor`, `tokenExtractor`, `motionDecompiler`, `jsxSynthesizer`) must include unit test coverage in `tests/`.
4. **Git Commit Style**: Use Conventional Commits (`feat: ...`, `fix: ...`, `docs: ...`, `test: ...`).
