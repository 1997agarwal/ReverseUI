import React from 'react';
import { Bookmark, Sparkles, Github, RotateCcw } from 'lucide-react';
import { SHOWCASE_PRESETS, Preset } from '../lib/presets';

interface HeaderProps {
  currentPresetId: string;
  onSelectPreset: (preset: Preset) => void;
  onOpenBookmarklet: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPresetId,
  onSelectPreset,
  onOpenBookmarklet,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 shadow-lg shadow-cyan-500/20 text-white font-bold text-lg">
            🔍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">ReverseUI</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Client-Side Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Reverse Engineer Any Web UI into Clean React 18 + Tailwind + Framer Motion
            </p>
          </div>
        </div>

        {/* Preset Selector Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          {SHOWCASE_PRESETS.map((preset) => {
            const isSelected = currentPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-semibold'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
                title={preset.description}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenBookmarklet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Get the 1-click browser bookmarklet"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Get</span> Bookmarklet
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            title="Reset to blank template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <a
            href="https://github.com/1997agarwal/ReverseUI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-slate-100 border border-slate-700 shadow-sm transition-all"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
