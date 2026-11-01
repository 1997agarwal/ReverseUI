import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { LiveSandbox } from './components/LiveSandbox';
import { EvidencePanel } from './components/EvidencePanel';
import { StatsBar } from './components/StatsBar';
import { BookmarkletModal } from './components/BookmarkletModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { SHOWCASE_PRESETS, Preset } from './lib/presets';
import { reverseEngineerSnippet, ReverseEngineResult } from './lib/reverseEngine';

export function App() {
  const [currentPresetId, setCurrentPresetId] = useState<string>(SHOWCASE_PRESETS[0].id);
  const [snippet, setSnippet] = useState<string>(SHOWCASE_PRESETS[0].rawSnippet);
  const [autoDecompile, setAutoDecompile] = useState<boolean>(true);
  const [bookmarkletOpen, setBookmarkletOpen] = useState<boolean>(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState<boolean>(false);
  const [activeMobileView, setActiveMobileView] = useState<'input' | 'sandbox' | 'evidence'>('sandbox');

  // Check URL query parameters for snippet captured via bookmarklet
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const snippetParam = urlParams.get('snippet');
      if (snippetParam) {
        setSnippet(snippetParam);
        setCurrentPresetId('');
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Compute decompiled result
  const engineResult: ReverseEngineResult = useMemo(() => {
    return reverseEngineerSnippet(snippet || '<div class="empty"></div>');
  }, [snippet]);

  const handleSelectPreset = (preset: Preset) => {
    setCurrentPresetId(preset.id);
    setSnippet(preset.rawSnippet);
  };

  const handleReset = () => {
    setCurrentPresetId('');
    setSnippet('');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Header */}
      <Header
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
        onOpenBookmarklet={() => setBookmarkletOpen(true)}
        onOpenHowItWorks={() => setHowItWorksOpen(true)}
        onReset={handleReset}
      />

      {/* Mobile/Tablet View Selector Tabs */}
      <div className="flex xl:hidden border-b border-slate-800 bg-slate-900/80 px-4 py-1.5 gap-2">
        <button
          onClick={() => setActiveMobileView('input')}
          className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors ${
            activeMobileView === 'input'
              ? 'bg-cyan-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Input
        </button>
        <button
          onClick={() => setActiveMobileView('sandbox')}
          className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors ${
            activeMobileView === 'sandbox'
              ? 'bg-cyan-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Live Sandbox
        </button>
        <button
          onClick={() => setActiveMobileView('evidence')}
          className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors ${
            activeMobileView === 'evidence'
              ? 'bg-cyan-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Decompiled Output
        </button>
      </div>

      {/* 2. Main 3-Column Studio Grid */}
      <main className="flex-1 p-3 overflow-hidden">
        {/* Desktop 3-Column Layout */}
        <div className="hidden xl:grid xl:grid-cols-12 gap-3 h-full">
          {/* Column 1: Input Editor (4 cols = ~33%) */}
          <div className="col-span-4 h-full overflow-hidden">
            <InputPanel
              snippet={snippet}
              onChangeSnippet={(newVal) => {
                setSnippet(newVal);
                setCurrentPresetId('');
              }}
              onSelectPreset={handleSelectPreset}
              activePresetId={currentPresetId}
              onTriggerDecompile={() => {}}
              autoDecompile={autoDecompile}
              onToggleAutoDecompile={setAutoDecompile}
              onOpenBookmarklet={() => setBookmarkletOpen(true)}
            />
          </div>

          {/* Column 2: Live Sandbox (4 cols = ~33%) */}
          <div className="col-span-4 h-full overflow-hidden">
            <LiveSandbox snippet={snippet} />
          </div>

          {/* Column 3: Decompiled Evidence & Output (4 cols = ~33%) */}
          <div className="col-span-4 h-full overflow-hidden">
            <EvidencePanel engineResult={engineResult} />
          </div>
        </div>

        {/* Mobile / Tablet Single Active View */}
        <div className="xl:hidden h-full overflow-hidden">
          {activeMobileView === 'input' && (
            <InputPanel
              snippet={snippet}
              onChangeSnippet={(newVal) => {
                setSnippet(newVal);
                setCurrentPresetId('');
              }}
              onSelectPreset={handleSelectPreset}
              activePresetId={currentPresetId}
              onTriggerDecompile={() => {}}
              autoDecompile={autoDecompile}
              onToggleAutoDecompile={setAutoDecompile}
              onOpenBookmarklet={() => setBookmarkletOpen(true)}
            />
          )}

          {activeMobileView === 'sandbox' && <LiveSandbox snippet={snippet} />}

          {activeMobileView === 'evidence' && <EvidencePanel engineResult={engineResult} />}
        </div>
      </main>

      {/* 3. Bottom Stats Bar */}
      <StatsBar stats={engineResult.stats} />

      {/* 4. Bookmarklet Modal */}
      <BookmarkletModal
        isOpen={bookmarkletOpen}
        onClose={() => setBookmarkletOpen(false)}
      />

      {/* 5. How It Works Modal (PM & Designer Guide) */}
      <HowItWorksModal
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
        onOpenBookmarklet={() => setBookmarkletOpen(true)}
      />
    </div>
  );
}

export default App;
