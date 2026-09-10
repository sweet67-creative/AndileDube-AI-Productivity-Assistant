/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  History,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Download,
  Filter,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import { EmailRecord, StructuredEmail } from '../types';
import { downloadEmailFile, formatFullEmailText } from '../services/storage';

interface HistoryViewProps {
  history: EmailRecord[];
  onOpenEmail: (record: EmailRecord) => void;
  onDeleteEmail: (id: string) => void;
  onClearHistory: () => void;
  onNewEmail: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onOpenEmail,
  onDeleteEmail,
  onClearHistory,
  onNewEmail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = history.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emailType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || item.emailType === selectedType;
    return matchesSearch && matchesType;
  });

  const uniqueTypes = Array.from(new Set(history.map((h) => h.emailType)));

  const handleCopyRecord = async (record: EmailRecord) => {
    const text = formatFullEmailText(record.content);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(record.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(record.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email_craft_history_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Generated Email History</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {history.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Securely stored records with instant access to reopen, edit, copy, or export.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire email history?')) {
                  onClearHistory();
                }
              }}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, keywords, or content..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {uniqueTypes.length > 0 && (
          <div className="w-full sm:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full sm:w-48 py-2 px-3 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Email Types</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* History Items List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
          <History className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            {history.length === 0 ? 'No Saved Emails Yet' : 'No Matching Emails Found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {history.length === 0
              ? 'Emails you generate, rewrite, or polish will automatically be archived here for future reference.'
              : 'Try searching with different keywords or clearing the category filter.'}
          </p>
          {history.length === 0 && (
            <button
              type="button"
              onClick={onNewEmail}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Your First Email</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((record) => {
            const dateStr = new Date(record.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            const isCopied = copiedId === record.id;

            return (
              <div
                key={record.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1.5 flex-1">
                    {/* Badges & Meta */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-medium text-slate-400">
                        {record.id.slice(0, 10)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                        {record.emailType}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {record.tone}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                    </div>

                    {/* Subject */}
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {record.subject || 'Untitled Email'}
                    </h4>

                    {/* Body snippet */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {record.content.greeting} {record.content.body}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1.5 pt-2 sm:pt-0 self-end sm:self-start">
                    {/* Open in Editor */}
                    <button
                      type="button"
                      onClick={() => onOpenEmail(record)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 transition-colors flex items-center gap-1"
                      title="Open and edit in Email Editor"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open & Edit</span>
                    </button>

                    {/* Copy */}
                    <button
                      type="button"
                      onClick={() => handleCopyRecord(record)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isCopied
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Copy full email text"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {/* Download EML */}
                    <button
                      type="button"
                      onClick={() => downloadEmailFile(record.content, 'eml')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Download as .eml file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDeleteEmail(record.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
