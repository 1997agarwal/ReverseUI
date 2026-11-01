import { TAILWIND_COLORS, TailwindColor } from './tailwindPalette';

export interface ParsedColor {
  r: number;
  g: number;
  b: number;
  a: number;
  hex: string;
}

export interface QuantizedColor {
  original: string;
  token: string; // e.g. "slate-900" or "white"
  matchedHex: string;
  alpha: number;
  distance: number;
  tailwindClass: string; // e.g. "bg-slate-900", "text-slate-900/80"
  fullToken: string; // e.g. "slate-900" or "slate-900/80"
}

export interface ExtractedTokens {
  colors: QuantizedColor[];
  typography: {
    fontSizes: { original: string; token: string }[];
    fontWeights: { original: string; token: string }[];
    lineHeights: { original: string; token: string }[];
    letterSpacings: { original: string; token: string }[];
  };
  radii: { original: string; token: string }[];
  shadows: { original: string; token: string }[];
  blurs: { original: string; token: string }[];
}

/**
 * Parses any CSS color string (hex, rgb, rgba, hsl, hsla, named color)
 */
export function parseColor(colorStr: string): ParsedColor | null {
  if (!colorStr) return null;
  const str = colorStr.trim().toLowerCase();

  // Named colors
  if (str === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0, hex: '#00000000' };
  }
  if (str === 'white') {
    return { r: 255, g: 255, b: 255, a: 1, hex: '#ffffff' };
  }
  if (str === 'black') {
    return { r: 0, g: 0, b: 0, a: 1, hex: '#000000' };
  }

  // Hex format: #fff, #ffff, #ffffff, #ffffff80
  if (str.startsWith('#')) {
    const raw = str.slice(1);
    let r = 0, g = 0, b = 0, a = 1;
    if (raw.length === 3 || raw.length === 4) {
      r = parseInt(raw[0] + raw[0], 16);
      g = parseInt(raw[1] + raw[1], 16);
      b = parseInt(raw[2] + raw[2], 16);
      if (raw.length === 4) {
        a = parseInt(raw[3] + raw[3], 16) / 255;
      }
    } else if (raw.length === 6 || raw.length === 8) {
      r = parseInt(raw.slice(0, 2), 16);
      g = parseInt(raw.slice(2, 4), 16);
      b = parseInt(raw.slice(4, 6), 16);
      if (raw.length === 8) {
        a = parseInt(raw.slice(6, 8), 16) / 255;
      }
    } else {
      return null;
    }
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    return { r, g, b, a: Number(a.toFixed(2)), hex };
  }

  // rgb / rgba: rgb(255, 255, 255), rgba(0, 0, 0, 0.5), rgb(0 0 0 / 50%)
  const rgbMatch = str.match(/rgba?\s*\(([^)]+)\)/);
  if (rgbMatch) {
    const parts = rgbMatch[1]
      .split(/[\s,/]+/)
      .map(p => p.trim())
      .filter(Boolean);
    if (parts.length >= 3) {
      const r = Math.min(255, Math.max(0, parseInt(parts[0], 10)));
      const g = Math.min(255, Math.max(0, parseInt(parts[1], 10)));
      const b = Math.min(255, Math.max(0, parseInt(parts[2], 10)));
      let a = 1;
      if (parts[3]) {
        if (parts[3].endsWith('%')) {
          a = parseFloat(parts[3]) / 100;
        } else {
          a = parseFloat(parts[3]);
        }
      }
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      return { r, g, b, a: Number(a.toFixed(2)), hex };
    }
  }

  // hsl / hsla: hsl(215, 25%, 27%), hsla(215, 25%, 27%, 0.5)
  const hslMatch = str.match(/hsla?\s*\(([^)]+)\)/);
  if (hslMatch) {
    const parts = hslMatch[1]
      .split(/[\s,/]+/)
      .map(p => p.trim())
      .filter(Boolean);
    if (parts.length >= 3) {
      const h = parseFloat(parts[0]);
      const s = parseFloat(parts[1]) / 100;
      const l = parseFloat(parts[2]) / 100;
      let a = 1;
      if (parts[3]) {
        a = parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
      }
      // HSL to RGB conversion
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let rPrime = 0, gPrime = 0, bPrime = 0;
      if (h >= 0 && h < 60) {
        rPrime = c; gPrime = x; bPrime = 0;
      } else if (h >= 60 && h < 120) {
        rPrime = x; gPrime = c; bPrime = 0;
      } else if (h >= 120 && h < 180) {
        rPrime = 0; gPrime = c; bPrime = x;
      } else if (h >= 180 && h < 240) {
        rPrime = 0; gPrime = x; bPrime = c;
      } else if (h >= 240 && h < 300) {
        rPrime = x; gPrime = 0; bPrime = c;
      } else if (h >= 300 && h < 360) {
        rPrime = c; gPrime = 0; bPrime = x;
      }
      const r = Math.round((rPrime + m) * 255);
      const g = Math.round((gPrime + m) * 255);
      const b = Math.round((bPrime + m) * 255);
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      return { r, g, b, a: Number(a.toFixed(2)), hex };
    }
  }

  return null;
}

/**
 * Calculates weighted Euclidean distance between two RGB colors (Color Difference Formula)
 * Uses redmean formula for human perception accuracy
 */
export function colorDistance(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number
): number {
  const rMean = (r1 + r2) / 2;
  const deltaR = r1 - r2;
  const deltaG = g1 - g2;
  const deltaB = b1 - b2;
  return Math.sqrt(
    (2 + rMean / 256) * deltaR * deltaR +
    4 * deltaG * deltaG +
    (2 + (255 - rMean) / 256) * deltaB * deltaB
  );
}

/**
 * Quantizes an arbitrary color to the nearest standard Tailwind CSS color token
 */
export function quantizeColor(colorStr: string, prefix = 'bg'): QuantizedColor {
  const parsed = parseColor(colorStr);
  if (!parsed) {
    return {
      original: colorStr,
      token: 'transparent',
      matchedHex: 'transparent',
      alpha: 1,
      distance: 0,
      tailwindClass: `${prefix}-transparent`,
      fullToken: 'transparent',
    };
  }

  if (parsed.a === 0) {
    return {
      original: colorStr,
      token: 'transparent',
      matchedHex: 'transparent',
      alpha: 0,
      distance: 0,
      tailwindClass: `${prefix}-transparent`,
      fullToken: 'transparent',
    };
  }

  let closest: TailwindColor = TAILWIND_COLORS[0];
  let minDistance = Infinity;

  for (const c of TAILWIND_COLORS) {
    const dist = colorDistance(parsed.r, parsed.g, parsed.b, c.r, c.g, c.b);
    if (dist < minDistance) {
      minDistance = dist;
      closest = c;
    }
  }

  let fullToken = closest.token;
  let tailwindClass = `${prefix}-${closest.token}`;

  if (parsed.a < 1) {
    const opacityPct = Math.round(parsed.a * 100);
    fullToken = `${closest.token}/${opacityPct}`;
    tailwindClass = `${prefix}-${closest.token}/${opacityPct}`;
  }

  return {
    original: colorStr,
    token: closest.token,
    matchedHex: closest.hex,
    alpha: parsed.a,
    distance: Math.round(minDistance * 10) / 10,
    tailwindClass,
    fullToken,
  };
}

/**
 * Converts CSS font-size to Tailwind class
 */
export function mapFontSize(val: string): string {
  if (!val) return 'text-base';
  const clean = val.trim().toLowerCase();
  const num = parseFloat(clean);
  const isRem = clean.endsWith('rem');
  const px = isRem ? num * 16 : num;

  if (px <= 12) return 'text-xs';
  if (px <= 14) return 'text-sm';
  if (px <= 16) return 'text-base';
  if (px <= 18) return 'text-lg';
  if (px <= 20) return 'text-xl';
  if (px <= 24) return 'text-2xl';
  if (px <= 30) return 'text-3xl';
  if (px <= 36) return 'text-4xl';
  if (px <= 48) return 'text-5xl';
  if (px <= 60) return 'text-6xl';
  if (px <= 72) return 'text-7xl';
  if (px <= 96) return 'text-8xl';
  return 'text-9xl';
}

/**
 * Converts CSS font-weight to Tailwind class
 */
export function mapFontWeight(val: string): string {
  if (!val) return 'font-normal';
  const clean = val.trim().toLowerCase();
  if (clean === 'normal' || clean === '400') return 'font-normal';
  if (clean === 'bold' || clean === '700') return 'font-bold';
  if (clean === '100') return 'font-thin';
  if (clean === '200') return 'font-extralight';
  if (clean === '300') return 'font-light';
  if (clean === '500') return 'font-medium';
  if (clean === '600') return 'font-semibold';
  if (clean === '800') return 'font-extrabold';
  if (clean === '900') return 'font-black';
  return 'font-normal';
}

/**
 * Converts CSS line-height to Tailwind class
 */
export function mapLineHeight(val: string): string {
  if (!val) return 'leading-normal';
  const clean = val.trim().toLowerCase();
  const num = parseFloat(clean);
  if (num <= 1 || clean === '1') return 'leading-none';
  if (num <= 1.25 || clean === '1.25' || clean === '20px') return 'leading-tight';
  if (num <= 1.375 || clean === '1.375') return 'leading-snug';
  if (num <= 1.5 || clean === '1.5' || clean === '24px') return 'leading-normal';
  if (num <= 1.625 || clean === '1.625') return 'leading-relaxed';
  if (num > 1.625) return 'leading-loose';
  return 'leading-normal';
}

/**
 * Converts CSS letter-spacing to Tailwind class
 */
export function mapLetterSpacing(val: string): string {
  if (!val) return 'tracking-normal';
  const clean = val.trim().toLowerCase();
  if (clean === 'normal' || clean === '0' || clean === '0px') return 'tracking-normal';
  const num = parseFloat(clean);
  if (num <= -0.05) return 'tracking-tighter';
  if (num < 0) return 'tracking-tight';
  if (num >= 0.1) return 'tracking-widest';
  if (num >= 0.05) return 'tracking-wider';
  if (num > 0) return 'tracking-wide';
  return 'tracking-normal';
}

/**
 * Converts CSS border-radius to Tailwind class
 */
export function mapBorderRadius(val: string): string {
  if (!val) return 'rounded-none';
  const clean = val.trim().toLowerCase();
  if (clean === '0' || clean === '0px' || clean === 'none') return 'rounded-none';
  if (clean === '50%' || clean === '9999px' || clean === '100%') return 'rounded-full';

  const num = parseFloat(clean);
  const isRem = clean.endsWith('rem');
  const px = isRem ? num * 16 : num;

  if (px <= 2) return 'rounded-sm';
  if (px <= 4) return 'rounded';
  if (px <= 6) return 'rounded-md';
  if (px <= 8) return 'rounded-lg';
  if (px <= 12) return 'rounded-xl';
  if (px <= 16) return 'rounded-2xl';
  if (px <= 24) return 'rounded-3xl';
  return 'rounded-full';
}

/**
 * Converts CSS box-shadow to Tailwind class
 */
export function mapBoxShadow(val: string): string {
  if (!val || val === 'none') return 'shadow-none';
  const clean = val.trim().toLowerCase();
  if (clean.includes('inset')) return 'shadow-inner';
  if (clean.includes('50px')) return 'shadow-2xl';
  if (clean.includes('20px') || clean.includes('25px')) return 'shadow-xl';
  if (clean.includes('10px') || clean.includes('15px')) return 'shadow-lg';
  if (clean.includes('4px') || clean.includes('6px')) return 'shadow-md';
  if (clean.includes('1px') || clean.includes('2px')) return 'shadow-sm';
  return 'shadow';
}

/**
 * Converts backdrop-filter blur to Tailwind class
 */
export function mapBackdropBlur(val: string): string {
  if (!val || val === 'none') return '';
  const clean = val.trim().toLowerCase();
  const match = clean.match(/blur\(([^)]+)\)/);
  if (!match) return 'backdrop-blur';
  const num = parseFloat(match[1]);
  if (num <= 4) return 'backdrop-blur-sm';
  if (num <= 8) return 'backdrop-blur-md';
  if (num <= 16) return 'backdrop-blur-lg';
  if (num <= 24) return 'backdrop-blur-xl';
  if (num <= 40) return 'backdrop-blur-2xl';
  return 'backdrop-blur-3xl';
}

/**
 * Extracts and deduplicates design tokens from a set of CSS property-value maps
 */
export function extractDesignTokens(
  declarationsList: Record<string, string>[]
): ExtractedTokens {
  const colorMap = new Map<string, QuantizedColor>();
  const fontSizes = new Map<string, string>();
  const fontWeights = new Map<string, string>();
  const lineHeights = new Map<string, string>();
  const letterSpacings = new Map<string, string>();
  const radii = new Map<string, string>();
  const shadows = new Map<string, string>();
  const blurs = new Map<string, string>();

  for (const decl of declarationsList) {
    for (const [prop, val] of Object.entries(decl)) {
      if (!val) continue;

      // Color properties
      if (
        prop === 'color' ||
        prop === 'background-color' ||
        prop === 'border-color' ||
        prop === 'outline-color'
      ) {
        const prefix = prop === 'color' ? 'text' : prop === 'background-color' ? 'bg' : 'border';
        const q = quantizeColor(val, prefix);
        if (q.token !== 'transparent') {
          colorMap.set(val, q);
        }
      }

      // Check for colors inside linear-gradient or box-shadow
      const colorMatches = val.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/g);
      if (colorMatches) {
        for (const c of colorMatches) {
          const q = quantizeColor(c, 'bg');
          if (q.token !== 'transparent') {
            colorMap.set(c, q);
          }
        }
      }

      // Typography
      if (prop === 'font-size') {
        fontSizes.set(val, mapFontSize(val));
      }
      if (prop === 'font-weight') {
        fontWeights.set(val, mapFontWeight(val));
      }
      if (prop === 'line-height') {
        lineHeights.set(val, mapLineHeight(val));
      }
      if (prop === 'letter-spacing') {
        letterSpacings.set(val, mapLetterSpacing(val));
      }

      // Radius & Shadows
      if (prop === 'border-radius') {
        radii.set(val, mapBorderRadius(val));
      }
      if (prop === 'box-shadow') {
        shadows.set(val, mapBoxShadow(val));
      }
      if (prop === 'backdrop-filter' || prop === '-webkit-backdrop-filter') {
        const b = mapBackdropBlur(val);
        if (b) blurs.set(val, b);
      }
    }
  }

  return {
    colors: Array.from(colorMap.values()),
    typography: {
      fontSizes: Array.from(fontSizes.entries()).map(([k, v]) => ({ original: k, token: v })),
      fontWeights: Array.from(fontWeights.entries()).map(([k, v]) => ({ original: k, token: v })),
      lineHeights: Array.from(lineHeights.entries()).map(([k, v]) => ({ original: k, token: v })),
      letterSpacings: Array.from(letterSpacings.entries()).map(([k, v]) => ({ original: k, token: v })),
    },
    radii: Array.from(radii.entries()).map(([k, v]) => ({ original: k, token: v })),
    shadows: Array.from(shadows.entries()).map(([k, v]) => ({ original: k, token: v })),
    blurs: Array.from(blurs.entries()).map(([k, v]) => ({ original: k, token: v })),
  };
}
