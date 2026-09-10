/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RefreshCw, AlertCircle, Sparkles, FileText } from 'lucide-react';
import { REWRITE_TONES } from '../constants';
import { RewriteToneOption, RewriteEmailParams } from '../types';

interface RewriteFormProps {
  onRewrite: (params: RewriteEmailParams) => Promise<void>;
  isLoading: boolean;
  initialText?: string;
}

const SAMPLE_RAW_EMAIL = `hey team, just wanted to check on the report. we need it soon or client will be mad. let me know what is happening asap thanks.`;

export const RewriteForm: React.FC<RewriteFormProps> = ({
  onRewrite,
  isLoading,
  initialText = '',
}) => {
  const [emailText, setEmailText] = useState(initialText);
  const [tone, setTone] = useState<RewriteToneOption>('Professional');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) {
      setError('Please paste the email you want to rewrite.');
      return;
    }
    setError(null);
    await onRewrite({
      emailText: emailText.trim(),
      tone,
      instructions: instructions.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Paste Existing Email
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AI will rewrite phrasing and style while preserving your exact meaning and facts.
          </p>
        </div>
        {!emailText && (
          <button
            type="button"
            onClick={() => {
              setEmailText(SAMPLE_RAW_EMAIL);
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
          id="rewrite-email-input"
          rows={6}
          value={emailText}
          onChange={(e) => {
            setEmailText(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste your rough draft or existing email here..."
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

      {/* Tone Selection Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Target Tone
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {REWRITE_TONES.map((t) => {
            const isSelected = tone === t.label;
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => setTone(t.label)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 ring-1 ring-indigo-600 text-indigo-950 dark:text-indigo-200'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="font-semibold text-xs">{t.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {t.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional instruction */}
      <div className="space-y-1">
        <label htmlFor="rewrite-custom-note" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Specific nuance or notes (Optional):
        </label>
        <input
          id="rewrite-custom-note"
          type="text"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g. emphasize urgency gently, or make it sound executive"
          className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        id="btn-submit-rewrite"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-60 disabled:pointer-events-none shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Rewriting your email...</span>
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 text-indigo-200" />
            <span>Rewrite Email</span>
          </>
        )}
      </button>
    </form>
  );
};
