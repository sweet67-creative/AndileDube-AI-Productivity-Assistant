/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, CheckSquare, ListFilter, AlignLeft, AlertCircle } from 'lucide-react';
import { SummarizeFormat, SummarizeEmailParams } from '../types';

interface SummarizeFormProps {
  onSummarize: (params: SummarizeEmailParams) => Promise<void>;
  isLoading: boolean;
  initialText?: string;
}

const SAMPLE_LONG_EMAIL = `Hi Team,

I hope everyone had a productive week. Following up on this morning's executive committee meeting regarding the Q3 product roadmap and cloud infrastructure migration.

First, the DevOps team confirmed that our database migration will proceed this coming Saturday starting at 11:00 PM UTC. We anticipate approximately 45 minutes of scheduled downtime. Please alert enterprise clients by Thursday 5:00 PM EST. Mark, could you please prepare the status page banner and email blast by Wednesday noon for review?

Second, regarding budget allocations for Q4, our department requires finalized hardware expense projections submitted to Sarah in Finance no later than October 15th. Every team lead must cross-check their contractor hours before the submission cutoff.

Third, our UX research session for the new checkout flow is scheduled for next Tuesday at 2:00 PM. All frontend developers are encouraged to attend to observe customer friction points firsthand.

Please let me know if there are any blockers before our Wednesday sync.

Best regards,
Michael Scott
Director of Engineering`;

const FORMAT_OPTIONS: Array<{
  id: SummarizeFormat;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    id: 'action_items',
    label: 'Action Items',
    icon: CheckSquare,
    description: 'Tasks, deadlines & decisions',
  },
  {
    id: 'key_points',
    label: 'Key Points',
    icon: ListFilter,
    description: 'Bulleted core takeaways',
  },
  {
    id: 'short_summary',
    label: 'Short Summary',
    icon: AlignLeft,
    description: 'Crisp 2-3 sentence overview',
  },
  {
    id: 'one_sentence',
    label: 'One Sentence',
    icon: FileText,
    description: 'Executive one-line takeaway',
  },
];

export const SummarizeForm: React.FC<SummarizeFormProps> = ({
  onSummarize,
  isLoading,
  initialText = '',
}) => {
  const [emailText, setEmailText] = useState(initialText);
  const [format, setFormat] = useState<SummarizeFormat>('action_items');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) {
      setError('Please enter or paste the email you want to summarize.');
      return;
    }
    setError(null);
    await onSummarize({
      emailText: emailText.trim(),
      format,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Paste Long Email Thread
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Extract action items, key decisions, deadlines, or get a quick executive summary.
          </p>
        </div>
        {!emailText && (
          <button
            type="button"
            onClick={() => {
              setEmailText(SAMPLE_LONG_EMAIL);
              setError(null);
            }}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            Try sample
          </button>
        )}
      </div>

      {/* Textarea */}
      <div className="space-y-1.5">
        <textarea
          id="summarize-email-input"
          rows={7}
          value={emailText}
          onChange={(e) => {
            setEmailText(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste lengthy email chain, meeting recap, or newsletter..."
          className={`w-full p-3.5 rounded-xl text-sm bg-white dark:bg-slate-900 border ${
            error
              ? 'border-rose-400 ring-2 ring-rose-400/20'
              : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          } text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all font-sans`}
        />
        {error && (
          <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Summary Format Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Summary Output Format
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FORMAT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = format === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`format-btn-${opt.id}`}
                onClick={() => setFormat(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 ring-1 ring-indigo-600 text-indigo-950 dark:text-indigo-200'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <div>
                  <div className="font-semibold text-xs">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {opt.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        id="btn-submit-summarize"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-60 disabled:pointer-events-none shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Analyzing & summarizing email...</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 text-indigo-200" />
            <span>Summarize Email</span>
          </>
        )}
      </button>
    </form>
  );
};
