import { describe, it, expect } from 'vitest';
import { reverseEngineerSnippet } from '../src/lib/reverseEngine';
import { SHOWCASE_PRESETS } from '../src/lib/presets';

describe('ReverseUI End-to-End Engine Pipeline', () => {
  it('processes all 4 showcase presets without errors', () => {
    for (const preset of SHOWCASE_PRESETS) {
      const result = reverseEngineerSnippet(preset.rawSnippet);
      expect(result.jsx.code).toBeDefined();
      expect(result.jsx.code).toContain('export default function ReversedComponent()');
      expect(result.tokens.colors.length).toBeGreaterThan(0);
      expect(result.tokens.radii.length).toBeGreaterThan(0);
      expect(result.motion.spring).toBeDefined();
      expect(result.stats.nodeCount).toBeGreaterThan(0);
    }
  });

  it('decompiles Linear Command Palette preset accurately', () => {
    const linearPreset = SHOWCASE_PRESETS.find(p => p.id === 'linear-command-palette')!;
    const result = reverseEngineerSnippet(linearPreset.rawSnippet);

    expect(result.tokens.shadows.length).toBeGreaterThan(0);
    expect(result.motion.bezier.x1).toBeCloseTo(0.16, 2);
    expect(result.jsx.code).toContain('backdrop-blur');
    expect(result.stats.semanticTagsInferred).toBeGreaterThanOrEqual(1);
  });

  it('decompiles Stripe Radiant Card preset accurately', () => {
    const stripePreset = SHOWCASE_PRESETS.find(p => p.id === 'stripe-radiant-card')!;
    const result = reverseEngineerSnippet(stripePreset.rawSnippet);

    expect(result.tokens.colors.some(c => c.token.includes('indigo') || c.token.includes('slate'))).toBe(true);
    expect(result.motion.spring.overshootPct).toBeGreaterThan(0);
  });
});
