/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EmailType =
  | 'Job Application'
  | 'Cover Letter'
  | 'Follow-Up'
  | 'Business'
  | 'Customer Service'
  | 'Complaint'
  | 'Apology'
  | 'Thank You'
  | 'Meeting Request'
  | 'Leave Request'
  | 'Resignation'
  | 'Sales/Marketing'
  | 'Networking'
  | 'General'
  | 'Custom';

export type ToneOption =
  | 'Professional'
  | 'Formal'
  | 'Friendly'
  | 'Casual'
  | 'Polite'
  | 'Confident'
  | 'Persuasive'
  | 'Direct'
  | 'Warm';

export type RewriteToneOption =
  | 'Professional'
  | 'Friendly'
  | 'Formal'
  | 'Concise'
  | 'Persuasive'
  | 'Natural';

export type LengthOption = 'Short' | 'Medium' | 'Detailed';

export type SummarizeFormat =
  | 'one_sentence'
  | 'short_summary'
  | 'key_points'
  | 'action_items';

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName?: string;
}

export interface StructuredEmail {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
  signature: string;
}

export interface GenerateEmailParams {
  recipientName?: string;
  senderName?: string;
  emailPurpose: string;
  keyPoints?: string;
  additionalInfo?: string;
  emailType: EmailType | string;
  tone: ToneOption | string;
  length: LengthOption;
  language?: string;
}

export interface RewriteEmailParams {
  emailText: string;
  tone: RewriteToneOption | string;
  instructions?: string;
}

export interface ImproveEmailParams {
  emailText: string;
}

export interface SummarizeEmailParams {
  emailText: string;
  format: SummarizeFormat;
}

export interface SummarizeResponse {
  summary: string;
  keyPoints?: string[];
  actionItems?: Array<{
    task: string;
    deadline?: string;
    assigneeOrRole?: string;
  }>;
  subject?: string;
}

export interface TranslateEmailParams {
  emailText: string;
  targetLanguage: string;
}

export interface QuickTransformParams {
  currentEmail: StructuredEmail;
  action: 'make_shorter' | 'make_longer' | 'change_tone' | 'improve_part';
  targetTone?: string;
  instructions?: string;
}

export interface EmailRecord {
  id: string;
  timestamp: number;
  emailType: string;
  tone: string;
  subject: string;
  content: StructuredEmail;
  originalPurpose?: string;
  recipientName?: string;
  senderName?: string;
  sourceTool: 'generator' | 'rewrite' | 'improve' | 'summarize' | 'translate';
  userId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  defaultSenderName: string;
  defaultSignature: string;
  isAuthenticated: boolean;
}

export type ActiveTool =
  | 'generator'
  | 'rewrite'
  | 'improve'
  | 'summarize'
  | 'translate'
  | 'history';
