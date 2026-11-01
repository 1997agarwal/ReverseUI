export interface CubicBezierPoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface SpringPhysics {
  stiffness: number;
  damping: number;
  mass: number;
  overshootPct: number;
  settlingTimeSec: number;
  dampingRatio: number; // zeta
}

export interface DecompiledMotion {
  originalCss: string;
  durationMs: number;
  delayMs: number;
  easingName: string;
  bezier: CubicBezierPoints;
  spring: SpringPhysics;
  framerMotionConfig: {
    transition: {
      type: string;
      stiffness: number;
      damping: number;
      mass: number;
      duration?: number;
      delay?: number;
    };
    codeSnippet: string;
  };
  tailwindClass: string;
  keyframes?: {
    name: string;
    steps: { offset: string; properties: Record<string, string> }[];
  };
}

// Preset standard CSS easings mapped to cubic-bezier
export const STANDARD_EASINGS: Record<string, CubicBezierPoints> = {
  'linear': { x1: 0, y1: 0, x2: 1, y2: 1 },
  'ease': { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 },
  'ease-in': { x1: 0.42, y1: 0, x2: 1, y2: 1 },
  'ease-out': { x1: 0, y1: 0, x2: 0.58, y2: 1 },
  'ease-in-out': { x1: 0.42, y1: 0, x2: 0.58, y2: 1 },
  'apple-spring': { x1: 0.16, y1: 1, x2: 0.3, y2: 1 },
  'bouncy': { x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },
  'snappy': { x1: 0.2, y1: 0, x2: 0, y2: 1 },
};

/**
 * Computes the Cubic Bezier value B(t) given t in [0, 1]
 */
export function evaluateBezier(t: number, p1: number, p2: number): number {
  const oneMinusT = 1 - t;
  return 3 * oneMinusT * oneMinusT * t * p1 + 3 * oneMinusT * t * t * p2 + t * t * t;
}

/**
 * Samples a cubic-bezier curve into N 2D coordinate points
 */
export function sampleBezierCurve(bezier: CubicBezierPoints, sampleCount = 40): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= sampleCount; i++) {
    const t = i / sampleCount;
    const x = evaluateBezier(t, bezier.x1, bezier.x2);
    const y = evaluateBezier(t, bezier.y1, bezier.y2);
    points.push({ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) });
  }
  return points;
}

/**
 * Analyzes the peak and overshoot of a bezier curve
 */
export function analyzeBezierOvershoot(bezier: CubicBezierPoints): { maxVal: number; overshoot: number } {
  let maxVal = 1;
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const y = evaluateBezier(t, bezier.y1, bezier.y2);
    if (y > maxVal) {
      maxVal = y;
    }
  }
  const overshoot = Math.max(0, maxVal - 1);
  return { maxVal, overshoot };
}

/**
 * Solves equivalent Framer Motion spring physics from a cubic-bezier curve and duration
 */
export function solveSpringPhysics(bezier: CubicBezierPoints, durationMs = 350): SpringPhysics {
  const durationSec = Math.max(0.1, durationMs / 1000);
  const { overshoot } = analyzeBezierOvershoot(bezier);

  let zeta: number;
  if (overshoot > 0.01) {
    // Underdamped spring: zeta = sqrt( ln(OS)^2 / (pi^2 + ln(OS)^2) )
    const lnOS = Math.log(overshoot);
    zeta = Math.sqrt((lnOS * lnOS) / (Math.PI * Math.PI + lnOS * lnOS));
    zeta = Math.max(0.15, Math.min(0.85, zeta));
  } else {
    // Critically damped or smooth transition
    // Determine how fast it ramps up
    const initialSlope = bezier.x1 > 0 ? bezier.y1 / bezier.x1 : 1;
    if (initialSlope > 2.5) {
      zeta = 0.88; // Snappy without oscillation
    } else if (initialSlope > 1.2) {
      zeta = 0.95;
    } else {
      zeta = 1.05; // Gentle overdamped
    }
  }

  // Settling time Ts ≈ 4 / (zeta * omega_n)  =>  omega_n = 4 / (zeta * durationSec)
  const omega_n = 4 / (zeta * durationSec);
  const mass = 1;
  const rawStiffness = mass * omega_n * omega_n;
  const rawDamping = 2 * zeta * Math.sqrt(rawStiffness * mass);

  // Clamp to idiomatic UI spring values
  const stiffness = Math.round(Math.max(60, Math.min(650, rawStiffness)));
  const damping = Math.round(Math.max(8, Math.min(60, rawDamping)));

  return {
    stiffness,
    damping,
    mass,
    overshootPct: Math.round(overshoot * 100),
    settlingTimeSec: Number(durationSec.toFixed(2)),
    dampingRatio: Number(zeta.toFixed(2)),
  };
}

/**
 * Parses a CSS transition or animation string into DecompiledMotion
 */
export function decompileMotion(cssInput: string): DecompiledMotion {
  let durationMs = 300;
  let delayMs = 0;
  let bezier: CubicBezierPoints = { ...STANDARD_EASINGS['ease'] };
  let easingName = 'ease';

  // Match cubic-bezier(x1, y1, x2, y2)
  const cbMatch = cssInput.match(/cubic-bezier\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/i);
  if (cbMatch) {
    bezier = {
      x1: parseFloat(cbMatch[1]),
      y1: parseFloat(cbMatch[2]),
      x2: parseFloat(cbMatch[3]),
      y2: parseFloat(cbMatch[4]),
    };
    easingName = `cubic-bezier(${bezier.x1}, ${bezier.y1}, ${bezier.x2}, ${bezier.y2})`;
  } else {
    // Look for named easings
    for (const [name, coords] of Object.entries(STANDARD_EASINGS)) {
      if (new RegExp(`\\b${name}\\b`, 'i').test(cssInput)) {
        bezier = { ...coords };
        easingName = name;
        break;
      }
    }
  }

  // Match duration: e.g. 0.3s, 300ms, 450ms
  const durMatch = cssInput.match(/(\d+(?:\.\d+)?)\s*(ms|s)/i);
  if (durMatch) {
    const val = parseFloat(durMatch[1]);
    durationMs = durMatch[2].toLowerCase() === 's' ? Math.round(val * 1000) : Math.round(val);
  }

  // Match delay if secondary time found
  const timeMatches = Array.from(cssInput.matchAll(/(\d+(?:\.\d+)?)\s*(ms|s)/gi));
  if (timeMatches.length > 1) {
    const val = parseFloat(timeMatches[1][1]);
    delayMs = timeMatches[1][2].toLowerCase() === 's' ? Math.round(val * 1000) : Math.round(val);
  }

  const spring = solveSpringPhysics(bezier, durationMs);

  // Compute Tailwind transition class
  const twDuration = durationMs <= 75 ? 'duration-75'
    : durationMs <= 100 ? 'duration-100'
    : durationMs <= 150 ? 'duration-150'
    : durationMs <= 200 ? 'duration-200'
    : durationMs <= 300 ? 'duration-300'
    : durationMs <= 500 ? 'duration-500'
    : durationMs <= 700 ? 'duration-700'
    : 'duration-1000';

  const twEase = easingName === 'linear' ? 'ease-linear'
    : easingName === 'ease-in' ? 'ease-in'
    : easingName === 'ease-out' ? 'ease-out'
    : easingName === 'ease-in-out' ? 'ease-in-out'
    : `ease-[cubic-bezier(${bezier.x1},${bezier.y1},${bezier.x2},${bezier.y2})]`;

  const tailwindClass = `transition-all ${twDuration} ${twEase}`;

  const framerMotionConfig = {
    transition: {
      type: 'spring',
      stiffness: spring.stiffness,
      damping: spring.damping,
      mass: spring.mass,
      ...(delayMs > 0 ? { delay: delayMs / 1000 } : {}),
    },
    codeSnippet: `transition: {
  type: "spring",
  stiffness: ${spring.stiffness},
  damping: ${spring.damping},
  mass: ${spring.mass}${delayMs > 0 ? `,\n  delay: ${delayMs / 1000}` : ''}
}`,
  };

  // Optional keyframes parsing
  let keyframes: DecompiledMotion['keyframes'] = undefined;
  const kfMatch = cssInput.match(/@keyframes\s+([a-zA-Z0-9_-]+)\s*\{([^}]+(?:\{[^}]+\}[^}]*)*)\}/);
  if (kfMatch) {
    const kfName = kfMatch[1];
    const kfBody = kfMatch[2];
    const steps: { offset: string; properties: Record<string, string> }[] = [];
    const stepRegex = /([0-9]+%|from|to)\s*\{([^}]+)\}/g;
    let stepMatch;
    while ((stepMatch = stepRegex.exec(kfBody)) !== null) {
      const offset = stepMatch[1];
      const propsStr = stepMatch[2];
      const props: Record<string, string> = {};
      propsStr.split(';').forEach(pair => {
        const [k, v] = pair.split(':').map(s => s.trim());
        if (k && v) props[k] = v;
      });
      steps.push({ offset, properties: props });
    }
    if (steps.length > 0) {
      keyframes = { name: kfName, steps };
    }
  }

  return {
    originalCss: cssInput,
    durationMs,
    delayMs,
    easingName,
    bezier,
    spring,
    framerMotionConfig,
    tailwindClass,
    keyframes,
  };
}
