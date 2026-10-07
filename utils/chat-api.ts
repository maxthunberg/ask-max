import { projectId, publicAnonKey } from './supabase/info';

// Generate a unique chat ID for each session
let sessionChatId: string | null = null;

function getChatId(): string {
  if (!sessionChatId) {
    sessionChatId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  return sessionChatId;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSuggestion {
  label: string;
  description: string; // Why the visitor should look at the link
  url: string;
  emoji?: string; // Icon shown on the card
  domain?: string; // Where the link goes, shown next to the label
}

// What Digital Max remembers about the visitor. Kept in the browser and sent
// with every message, the server updates it
export type VisitorBrief = Record<string, unknown>;

export type FitCheckStatus = 'none' | 'offered' | 'done';

export interface FitCheck {
  intro: string;
  matches: string[]; // Where Max fits
  risks: string[]; // Where Max might not be the right person
  unknowns: string[]; // Still unclear
  question: string; // Follow-up about the most important unknown
}

export interface ChatOptions {
  visitorBrief?: VisitorBrief;
  fitCheckStatus?: FitCheckStatus;
  runFitCheck?: boolean; // Visitor clicked "do the fit check"
}

export interface ChatResponse {
  message: string;
  visitorBrief?: VisitorBrief;
  fitCheckStatus?: FitCheckStatus;
  fitCheckOffered?: boolean; // This answer offers a fit check
  fitCheck?: FitCheck;
  suggestions?: ChatSuggestion[]; // Link cards shown under the answer
  suggestionFooter?: string; // Closing text shown after the suggestion cards
  sources: string[];
  detectedLanguage?: 'en' | 'sv' | 'other'; // Language detected from user's message
  shouldSwitchUI?: boolean; // Whether UI should switch language
}

/**
 * Send a chat message to the Ask Max API
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[] = [],
  userLanguage?: 'en' | 'sv',
  currentUILanguage?: 'en' | 'sv',
  audience?: 'airon',
  who?: string, // Company from ?who=, enables the fixed "Why should X hire you?" answer
  options: ChatOptions = {}
): Promise<ChatResponse> {
  // Note: Tracking is now handled in PortfolioPage.tsx via utils/analytics.ts
  
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-2b0a7158/chat`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory,
        userLanguage,
        currentUILanguage,
        audience,
        who,
        ...options,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    
    // Check if it's a quota exceeded error with a custom message
    if (error.error === 'QUOTA_EXCEEDED' && error.message) {
      throw new Error(error.message);
    }
    
    const errorMessage = error.details || error.error || 'Failed to send message';
    console.error('API Error:', error);
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // Note: Tracking is now handled in PortfolioPage.tsx via utils/analytics.ts
  
  return data;
}

/**
 * Initialize the knowledge base with Max's portfolio data
 */
export async function initializeKnowledgeBase(
  audience?: 'airon',
  force = false
): Promise<void> {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-2b0a7158/init-kb`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audience, force }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to initialize knowledge base');
  }
}
export interface CompanyProfile {
  found: boolean;
  name?: string;
  domain?: string;
  logoUrl?: string;
}

/**
 * Look up the ?who= company (name, logo). First call per company runs a web search server side.
 */
export async function fetchCompanyProfile(who: string): Promise<CompanyProfile> {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-2b0a7158/company?who=${encodeURIComponent(who)}`,
    { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
  );
  if (!response.ok) return { found: false };
  return response.json();
}

export interface HandoffRequest {
  email: string;
  name?: string;
  note?: string;
  who?: string;
  visitorBrief?: VisitorBrief;
  fitCheck?: FitCheck;
  transcript: ChatMessage[];
}

/**
 * Send the conversation to the real Max by email
 */
export async function sendHandoff(request: HandoffRequest): Promise<void> {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-2b0a7158/handoff`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'SEND_FAILED' }));
    throw new Error(error.error || 'SEND_FAILED');
  }
}
