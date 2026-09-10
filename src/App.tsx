/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { GeneratorForm } from './components/GeneratorForm';
import { RewriteForm } from './components/RewriteForm';
import { ImproveForm } from './components/ImproveForm';
import { SummarizeForm } from './components/SummarizeForm';
import { TranslateForm } from './components/TranslateForm';
import { EmailEditor } from './components/EmailEditor';
import { SummarizeResultView } from './components/SummarizeResultView';
import { HistoryView } from './components/HistoryView';
import { UserProfileModal } from './components/UserProfileModal';
import { api } from './services/api';
import { storage, formatFullEmailText } from './services/storage';
import {
  ActiveTool,
  StructuredEmail,
  SummarizeResponse,
  EmailRecord,
  UserProfile,
  GenerateEmailParams,
  RewriteEmailParams,
  ImproveEmailParams,
  SummarizeEmailParams,
  TranslateEmailParams,
  ToneOption,
} from './types';
import { AlertTriangle, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Application State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => storage.getTheme());
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [history, setHistory] = useState<EmailRecord[]>(() => storage.getHistory());
  const [activeTool, setActiveTool] = useState<ActiveTool>('generator');

  const [currentEmail, setCurrentEmail] = useState<StructuredEmail | null>(null);
  const [summaryResult, setSummaryResult] = useState<SummarizeResponse | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Writing your email...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [lastGenParams, setLastGenParams] = useState<GenerateEmailParams | null>(null);

  // Sync theme with HTML document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 6000);
  };

  // 1. Generate Email Handler
  const handleGenerate = async (params: GenerateEmailParams) => {
    setIsLoading(true);
    setLoadingMessage('Writing your email...');
    setErrorMessage(null);
    setLastGenParams(params);

    try {
      const generated = await api.generateEmail({
        ...params,
        senderName: params.senderName || profile.defaultSenderName || profile.name,
      });
      setCurrentEmail(generated);
      setIsSaved(true);

      // Auto archive in history
      const savedRecord = storage.saveEmail({
        emailType: params.emailType,
        tone: params.tone,
        subject: generated.subject,
        content: generated,
        originalPurpose: params.emailPurpose,
        recipientName: params.recipientName,
        senderName: generated.signature,
        sourceTool: 'generator',
      });
      setHistory(storage.getHistory());
      showToast('Email generated successfully!');
    } catch (err: any) {
      showError(err?.message || "We couldn't generate your email right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Rewrite Email Handler
  const handleRewrite = async (params: RewriteEmailParams) => {
    setIsLoading(true);
    setLoadingMessage('Rewriting your email...');
    setErrorMessage(null);

    try {
      const rewritten = await api.rewriteEmail(params);
      setCurrentEmail(rewritten);
      setIsSaved(true);

      storage.saveEmail({
        emailType: 'Rewrite',
        tone: params.tone,
        subject: rewritten.subject,
        content: rewritten,
        sourceTool: 'rewrite',
      });
      setHistory(storage.getHistory());
      showToast('Email rewritten successfully!');
    } catch (err: any) {
      showError(err?.message || "We couldn't rewrite your email right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Improve Email Handler
  const handleImprove = async (params: ImproveEmailParams) => {
    setIsLoading(true);
    setLoadingMessage('Polishing grammar & clarity...');
    setErrorMessage(null);

    try {
      const improved = await api.improveEmail(params);
      setCurrentEmail(improved);
      setIsSaved(true);

      storage.saveEmail({
        emailType: 'Improve',
        tone: 'Professional',
        subject: improved.subject,
        content: improved,
        sourceTool: 'improve',
      });
      setHistory(storage.getHistory());
      showToast('Email polished and improved!');
    } catch (err: any) {
      showError(err?.message || "We couldn't improve your email right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Summarize Email Handler
  const handleSummarize = async (params: SummarizeEmailParams) => {
    setIsLoading(true);
    setLoadingMessage('Analyzing & extracting action items...');
    setErrorMessage(null);

    try {
      const summarized = await api.summarizeEmail(params);
      setSummaryResult(summarized);
      showToast('Email summarized successfully!');
    } catch (err: any) {
      showError(err?.message || "We couldn't summarize your email right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Translate Email Handler
  const handleTranslate = async (params: TranslateEmailParams) => {
    setIsLoading(true);
    setLoadingMessage(`Translating to ${params.targetLanguage}...`);
    setErrorMessage(null);

    try {
      const translated = await api.translateEmail(params);
      setCurrentEmail(translated);
      setIsSaved(true);

      storage.saveEmail({
        emailType: 'Translation',
        tone: params.targetLanguage,
        subject: translated.subject,
        content: translated,
        sourceTool: 'translate',
      });
      setHistory(storage.getHistory());
      showToast(`Translated to ${params.targetLanguage}!`);
    } catch (err: any) {
      showError(err?.message || "We couldn't translate your email right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Action: In-Editor Quick Transform (Make Shorter, Longer, Change Tone, Translate)
  const handleQuickTransform = async (
    action: 'make_shorter' | 'make_longer' | 'change_tone',
    targetTone?: string,
    instructions?: string
  ) => {
    if (!currentEmail) return;
    setIsLoading(true);

    let msg = 'Writing your email...';
    if (action === 'make_shorter') msg = 'Making email concise...';
    if (action === 'make_longer') msg = 'Expanding with natural context...';
    if (action === 'change_tone') msg = `Changing tone to ${targetTone}...`;
    setLoadingMessage(msg);

    try {
      const transformed = await api.transformEmail({
        currentEmail,
        action,
        targetTone,
        instructions,
      });
      setCurrentEmail(transformed);
      setIsSaved(false);
      showToast('Transformation applied!');
    } catch (err: any) {
      showError(err?.message || "We couldn't transform your email right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // In-Editor Translate Action
  const handleEditorTranslate = async (targetLanguage: string) => {
    if (!currentEmail) return;
    const fullText = formatFullEmailText(currentEmail);
    await handleTranslate({ emailText: fullText, targetLanguage });
  };

  // In-Editor Improve Action
  const handleEditorImprove = async () => {
    if (!currentEmail) return;
    const fullText = formatFullEmailText(currentEmail);
    await handleImprove({ emailText: fullText });
  };

  // Regenerate handler
  const handleRegenerate = async () => {
    if (lastGenParams) {
      await handleGenerate(lastGenParams);
    } else if (currentEmail) {
      const fullText = formatFullEmailText(currentEmail);
      await handleRewrite({ emailText: fullText, tone: 'Professional' });
    }
  };

  // Save Current Email to History
  const handleSaveToHistory = () => {
    if (!currentEmail) return;
    storage.saveEmail({
      emailType: lastGenParams?.emailType || 'Saved Email',
      tone: lastGenParams?.tone || 'Professional',
      subject: currentEmail.subject,
      content: currentEmail,
      recipientName: lastGenParams?.recipientName,
      senderName: currentEmail.signature,
      sourceTool: activeTool,
    });
    setHistory(storage.getHistory());
    setIsSaved(true);
    showToast('Saved to history!');
  };

  // Open email from History in Editor
  const handleOpenEmailFromHistory = (record: EmailRecord) => {
    setCurrentEmail(record.content);
    setIsSaved(true);
    setActiveTool('generator');
    showToast(`Loaded "${record.subject || 'Email'}" into editor`);
  };

  // Delete item from history
  const handleDeleteEmailFromHistory = (id: string) => {
    storage.deleteEmail(id);
    setHistory(storage.getHistory());
    showToast('Record deleted');
  };

  // Clear all history
  const handleClearHistory = () => {
    storage.clearHistory();
    setHistory([]);
    showToast('History cleared');
  };

  // Draft reply from summary
  const handleDraftReplyFromSummary = (summary: SummarizeResponse) => {
    setActiveTool('generator');
    const tasks = summary.actionItems?.map((a) => a.task).join('; ') || '';
    setLastGenParams({
      emailPurpose: `Reply to the email regarding "${summary.subject || 'recent updates'}". Address the following points: ${summary.summary}`,
      keyPoints: tasks,
      emailType: 'Business',
      tone: 'Professional',
      length: 'Medium',
    });
  };

  // New Email reset
  const handleNewEmail = () => {
    setCurrentEmail(null);
    setSummaryResult(null);
    setIsSaved(false);
    setActiveTool('generator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenHistory={() => setActiveTool('history')}
        historyCount={history.length}
        onNewEmail={handleNewEmail}
        activeTool={activeTool}
      />

      {/* Navigation Tabs */}
      <Navigation
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        historyCount={history.length}
      />

      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700/50 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTool === 'history' ? (
          /* History View Tab */
          <div className="w-full">
            <HistoryView
              history={history}
              onOpenEmail={handleOpenEmailFromHistory}
              onDeleteEmail={handleDeleteEmailFromHistory}
              onClearHistory={handleClearHistory}
              onNewEmail={handleNewEmail}
            />
          </div>
        ) : (
          /* Two-Column Responsive Layout: Controls on Left | Email Output on Right */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Input Form for Selected AI Tool */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              {activeTool === 'generator' && (
                <GeneratorForm
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  defaultSenderName={profile.defaultSenderName || profile.name}
                />
              )}

              {activeTool === 'rewrite' && (
                <RewriteForm
                  onRewrite={handleRewrite}
                  isLoading={isLoading}
                  initialText={currentEmail ? formatFullEmailText(currentEmail) : ''}
                />
              )}

              {activeTool === 'improve' && (
                <ImproveForm
                  onImprove={handleImprove}
                  isLoading={isLoading}
                  initialText={currentEmail ? formatFullEmailText(currentEmail) : ''}
                />
              )}

              {activeTool === 'summarize' && (
                <SummarizeForm
                  onSummarize={handleSummarize}
                  isLoading={isLoading}
                  initialText={currentEmail ? formatFullEmailText(currentEmail) : ''}
                />
              )}

              {activeTool === 'translate' && (
                <TranslateForm
                  onTranslate={handleTranslate}
                  isLoading={isLoading}
                  initialText={currentEmail ? formatFullEmailText(currentEmail) : ''}
                />
              )}
            </div>

            {/* Right Column: Email Editor OR Summarize Result View */}
            <div className="lg:col-span-6 sticky top-24">
              {activeTool === 'summarize' && summaryResult ? (
                <SummarizeResultView
                  result={summaryResult}
                  onDraftReply={handleDraftReplyFromSummary}
                  onClear={() => setSummaryResult(null)}
                />
              ) : (
                <EmailEditor
                  email={currentEmail}
                  onChangeEmail={setCurrentEmail}
                  onRegenerate={handleRegenerate}
                  onImprove={handleEditorImprove}
                  onMakeShorter={() => handleQuickTransform('make_shorter')}
                  onMakeLonger={() => handleQuickTransform('make_longer')}
                  onChangeTone={(newTone) => handleQuickTransform('change_tone', newTone)}
                  onTranslate={handleEditorTranslate}
                  onClear={() => {
                    setCurrentEmail(null);
                    setIsSaved(false);
                  }}
                  onSaveToHistory={handleSaveToHistory}
                  isLoading={isLoading}
                  loadingMessage={loadingMessage}
                  isSaved={isSaved}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* User Profile / Settings Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => {
          setProfile(updated);
          storage.saveProfile(updated);
          showToast('Account preferences updated');
        }}
      />
    </div>
  );
}
