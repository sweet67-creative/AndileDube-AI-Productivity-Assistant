/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  CheckCheck,
  Minimize2,
  Maximize2,
  SlidersHorizontal,
  Languages,
  Trash2,
  Download,
  Bookmark,
  Sparkles,
  Eye,
  Edit3,
  Globe,
} from 'lucide-react';
import { StructuredEmail, ToneOption } from '../types';
import { TONE_OPTIONS, SUPPORTED_LANGUAGES } from '../constants';
import { downloadEmailFile, formatFullEmailText } from '../services/storage';

interface EmailEditorProps {
  email: StructuredEmail | null;
  onChangeEmail: (updated: StructuredEmail) => void;
  onRegenerate: () => void;
  onImprove: () => void;
  onMakeShorter: () => void;
  onMakeLonger: () => void;
  onChangeTone: (newTone: ToneOption) => void;
  onTranslate: (language: string) => void;
  onClear: () => void;
  onSaveToHistory: () => void;
  isLoading: boolean;
  loadingMessage?: string;
  isSaved?: boolean;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({
  email,
  onChangeEmail,
  onRegenerate,
  onImprove,
  onMakeShorter,
  onMakeLonger,
  onChangeTone,
  onTranslate,
  onClear,
  onSaveToHistory,
  isLoading,
  loadingMessage = 'Writing your email...',
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);

  if (!email && !isLoading) {
    return (
      <div className="h-full min-h-[440px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-sm">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
          Your AI Email Will Appear Here
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Enter your instructions or paste an existing draft on the left, then click Generate to create a tailored, polished email.
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    if (!email) return;
    const fullText = formatFullEmailText(email);
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = fullText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const updateField = (field: keyof StructuredEmail, value: string) => {
    if (!email) return;
    onChangeEmail({
      ...email,
      [field]: value,
    });
  };

  return (
    <div className="relative flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30 animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            {loadingMessage}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Applying professional tone, grammar, and personalization...
          </p>
        </div>
      )}

      {/* Editor Header & Main Actions */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-2">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'editor'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'preview'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Right: Primary Copy Button + Save + Export */}
        <div className="flex items-center gap-1.5">
          {/* Save to History button */}
          <button
            type="button"
            id="btn-save-history"
            onClick={onSaveToHistory}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isSaved
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Save to History library"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600 dark:fill-emerald-400' : ''}`} />
            <span>{isSaved ? 'Saved ✓' : 'Save'}</span>
          </button>

          {/* Download */}
          <button
            type="button"
            id="btn-download-eml"
            onClick={() => email && downloadEmailFile(email, 'eml')}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Download as .eml / mail file"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Copy Button */}
          <button
            type="button"
            id="btn-copy-email"
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Copied ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick AI Action Toolbar */}
      <div className="px-4 py-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {/* Regenerate */}
        <button
          type="button"
          id="editor-action-regenerate"
          disabled={isLoading}
          onClick={onRegenerate}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          title="Regenerate from current instructions"
        >
          <RefreshCw className="w-3 h-3 text-indigo-500" />
          <span>Regenerate</span>
        </button>

        {/* Improve */}
        <button
          type="button"
          id="editor-action-improve"
          disabled={isLoading}
          onClick={onImprove}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          title="Polish grammar, phrasing, and flow"
        >
          <CheckCheck className="w-3 h-3 text-emerald-500" />
          <span>Improve</span>
        </button>

        {/* Make Shorter */}
        <button
          type="button"
          id="editor-action-shorter"
          disabled={isLoading}
          onClick={onMakeShorter}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          title="Make concise while preserving facts"
        >
          <Minimize2 className="w-3 h-3 text-amber-500" />
          <span>Make Shorter</span>
        </button>

        {/* Make Longer */}
        <button
          type="button"
          id="editor-action-longer"
          disabled={isLoading}
          onClick={onMakeLonger}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          title="Expand with context without inventing facts"
        >
          <Maximize2 className="w-3 h-3 text-blue-500" />
          <span>Make Longer</span>
        </button>

        {/* Change Tone Menu */}
        <div className="relative">
          <button
            type="button"
            id="editor-action-tone-menu"
            disabled={isLoading}
            onClick={() => {
              setShowToneMenu(!showToneMenu);
              setShowTranslateMenu(false);
            }}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3 h-3 text-violet-500" />
            <span>Change Tone</span>
          </button>

          {showToneMenu && (
            <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-30 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Select New Tone:
              </div>
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => {
                    onChangeTone(t.label);
                    setShowToneMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors flex items-center justify-between"
                >
                  <span>{t.label}</span>
                  <span className="text-[10px] text-slate-400">{t.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Translate Menu */}
        <div className="relative">
          <button
            type="button"
            id="editor-action-translate-menu"
            disabled={isLoading}
            onClick={() => {
              setShowTranslateMenu(!showTranslateMenu);
              setShowToneMenu(false);
            }}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Languages className="w-3 h-3 text-cyan-500" />
            <span>Translate</span>
          </button>

          {showTranslateMenu && (
            <div className="absolute left-0 mt-1 w-52 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-30 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Translate Email To:
              </div>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onTranslate(lang.name);
                    setShowTranslateMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors flex items-center justify-between"
                >
                  <span>{lang.name}</span>
                  <span className="text-[10px] text-slate-400">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear */}
        <button
          type="button"
          id="editor-action-clear"
          disabled={isLoading}
          onClick={onClear}
          className="ml-auto px-2 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors flex items-center gap-1"
          title="Clear editor contents"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      {/* Editor Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {viewMode === 'editor' ? (
          /* Structured Field-by-Field Editor */
          <div className="space-y-4">
            {/* Subject */}
            <div className="space-y-1">
              <label htmlFor="edit-subject" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Subject</span>
                <span className="text-[11px] font-normal text-slate-400">
                  {email?.subject?.length || 0} characters
                </span>
              </label>
              <input
                id="edit-subject"
                type="text"
                value={email?.subject || ''}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder="Email Subject"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
              />
            </div>

            {/* Greeting */}
            <div className="space-y-1">
              <label htmlFor="edit-greeting" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Salutation / Greeting
              </label>
              <input
                id="edit-greeting"
                type="text"
                value={email?.greeting || ''}
                onChange={(e) => updateField('greeting', e.target.value)}
                placeholder="Dear..."
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
              />
            </div>

            {/* Body */}
            <div className="space-y-1">
              <label htmlFor="edit-body" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Body
              </label>
              <textarea
                id="edit-body"
                rows={9}
                value={email?.body || ''}
                onChange={(e) => updateField('body', e.target.value)}
                placeholder="Compose your email text here..."
                className="w-full p-3.5 rounded-xl text-sm leading-relaxed bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-colors font-sans"
              />
            </div>

            {/* Closing and Signature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="edit-closing" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Closing
                </label>
                <input
                  id="edit-closing"
                  type="text"
                  value={email?.closing || ''}
                  onChange={(e) => updateField('closing', e.target.value)}
                  placeholder="Kind regards,"
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="edit-signature" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Signature / Sender
                </label>
                <input
                  id="edit-signature"
                  type="text"
                  value={email?.signature || ''}
                  onChange={(e) => updateField('signature', e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Formatted Email Client Preview Card */
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 p-6 space-y-4">
            {/* Subject banner */}
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="text-xs font-medium text-slate-400">Subject:</div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {email?.subject || 'No Subject'}
              </h2>
            </div>

            {/* Email Letter Layout */}
            <div className="space-y-4 text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed pt-2">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {email?.greeting}
              </p>

              <div className="whitespace-pre-line space-y-3">
                {email?.body}
              </div>

              <div className="pt-3">
                <p>{email?.closing}</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  {email?.signature}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
