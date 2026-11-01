import { describe, it, expect } from 'vitest';
import {
  parseColor,
  quantizeColor,
  mapFontSize,
  mapFontWeight,
  mapBorderRadius,
  mapBoxShadow,
  mapBackdropBlur,
  extractDesignTokens,
} from '../src/lib/tokenExtractor';

describe('Engine 2: Token Extractor & Boundary Detection', () => {
  describe('Color Quantization', () => {
    it('correctly parses hex, rgb, rgba, and hsl colors', () => {
      const hex = parseColor('#0f172a');
      expect(hex).toEqual({ r: 15, g: 23, b: 42, a: 1, hex: '#0f172a' });

      const rgb = parseColor('rgb(255, 255, 255)');
      expect(rgb?.r).toBe(255);
      expect(rgb?.g).toBe(255);
      expect(rgb?.b).toBe(255);
      expect(rgb?.a).toBe(1);

      const rgba = parseColor('rgba(15, 23, 42, 0.5)');
      expect(rgba?.r).toBe(15);
      expect(rgba?.a).toBe(0.5);

      const hsl = parseColor('hsl(0, 100%, 50%)');
      expect(hsl?.r).toBe(255);
      expect(hsl?.g).toBe(0);
      expect(hsl?.b).toBe(0);
    });

    it('quantizes #0f172a to slate-900', () => {
      const res = quantizeColor('#0f172a', 'bg');
      expect(res.token).toBe('slate-900');
      expect(res.tailwindClass).toBe('bg-slate-900');
    });

    it('quantizes colors with opacity channels preserving alpha (e.g. slate-900/50)', () => {
      const res = quantizeColor('rgba(15, 23, 42, 0.5)', 'bg');
      expect(res.token).toBe('slate-900');
      expect(res.tailwindClass).toBe('bg-slate-900/50');
      expect(res.alpha).toBe(0.5);
    });

    it('handles black, white, and transparent correctly', () => {
      expect(quantizeColor('#000000', 'text').tailwindClass).toBe('text-black');
      expect(quantizeColor('#ffffff', 'text').tailwindClass).toBe('text-white');
      expect(quantizeColor('transparent', 'bg').tailwindClass).toBe('bg-transparent');
    });
  });

  describe('Typography Matrix', () => {
    it('maps font-size values to Tailwind tokens', () => {
      expect(mapFontSize('12px')).toBe('text-xs');
      expect(mapFontSize('14px')).toBe('text-sm');
      expect(mapFontSize('16px')).toBe('text-base');
      expect(mapFontSize('20px')).toBe('text-xl');
      expect(mapFontSize('24px')).toBe('text-2xl');
      expect(mapFontSize('1.5rem')).toBe('text-2xl');
    });

    it('maps font-weight values to Tailwind tokens', () => {
      expect(mapFontWeight('400')).toBe('font-normal');
      expect(mapFontWeight('500')).toBe('font-medium');
      expect(mapFontWeight('600')).toBe('font-semibold');
      expect(mapFontWeight('700')).toBe('font-bold');
      expect(mapFontWeight('bold')).toBe('font-bold');
    });
  });

  describe('Elevation & Radius', () => {
    it('maps border-radius to Tailwind tokens', () => {
      expect(mapBorderRadius('0px')).toBe('rounded-none');
      expect(mapBorderRadius('4px')).toBe('rounded');
      expect(mapBorderRadius('8px')).toBe('rounded-lg');
      expect(mapBorderRadius('12px')).toBe('rounded-xl');
      expect(mapBorderRadius('9999px')).toBe('rounded-full');
      expect(mapBorderRadius('50%')).toBe('rounded-full');
    });

    it('maps box-shadow and backdrop-filter', () => {
      expect(mapBoxShadow('none')).toBe('shadow-none');
      expect(mapBoxShadow('0 20px 25px -5px rgba(0, 0, 0, 0.5)')).toBe('shadow-xl');
      expect(mapBackdropBlur('blur(16px)')).toBe('backdrop-blur-lg');
    });

    it('extracts unique tokens from declarations map', () => {
      const decls: Record<string, string>[] = [
        { 'background-color': '#0f172a', 'font-size': '14px', 'border-radius': '12px' },
        { color: '#ffffff', 'font-size': '14px', 'box-shadow': '0 20px 25px -5px rgba(0,0,0,0.5)' },
      ];
      const tokens = extractDesignTokens(decls);
      expect(tokens.colors.length).toBeGreaterThan(0);
      expect(tokens.typography.fontSizes).toHaveLength(1);
      expect(tokens.typography.fontSizes[0].token).toBe('text-sm');
      expect(tokens.radii[0].token).toBe('rounded-xl');
    });
  });
});
