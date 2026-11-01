import React from 'react';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';
import { ReverseEngineStats } from '../lib/reverseEngine';

interface StatsBarProps {
  stats: ReverseEngineStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/90 px-4 py-2 text-xs text-slate-400">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Friendly Reassuring Badges */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Client-Side Conversion</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Colors Extracted:</span>
            <span className="text-amber-400 font-semibold">{stats.colorsExtracted}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">HTML Elements Cleaned:</span>
            <span className="text-emerald-400 font-semibold">{stats.nodeCount}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Private (Runs locally in your browser)</span>
          </div>
        </div>

        {/* Right: Guarantee & Target */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Check className="w-3.5 h-3.5" /> $0/mo Forever • Zero Server Costs
          </span>
          <span className="text-slate-600">|</span>
          <a
            href="https://1997agarwal.github.io/ReverseUI/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-colors font-medium"
          >
            1997agarwal.github.io/ReverseUI
          </a>
        </div>
      </div>
    </footer>
  );
};
