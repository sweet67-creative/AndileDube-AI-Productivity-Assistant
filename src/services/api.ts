/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GenerateEmailParams,
  RewriteEmailParams,
  ImproveEmailParams,
  SummarizeEmailParams,
  TranslateEmailParams,
  QuickTransformParams,
  StructuredEmail,
  SummarizeResponse,
} from '../types';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = 'An error occurred while communicating with the AI service.';
    try {
      const data = await res.json();
      if (data?.error) {
        errorMessage = data.error;
      }
    } catch {
      // Use fallback
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export const api = {
  async checkHealth(): Promise<{ status: string; hasApiKey: boolean }> {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch {
      return { status: 'offline', hasApiKey: false };
    }
  },

  async generateEmail(params: GenerateEmailParams): Promise<StructuredEmail> {
    const res = await fetch('/api/email/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse<StructuredEmail>(res);
  },

  async rewriteEmail(params: RewriteEmailParams): Promise<StructuredEmail> {
    const res = await fetch('/api/email/rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse<StructuredEmail>(res);
  },

  async improveEmail(params: ImproveEmailParams): Promise<StructuredEmail & { improvements?: string[] }> {
    const res = await fetch('/api/email/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse<StructuredEmail & { improvements?: string[] }>(res);
  },

  async summarizeEmail(params: SummarizeEmailParams): Promise<SummarizeResponse> {
    const res = await fetch('/api/email/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse<SummarizeResponse>(res);
  },

  async translateEmail(params: TranslateEmailParams): Promise<StructuredEmail> {
    const res = await fetch('/api/email/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse<StructuredEmail>(res);
  },

  async transformEmail(params: QuickTransformParams): Promise<StructuredEmail> {
    const res = await fetch('/api/email/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse<StructuredEmail>(res);
  },
};
