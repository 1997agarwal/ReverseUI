import React, { useRef, useState } from 'react';
import {
  Sparkles,
  Globe,
  Code2,
  Upload,
  Clipboard,
  Trash2,
  Zap,
  Loader2,
  Bookmark,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { SHOWCASE_PRESETS, Preset } from '../lib/presets';
import { fetchWebsiteHtml, extractSectionsFromHtml, ExtractedSection } from '../lib/urlFetcher';

interface InputPanelProps {
  snippet: string;
  onChangeSnippet: (newVal: string) => void;
  onSelectPreset: (preset: Preset) => void;
  activePresetId?: string;
  onTriggerDecompile: () => void;
  autoDecompile: boolean;
  onToggleAutoDecompile: (val: boolean) => void;
  onOpenBookmarklet?: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  snippet,
  onChangeSnippet,
  onSelectPreset,
  activePresetId,
  onTriggerDecompile,
  autoDecompile,
  onToggleAutoDecompile,
  onOpenBookmarklet,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'url' | 'code'>('presets');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [extractedSections, setExtractedSections] = useState<ExtractedSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChangeSnippet(content);
        setActiveTab('code');
      }
    };
    reader.readAsText(file);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (text.startsWith('http://') || text.startsWith('https://')) {
          setActiveTab('url');
          setTargetUrl(text);
        } else {
          setActiveTab('code');
          onChangeSnippet(text);
        }
      }
    } catch {
      alert('Clipboard access unavailable. Please paste directly into the box.');
    }
  };

  const handleFetchUrl = async () => {
    if (!targetUrl.trim()) return;
    setIsFetchingUrl(true);
    setFetchError(null);
    setExtractedSections([]);

    try {
      const html = await fetchWebsiteHtml(targetUrl);
      const sections = extractSectionsFromHtml(html);

      if (sections.length > 0) {
        setExtractedSections(sections);
        setSelectedSectionId(sections[0].id);
        onChangeSnippet(sections[0].snippet);
      } else {
        onChangeSnippet(html);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch URL';
      setFetchError(message);
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleSelectSection = (section: ExtractedSection) => {
    setSelectedSectionId(section.id);
    onChangeSnippet(section.snippet);
  };

  const presetIcons: Record<string, string> = {
    'linear-command-palette': '⌘',
    'stripe-radiant-card': '✨',
    'apple-dynamic-island': '🏝️',
    'vercel-sliding-navbar': '🧭',
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
      {/* Friendly Segmented Tabs */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/70">
        <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'presets'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'url'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website Link</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'code'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Raw Code</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Showcase Presets (Visual & Friendly) */}
      {activeTab === 'presets' && (
        <div className="p-4 space-y-3 flex-1 overflow-y-auto bg-slate-950 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-xs tracking-tight">Pick an Inspiration Template</span>
            <span className="text-[11px] text-slate-500">1-click ready</span>
          </div>

          <div className="space-y-2.5">
            {SHOWCASE_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              const icon = presetIcons[preset.id] || '⚡';
              return (
                <div
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{icon}</span>
                      <strong className={`text-xs ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {preset.name}
                      </strong>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700/50">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                    {preset.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Friendly Bookmarklet Callout Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/20 text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                Want to capture any live website?
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Use the 1-Click Bookmarklet to point & click any element on Stripe, Linear, or Apple while browsing.
            </p>
            {onOpenBookmarklet && (
              <button
                onClick={onOpenBookmarklet}
                className="w-full py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-semibold text-xs border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Get 1-Click Bookmarklet</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Paste Website URL */}
      {activeTab === 'url' && (
        <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-slate-950 text-xs">
          <div className="space-y-2">
            <label className="font-semibold text-slate-200 block text-xs">
              Enter any public website address:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchUrl()}
                placeholder="https://tailwindcss.com, https://github.com..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 shadow-inner"
              />
              <button
                onClick={handleFetchUrl}
                disabled={isFetchingUrl || !targetUrl.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all shrink-0"
              >
                {isFetchingUrl ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Scan Site</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {fetchError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-2">
              <p className="font-semibold">⚠️ Protected by Bot Shield or CORS</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Modern dynamic sites like Stripe or Linear protect their HTML. Use the <strong>1-Click Bookmarklet</strong> directly on that page to capture the element instantly!
              </p>
              {onOpenBookmarklet && (
                <button
                  onClick={onOpenBookmarklet}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 font-semibold text-xs hover:bg-slate-850"
                >
                  Open Bookmarklet Setup
                </button>
              )}
            </div>
          )}

          {extractedSections.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="font-bold text-slate-300 text-xs block">
                Discovered Components ({extractedSections.length}):
              </span>
              <div className="space-y-2">
                {extractedSections.map((sec) => {
                  const isSelected = selectedSectionId === sec.id;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => handleSelectSection(sec)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs flex items-center gap-1.5">
                          {isSelected && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                          {sec.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 uppercase">&lt;{sec.tag}&gt;</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{sec.previewText}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 space-y-1 leading-relaxed">
            <span className="font-bold text-slate-300 block">💡 Pro Tip for Product Managers:</span>
            <p>
              For logged-in dashboards or interactive modals, the <strong>1-Click Bookmarklet</strong> is the fastest path because it captures your active screen directly with zero setup.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Paste Code */}
      {activeTab === 'code' && (
        <div className="flex-1 flex flex-col min-h-[300px] bg-slate-950">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800/80 bg-slate-950 text-[11px] text-slate-400">
            <span>Paste raw HTML + CSS snippet:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePasteClipboard}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <Clipboard className="w-2.5 h-2.5" />
                Paste
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <Upload className="w-2.5 h-2.5" />
                Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.css,.txt,.svg"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => onChangeSnippet('')}
                disabled={!snippet}
                className="p-1 rounded text-slate-400 hover:text-rose-400 disabled:opacity-40"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          <textarea
            value={snippet}
            onChange={(e) => onChangeSnippet(e.target.value)}
            placeholder="Paste raw HTML, CSS <style> block, minified DOM markup, or SVG icon here..."
            className="w-full flex-1 p-3.5 bg-slate-950 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed selection:bg-cyan-500 selection:text-white"
            spellCheck={false}
          />
        </div>
      )}

      {/* Panel Footer */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoDecompile}
            onChange={(e) => onToggleAutoDecompile(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
          />
          <span className="text-[11px] text-slate-300">Auto-update preview</span>
        </label>

        {!autoDecompile && (
          <button
            onClick={onTriggerDecompile}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
          >
            <Zap className="w-3 h-3" />
            Update
          </button>
        )}
      </div>
    </div>
  );
};
