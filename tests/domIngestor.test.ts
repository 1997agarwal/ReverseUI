import { describe, it, expect } from 'vitest';
import {
  ingestSnippet,
  parseStyleString,
  parseCssStylesheet,
  inferSemanticTag,
  flattenRedundantWrappers,
  NormalizedNode,
} from '../src/lib/domIngestor';

describe('Engine 1: AST Ingestion & DOM Normalizer', () => {
  it('parses inline style strings correctly', () => {
    const styles = parseStyleString('background-color: #0f172a; padding: 12px; font-weight: 600;');
    expect(styles['background-color']).toBe('#0f172a');
    expect(styles['padding']).toBe('12px');
    expect(styles['font-weight']).toBe('600');
  });

  it('separates regular CSS rules and :hover rules', () => {
    const css = `
      .card { background-color: #000; }
      .card:hover { background-color: #333; transform: scale(1.02); }
    `;
    const { baseRules, hoverRules } = parseCssStylesheet(css);
    expect(baseRules.get('.card')?.['background-color']).toBe('#000');
    expect(hoverRules.get('.card')?.['transform']).toBe('scale(1.02)');
  });

  it('infers semantic tags from roles and classes', () => {
    expect(inferSemanticTag('div', { role: 'button' }, {}).tagName).toBe('button');
    expect(inferSemanticTag('div', { role: 'navigation' }, {}).tagName).toBe('nav');
    expect(inferSemanticTag('div', { class: 'navbar-container' }, {}).tagName).toBe('nav');
    expect(inferSemanticTag('div', { class: 'status-badge' }, {}).tagName).toBe('span');
    expect(inferSemanticTag('div', { role: 'banner' }, {}).tagName).toBe('header');
  });

  it('flattens redundant single-child wrapper divs with no styles or IDs', () => {
    const childNode: NormalizedNode = {
      id: 'node_2',
      tagName: 'button',
      originalTagName: 'button',
      isSemanticConverted: false,
      attributes: {},
      inlineStyles: { padding: '8px' },
      matchedStyles: {},
      hoverStyles: {},
      textContent: 'Click me',
      children: [],
      isSvg: false,
    };

    const wrapperNode: NormalizedNode = {
      id: 'node_1',
      tagName: 'div',
      originalTagName: 'div',
      isSemanticConverted: false,
      attributes: {},
      inlineStyles: {},
      matchedStyles: {},
      hoverStyles: {},
      children: [childNode],
      isSvg: false,
    };

    const flattened = flattenRedundantWrappers(wrapperNode);
    expect(flattened.tagName).toBe('button');
    expect(flattened.textContent).toBe('Click me');
  });

  it('ingests full snippet with <style> and HTML', () => {
    const snippet = `
      <style>
        .box { background-color: #0f172a; padding: 16px; border-radius: 8px; }
      </style>
      <div class="box">
        <div role="button" class="btn">Confirm</div>
      </div>
    `;
    const result = ingestSnippet(snippet);
    expect(result.rootNodes).toHaveLength(1);
    expect(result.rootNodes[0].children[0].tagName).toBe('button');
    expect(result.cssRules.get('.box')?.['background-color']).toBe('#0f172a');
  });
});
