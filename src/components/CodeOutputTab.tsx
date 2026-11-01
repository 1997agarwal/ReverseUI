import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle2, Sparkles } from 'lucide-react';
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
      {/* Friendly Action Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 font-sans">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">{componentName}.tsx</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Production-Ready
              </span>
              {hasFramerMotion && (
                <span className="text-[10px] text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20 px-2 py-0.5 rounded-full font-semibold">
                  Framer Motion
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Clean React 18 + Tailwind CSS + Framer Motion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy React Component'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-750 transition-colors"
            title="Download .tsx file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download</span>
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
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400 font-sans">
        <span className="flex items-center gap-1.5 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{lines} lines • {chars} characters</span>
        </span>
        <span className="text-slate-500 text-[11px]">Paste directly into any Next.js, Vite, or React project</span>
      </div>
    </div>
  );
};
