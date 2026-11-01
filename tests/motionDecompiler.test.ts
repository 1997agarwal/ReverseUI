import { describe, it, expect } from 'vitest';
import {
  decompileMotion,
  solveSpringPhysics,
  sampleBezierCurve,
  analyzeBezierOvershoot,
} from '../src/lib/motionDecompiler';

describe('Engine 3: Motion & Physics Decompiler', () => {
  it('solves Apple snappy spring curve (0.16, 1, 0.3, 1)', () => {
    const bezier = { x1: 0.16, y1: 1, x2: 0.3, y2: 1 };
    const spring = solveSpringPhysics(bezier, 350);

    expect(spring.stiffness).toBeGreaterThan(100);
    expect(spring.damping).toBeGreaterThan(15);
    expect(spring.mass).toBe(1);
    expect(spring.overshootPct).toBe(0);
  });

  it('detects overshoot in bouncy spring curve (0.34, 1.56, 0.64, 1)', () => {
    const bezier = { x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 };
    const { overshoot } = analyzeBezierOvershoot(bezier);
    expect(overshoot).toBeGreaterThan(0.05);

    const spring = solveSpringPhysics(bezier, 500);
    expect(spring.overshootPct).toBeGreaterThan(5);
    expect(spring.dampingRatio).toBeLessThan(1.0);
  });

  it('decompiles CSS transition string into Framer Motion config', () => {
    const css = 'transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);';
    const result = decompileMotion(css);

    expect(result.durationMs).toBe(350);
    expect(result.framerMotionConfig.transition.type).toBe('spring');
    expect(result.framerMotionConfig.transition.stiffness).toBeDefined();
    expect(result.tailwindClass).toContain('transition-all');
    expect(result.tailwindClass).toContain('ease-[cubic-bezier(0.16,1,0.3,1)]');
  });

  it('samples bezier curve points for SVG rendering', () => {
    const points = sampleBezierCurve({ x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 }, 20);
    expect(points.length).toBe(21);
    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[20].x).toBeCloseTo(1, 1);
    expect(points[20].y).toBeCloseTo(1, 1);
  });
});
