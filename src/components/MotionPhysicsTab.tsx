import React, { useState } from 'react';
import { Play, Copy, Check, Sliders, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { DecompiledMotion } from '../lib/motionDecompiler';

interface MotionPhysicsTabProps {
  motionData: DecompiledMotion;
}

export const MotionPhysicsTab: React.FC<MotionPhysicsTabProps> = ({ motionData }) => {
  const [copied, setCopied] = useState(false);
  const [isTestAnimated, setIsTestAnimated] = useState(false);

  // SVG dimensions for curve
  const svgWidth = 240;
  const svgHeight = 150;
  const padding = 24;
  const graphW = svgWidth - padding * 2;
  const graphH = svgHeight - padding * 2;

  const mapX = (x: number) => padding + x * graphW;
  const mapY = (y: number) => svgHeight - padding - y * graphH;

  const p0 = { x: mapX(0), y: mapY(0) };
  const p1 = { x: mapX(motionData.bezier.x1), y: mapY(motionData.bezier.y1) };
  const p2 = { x: mapX(motionData.bezier.x2), y: mapY(motionData.bezier.y2) };
  const p3 = { x: mapX(1), y: mapY(1) };

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

  const isBouncy = motionData.spring.overshootPct > 10;
  const isSnappy = motionData.bezier.y1 >= 0.8 && motionData.spring.overshootPct <= 10;
  const feelBadge = isBouncy
    ? '✨ Bouncy & Playful'
    : isSnappy
    ? '⚡ Apple-Style Snappy'
    : '🍃 Smooth & Gentle';

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto p-5 space-y-6 text-xs">
      {/* 1. Friendly Summary Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/20 border border-cyan-500/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Motion Feel: <span className="text-cyan-300 font-extrabold">{feelBadge}</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {motionData.durationMs}ms duration
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          ReverseUI translated this CSS animation curve into standard <strong>Framer Motion spring physics</strong> so your developers can drop it into any React project with natural physics.
        </p>
      </div>

      {/* 2. Side-by-Side Live Testbed */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-200 text-xs">Interactive Spring Test</h4>
            <p className="text-[11px] text-slate-400">Click below to test how the spring motion feels live</p>
          </div>
          <button
            onClick={triggerTestAnimation}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Test Animation
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Track 1: CSS */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between h-24">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span className="font-semibold text-sky-400">CSS Transition</span>
              <span className="font-mono">{motionData.durationMs}ms</span>
            </div>
            <div className="relative w-full h-8 bg-slate-900 rounded-full overflow-hidden p-1 flex items-center">
              <div
                className="w-6 h-6 rounded-full bg-sky-500 shadow-md shadow-sky-500/50"
                style={{
                  transform: isTestAnimated ? 'translateX(calc(220px - 2rem))' : 'translateX(0)',
                  transition: `transform ${motionData.durationMs}ms cubic-bezier(${motionData.bezier.x1}, ${motionData.bezier.y1}, ${motionData.bezier.x2}, ${motionData.bezier.y2})`,
                }}
              />
            </div>
          </div>

          {/* Track 2: Framer Motion Spring */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between h-24">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span className="font-semibold text-fuchsia-400">Framer Motion Spring</span>
              <span className="font-mono">k={motionData.spring.stiffness}, c={motionData.spring.damping}</span>
            </div>
            <div className="relative w-full h-8 bg-slate-900 rounded-full overflow-hidden p-1 flex items-center">
              <motion.div
                className="w-6 h-6 rounded-full bg-fuchsia-500 shadow-md shadow-fuchsia-500/50"
                animate={{
                  x: isTestAnimated ? 190 : 0,
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

      {/* 3. Physics Metric Cards */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Sliders className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm">Spring Parameters for Developers</span>
          </div>
          <span className="text-[11px] text-slate-500">React Framer Motion</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stiffness</span>
            <span className="text-base font-extrabold text-cyan-400 font-mono">{motionData.spring.stiffness}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Snappiness</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Damping</span>
            <span className="text-base font-extrabold text-indigo-400 font-mono">{motionData.spring.damping}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Smoothness</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mass</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">{motionData.spring.mass}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Inertia</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bounce</span>
            <span className="text-base font-extrabold text-amber-400 font-mono">{motionData.spring.overshootPct}%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Overshoot</span>
          </div>
        </div>

        {/* Copyable Transition Code */}
        <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Framer Motion Transition Code:</span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied code!' : 'Copy Config'}
            </button>
          </div>
          <pre className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 overflow-x-auto">
            {motionData.framerMotionConfig.codeSnippet}
          </pre>
        </div>
      </div>

      {/* 4. Visual Bezier Curve Graph */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="bg-slate-950 rounded-lg p-2 border border-slate-800/80 shrink-0">
          <svg width={svgWidth} height={svgHeight} className="overflow-visible">
            <line x1={padding} y1={mapY(0)} x2={mapX(1)} y2={mapY(0)} stroke="#334155" strokeWidth="1" />
            <line x1={padding} y1={mapY(1)} x2={mapX(1)} y2={mapY(1)} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
            <line x1={padding} y1={mapY(0)} x2={padding} y2={mapY(1)} stroke="#334155" strokeWidth="1" />
            <line x1={mapX(1)} y1={mapY(0)} x2={mapX(1)} y2={mapY(1)} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
            <path d={svgPathData} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={p1.x} cy={p1.y} r="4" fill="#38bdf8" />
            <circle cx={p2.x} cy={p2.y} r="4" fill="#818cf8" />
          </svg>
        </div>
        <div className="space-y-1 text-xs text-slate-400">
          <span className="font-semibold text-slate-200 block">Curve Easing Reference</span>
          <p className="text-[11px] font-mono text-cyan-400">{motionData.easingName}</p>
          <p className="text-[11px] text-slate-400 pt-1">
            Tailwind class: <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded font-mono">{motionData.tailwindClass}</code>
          </p>
        </div>
      </div>
    </div>
  );
};
