import { NormalizedNode } from './domIngestor';
import {
  quantizeColor,
  mapFontSize,
  mapFontWeight,
  mapLineHeight,
  mapLetterSpacing,
  mapBorderRadius,
  mapBoxShadow,
  mapBackdropBlur,
} from './tokenExtractor';
import { decompileMotion, DecompiledMotion } from './motionDecompiler';

export interface SynthesizedResult {
  code: string;
  componentName: string;
  hasFramerMotion: boolean;
  hasLucideIcons: boolean;
  decompiledMotions: DecompiledMotion[];
  allClassNames: string[];
}

/**
 * Maps pixel/rem dimension values to nearest Tailwind sizing scale
 */
export function mapSize(val: string, prefix: string): string {
  if (!val) return '';
  const clean = val.trim().toLowerCase();
  if (clean === '100%') return `${prefix}-full`;
  if (clean === '100vw') return `${prefix}-screen`;
  if (clean === '100vh') return `${prefix}-screen`;
  if (clean === 'auto') return `${prefix}-auto`;
  if (clean === 'fit-content' || clean === 'max-content') return `${prefix}-fit`;
  if (clean === 'min-content') return `${prefix}-min`;
  if (clean === '0' || clean === '0px') return `${prefix}-0`;

  const num = parseFloat(clean);
  const isRem = clean.endsWith('rem');
  const px = isRem ? num * 16 : num;

  if (px <= 2) return `${prefix}-0.5`;
  if (px <= 4) return `${prefix}-1`;
  if (px <= 6) return `${prefix}-1.5`;
  if (px <= 8) return `${prefix}-2`;
  if (px <= 10) return `${prefix}-2.5`;
  if (px <= 12) return `${prefix}-3`;
  if (px <= 14) return `${prefix}-3.5`;
  if (px <= 16) return `${prefix}-4`;
  if (px <= 20) return `${prefix}-5`;
  if (px <= 24) return `${prefix}-6`;
  if (px <= 28) return `${prefix}-7`;
  if (px <= 32) return `${prefix}-8`;
  if (px <= 36) return `${prefix}-9`;
  if (px <= 40) return `${prefix}-10`;
  if (px <= 48) return `${prefix}-12`;
  if (px <= 56) return `${prefix}-14`;
  if (px <= 64) return `${prefix}-16`;
  if (px <= 80) return `${prefix}-20`;
  if (px <= 96) return `${prefix}-24`;
  if (px <= 112) return `${prefix}-28`;
  if (px <= 128) return `${prefix}-32`;
  if (px <= 160) return `${prefix}-40`;
  if (px <= 192) return `${prefix}-48`;
  if (px <= 224) return `${prefix}-56`;
  if (px <= 256) return `${prefix}-64`;
  if (px <= 320) return `${prefix}-80`;
  if (px <= 384) return `${prefix}-96`;

  // Max width presets
  if (prefix === 'max-w') {
    if (px <= 384) return 'max-w-sm';
    if (px <= 448) return 'max-w-md';
    if (px <= 512) return 'max-w-lg';
    if (px <= 576) return 'max-w-xl';
    if (px <= 672) return 'max-w-2xl';
    if (px <= 768) return 'max-w-3xl';
    if (px <= 896) return 'max-w-4xl';
    if (px <= 1024) return 'max-w-5xl';
    if (px <= 1152) return 'max-w-6xl';
    if (px <= 1280) return 'max-w-7xl';
  }

  return `${prefix}-[${clean}]`;
}

/**
 * Translates CSS properties into clean Tailwind CSS utility classes
 */
export function cssStylesToTailwind(
  styles: Record<string, string>,
  prefix = ''
): string[] {
  const classes: string[] = [];
  const pfx = prefix ? `${prefix}:` : '';

  for (const [prop, rawVal] of Object.entries(styles)) {
    const val = rawVal.trim().toLowerCase();

    // Display
    if (prop === 'display') {
      if (val === 'flex') classes.push(`${pfx}flex`);
      else if (val === 'inline-flex') classes.push(`${pfx}inline-flex`);
      else if (val === 'grid') classes.push(`${pfx}grid`);
      else if (val === 'block') classes.push(`${pfx}block`);
      else if (val === 'inline-block') classes.push(`${pfx}inline-block`);
      else if (val === 'inline') classes.push(`${pfx}inline`);
      else if (val === 'none') classes.push(`${pfx}hidden`);
    }

    // Flexbox
    if (prop === 'flex-direction') {
      if (val === 'column') classes.push(`${pfx}flex-col`);
      else if (val === 'row') classes.push(`${pfx}flex-row`);
      else if (val === 'column-reverse') classes.push(`${pfx}flex-col-reverse`);
      else if (val === 'row-reverse') classes.push(`${pfx}flex-row-reverse`);
    }
    if (prop === 'align-items') {
      if (val === 'center') classes.push(`${pfx}items-center`);
      else if (val.includes('start')) classes.push(`${pfx}items-start`);
      else if (val.includes('end')) classes.push(`${pfx}items-end`);
      else if (val === 'stretch') classes.push(`${pfx}items-stretch`);
      else if (val === 'baseline') classes.push(`${pfx}items-baseline`);
    }
    if (prop === 'justify-content') {
      if (val === 'center') classes.push(`${pfx}justify-center`);
      else if (val === 'space-between') classes.push(`${pfx}justify-between`);
      else if (val.includes('start')) classes.push(`${pfx}justify-start`);
      else if (val.includes('end')) classes.push(`${pfx}justify-end`);
      else if (val === 'space-around') classes.push(`${pfx}justify-around`);
      else if (val === 'space-evenly') classes.push(`${pfx}justify-evenly`);
    }
    if (prop === 'flex-wrap') {
      if (val === 'wrap') classes.push(`${pfx}flex-wrap`);
      else if (val === 'nowrap') classes.push(`${pfx}flex-nowrap`);
    }

    // Gap
    if (prop === 'gap') {
      classes.push(`${pfx}${mapSize(val, 'gap')}`);
    }

    // Padding & Margin
    if (prop === 'padding') {
      const parts = val.split(/\s+/);
      if (parts.length === 1) {
        classes.push(`${pfx}${mapSize(parts[0], 'p')}`);
      } else if (parts.length === 2) {
        classes.push(`${pfx}${mapSize(parts[0], 'py')}`);
        classes.push(`${pfx}${mapSize(parts[1], 'px')}`);
      } else if (parts.length === 4) {
        classes.push(`${pfx}${mapSize(parts[0], 'pt')}`);
        classes.push(`${pfx}${mapSize(parts[1], 'pr')}`);
        classes.push(`${pfx}${mapSize(parts[2], 'pb')}`);
        classes.push(`${pfx}${mapSize(parts[3], 'pl')}`);
      }
    }
    if (prop === 'padding-left') classes.push(`${pfx}${mapSize(val, 'pl')}`);
    if (prop === 'padding-right') classes.push(`${pfx}${mapSize(val, 'pr')}`);
    if (prop === 'padding-top') classes.push(`${pfx}${mapSize(val, 'pt')}`);
    if (prop === 'padding-bottom') classes.push(`${pfx}${mapSize(val, 'pb')}`);

    if (prop === 'margin') {
      if (val === 'auto' || val === '0 auto') {
        classes.push(`${pfx}mx-auto`);
      } else {
        const parts = val.split(/\s+/);
        if (parts.length === 1) {
          classes.push(`${pfx}${mapSize(parts[0], 'm')}`);
        } else if (parts.length === 2) {
          classes.push(`${pfx}${mapSize(parts[0], 'my')}`);
          classes.push(parts[1] === 'auto' ? `${pfx}mx-auto` : `${pfx}${mapSize(parts[1], 'mx')}`);
        }
      }
    }
    if (prop === 'margin-top') classes.push(`${pfx}${mapSize(val, 'mt')}`);
    if (prop === 'margin-bottom') classes.push(`${pfx}${mapSize(val, 'mb')}`);
    if (prop === 'margin-left') classes.push(`${pfx}${mapSize(val, 'ml')}`);
    if (prop === 'margin-right') classes.push(`${pfx}${mapSize(val, 'mr')}`);

    // Dimensions
    if (prop === 'width') classes.push(`${pfx}${mapSize(val, 'w')}`);
    if (prop === 'height') classes.push(`${pfx}${mapSize(val, 'h')}`);
    if (prop === 'max-width') classes.push(`${pfx}${mapSize(val, 'max-w')}`);
    if (prop === 'min-width') classes.push(`${pfx}${mapSize(val, 'min-w')}`);
    if (prop === 'max-height') classes.push(`${pfx}${mapSize(val, 'max-h')}`);
    if (prop === 'min-height') classes.push(`${pfx}${mapSize(val, 'min-h')}`);

    // Colors
    if (prop === 'background-color') {
      const q = quantizeColor(val, 'bg');
      if (q.token !== 'transparent') classes.push(`${pfx}${q.tailwindClass}`);
    }
    if (prop === 'color') {
      const q = quantizeColor(val, 'text');
      if (q.token !== 'transparent') classes.push(`${pfx}${q.tailwindClass}`);
    }

    // Gradients
    if (prop === 'background' || prop === 'background-image') {
      if (val.includes('linear-gradient')) {
        let dir = 'to-r';
        if (val.includes('to bottom') || val.includes('180deg')) dir = 'to-b';
        else if (val.includes('to top')) dir = 'to-t';
        else if (val.includes('to bottom right') || val.includes('135deg')) dir = 'to-br';
        else if (val.includes('to top right') || val.includes('45deg')) dir = 'to-tr';
        classes.push(`${pfx}bg-gradient-${dir}`);

        const colorMatches = val.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/g);
        if (colorMatches && colorMatches.length >= 2) {
          const fromQ = quantizeColor(colorMatches[0], 'from');
          const toQ = quantizeColor(colorMatches[colorMatches.length - 1], 'to');
          classes.push(`${pfx}${fromQ.tailwindClass}`);
          if (colorMatches.length > 2) {
            const viaQ = quantizeColor(colorMatches[1], 'via');
            classes.push(`${pfx}${viaQ.tailwindClass}`);
          }
          classes.push(`${pfx}${toQ.tailwindClass}`);
        }
      }
    }

    // Typography
    if (prop === 'font-size') classes.push(`${pfx}${mapFontSize(val)}`);
    if (prop === 'font-weight') classes.push(`${pfx}${mapFontWeight(val)}`);
    if (prop === 'line-height') classes.push(`${pfx}${mapLineHeight(val)}`);
    if (prop === 'letter-spacing') classes.push(`${pfx}${mapLetterSpacing(val)}`);
    if (prop === 'text-align') {
      if (val === 'center') classes.push(`${pfx}text-center`);
      else if (val === 'right') classes.push(`${pfx}text-right`);
      else if (val === 'left') classes.push(`${pfx}text-left`);
    }

    // Borders & Radius
    if (prop === 'border-radius') classes.push(`${pfx}${mapBorderRadius(val)}`);
    if (prop === 'border') {
      if (val !== 'none' && !val.startsWith('0')) {
        classes.push(`${pfx}border`);
        const colorMatch = val.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/);
        if (colorMatch) {
          const q = quantizeColor(colorMatch[0], 'border');
          classes.push(`${pfx}${q.tailwindClass}`);
        }
      }
    }
    if (prop === 'border-color') {
      const q = quantizeColor(val, 'border');
      classes.push(`${pfx}${q.tailwindClass}`);
    }
    if (prop === 'border-width') {
      const num = parseFloat(val);
      if (num === 0) classes.push(`${pfx}border-0`);
      else if (num === 2) classes.push(`${pfx}border-2`);
      else if (num === 4) classes.push(`${pfx}border-4`);
      else if (num === 8) classes.push(`${pfx}border-8`);
      else classes.push(`${pfx}border`);
    }

    // Shadows & Effects
    if (prop === 'box-shadow') classes.push(`${pfx}${mapBoxShadow(val)}`);
    if (prop === 'backdrop-filter' || prop === '-webkit-backdrop-filter') {
      const blurClass = mapBackdropBlur(val);
      if (blurClass) classes.push(`${pfx}${blurClass}`);
    }

    // Position & Overflow
    if (prop === 'position') {
      if (['relative', 'absolute', 'fixed', 'sticky'].includes(val)) {
        classes.push(`${pfx}${val}`);
      }
    }
    if (prop === 'top' && (val === '0' || val === '0px')) classes.push(`${pfx}top-0`);
    if (prop === 'bottom' && (val === '0' || val === '0px')) classes.push(`${pfx}bottom-0`);
    if (prop === 'left' && (val === '0' || val === '0px')) classes.push(`${pfx}left-0`);
    if (prop === 'right' && (val === '0' || val === '0px')) classes.push(`${pfx}right-0`);

    if (prop === 'overflow') {
      if (val === 'hidden') classes.push(`${pfx}overflow-hidden`);
      else if (val === 'auto') classes.push(`${pfx}overflow-auto`);
    }
    if (prop === 'cursor') {
      if (val === 'pointer') classes.push(`${pfx}cursor-pointer`);
      else if (val === 'not-allowed') classes.push(`${pfx}cursor-not-allowed`);
    }
    if (prop === 'opacity') {
      const num = parseFloat(val);
      const pct = Math.round(num * 100);
      classes.push(`${pfx}opacity-${pct}`);
    }
  }

  return classes;
}

/**
 * Normalizes HTML attributes for React JSX (e.g. class -> className, stroke-width -> strokeWidth)
 */
export function formatJsxAttributes(attrs: Record<string, string>): Record<string, string> {
  const jsxAttrs: Record<string, string> = {};
  const attrMap: Record<string, string> = {
    'class': 'className',
    'for': 'htmlFor',
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset',
    'stroke-miterlimit': 'strokeMiterlimit',
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'clip-path': 'clipPath',
    'viewbox': 'viewBox',
    'xmlns:xlink': 'xmlnsXlink',
    'tabindex': 'tabIndex',
    'autocomplete': 'autoComplete',
    'autofocus': 'autoFocus',
    'readonly': 'readOnly',
  };

  for (const [key, val] of Object.entries(attrs)) {
    const lowerKey = key.toLowerCase();
    const jsxKey = attrMap[lowerKey] || (key.includes('-') && !key.startsWith('data-') && !key.startsWith('aria-')
      ? key.replace(/-([a-z])/g, (_, g) => g.toUpperCase())
      : key);

    // Skip raw style attribute since it's translated to Tailwind
    if (jsxKey === 'style') continue;

    jsxAttrs[jsxKey] = val;
  }

  return jsxAttrs;
}

/**
 * Synthesizes normalized DOM nodes and motion into clean React 18 + Tailwind JSX
 */
export function synthesizeComponent(
  rootNodes: NormalizedNode[],
  cssString: string,
  componentName = 'DecompiledComponent'
): SynthesizedResult {
  let hasFramerMotion = false;
  let hasLucideIcons = false;
  const decompiledMotions: DecompiledMotion[] = [];
  const allClassNamesSet = new Set<string>();

  // Check if any motion in CSS
  if (
    cssString.includes('transition') ||
    cssString.includes('animation') ||
    cssString.includes('@keyframes')
  ) {
    const dm = decompileMotion(cssString);
    decompiledMotions.push(dm);
  }

  function renderNode(node: NormalizedNode, depth: number): string {
    const indent = '  '.repeat(depth);
    const mergedStyles = { ...node.matchedStyles, ...node.inlineStyles };

    // Tailwind utility classes
    const baseClasses = cssStylesToTailwind(mergedStyles);
    const hoverClasses = cssStylesToTailwind(node.hoverStyles, 'hover');
    const existingClasses = (node.attributes.class || node.attributes.className || '')
      .split(/\s+/)
      .filter(c => !c.startsWith('custom-') && !c.includes('__') && c.length > 0);

    const combinedClasses = Array.from(
      new Set([...existingClasses, ...baseClasses, ...hoverClasses])
    );
    combinedClasses.forEach(c => allClassNamesSet.add(c));

    // Motion attributes
    let tag = node.tagName;
    const motionProps: string[] = [];

    const hasMotionTransition = Boolean(
      mergedStyles.transition ||
      node.hoverStyles.transform ||
      node.hoverStyles.opacity ||
      mergedStyles.animation
    );

    if (hasMotionTransition && !node.isSvg) {
      hasFramerMotion = true;
      tag = `motion.${tag}`;

      // Detect hover transform
      if (node.hoverStyles.transform?.includes('scale')) {
        const scaleMatch = node.hoverStyles.transform.match(/scale\(([^)]+)\)/);
        const scaleVal = scaleMatch ? scaleMatch[1] : '1.02';
        motionProps.push(`whileHover={{ scale: ${scaleVal} }}`);
      } else if (node.tagName === 'button' || node.isSemanticConverted) {
        motionProps.push(`whileHover={{ scale: 1.02 }}`);
        motionProps.push(`whileTap={{ scale: 0.98 }}`);
      }

      // Initial and animate defaults
      if (depth === 2) {
        motionProps.push(`initial={{ opacity: 0, y: 10 }}`);
        motionProps.push(`animate={{ opacity: 1, y: 0 }}`);
        motionProps.push(`transition={{ duration: 0.3 }}`);
      }
    }

    // Build attributes
    const rawAttrs = formatJsxAttributes(node.attributes);
    delete rawAttrs.class;
    delete rawAttrs.className;

    const attrStrings: string[] = [];
    if (combinedClasses.length > 0) {
      attrStrings.push(`className="${combinedClasses.join(' ')}"`);
    }

    for (const [k, v] of Object.entries(rawAttrs)) {
      if (v === '' || v === k) {
        attrStrings.push(k);
      } else {
        attrStrings.push(`${k}="${v}"`);
      }
    }

    if (motionProps.length > 0) {
      attrStrings.push(...motionProps);
    }

    const attrsLine = attrStrings.length > 0 ? ` ${attrStrings.join(' ')}` : '';

    // Self closing tags
    const selfClosingTags = new Set(['input', 'img', 'br', 'hr', 'path', 'circle', 'rect', 'line']);
    if (selfClosingTags.has(node.tagName) && node.children.length === 0) {
      return `${indent}<${tag}${attrsLine} />`;
    }

    // Children or text content
    if (node.children.length === 0) {
      const text = node.textContent || '';
      return `${indent}<${tag}${attrsLine}>${text}</${tag}>`;
    }

    const renderedChildren = node.children
      .map(child => renderNode(child, depth + 1))
      .join('\n');

    return `${indent}<${tag}${attrsLine}>\n${renderedChildren}\n${indent}</${tag}>`;
  }

  const renderedBody = rootNodes.map(rn => renderNode(rn, 2)).join('\n');

  // Generate imports
  const imports: string[] = ["import React from 'react';"];
  if (hasFramerMotion) {
    imports.push("import { motion } from 'framer-motion';");
  }
  if (hasLucideIcons) {
    imports.push("import { ArrowRight, Check, Sparkles } from 'lucide-react';");
  }

  const code = `${imports.join('\n')}

export default function ${componentName}() {
  return (
${renderedBody}
  );
}
`;

  return {
    code,
    componentName,
    hasFramerMotion,
    hasLucideIcons,
    decompiledMotions,
    allClassNames: Array.from(allClassNamesSet),
  };
}
