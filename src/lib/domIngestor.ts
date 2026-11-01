export interface NormalizedNode {
  id: string;
  tagName: string;
  originalTagName: string;
  isSemanticConverted: boolean;
  attributes: Record<string, string>;
  inlineStyles: Record<string, string>;
  matchedStyles: Record<string, string>;
  hoverStyles: Record<string, string>;
  textContent?: string;
  children: NormalizedNode[];
  isSvg: boolean;
}

export interface IngestedResult {
  rootNodes: NormalizedNode[];
  extractedCss: string;
  cssRules: Map<string, Record<string, string>>;
  hoverRules: Map<string, Record<string, string>>;
  keyframesCss: string[];
}

/**
 * Parses a style attribute string (e.g. "background-color: #fff; padding: 10px") into a map
 */
export function parseStyleString(styleStr: string): Record<string, string> {
  const styles: Record<string, string> = {};
  if (!styleStr) return styles;

  const declarations = styleStr.split(';');
  for (const decl of declarations) {
    const colonIdx = decl.indexOf(':');
    if (colonIdx !== -1) {
      const prop = decl.slice(0, colonIdx).trim().toLowerCase();
      const val = decl.slice(colonIdx + 1).trim();
      if (prop && val) {
        styles[prop] = val;
      }
    }
  }
  return styles;
}

/**
 * Extracts and parses CSS stylesheet rules, separating base rules, :hover rules, and keyframes
 */
export function parseCssStylesheet(cssText: string): {
  baseRules: Map<string, Record<string, string>>;
  hoverRules: Map<string, Record<string, string>>;
  keyframes: string[];
} {
  const baseRules = new Map<string, Record<string, string>>();
  const hoverRules = new Map<string, Record<string, string>>();
  const keyframes: string[] = [];

  // Extract @keyframes
  const kfRegex = /@keyframes\s+([^{]+)\{([\s\S]+?\}\s*)\}/g;
  let kfMatch;
  while ((kfMatch = kfRegex.exec(cssText)) !== null) {
    keyframes.push(kfMatch[0]);
  }

  // Remove comments
  const cleanCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

  // Match regular rules
  const ruleRegex = /([^{}@]+)\{([^}]+)\}/g;
  let ruleMatch;
  while ((ruleMatch = ruleRegex.exec(cleanCss)) !== null) {
    const rawSelector = ruleMatch[1].trim();
    const body = ruleMatch[2].trim();
    if (!rawSelector || rawSelector.startsWith('@')) continue;

    const styles = parseStyleString(body);
    const selectors = rawSelector.split(',').map(s => s.trim());

    for (const sel of selectors) {
      if (sel.includes(':hover')) {
        const baseSel = sel.replace(/:hover/g, '').trim();
        const existing = hoverRules.get(baseSel) || {};
        hoverRules.set(baseSel, { ...existing, ...styles });
      } else {
        const existing = baseRules.get(sel) || {};
        baseRules.set(sel, { ...existing, ...styles });
      }
    }
  }

  return { baseRules, hoverRules, keyframes };
}

/**
 * Reconstructs semantic HTML5 tags from generic div/span with roles or characteristic classnames
 */
export function inferSemanticTag(
  currentTag: string,
  attrs: Record<string, string>,
  styles: Record<string, string>
): { tagName: string; converted: boolean } {
  const tag = currentTag.toLowerCase();
  const role = (attrs.role || '').toLowerCase();
  const className = (attrs.class || attrs.className || '').toLowerCase();

  // If already a specific semantic tag, preserve it
  const preservedTags = new Set([
    'button', 'input', 'nav', 'header', 'footer', 'aside', 'section',
    'article', 'main', 'form', 'textarea', 'select', 'label', 'a',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'ul', 'ol', 'li',
    'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'kbd', 'code', 'pre'
  ]);

  if (preservedTags.has(tag)) {
    return { tagName: tag, converted: false };
  }

  // Role-based inferences
  if (role === 'button' || className.includes('btn') || className.includes('button')) {
    return { tagName: 'button', converted: true };
  }
  if (role === 'navigation' || className.includes('navbar') || className.includes('nav-bar')) {
    return { tagName: 'nav', converted: true };
  }
  if (role === 'banner' || className.includes('header') || className.includes('app-header')) {
    return { tagName: 'header', converted: true };
  }
  if (role === 'contentinfo' || className.includes('footer')) {
    return { tagName: 'footer', converted: true };
  }
  if (role === 'complementary' || className.includes('sidebar') || className.includes('aside')) {
    return { tagName: 'aside', converted: true };
  }
  if (role === 'search' || className.includes('search-bar')) {
    return { tagName: 'search', converted: true };
  }
  if (className.includes('badge') || className.includes('chip') || className.includes('pill') || className.includes('tag')) {
    return { tagName: 'span', converted: true };
  }

  // Cursor pointer detection for clickable divs
  if (styles.cursor === 'pointer' && !role && !className.includes('card')) {
    return { tagName: 'button', converted: true };
  }

  return { tagName: tag, converted: false };
}

/**
 * Flattens redundant single-child wrapper divs
 */
export function flattenRedundantWrappers(node: NormalizedNode): NormalizedNode {
  // Recursively flatten children first
  node.children = node.children.map(flattenRedundantWrappers);

  // Check if current node is a redundant wrapper
  if (
    node.tagName === 'div' &&
    node.children.length === 1 &&
    (!node.textContent || node.textContent.trim() === '')
  ) {
    const child = node.children[0];
    const hasInlineStyles = Object.keys(node.inlineStyles).length > 0;
    const hasMatchedStyles = Object.keys(node.matchedStyles).length > 0;
    const hasId = Boolean(node.attributes.id);
    const hasMeaningfulClasses = Boolean(
      node.attributes.class &&
      !['wrapper', 'wrap', 'container-wrapper', 'inner-wrap'].includes(node.attributes.class.trim())
    );

    // If wrapper has no distinct styling or identification, unwrap it
    if (!hasInlineStyles && !hasMatchedStyles && !hasId && !hasMeaningfulClasses) {
      return child;
    }
  }

  return node;
}

/**
 * Main DOM Ingestion function
 */
export function ingestSnippet(rawSnippet: string): IngestedResult {
  let htmlContent = rawSnippet;
  let extractedCss = '';

  // Extract <style> tags
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let styleMatch;
  while ((styleMatch = styleTagRegex.exec(rawSnippet)) !== null) {
    extractedCss += `\n${styleMatch[1]}`;
  }
  htmlContent = htmlContent.replace(styleTagRegex, '').trim();

  // Also check if raw CSS was appended or standalone
  const { baseRules, hoverRules, keyframes } = parseCssStylesheet(extractedCss);

  // Browser-native or jsdom DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Find root elements in body
  const bodyChildren = Array.from(doc.body.children);
  let idCounter = 1;

  function convertElement(el: Element): NormalizedNode {
    const originalTagName = el.tagName.toLowerCase();
    const isSvg = el instanceof SVGElement || originalTagName === 'svg' || el.closest('svg') !== null;

    // Attributes
    const attributes: Record<string, string> = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      attributes[attr.name] = attr.value;
    }

    const inlineStyleStr = el.getAttribute('style') || '';
    const inlineStyles = parseStyleString(inlineStyleStr);

    // Match CSS rules by class, id, tag
    const matchedStyles: Record<string, string> = {};
    const hoverStyles: Record<string, string> = {};

    // Match tag
    if (baseRules.has(originalTagName)) {
      Object.assign(matchedStyles, baseRules.get(originalTagName));
    }
    if (hoverRules.has(originalTagName)) {
      Object.assign(hoverStyles, hoverRules.get(originalTagName));
    }

    // Match classes
    const classes = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean);
    for (const c of classes) {
      const dotClass = `.${c}`;
      if (baseRules.has(dotClass)) {
        Object.assign(matchedStyles, baseRules.get(dotClass));
      }
      if (hoverRules.has(dotClass)) {
        Object.assign(hoverStyles, hoverRules.get(dotClass));
      }
    }

    // Match ID
    const elId = el.getAttribute('id');
    if (elId) {
      const hashId = `#${elId}`;
      if (baseRules.has(hashId)) {
        Object.assign(matchedStyles, baseRules.get(hashId));
      }
      if (hoverRules.has(hashId)) {
        Object.assign(hoverStyles, hoverRules.get(hashId));
      }
    }

    const mergedStyles = { ...matchedStyles, ...inlineStyles };

    // Infer semantic tag if not SVG
    const { tagName, converted } = isSvg
      ? { tagName: originalTagName, converted: false }
      : inferSemanticTag(originalTagName, attributes, mergedStyles);

    // Children
    const children: NormalizedNode[] = [];
    for (const childEl of Array.from(el.children)) {
      children.push(convertElement(childEl));
    }

    // Get direct text content if no element children or simple text
    let directText: string | undefined = undefined;
    if (children.length === 0) {
      directText = el.textContent?.trim() || undefined;
    } else {
      // Direct child text nodes
      const textNodes: string[] = [];
      el.childNodes.forEach(cn => {
        if (cn.nodeType === Node.TEXT_NODE && cn.textContent?.trim()) {
          textNodes.push(cn.textContent.trim());
        }
      });
      if (textNodes.length > 0) {
        directText = textNodes.join(' ');
      }
    }

    const node: NormalizedNode = {
      id: `node_${idCounter++}`,
      tagName,
      originalTagName,
      isSemanticConverted: converted,
      attributes,
      inlineStyles,
      matchedStyles,
      hoverStyles,
      textContent: directText,
      children,
      isSvg,
    };

    return node;
  }

  let rootNodes: NormalizedNode[] = [];
  if (bodyChildren.length > 0) {
    rootNodes = bodyChildren.map(el => flattenRedundantWrappers(convertElement(el)));
  } else if (doc.body.textContent?.trim()) {
    // If only text was passed
    rootNodes = [
      {
        id: `node_${idCounter++}`,
        tagName: 'span',
        originalTagName: 'span',
        isSemanticConverted: false,
        attributes: {},
        inlineStyles: {},
        matchedStyles: {},
        hoverStyles: {},
        textContent: doc.body.textContent.trim(),
        children: [],
        isSvg: false,
      },
    ];
  }

  return {
    rootNodes,
    extractedCss,
    cssRules: baseRules,
    hoverRules,
    keyframesCss: keyframes,
  };
}
