import React, { useRef, useState } from 'react';
import { Code2, Upload, Clipboard, Trash2, Zap, Globe, Loader2, Bookmark, CheckCircle } from 'lucide-react';
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
  const [inputMode, setInputMode] = useState<'code' | 'url'>('code');
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
      }
    };
    reader.readAsText(file);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (text.startsWith('http://') || text.startsWith('https://')) {
          setInputMode('url');
          setTargetUrl(text);
        } else {
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

  const lines = snippet.split('\n').length;
  const chars = snippet.length;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Panel Header & Mode Selector */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setInputMode('code')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'code'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Raw Code</span>
          </button>

          <button
            onClick={() => setInputMode('url')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'url'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Paste Website URL</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {inputMode === 'code' && (
            <>
              <button
                onClick={handlePasteClipboard}
                className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3 h-3" />
                <span className="hidden sm:inline">Paste</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                title="Upload snippet file"
              >
                <Upload className="w-3 h-3" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.css,.txt,.svg"
                className="hidden"
                onChange={handleFileUpload}
              />
            </>
          )}

          <button
            onClick={() => onChangeSnippet('')}
            disabled={!snippet}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Quick Toolbar */}
      <div className="px-3 py-1.5 border-b border-slate-800/70 bg-slate-950/30 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
          Presets:
        </span>
        {SHOWCASE_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setInputMode('code');
              onSelectPreset(p);
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-medium shrink-0 transition-all ${
              activePresetId === p.id && inputMode === 'code'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
            }`}
          >
            {p.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Mode Body */}
      {inputMode === 'url' ? (
        <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-slate-950 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 block text-xs">
              Enter any public website URL:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchUrl()}
                placeholder="https://tailwindui.com, https://github.com, etc."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleFetchUrl}
                disabled={isFetchingUrl || !targetUrl.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
              >
                {isFetchingUrl ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Reverse</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner with Bookmarklet Callout */}
          {fetchError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-2">
              <p className="font-semibold">⚠️ Remote Site Protected or Blocked by CORS</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Many modern sites block external proxies or are dynamic Single Page Apps (SPAs).
                Use our <strong>1-Click Bookmarklet</strong> directly on that page to capture the exact rendered element instantly!
              </p>
              {onOpenBookmarklet && (
                <button
                  onClick={onOpenBookmarklet}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 font-semibold text-xs hover:bg-slate-850"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Get 1-Click Bookmarklet
                </button>
              )}
            </div>
          )}

          {/* Extracted Sections Picker */}
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
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
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

          {/* Explanatory Callout */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
            <p className="font-semibold text-slate-300 flex items-center gap-1">
              <span>💡</span> Why the 1-Click Bookmarklet is the fastest path for complex websites:
            </p>
            <p>
              Modern web apps (Linear, Stripe, Apple, React/Next.js) render their HTML dynamically using JavaScript and live behind browser CORS security.
            </p>
            <p>
              The <strong>ReverseUI Bookmarklet</strong> runs directly in your active tab, extracts the exact rendered DOM node + computed CSS styles with 0 latency, and requires zero servers.
            </p>
          </div>
        </div>
      ) : (
        /* Code Editor Mode */
        <div className="relative flex-1 flex flex-col min-h-[300px]">
          <textarea
            value={snippet}
            onChange={(e) => onChangeSnippet(e.target.value)}
            placeholder="Paste raw HTML, CSS <style> block, minified DOM markup, or CSS animation here..."
            className="w-full flex-1 p-3.5 bg-slate-950 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed selection:bg-cyan-500 selection:text-white"
            spellCheck={false}
          />
        </div>
      )}

      {/* Panel Footer */}
      <div className="px-3.5 py-2 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-[11px]">
        <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoDecompile}
            onChange={(e) => onToggleAutoDecompile(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
          />
          Live auto-decompile
        </label>

        <span className="text-slate-500 font-mono text-[10px]">
          {lines} lines • {chars} bytes
        </span>

        {!autoDecompile && (
          <button
            onClick={onTriggerDecompile}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
          >
            <Zap className="w-3 h-3" />
            Decompile
          </button>
        )}
      </div>
    </div>
  );
};
