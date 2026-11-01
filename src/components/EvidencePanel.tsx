import React, { useState } from 'react';
import { Code, Palette, Activity } from 'lucide-react';
import { CodeOutputTab } from './CodeOutputTab';
import { TokensTab } from './TokensTab';
import { MotionPhysicsTab } from './MotionPhysicsTab';
import { ReverseEngineResult } from '../lib/reverseEngine';

interface EvidencePanelProps {
  engineResult: ReverseEngineResult;
}

type TabType = 'code' | 'tokens' | 'motion';

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ engineResult }) => {
  const [activeTab, setActiveTab] = useState<TabType>('code');

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
      {/* Friendly Tabs Navigation Header */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/70">
        <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'code'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>React Code</span>
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'tokens'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Design Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('motion')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'motion'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Motion Feel</span>
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'code' && (
          <CodeOutputTab
            code={engineResult.jsx.code}
            componentName={engineResult.jsx.componentName}
            hasFramerMotion={engineResult.jsx.hasFramerMotion}
          />
        )}

        {activeTab === 'tokens' && <TokensTab tokens={engineResult.tokens} />}

        {activeTab === 'motion' && <MotionPhysicsTab motionData={engineResult.motion} />}
      </div>
    </div>
  );
};
