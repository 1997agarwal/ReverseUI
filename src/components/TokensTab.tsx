import React, { useState } from 'react';
import { Palette, Type, Box, Check } from 'lucide-react';
import { ExtractedTokens } from '../lib/tokenExtractor';

interface TokensTabProps {
  tokens: ExtractedTokens;
}

export const TokensTab: React.FC<TokensTabProps> = ({ tokens }) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 1800);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto p-5 space-y-6 text-xs">
      {/* 1. Color Palette */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="text-sm">Tailwind Color Palette</span>
          </div>
          <span className="text-[11px] text-slate-500">Click any card to copy class</span>
        </div>

        {tokens.colors.length === 0 ? (
          <p className="text-slate-500 py-3 text-center">No explicit color declarations found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {tokens.colors.map((c, idx) => {
              const chipId = `color-${idx}`;
              const isCopied = copiedItem === chipId;
              return (
                <div
                  key={idx}
                  onClick={() => copyToClipboard(c.tailwindClass, chipId)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 cursor-pointer transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg border border-slate-700/80 shadow-md shrink-0 ring-2 ring-black/20"
                      style={{ backgroundColor: c.matchedHex }}
                    />
                    <div>
                      <div className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors text-xs">
                        {c.tailwindClass}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {c.original}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    {isCopied ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors">
                        Copy
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Typography */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Type className="w-4 h-4 text-emerald-400" />
            <span className="text-sm">Typography & Text Scale</span>
          </div>
          <span className="text-[11px] text-slate-500">Standardized scale</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Font Sizes */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Font Sizes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tokens.typography.fontSizes.length === 0 ? (
                <span className="text-slate-500">Default (text-base)</span>
              ) : (
                tokens.typography.fontSizes.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyToClipboard(item.token, `fs-${idx}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono text-[11px] border border-slate-700/60 flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="font-semibold text-emerald-400">{item.token}</span>
                    <span className="text-[10px] text-slate-500">({item.original})</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Font Weights */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Font Weights
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tokens.typography.fontWeights.length === 0 ? (
                <span className="text-slate-500">Default (font-normal)</span>
              ) : (
                tokens.typography.fontWeights.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyToClipboard(item.token, `fw-${idx}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono text-[11px] border border-slate-700/60 flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="font-semibold text-sky-400">{item.token}</span>
                    <span className="text-[10px] text-slate-500">({item.original})</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Corners & Elevation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Box className="w-4 h-4 text-purple-400" />
            <span className="text-sm">Corners & Elevation</span>
          </div>
          <span className="text-[11px] text-slate-500">Radii, Shadows & Blur</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Border Radii */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Corner Radius
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tokens.radii.length === 0 ? (
                <span className="text-slate-500">None</span>
              ) : (
                tokens.radii.map((r, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 font-mono text-[11px] border border-purple-500/20 font-semibold"
                  >
                    {r.token}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Shadows */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Box Shadow
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tokens.shadows.length === 0 ? (
                <span className="text-slate-500">None</span>
              ) : (
                tokens.shadows.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 font-mono text-[11px] border border-sky-500/20 font-semibold"
                  >
                    {s.token}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Backdrop Blur */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Glassmorphism Blur
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tokens.blurs.length === 0 ? (
                <span className="text-slate-500">None</span>
              ) : (
                tokens.blurs.map((b, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 font-mono text-[11px] border border-cyan-500/20 font-semibold"
                  >
                    {b.token}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
