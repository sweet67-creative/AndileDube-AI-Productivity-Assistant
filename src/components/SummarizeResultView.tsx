/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  CheckSquare,
  ListFilter,
  Copy,
  Check,
  Calendar,
  User,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { SummarizeResponse } from '../types';

interface SummarizeResultViewProps {
  result: SummarizeResponse | null;
  onDraftReply: (summary: SummarizeResponse) => void;
  onClear: () => void;
}

export const SummarizeResultView: React.FC<SummarizeResultViewProps> = ({
  result,
  onDraftReply,
  onClear,
}) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = async () => {
    const lines: string[] = [];
    if (result.subject) lines.push(`Topic: ${result.subject}\n`);
    lines.push(`Executive Summary:\n${result.summary}\n`);

    if (result.keyPoints && result.keyPoints.length > 0) {
      lines.push('Key Points:');
      result.keyPoints.forEach((p) => lines.push(`• ${p}`));
      lines.push('');
    }

    if (result.actionItems && result.actionItems.length > 0) {
      lines.push('Action Items & Deadlines:');
      result.actionItems.forEach((item) => {
        let line = `• ${item.task}`;
        if (item.assigneeOrRole) line += ` (Assigned: ${item.assigneeOrRole})`;
        if (item.deadline) line += ` [Due: ${item.deadline}]`;
        lines.push(line);
      });
    }

    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Top Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Executive Email Summary
            </h3>
            {result.subject && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                {result.subject}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear Summary"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5">
        {/* Main Summary Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Overview
          </div>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            {result.summary}
          </p>
        </div>

        {/* Action Items */}
        {result.actionItems && result.actionItems.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
              <span>Action Items, Tasks & Decisions</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                {result.actionItems.length}
              </span>
            </div>

            <div className="space-y-2">
              {result.actionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item.task}</span>
                  </div>

                  <div className="flex items-center gap-2 pl-6 sm:pl-0 flex-shrink-0">
                    {item.assigneeOrRole && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        <User className="w-3 h-3 text-slate-400" />
                        {item.assigneeOrRole}
                      </span>
                    )}
                    {item.deadline && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50 font-medium">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        {item.deadline}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Points */}
        {result.keyPoints && result.keyPoints.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              <ListFilter className="w-3.5 h-3.5 text-violet-500" />
              <span>Key Points</span>
            </div>
            <ul className="space-y-1.5 pl-1">
              {result.keyPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button to generate reply */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onDraftReply(result)}
            className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <span>Draft Email Response Addressing These Points</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
