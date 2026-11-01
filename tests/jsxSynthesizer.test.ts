import { describe, it, expect } from 'vitest';
import { synthesizeComponent, cssStylesToTailwind, formatJsxAttributes } from '../src/lib/jsxSynthesizer';
import { NormalizedNode } from '../src/lib/domIngestor';

describe('Engine 4: Semantic JSX Synthesizer', () => {
  it('converts CSS declarations to Tailwind classes', () => {
    const styles = {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'space-between',
      'background-color': '#0f172a',
      color: '#ffffff',
      'border-radius': '12px',
      padding: '16px',
    };
    const classes = cssStylesToTailwind(styles);
    expect(classes).toContain('flex');
    expect(classes).toContain('items-center');
    expect(classes).toContain('justify-between');
    expect(classes).toContain('bg-slate-900');
    expect(classes).toContain('text-white');
    expect(classes).toContain('rounded-xl');
    expect(classes).toContain('p-4');
  });

  it('formats JSX attributes properly (className, strokeWidth, etc.)', () => {
    const raw = {
      class: 'btn-primary',
      'stroke-width': '2',
      for: 'username',
      viewbox: '0 0 24 24',
    };
    const formatted = formatJsxAttributes(raw);
    expect(formatted.className).toBe('btn-primary');
    expect(formatted.strokeWidth).toBe('2');
    expect(formatted.htmlFor).toBe('username');
    expect(formatted.viewBox).toBe('0 0 24 24');
  });

  it('synthesizes clean React 18 component with Framer Motion when hover transition exists', () => {
    const testNode: NormalizedNode = {
      id: 'node_1',
      tagName: 'button',
      originalTagName: 'button',
      isSemanticConverted: false,
      attributes: { class: 'submit-btn' },
      inlineStyles: {
        'background-color': '#3b82f6',
        color: '#ffffff',
        padding: '10px 20px',
        'border-radius': '8px',
        transition: 'all 0.2s ease',
      },
      matchedStyles: {},
      hoverStyles: {
        transform: 'scale(1.05)',
      },
      textContent: 'Submit Form',
      children: [],
      isSvg: false,
    };

    const result = synthesizeComponent([testNode], 'transition: all 0.2s ease;', 'SubmitButton');
    expect(result.componentName).toBe('SubmitButton');
    expect(result.hasFramerMotion).toBe(true);
    expect(result.code).toContain("import { motion } from 'framer-motion';");
    expect(result.code).toContain('<motion.button');
    expect(result.code).toContain('whileHover={{ scale: 1.05 }}');
    expect(result.code).toContain('Submit Form');
  });
});
