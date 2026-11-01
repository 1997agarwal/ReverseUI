import React, { useState, useRef } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Moon,
  Sun,
  Grid,
  RotateCw,
  Sparkles,
} from 'lucide-react';

interface LiveSandboxProps {
  snippet: string;
}

type ViewportMode = 'mobile' | 'tablet' | 'desktop';

export const LiveSandbox: React.FC<LiveSandboxProps> = ({ snippet }) => {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [isDarkCanvas, setIsDarkCanvas] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Construct isolated iframe HTML document
  const buildIframeDoc = (raw: string, isDark: boolean) => {
    return `<!DOCTYPE html>
<html lang="en" class="${isDark ? 'dark' : 'light'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: transparent;
      color: ${isDark ? '#f8fafc' : '#0f172a'};
      overflow-x: hidden;
    }
  </style>
</head>
<body>
  ${raw}
</body>
</html>`;
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
      {/* Sandbox Window Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-bold text-white tracking-tight">Interactive Preview</span>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewport === 'desktop'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-750'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewport === 'tablet'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-750'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewport === 'mobile'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-750'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Phone</span>
          </button>
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg text-xs border transition-colors ${
              showGrid
                ? 'bg-slate-800 border-slate-700 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle background grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsDarkCanvas(!isDarkCanvas)}
            className="p-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isDarkCanvas ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkCanvas ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>

          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="p-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Refresh preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sandbox Viewport Stage */}
      <div
        className={`relative flex-1 flex items-center justify-center p-6 transition-colors overflow-auto ${
          isDarkCanvas ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
        } ${
          showGrid
            ? isDarkCanvas
              ? 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]'
              : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]'
            : ''
        }`}
      >
        <div
          className={`w-full h-full flex items-center justify-center transition-all duration-300 ${getViewportWidth()}`}
        >
          {snippet ? (
            <iframe
              key={`${refreshKey}-${isDarkCanvas}`}
              ref={iframeRef}
              title="ReverseUI Interactive Live Sandbox"
              sandbox="allow-scripts"
              srcDoc={buildIframeDoc(snippet, isDarkCanvas)}
              className="w-full h-full min-h-[350px] rounded-2xl border border-dashed border-slate-800/80 shadow-2xl bg-transparent"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <Sparkles className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No component selected yet</p>
              <p className="text-xs text-slate-500 mt-1">Pick a showcase preset on the left or paste a website link</p>
            </div>
          )}
        </div>
      </div>

      {/* Sandbox Status Bar */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive Canvas • Hover to test animations</span>
        </span>
        <span className="text-[11px] text-slate-500 capitalize">{viewport} view</span>
      </div>
    </div>
  );
};
