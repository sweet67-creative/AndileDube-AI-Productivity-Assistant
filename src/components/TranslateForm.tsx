/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Languages, AlertCircle, Globe, FileText } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../constants';
import { TranslateEmailParams } from '../types';

interface TranslateFormProps {
  onTranslate: (params: TranslateEmailParams) => Promise<void>;
  isLoading: boolean;
  initialText?: string;
}

const SAMPLE_EMAIL_TRANSLATE = `Subject: Inquiry Regarding Your Partnership Proposal

Dear Mr. Dube,

Thank you very much for submitting the partnership proposal earlier this week. Our executive board reviewed your terms and we are excited about exploring collaboration opportunities.

Could you please provide your availability for a 30-minute introductory call next Tuesday or Wednesday?

Sincerely,
Sarah Jenkins
Head of Global Partnerships`;

export const TranslateForm: React.FC<TranslateFormProps> = ({
  onTranslate,
  isLoading,
  initialText = '',
}) => {
  const [emailText, setEmailText] = useState(initialText);
  const [targetLanguage, setTargetLanguage] = useState('isiZulu');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) {
      setError('Please paste the email you want to translate.');
      return;
    }
    setError(null);
    await onTranslate({
      emailText: emailText.trim(),
      targetLanguage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Translate Email
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Accurate translation maintaining professional cultural etiquette, greetings, and tone.
          </p>
        </div>
        {!emailText && (
          <button
            type="button"
            onClick={() => {
              setEmailText(SAMPLE_EMAIL_TRANSLATE);
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
          id="translate-email-input"
          rows={6}
          value={emailText}
          onChange={(e) => {
            setEmailText(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste email in any language here..."
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

      {/* Target Language Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="select-target-language" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>Target Language</span>
          </label>
          <span className="text-xs text-slate-400">Preserves etiquette & structure</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = targetLanguage === lang.name;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setTargetLanguage(lang.name)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 ring-1 ring-indigo-600 text-indigo-950 dark:text-indigo-200'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="font-semibold text-xs">{lang.name}</div>
                <div className="text-[10px] text-slate-400">{lang.nativeName}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        id="btn-submit-translate"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-60 disabled:pointer-events-none shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Translating to {targetLanguage}...</span>
          </>
        ) : (
          <>
            <Languages className="w-4 h-4 text-indigo-200" />
            <span>Translate to {targetLanguage}</span>
          </>
        )}
      </button>
    </form>
  );
};
