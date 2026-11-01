import React from 'react';
import { Check, Cpu } from 'lucide-react';
import { ReverseEngineStats } from '../lib/reverseEngine';

interface StatsBarProps {
  stats: ReverseEngineStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const reductionPct = Math.max(
    0,
    Math.round(((stats.originalCharLength - stats.outputCharLength) / (stats.originalCharLength || 1)) * 100)
  );

  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/80 px-4 py-2 text-[11px] text-slate-400">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Engine Benchmarks */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>4-Stage AST Decompiler</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Latency:</span>
            <span className="text-slate-200 font-mono font-medium">{stats.processingTimeMs}ms</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">DOM Nodes:</span>
            <span className="text-slate-200 font-mono font-medium">{stats.nodeCount}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Semantic Tags Inferred:</span>
            <span className="text-emerald-400 font-mono font-semibold">{stats.semanticTagsInferred}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Colors Quantized:</span>
            <span className="text-amber-400 font-mono font-medium">{stats.colorsExtracted}</span>
          </div>

          {reductionPct > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Efficiency:</span>
              <span className="text-cyan-400 font-mono font-semibold">+{reductionPct}% cleaner</span>
            </div>
          )}
        </div>

        {/* Right: Guarantee & Target */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Check className="w-3.5 h-3.5" /> $0/mo Forever • Static GitHub Pages
          </span>
          <span className="text-slate-600">|</span>
          <a
            href="https://1997agarwal.github.io/ReverseUI/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-colors"
          >
            1997agarwal.github.io/ReverseUI
          </a>
        </div>
      </div>
    </footer>
  );
};
