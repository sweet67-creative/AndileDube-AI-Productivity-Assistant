/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const BASE_SYSTEM_INSTRUCTION = `You are an expert professional email-writing assistant. Create clear, natural, personalized, grammatically correct emails based only on the information supplied by the user. Preserve the user's intended meaning. Never invent names, dates, qualifications, prices, promises, events, or other important facts. Follow the requested email type, tone, language, and length. Make the email sound natural and human. Always produce an appropriate subject line.`;

const EMAIL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    subject: { type: Type.STRING, description: 'Concise, clear, and relevant subject line' },
    greeting: { type: Type.STRING, description: 'Professional greeting tailored to recipient e.g. "Dear Mr. Smith," or "Hi Alex,"' },
    body: { type: Type.STRING, description: 'The main email content formatted into well-spaced paragraphs' },
    closing: { type: Type.STRING, description: 'Professional sign-off e.g. "Kind regards," or "Sincerely,"' },
    signature: { type: Type.STRING, description: 'Sender name or signature placeholder' },
  },
  required: ['subject', 'greeting', 'body', 'closing', 'signature'],
};

// Safe JSON parser helper
function safeParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 2. Generate Email
app.post('/api/email/generate', async (req, res) => {
  try {
    const {
      recipientName,
      senderName,
      emailPurpose,
      keyPoints,
      additionalInfo,
      emailType = 'General',
      tone = 'Professional',
      length = 'Medium',
      language = 'English',
    } = req.body;

    if (!emailPurpose || !emailPurpose.trim()) {
      return res.status(400).json({ error: 'Please tell us what you want the email to be about.' });
    }

    const ai = getAI();
    const prompt = `Generate a ${tone.toLowerCase()} ${emailType} email in ${language}.
Length requirement: ${length} (Short = 1-2 concise paragraphs, Medium = 2-4 balanced paragraphs, Detailed = comprehensive thorough paragraphs).

Information supplied by user:
- Email Purpose / Goal: ${emailPurpose.trim()}
- Recipient: ${recipientName?.trim() || 'Not specified (use appropriate professional salutation)'}
- Sender: ${senderName?.trim() || 'Not specified (use user signature placeholder)'}
- Key Points to cover: ${keyPoints?.trim() || 'None provided'}
- Additional Instructions: ${additionalInfo?.trim() || 'None provided'}

Strict constraints:
- Base the email ONLY on the information supplied above.
- Do NOT invent facts, qualifications, prices, company policies, or promises.
- Produce an appropriate, compelling subject line.
- Return structured JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: EMAIL_SCHEMA,
      },
    });

    const parsed = safeParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error generating email:', err?.message || err);
    return res.status(500).json({
      error: "We couldn't generate your email right now. Please try again.",
    });
  }
});

// 3. Rewrite Email
app.post('/api/email/rewrite', async (req, res) => {
  try {
    const { emailText, tone = 'Professional', instructions } = req.body;

    if (!emailText || !emailText.trim()) {
      return res.status(400).json({ error: 'Please enter or paste the email you want to rewrite.' });
    }

    const ai = getAI();
    const prompt = `Rewrite the following existing email in a ${tone.toLowerCase()} tone.
Instructions:
- Rewrite the email while strictly preserving its original meaning and all facts.
- Tone target: ${tone}
${instructions ? `- User instruction: ${instructions}` : ''}
- The AI must not invent information, dates, promises, or entities not in the source text.
- Provide a clean subject line, greeting, body, closing, and signature.

Source Email:
"""
${emailText.trim()}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: EMAIL_SCHEMA,
      },
    });

    const parsed = safeParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error rewriting email:', err?.message || err);
    return res.status(500).json({
      error: "We couldn't rewrite your email right now. Please try again.",
    });
  }
});

// 4. Improve Email
app.post('/api/email/improve', async (req, res) => {
  try {
    const { emailText } = req.body;

    if (!emailText || !emailText.trim()) {
      return res.status(400).json({ error: 'Please enter or paste the email you want to improve.' });
    }

    const ai = getAI();
    const prompt = `Improve the following email for:
1. Grammar and spelling
2. Sentence structure and flow
3. Clarity and conciseness
4. Professionalism and tone
5. Readability

Strict rules:
- Preserve the user's original meaning and all important facts.
- Do NOT fabricate new facts or remove essential content.
- Also list 2 to 4 concise bullet points describing what was improved.

Original Email:
"""
${emailText.trim()}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            greeting: { type: Type.STRING },
            body: { type: Type.STRING },
            closing: { type: Type.STRING },
            signature: { type: Type.STRING },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key improvements made to clarity, grammar, tone, or structure',
            },
          },
          required: ['subject', 'greeting', 'body', 'closing', 'signature', 'improvements'],
        },
      },
    });

    const parsed = safeParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error improving email:', err?.message || err);
    return res.status(500).json({
      error: "We couldn't improve your email right now. Please try again.",
    });
  }
});

// 5. Summarize Email
app.post('/api/email/summarize', async (req, res) => {
  try {
    const { emailText, format = 'short_summary' } = req.body;

    if (!emailText || !emailText.trim()) {
      return res.status(400).json({ error: 'Please enter or paste the email you want to summarize.' });
    }

    const ai = getAI();
    const prompt = `Produce a structured email summary based on the requested format: "${format}".
Requested format options:
- "one_sentence": A single powerful, comprehensive sentence capturing the essence.
- "short_summary": A clear 2-3 sentence overview.
- "key_points": A bulleted breakdown of the core message and vital context.
- "action_items": Explicitly identify tasks, deadlines, requests, or decisions contained in the email.

Email to summarize:
"""
${emailText.trim()}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert executive email analyst. Summarize emails with high fidelity without hallucinating facts. Always identify any actionable items, dates, and key decisions.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING, description: 'Subject or core topic of the email' },
            summary: { type: Type.STRING, description: 'The main summary text formatted for readability' },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of primary takeaways or bullet points',
            },
            actionItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                  assigneeOrRole: { type: Type.STRING },
                },
                required: ['task'],
              },
              description: 'Action items, requests, tasks, and deadlines detected',
            },
          },
          required: ['subject', 'summary'],
        },
      },
    });

    const parsed = safeParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error summarizing email:', err?.message || err);
    return res.status(500).json({
      error: "We couldn't summarize your email right now. Please try again.",
    });
  }
});

// 6. Translate Email
app.post('/api/email/translate', async (req, res) => {
  try {
    const { emailText, targetLanguage = 'English' } = req.body;

    if (!emailText || !emailText.trim()) {
      return res.status(400).json({ error: 'Please enter or paste the email you want to translate.' });
    }

    const ai = getAI();
    const prompt = `Translate the following email accurately into ${targetLanguage}.
- The translation should preserve the original meaning, professional etiquette, and tone.
- Keep structural parts separated: Subject, Greeting, Body, Closing, Signature.
- Do not add or omit facts.

Source Email:
"""
${emailText.trim()}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert polyglot business translator. Translate emails fluently and naturally into the target language, maintaining proper cultural greeting and closing etiquette while preserving all facts.`,
        responseMimeType: 'application/json',
        responseSchema: EMAIL_SCHEMA,
      },
    });

    const parsed = safeParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error translating email:', err?.message || err);
    return res.status(500).json({
      error: "We couldn't translate your email right now. Please try again.",
    });
  }
});

// 7. Quick Transform (Make Shorter / Make Longer / Change Tone)
app.post('/api/email/transform', async (req, res) => {
  try {
    const { currentEmail, action, targetTone, instructions } = req.body;

    if (!currentEmail || (!currentEmail.body && !currentEmail.subject)) {
      return res.status(400).json({ error: 'No email content provided to transform.' });
    }

    let instructionDetails = '';
    if (action === 'make_shorter') {
      instructionDetails = 'Make the email significantly shorter and more concise. Reduce unnecessary wording while strictly preserving all important facts, action items, dates, and numbers.';
    } else if (action === 'make_longer') {
      instructionDetails = 'Expand the email naturally with polite context, clear explanations, and thoughtful transitions without inventing facts, dates, promises, or prices.';
    } else if (action === 'change_tone') {
      instructionDetails = `Change the tone of the email to "${targetTone || 'Friendly'}". Rewrite the phrasing to match this tone while preserving the original meaning and core information.`;
    } else {
      instructionDetails = instructions || 'Improve and polish this email.';
    }

    const emailContent = `
Subject: ${currentEmail.subject || ''}
Greeting: ${currentEmail.greeting || ''}
Body: ${currentEmail.body || ''}
Closing: ${currentEmail.closing || ''}
Signature: ${currentEmail.signature || ''}
`.trim();

    const ai = getAI();
    const prompt = `Perform the following transformation on this email:
${instructionDetails}

Source Email:
"""
${emailContent}
"""

Return the updated structured email.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: EMAIL_SCHEMA,
      },
    });

    const parsed = safeParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error transforming email:', err?.message || err);
    return res.status(500).json({
      error: "We couldn't transform your email right now. Please try again.",
    });
  }
});

// Start server with Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
