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
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Tabs Navigation Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'code'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>React + Tailwind JSX</span>
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tokens'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Design Tokens</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
              {engineResult.tokens.colors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('motion')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'motion'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Motion Physics</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Spring
            </span>
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
