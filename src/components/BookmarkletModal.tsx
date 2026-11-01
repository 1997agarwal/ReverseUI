import React, { useState } from 'react';
import { X, Copy, Check, Bookmark, MousePointerClick, Sparkles } from 'lucide-react';

interface BookmarkletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookmarkletModal: React.FC<BookmarkletModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // The bookmarklet script extracts the targeted element and opens ReverseUI with encoded html
  const bookmarkletCode = `javascript:(function(){
  var hoveredEl = document.querySelector(':hover');
  var target = hoveredEl || document.activeElement || document.body;
  if(!target || target === document.body){
    alert('Please hover your mouse over an interesting element before clicking ReverseUI!');
    return;
  }
  var clone = target.cloneNode(true);
  var html = clone.outerHTML;
  var computed = window.getComputedStyle(target);
  var css = '<style>\\n/* Extracted style */\\n.extracted-element { ' +
    'background-color: ' + computed.backgroundColor + '; ' +
    'color: ' + computed.color + '; ' +
    'font-size: ' + computed.fontSize + '; ' +
    'font-weight: ' + computed.fontWeight + '; ' +
    'border-radius: ' + computed.borderRadius + '; ' +
    'box-shadow: ' + computed.boxShadow + '; ' +
    'backdrop-filter: ' + (computed.backdropFilter || 'none') + '; ' +
    'transition: ' + (computed.transition || 'none') + '; ' +
    '}\\n</style>';
  var fullSnippet = css + '\\n' + html;
  var url = 'https://1997agarwal.github.io/ReverseUI/?snippet=' + encodeURIComponent(fullSnippet);
  window.open(url, '_blank');
})();`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ReverseUI 1-Click Bookmarklet</h3>
              <p className="text-xs text-slate-400">Capture any UI snippet from any website into React + Tailwind</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center gap-3">
            <span className="text-slate-400 text-xs">
              👉 Drag this pill directly onto your browser's <strong className="text-slate-200">Bookmarks Bar</strong>:
            </span>
            <a
              href={bookmarkletCode}
              onClick={(e) => {
                // If clicked instead of dragged, notify user
                e.preventDefault();
                alert('Drag this button to your bookmarks bar, then click it while browsing any web page!');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all cursor-grab"
            >
              <Sparkles className="w-4 h-4" />
              🔍 ReverseUI Inspector
            </a>
            <span className="text-[11px] text-slate-500">
              Works in Chrome, Safari, Firefox, Edge, and Arc. Zero server tracking.
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5 text-cyan-400" /> How It Works
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-400 pl-1 leading-relaxed">
              <li>Navigate to any web page (e.g., Linear, Stripe, Apple, Vercel).</li>
              <li>Hover over or select any button, card, modal, or navigation bar.</li>
              <li>Click your <strong className="text-slate-200">🔍 ReverseUI Inspector</strong> bookmark.</li>
              <li>ReverseUI instantly opens with extracted DOM tokens, spring physics, and clean React code!</li>
            </ol>
          </div>

          {/* Copy Script directly */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 font-medium">Or copy script manually:</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied script!' : 'Copy Code'}
              </button>
            </div>
            <textarea
              readOnly
              value={bookmarkletCode}
              rows={3}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 font-mono text-[11px] text-slate-400 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
