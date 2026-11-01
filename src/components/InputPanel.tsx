import React, { useRef } from 'react';
import { Code2, Upload, Clipboard, Trash2, Zap } from 'lucide-react';
import { SHOWCASE_PRESETS, Preset } from '../lib/presets';

interface InputPanelProps {
  snippet: string;
  onChangeSnippet: (newVal: string) => void;
  onSelectPreset: (preset: Preset) => void;
  activePresetId?: string;
  onTriggerDecompile: () => void;
  autoDecompile: boolean;
  onToggleAutoDecompile: (val: boolean) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  snippet,
  onChangeSnippet,
  onSelectPreset,
  activePresetId,
  onTriggerDecompile,
  autoDecompile,
  onToggleAutoDecompile,
}) => {
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
        onChangeSnippet(text);
      }
    } catch {
      alert('Clipboard access denied or unavailable. Please paste directly into the editor.');
    }
  };

  const lines = snippet.split('\n').length;
  const chars = snippet.length;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Raw Input (HTML + CSS)</h2>
          <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
            {lines} lines • {chars} chars
          </span>
        </div>

        <div className="flex items-center gap-1.5">
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

          <button
            onClick={() => onChangeSnippet('')}
            disabled={!snippet}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Clear snippet"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Quick Toolbar */}
      <div className="px-3 py-2 border-b border-slate-800/70 bg-slate-950/30 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
          Load Sample:
        </span>
        {SHOWCASE_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPreset(p)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium shrink-0 transition-all ${
              activePresetId === p.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
            }`}
          >
            {p.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 flex flex-col min-h-[300px]">
        <textarea
          value={snippet}
          onChange={(e) => onChangeSnippet(e.target.value)}
          placeholder="Paste raw HTML, CSS <style> block, minified DOM markup, or CSS animation here..."
          className="w-full flex-1 p-3.5 bg-slate-950 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed selection:bg-cyan-500 selection:text-white"
          spellCheck={false}
        />
      </div>

      {/* Panel Footer */}
      <div className="px-3.5 py-2 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoDecompile}
            onChange={(e) => onToggleAutoDecompile(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
          />
          Live auto-decompile
        </label>

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
