import React, { useState } from 'react';
import { Palette, Type, Box, Copy, Check } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto p-4 space-y-6 text-xs">
      {/* 1. Color Quantization */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Color Quantization ({tokens.colors.length})</span>
          </div>
          <span className="text-[10px] text-slate-400">Euclidean distance in RGB space</span>
        </div>

        {tokens.colors.length === 0 ? (
          <p className="text-slate-500 py-3 text-center">No explicit color declarations found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {tokens.colors.map((c, idx) => {
              const chipId = `color-${idx}`;
              const isCopied = copiedItem === chipId;
              return (
                <div
                  key={idx}
                  onClick={() => copyToClipboard(c.tailwindClass, chipId)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition-all group"
                  title="Click to copy Tailwind class"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-lg border border-slate-700/80 shadow-sm shrink-0"
                      style={{ backgroundColor: c.matchedHex }}
                    />
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                        {c.tailwindClass}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {c.original} → {c.matchedHex}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span className="text-slate-500 mr-1">Δ {c.distance}</span>
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Typography Scale */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Type className="w-4 h-4 text-emerald-400" />
            <span>Typography Matrix</span>
          </div>
          <span className="text-[10px] text-slate-400">Tailwind Font Scale</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {/* Font Sizes */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Font Sizes</span>
            <div className="flex flex-wrap gap-1.5">
              {tokens.typography.fontSizes.length === 0 ? (
                <span className="text-slate-500">Default (text-base)</span>
              ) : (
                tokens.typography.fontSizes.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyToClipboard(item.token, `fs-${idx}`)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono text-[11px] border border-slate-700/50 flex items-center gap-1"
                  >
                    <span>{item.token}</span>
                    <span className="text-[9px] text-slate-500">({item.original})</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Font Weights */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Font Weights</span>
            <div className="flex flex-wrap gap-1.5">
              {tokens.typography.fontWeights.length === 0 ? (
                <span className="text-slate-500">Default (font-normal)</span>
              ) : (
                tokens.typography.fontWeights.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyToClipboard(item.token, `fw-${idx}`)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono text-[11px] border border-slate-700/50 flex items-center gap-1"
                  >
                    <span>{item.token}</span>
                    <span className="text-[9px] text-slate-500">({item.original})</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Elevation & Radius */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Box className="w-4 h-4 text-purple-400" />
            <span>Elevation & Radius Tokens</span>
          </div>
          <span className="text-[10px] text-slate-400">Radii, Shadows, Blur</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          {/* Border Radii */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Border Radii</span>
            <div className="flex flex-wrap gap-1">
              {tokens.radii.length === 0 ? (
                <span className="text-slate-500">None</span>
              ) : (
                tokens.radii.map((r, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono text-[11px] border border-purple-500/20"
                  >
                    {r.token}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Shadows */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Box Shadows</span>
            <div className="flex flex-wrap gap-1">
              {tokens.shadows.length === 0 ? (
                <span className="text-slate-500">None</span>
              ) : (
                tokens.shadows.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[11px] border border-sky-500/20"
                  >
                    {s.token}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Backdrop Blur */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Backdrop Blur</span>
            <div className="flex flex-wrap gap-1">
              {tokens.blurs.length === 0 ? (
                <span className="text-slate-500">None</span>
              ) : (
                tokens.blurs.map((b, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px] border border-cyan-500/20"
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
