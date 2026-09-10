/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lightbulb,
  Send,
  Sliders,
  User,
  AlignLeft,
} from 'lucide-react';
import { EMAIL_TYPES, TONE_OPTIONS, LENGTH_OPTIONS, SAMPLE_PROMPTS } from '../constants';
import { EmailType, ToneOption, LengthOption, GenerateEmailParams } from '../types';

interface GeneratorFormProps {
  onGenerate: (params: GenerateEmailParams) => Promise<void>;
  isLoading: boolean;
  defaultSenderName?: string;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onGenerate,
  isLoading,
  defaultSenderName = 'Andile Dube',
}) => {
  const [emailPurpose, setEmailPurpose] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState(defaultSenderName);
  const [emailType, setEmailType] = useState<EmailType>('Follow-Up');
  const [tone, setTone] = useState<ToneOption>('Professional');
  const [length, setLength] = useState<LengthOption>('Medium');
  const [keyPoints, setKeyPoints] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailPurpose.trim()) {
      setValidationError('Please tell us what you want the email to be about.');
      return;
    }
    setValidationError(null);
    await onGenerate({
      emailPurpose: emailPurpose.trim(),
      recipientName: recipientName.trim(),
      senderName: senderName.trim(),
      emailType,
      tone,
      length,
      keyPoints: keyPoints.trim(),
      additionalInfo: additionalInfo.trim(),
    });
  };

  const applySamplePrompt = (sample: (typeof SAMPLE_PROMPTS)[0]) => {
    setEmailPurpose(sample.purpose);
    setEmailType(sample.type as EmailType);
    setTone(sample.tone as ToneOption);
    setLength(sample.length);
    setRecipientName(sample.recipient);
    setKeyPoints(sample.keyPoints);
    setValidationError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Quick Inspiration Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick prompt ideas:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              key={sample.title}
              type="button"
              onClick={() => applySamplePrompt(sample)}
              className="px-2.5 py-1 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 dark:text-indigo-300 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50 whitespace-nowrap transition-colors"
            >
              + {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Purpose Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="email-purpose" className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>Email Purpose</span>
            <span className="text-rose-500 text-xs">*</span>
          </label>
          <span className="text-xs text-slate-400">Be as brief or detailed as you like</span>
        </div>

        <div className="relative">
          <textarea
            id="email-purpose"
            rows={3}
            value={emailPurpose}
            onChange={(e) => {
              setEmailPurpose(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="e.g. Write an email to the hiring manager asking about the status of my job application for the Frontend Developer role..."
            className={`w-full p-3.5 rounded-xl text-sm bg-white dark:bg-slate-900 border ${
              validationError
                ? 'border-rose-400 ring-2 ring-rose-400/20 focus:border-rose-500'
                : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            } text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all`}
          />
        </div>

        {validationError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Email Type and Tone Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email Type */}
        <div className="space-y-1.5">
          <label htmlFor="select-email-type" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Email Type
          </label>
          <select
            id="select-email-type"
            value={emailType}
            onChange={(e) => setEmailType(e.target.value as EmailType)}
            className="w-full p-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
          >
            {EMAIL_TYPES.map((type) => (
              <option key={type.label} value={type.label}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tone Selector */}
        <div className="space-y-1.5">
          <label htmlFor="select-email-tone" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Tone
          </label>
          <select
            id="select-email-tone"
            value={tone}
            onChange={(e) => setTone(e.target.value as ToneOption)}
            className="w-full p-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
          >
            {TONE_OPTIONS.map((t) => (
              <option key={t.label} value={t.label}>
                {t.label} ({t.description})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Length Selector Pills */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Desired Length</span>
          <span className="text-[11px] font-normal text-slate-400 lowercase">
            {LENGTH_OPTIONS.find((l) => l.label === length)?.hint}
          </span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {LENGTH_OPTIONS.map((opt) => {
            const isSelected = length === opt.label;
            return (
              <button
                key={opt.label}
                type="button"
                id={`length-btn-${opt.label.toLowerCase()}`}
                onClick={() => setLength(opt.label)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipient and Sender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <label htmlFor="input-recipient" className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" />
            <span>Recipient Name (Optional)</span>
          </label>
          <input
            id="input-recipient"
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="e.g. Jane Smith, Hiring Team"
            className="w-full p-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="input-sender" className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" />
            <span>Sender Name (Signature)</span>
          </label>
          <input
            id="input-sender"
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="e.g. Andile Dube"
            className="w-full p-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Advanced Collapsible: Key Points & Additional Info */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
        <button
          type="button"
          id="btn-toggle-advanced-generator"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            <span>Key Points & Constraints (Optional)</span>
            {(keyPoints || additionalInfo) && (
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </div>
          {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showAdvanced && (
          <div className="p-3.5 pt-1 space-y-3 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <label htmlFor="input-key-points" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Key points to include:
              </label>
              <textarea
                id="input-key-points"
                rows={2}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="e.g. Interview took place last Tuesday; loved team discussion on React architecture; available immediately"
                className="w-full p-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="input-additional-info" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Special instructions / constraints:
              </label>
              <input
                id="input-additional-info"
                type="text"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="e.g. Mention that I have attached my updated portfolio; keep tone humble"
                className="w-full p-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Prominent Generate Email button */}
      <button
        type="submit"
        id="btn-generate-email"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Writing your email...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Generate Email</span>
          </>
        )}
      </button>
    </form>
  );
};
