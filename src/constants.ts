/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmailType, ToneOption, RewriteToneOption, LengthOption, SupportedLanguage } from './types';

export const EMAIL_TYPES: Array<{ label: EmailType; description: string }> = [
  { label: 'Job Application', description: 'Apply for open positions and roles' },
  { label: 'Cover Letter', description: 'Introduce your background and candidacy' },
  { label: 'Follow-Up', description: 'Follow up on interviews, proposals, or status' },
  { label: 'Business', description: 'General professional business correspondence' },
  { label: 'Customer Service', description: 'Inquire, assist, or resolve customer matters' },
  { label: 'Complaint', description: 'Constructively address issues or unsatisfactory service' },
  { label: 'Apology', description: 'Express sincere apology and outline resolution' },
  { label: 'Thank You', description: 'Express gratitude for meetings, help, or opportunities' },
  { label: 'Meeting Request', description: 'Propose agenda, dates, and times for discussion' },
  { label: 'Leave Request', description: 'Request annual, sick, or personal time off' },
  { label: 'Resignation', description: 'Polite and professional formal notice of resignation' },
  { label: 'Sales/Marketing', description: 'Pitch products, services, or partnerships' },
  { label: 'Networking', description: 'Connect with peers, mentors, or industry contacts' },
  { label: 'General', description: 'Versatile standard email for any occasion' },
  { label: 'Custom', description: 'Customized email based on your specific needs' },
];

export const TONE_OPTIONS: Array<{ label: ToneOption; description: string }> = [
  { label: 'Professional', description: 'Balanced, credible, and polished' },
  { label: 'Formal', description: 'Traditional corporate or academic etiquette' },
  { label: 'Friendly', description: 'Approachable, warm, and cordial' },
  { label: 'Casual', description: 'Relaxed, conversational peer tone' },
  { label: 'Polite', description: 'Courteous, considerate, and respectful' },
  { label: 'Confident', description: 'Decisive, assertive, and articulate' },
  { label: 'Persuasive', description: 'Compelling and action-oriented' },
  { label: 'Direct', description: 'Concise, straight-to-the-point' },
  { label: 'Warm', description: 'Empathetic, welcoming, and thoughtful' },
];

export const REWRITE_TONES: Array<{ label: RewriteToneOption; description: string }> = [
  { label: 'Professional', description: 'Structured and workplace-ready' },
  { label: 'Friendly', description: 'Warm and approachable' },
  { label: 'Formal', description: 'Strict professional etiquette' },
  { label: 'Concise', description: 'Cut fluff, preserve core meaning' },
  { label: 'Persuasive', description: 'Stronger call to action' },
  { label: 'Natural', description: 'Authentic and human-sounding' },
];

export const LENGTH_OPTIONS: Array<{ label: LengthOption; hint: string }> = [
  { label: 'Short', hint: '1–2 concise paragraphs' },
  { label: 'Medium', hint: 'Standard 3–4 paragraphs' },
  { label: 'Detailed', hint: 'Comprehensive with detailed context' },
];

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zu', name: 'isiZulu', nativeName: 'isiZulu' },
  { code: 'xh', name: 'isiXhosa', nativeName: 'isiXhosa' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho' },
  { code: 'tn', name: 'Setswana', nativeName: 'Setswana' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
];

export const SAMPLE_PROMPTS = [
  {
    title: 'Job Application Status',
    type: 'Follow-Up',
    tone: 'Professional',
    length: 'Short' as LengthOption,
    purpose: 'Ask about the status of my job application for the Senior Software Engineer position interviewed last Tuesday.',
    recipient: 'Sarah Jenkins (Hiring Manager)',
    keyPoints: 'Interviewed on May 14th; reiterating enthusiasm for team mission; checking on hiring timeline.',
  },
  {
    title: 'Meeting Reschedule Request',
    type: 'Meeting Request',
    tone: 'Polite',
    length: 'Short' as LengthOption,
    purpose: 'Politely reschedule tomorrow’s quarterly planning meeting due to an unavoidable project conflict.',
    recipient: 'Marketing Strategy Team',
    keyPoints: 'Original slot tomorrow 10 AM; proposing Thursday 2 PM or Friday 11 AM; apology for the inconvenience.',
  },
  {
    title: 'Project Deadline Extension',
    type: 'Business',
    tone: 'Confident',
    length: 'Medium' as LengthOption,
    purpose: 'Request a 3-day extension on the financial audit deliverable to incorporate newly received Q3 supplier invoices.',
    recipient: 'David Chen, Director of Finance',
    keyPoints: 'Q3 data arrived 2 days late; extra time ensures 100% reconciliation accuracy; new delivery date Friday 5 PM.',
  },
  {
    title: 'Customer Refund & Apology',
    type: 'Customer Service',
    tone: 'Warm',
    length: 'Medium' as LengthOption,
    purpose: 'Apologize for delayed shipping order #89211 and process a full refund plus a 20% discount coupon for future purchases.',
    recipient: 'Elena Vance',
    keyPoints: 'Logistics center backorder; refund processed within 3-5 business days; coupon code COURTESY20.',
  }
];
