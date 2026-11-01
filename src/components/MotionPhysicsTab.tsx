import React, { useState } from 'react';
import { Activity, Play, Copy, Check, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';
import { DecompiledMotion } from '../lib/motionDecompiler';

interface MotionPhysicsTabProps {
  motionData: DecompiledMotion;
}

export const MotionPhysicsTab: React.FC<MotionPhysicsTabProps> = ({ motionData }) => {
  const [copied, setCopied] = useState(false);
  const [isTestAnimated, setIsTestAnimated] = useState(false);

  // Map 0..1 to SVG 0..200 coordinate space with margin
  const svgWidth = 240;
  const svgHeight = 160;
  const padding = 28;
  const graphW = svgWidth - padding * 2;
  const graphH = svgHeight - padding * 2;

  const mapX = (x: number) => padding + x * graphW;
  const mapY = (y: number) => svgHeight - padding - y * graphH;

  // Control points
  const p0 = { x: mapX(0), y: mapY(0) };
  const p1 = { x: mapX(motionData.bezier.x1), y: mapY(motionData.bezier.y1) };
  const p2 = { x: mapX(motionData.bezier.x2), y: mapY(motionData.bezier.y2) };
  const p3 = { x: mapX(1), y: mapY(1) };

  // SVG path string
  const svgPathData = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(motionData.framerMotionConfig.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerTestAnimation = () => {
    setIsTestAnimated(false);
    setTimeout(() => {
      setIsTestAnimated(true);
    }, 50);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto p-4 space-y-6 text-xs">
      {/* 1. Interactive Bezier Curve Preview */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Cubic-Bezier Solver</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">
            {motionData.easingName}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 mt-3 rounded-xl bg-slate-900 border border-slate-800">
          {/* SVG Canvas */}
          <div className="relative bg-slate-950 rounded-lg p-2 border border-slate-800/80 shrink-0">
            <svg width={svgWidth} height={svgHeight} className="overflow-visible">
              {/* Background grid */}
              <line x1={padding} y1={mapY(0)} x2={mapX(1)} y2={mapY(0)} stroke="#334155" strokeWidth="1" />
              <line x1={padding} y1={mapY(1)} x2={mapX(1)} y2={mapY(1)} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
              <line x1={padding} y1={mapY(0)} x2={padding} y2={mapY(1)} stroke="#334155" strokeWidth="1" />
              <line x1={mapX(1)} y1={mapY(0)} x2={mapX(1)} y2={mapY(1)} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

              {/* Diagonal linear reference */}
              <line x1={p0.x} y1={p0.y} x2={p3.x} y2={p3.y} stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4,4" />

              {/* Control handles */}
              <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
              <line x1={p3.x} y1={p3.y} x2={p2.x} y2={p2.y} stroke="#818cf8" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />

              {/* Bezier Curve */}
              <path d={svgPathData} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

              {/* Control point handles */}
              <circle cx={p1.x} cy={p1.y} r="4.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
              <circle cx={p2.x} cy={p2.y} r="4.5" fill="#818cf8" stroke="#0f172a" strokeWidth="2" />
              <circle cx={p0.x} cy={p0.y} r="3" fill="#64748b" />
              <circle cx={p3.x} cy={p3.y} r="3" fill="#64748b" />
            </svg>
            <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono px-2">
              <span>Time: 0s</span>
              <span>Duration: {motionData.durationMs}ms</span>
            </div>
          </div>

          {/* Coordinates Explanation */}
          <div className="flex-1 space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs">Extracted Curve Parameters</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Handle P1 (x1, y1)</span>
                <span className="text-sky-400 font-bold">
                  ({motionData.bezier.x1}, {motionData.bezier.y1})
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Handle P2 (x2, y2)</span>
                <span className="text-indigo-400 font-bold">
                  ({motionData.bezier.x2}, {motionData.bezier.y2})
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tailwind Utility:{' '}
              <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded font-mono">
                {motionData.tailwindClass}
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Solved Spring Physics Parameters */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Sliders className="w-4 h-4 text-fuchsia-400" />
            <span>Framer Motion Spring Translation</span>
          </div>
          <span className="text-[10px] text-fuchsia-400 font-mono">
            ζ = {motionData.spring.dampingRatio} ({motionData.spring.overshootPct > 0 ? 'Underdamped' : 'Critically Damped'})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stiffness (k)</span>
            <span className="text-lg font-extrabold text-cyan-400 font-mono">{motionData.spring.stiffness}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Tension force</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Damping (c)</span>
            <span className="text-lg font-extrabold text-indigo-400 font-mono">{motionData.spring.damping}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Friction decay</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mass (m)</span>
            <span className="text-lg font-extrabold text-emerald-400 font-mono">{motionData.spring.mass}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Inertia unit</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overshoot</span>
            <span className="text-lg font-extrabold text-amber-400 font-mono">{motionData.spring.overshootPct}%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Bounce amplitude</span>
          </div>
        </div>

        {/* Transition Code Snippet */}
        <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Framer Motion Transition Config:</span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Config'}
            </button>
          </div>
          <pre className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 overflow-x-auto">
            {motionData.framerMotionConfig.codeSnippet}
          </pre>
        </div>
      </div>

      {/* 3. Side-by-Side Motion Physics Testbed */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-200 text-xs">Side-by-Side Physics Verification</h4>
            <p className="text-[11px] text-slate-400">Compare pure CSS cubic-bezier against React Framer Motion spring</p>
          </div>
          <button
            onClick={triggerTestAnimation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Trigger Test
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* CSS Curve Test Track */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between h-28">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span className="font-semibold text-sky-400">CSS cubic-bezier</span>
              <span className="font-mono">{motionData.durationMs}ms</span>
            </div>
            <div className="relative w-full h-8 bg-slate-900 rounded-full overflow-hidden p-1 flex items-center">
              <div
                className="w-6 h-6 rounded-full bg-sky-500 shadow-md shadow-sky-500/50"
                style={{
                  transform: isTestAnimated ? 'translateX(calc(240px - 2rem))' : 'translateX(0)',
                  transition: `transform ${motionData.durationMs}ms cubic-bezier(${motionData.bezier.x1}, ${motionData.bezier.y1}, ${motionData.bezier.x2}, ${motionData.bezier.y2})`,
                }}
              />
            </div>
          </div>

          {/* Framer Motion Spring Test Track */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between h-28">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span className="font-semibold text-fuchsia-400">Framer Motion Spring</span>
              <span className="font-mono">k={motionData.spring.stiffness}, c={motionData.spring.damping}</span>
            </div>
            <div className="relative w-full h-8 bg-slate-900 rounded-full overflow-hidden p-1 flex items-center">
              <motion.div
                className="w-6 h-6 rounded-full bg-fuchsia-500 shadow-md shadow-fuchsia-500/50"
                animate={{
                  x: isTestAnimated ? 208 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: motionData.spring.stiffness,
                  damping: motionData.spring.damping,
                  mass: motionData.spring.mass,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
