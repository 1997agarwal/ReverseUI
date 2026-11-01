import React, { useState } from 'react';
import { X, Copy, Check, Bookmark, MousePointerClick, Sparkles, Laptop } from 'lucide-react';

interface BookmarkletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookmarkletModal: React.FC<BookmarkletModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [useProduction, setUseProduction] = useState(false);

  if (!isOpen) return null;

  // Detect current active URL of ReverseUI (e.g. http://localhost:5174/ReverseUI/)
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5174';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/ReverseUI/';
  const localBaseUrl = `${currentOrigin}${currentPath.endsWith('/') ? currentPath : currentPath + '/'}`;
  const productionBaseUrl = 'https://1997agarwal.github.io/ReverseUI/';

  const targetBaseUrl = useProduction ? productionBaseUrl : localBaseUrl;

  // The bookmarklet activates an interactive "Click-to-Pick" inspector overlay on any page!
  const bookmarkletCode = `javascript:(function(){
  if(window.__reverseUiActive) return;
  window.__reverseUiActive = true;

  /* 1. Create floating top banner */
  var banner = document.createElement('div');
  banner.id = '__reverseui_banner';
  banner.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#0f172a;color:#f8fafc;padding:10px 18px;border-radius:12px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:13px;font-weight:600;box-shadow:0 20px 25px -5px rgba(0,0,0,0.6);border:1px solid #38bdf8;display:flex;align-items:center;gap:10px;pointer-events:none;';
  banner.innerHTML = '<span style="font-size:16px;">🔍</span> <span>Click any element to reverse engineer it into React + Tailwind (Esc to cancel)</span>';
  document.body.appendChild(banner);

  /* 2. Create interactive hover highlight box */
  var box = document.createElement('div');
  box.id = '__reverseui_box';
  box.style.cssText = 'position:fixed;pointer-events:none;z-index:2147483646;border:2px solid #38bdf8;background:rgba(56,189,248,0.18);border-radius:6px;transition:all 0.08s ease-out;display:none;';
  document.body.appendChild(box);

  var currentTarget = null;

  function onMouseMove(e){
    var el = document.elementFromPoint(e.clientX, e.clientY);
    if(!el || el === banner || el === box || el.contains(banner)) return;
    currentTarget = el;
    var rect = el.getBoundingClientRect();
    box.style.display = 'block';
    box.style.top = rect.top + 'px';
    box.style.left = rect.left + 'px';
    box.style.width = rect.width + 'px';
    box.style.height = rect.height + 'px';
  }

  function cleanup(){
    window.__reverseUiActive = false;
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('keydown', onKeyDown, true);
    if(banner.parentNode) banner.parentNode.removeChild(banner);
    if(box.parentNode) box.parentNode.removeChild(box);
  }

  function onClick(e){
    e.preventDefault();
    e.stopPropagation();
    if(!currentTarget) return;
    var target = currentTarget;
    cleanup();

    var clone = target.cloneNode(true);
    var html = clone.outerHTML;
    var computed = window.getComputedStyle(target);
    var css = '<style>\\n.extracted-element { ' +
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
    var targetUrl = "${targetBaseUrl}?snippet=" + encodeURIComponent(fullSnippet);
    window.open(targetUrl, '_blank');
  }

  function onKeyDown(e){
    if(e.key === 'Escape'){
      cleanup();
    }
  }

  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', onKeyDown, true);
})();`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Interactive Click-to-Pick Bookmarklet</h3>
              <p className="text-xs text-slate-400">Captures any element and opens ReverseUI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Switcher */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-cyan-400" />
            Destination:
          </span>
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setUseProduction(false)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                !useProduction
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Local App ({localBaseUrl.replace(/https?:\/\//, '').replace(/\/$/, '')})
            </button>
            <button
              onClick={() => setUseProduction(true)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                useProduction
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GitHub Pages (1997agarwal)
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center gap-3">
            <span className="text-slate-400 text-xs">
              👉 Drag this pill directly onto your browser's <strong className="text-slate-200">Bookmarks Bar</strong>:
            </span>
            <a
              href={bookmarkletCode}
              onClick={(e) => {
                e.preventDefault();
                alert('Drag this button up to your browser bookmarks bar! Then on any website, click it to activate Click-to-Pick mode.');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all cursor-grab"
            >
              <Sparkles className="w-4 h-4" />
              🔍 ReverseUI Inspector
            </a>
            <span className="text-[11px] text-slate-500">
              Points to: <code className="text-cyan-400 font-mono">{targetBaseUrl}</code>
            </span>
          </div>

          <div className="space-y-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5 text-cyan-400" /> How It Works in 2 Simple Clicks:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-400 pl-1 leading-relaxed">
              <li>
                <strong className="text-slate-200">Click bookmark on any site:</strong> A blue banner appears at the top.
              </li>
              <li>
                <strong className="text-slate-200">Point & Click element:</strong> Hover and click the button, card, or modal you want!
              </li>
              <li>
                <strong className="text-slate-200">Auto-Opens ReverseUI:</strong> It immediately opens your running ReverseUI studio with the component decompiled!
              </li>
            </ol>
          </div>

          {/* Copy Script directly */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 font-medium">Or copy bookmark code manually:</span>
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
              rows={2}
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
