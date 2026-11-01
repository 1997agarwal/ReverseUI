import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeOutputTabProps {
  code: string;
  componentName: string;
  hasFramerMotion: boolean;
}

export const CodeOutputTab: React.FC<CodeOutputTabProps> = ({
  code,
  componentName,
  hasFramerMotion,
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${componentName}.tsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lines = code.split('\n').length;
  const chars = code.length;

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-xs">
      {/* Code Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200">{componentName}.tsx</span>
          <span className="text-[10px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded">
            {lines} lines • {chars} bytes
          </span>
          {hasFramerMotion && (
            <span className="text-[10px] font-semibold text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20 px-1.5 py-0.5 rounded">
              Framer Motion
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSX!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Download .tsx file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Code Viewport with Syntax Highlighting */}
      <div className="flex-1 overflow-auto p-4 bg-slate-950">
        <pre className="!bg-transparent !p-0 !m-0 !font-mono text-xs leading-relaxed">
          <code ref={codeRef} className="language-tsx">
            {code}
          </code>
        </pre>
      </div>

      {/* Footer Banner */}
      <div className="px-3.5 py-1.5 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Client-Side React 18 + Tailwind
        </span>
        <span className="text-slate-500">Zero Server Telemetry</span>
      </div>
    </div>
  );
};
