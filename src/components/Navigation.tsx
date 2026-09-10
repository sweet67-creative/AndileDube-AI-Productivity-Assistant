/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, RefreshCw, CheckCheck, FileText, Languages, History } from 'lucide-react';
import { ActiveTool } from '../types';

interface NavigationProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  historyCount?: number;
}

const TOOLS: Array<{
  id: ActiveTool;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
}> = [
  {
    id: 'generator',
    label: 'Generate Email',
    icon: Sparkles,
    description: 'Compose from instructions',
  },
  {
    id: 'rewrite',
    label: 'Rewrite',
    icon: RefreshCw,
    description: 'Change tone & phrasing',
  },
  {
    id: 'improve',
    label: 'Improve',
    icon: CheckCheck,
    description: 'Fix grammar & clarity',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    icon: FileText,
    description: 'Action items & overview',
  },
  {
    id: 'translate',
    label: 'Translate',
    icon: Languages,
    description: '14+ global languages',
  },
  {
    id: 'history',
    label: 'History',
    icon: History,
    description: 'Saved emails & drafts',
  },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTool,
  onSelectTool,
  historyCount = 0,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                id={`nav-tab-${tool.id}`}
                onClick={() => onSelectTool(tool.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{tool.label}</span>
                {tool.id === 'history' && historyCount > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {historyCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
