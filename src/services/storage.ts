/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmailRecord, StructuredEmail, UserProfile } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'ai_email_generator_history_v1',
  PROFILE: 'ai_email_generator_profile_v1',
  THEME: 'ai_email_generator_theme_v1',
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_default',
  name: 'Andile Dube',
  email: 'andydube22@gmail.com',
  defaultSenderName: 'Andile Dube',
  defaultSignature: 'Kind regards,\nAndile Dube',
  isAuthenticated: true,
};

export const storage = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch {
      // Ignore
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  },

  getHistory(): EmailRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore
    }
    return [];
  },

  saveEmail(record: Omit<EmailRecord, 'id' | 'timestamp'>): EmailRecord {
    const history = this.getHistory();
    const newRecord: EmailRecord = {
      ...record,
      id: 'eml_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
      timestamp: Date.now(),
    };
    const updated = [newRecord, ...history].slice(0, 100); // keep up to 100 items
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return newRecord;
  },

  updateEmail(id: string, updates: Partial<EmailRecord>): EmailRecord | null {
    const history = this.getHistory();
    const index = history.findIndex((item) => item.id === id);
    if (index === -1) return null;

    history[index] = { ...history[index], ...updates };
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch {
      // Ignore
    }
    return history[index];
  },

  deleteEmail(id: string): boolean {
    const history = this.getHistory();
    const filtered = history.filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      // Ignore
    }
  },

  getTheme(): 'light' | 'dark' {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // Ignore
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  },

  setTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // Ignore
    }
  },
};

export function formatFullEmailText(email: StructuredEmail): string {
  const parts: string[] = [];
  if (email.subject) parts.push(`Subject: ${email.subject}\n`);
  if (email.greeting) parts.push(email.greeting);
  if (email.body) parts.push(email.body);
  if (email.closing) parts.push(email.closing);
  if (email.signature) parts.push(email.signature);
  return parts.filter(Boolean).join('\n\n');
}

export function downloadEmailFile(email: StructuredEmail, format: 'txt' | 'eml' = 'txt') {
  const fullText = formatFullEmailText(email);
  let content = fullText;
  let filename = (email.subject ? email.subject.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30) : 'email') + '.' + format;

  if (format === 'eml') {
    content = `From: user@example.com\nSubject: ${email.subject}\nMIME-Version: 1.0\nContent-Type: text/plain; charset=utf-8\n\n${email.greeting}\n\n${email.body}\n\n${email.closing}\n${email.signature}`;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
