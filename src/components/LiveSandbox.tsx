import React, { useState, useRef } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Moon,
  Sun,
  Grid,
  RotateCw,
  Eye,
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
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Sandbox Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Live Sandbox</h2>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-0.5 border border-slate-800">
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded text-xs transition-colors ${
              viewport === 'mobile'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded text-xs transition-colors ${
              viewport === 'tablet'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded text-xs transition-colors ${
              viewport === 'desktop'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded text-xs border transition-colors ${
              showGrid
                ? 'bg-slate-800 border-slate-700 text-cyan-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle alignment grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsDarkCanvas(!isDarkCanvas)}
            className="p-1.5 rounded text-xs bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isDarkCanvas ? 'Switch to light canvas' : 'Switch to dark canvas'}
          >
            {isDarkCanvas ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>

          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="p-1.5 rounded text-xs bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reload sandbox preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sandbox Viewport Stage */}
      <div
        className={`relative flex-1 flex items-center justify-center p-4 transition-colors overflow-auto ${
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
              className="w-full h-full min-h-[350px] rounded-xl border border-dashed border-slate-800/80 shadow-inner bg-transparent"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <p className="text-sm font-medium">No component markup loaded</p>
              <p className="text-xs text-slate-600 mt-1">Select a preset on the left or paste your code snippet</p>
            </div>
          )}
        </div>
      </div>

      {/* Sandbox Status Bar */}
      <div className="px-3.5 py-1.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-[11px] text-slate-400">
        <span>Active Viewport: <strong className="text-slate-300 capitalize">{viewport}</strong></span>
        <span>Isolated iframe Sandbox • Full CSS & Hover state emulation</span>
      </div>
    </div>
  );
};
