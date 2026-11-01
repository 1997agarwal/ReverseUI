import React, { useState } from 'react';
import { X, Sparkles, MousePointer, Globe, HeartHandshake } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookmarklet: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onOpenBookmarklet,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarklet' | 'url' | 'handoff'>('bookmarklet');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 text-base">
              💡
            </div>
            <div>
              <h3 className="font-bold text-base text-white">How ReverseUI Works (PM & Designer Guide)</h3>
              <p className="text-xs text-slate-400">Zero coding required. Go from inspiration on the web to production specs in 3 clicks.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 gap-4">
          <button
            onClick={() => setActiveTab('bookmarklet')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'bookmarklet'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            Method 1: The 1-Click Bookmarklet (Recommended)
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Method 2: Paste Any Website URL
          </button>

          <button
            onClick={() => setActiveTab('handoff')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'handoff'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            Developer Handoff Checklist
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {activeTab === 'bookmarklet' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs leading-relaxed">
                <strong>Why this is the best method:</strong> You don't have to inspect element, copy weird code, or learn HTML. You browse the web normally, click one button on your bookmarks bar, and ReverseUI does all the heavy lifting!
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-slate-200 text-xs">Setup (5 seconds)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Click <strong>"Get Bookmarklet"</strong> and drag the <strong>🔍 ReverseUI Inspector</strong> pill to your browser's bookmarks bar.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-slate-200 text-xs">Click the Bookmark</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    On any website (Stripe, Linear, Apple), click the bookmark. An inspector mode activates with a blue banner at the top.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-slate-200 text-xs">Point & Click the Element</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Move your mouse and click on the button, card, or navbar. ReverseUI opens instantly with that exact component decompiled!
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => {
                    onClose();
                    onOpenBookmarklet();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Grab the 1-Click Bookmarklet Now
                </button>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed">
                If you have a public link (e.g., a landing page, a product documentation page, or a marketing site), you can paste the URL directly into ReverseUI without opening that site first.
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-200 block text-xs">Click "Paste Website URL" in Column 1</strong>
                    <span className="text-xs text-slate-400">Switch from the raw code view to URL mode.</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-200 block text-xs">Enter the URL and click "Reverse"</strong>
                    <span className="text-xs text-slate-400">
                      ReverseUI will fetch the site and automatically discover key sections like <strong>Hero Section</strong>, <strong>Navigation Bar</strong>, or <strong>Feature Cards</strong>.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-200 block text-xs">Select any section to inspect and export</strong>
                    <span className="text-xs text-slate-400">
                      Click the component name you want to see it rendered live in the sandbox and copied as clean React code.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'handoff' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs leading-relaxed">
                <strong>What makes developers love ReverseUI:</strong> Instead of attaching a blurry screenshot and saying <em>"make it look like this"</em>, you give them clean, idiomatic React 18, standardized Tailwind CSS classes, and exact motion physics!
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                  📋 The PM Handoff Template (Copy into Jira / Linear / Slack)
                </h4>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed select-all">
                  Hey team! For our new UI component, here is the exact production-ready specification decompiled with ReverseUI:
                  <br /><br />
                  1. 🎨 <strong>Design Tokens</strong>: Exact Tailwind palette classes (background, typography, border radii, shadows).
                  <br />
                  2. ⚡ <strong>Motion Physics</strong>: Framer Motion spring config (stiffness, damping, mass) for fluid transitions.
                  <br />
                  3. 💻 <strong>React 18 Component</strong>: See attached .tsx code (exported directly from ReverseUI).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">ReverseUI • Built for Product Managers, Designers & Developers</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
