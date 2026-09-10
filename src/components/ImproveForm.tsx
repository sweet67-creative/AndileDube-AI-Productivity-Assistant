/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCheck, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { ImproveEmailParams } from '../types';

interface ImproveFormProps {
  onImprove: (params: ImproveEmailParams) => Promise<void>;
  isLoading: boolean;
  initialText?: string;
}

const SAMPLE_ROUGH_EMAIL = `Dear Mr Anderson,
i am writing to ask if you got my proposal yesterday. We did some mistakes in the budget calculation but now fixed. Please check attached file when you have time and tell me if its ok to proceed with the contract signing before friday.
thanks,
David`;

const IMPROVEMENT_AREAS = [
  'Grammar & Spelling accuracy',
  'Sentence structure & natural flow',
  'Executive clarity & conciseness',
  'Professional tone & etiquette',
  'Paragraph pacing & readability',
];

export const ImproveForm: React.FC<ImproveFormProps> = ({
  onImprove,
  isLoading,
  initialText = '',
}) => {
  const [emailText, setEmailText] = useState(initialText);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) {
      setError('Please paste the email you want to improve.');
      return;
    }
    setError(null);
    await onImprove({ emailText: emailText.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Paste Rough Email Draft
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Polishes grammar, spelling, structure, and professional flow while keeping your facts intact.
          </p>
        </div>
        {!emailText && (
          <button
            type="button"
            onClick={() => {
              setEmailText(SAMPLE_ROUGH_EMAIL);
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
          id="improve-email-input"
          rows={6}
          value={emailText}
          onChange={(e) => {
            setEmailText(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste draft with typos, informal phrasing, or awkward sentences here..."
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

      {/* Feature checklist pill grid */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Automated Polish Engine
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
          {IMPROVEMENT_AREAS.map((area) => (
            <div key={area} className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        id="btn-submit-improve"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-60 disabled:pointer-events-none shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Improving your email...</span>
          </>
        ) : (
          <>
            <CheckCheck className="w-4 h-4 text-indigo-200" />
            <span>Improve Email</span>
          </>
        )}
      </button>
    </form>
  );
};
