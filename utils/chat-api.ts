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

export interface ChatResponse {
  message: string;
  sources: string[];
}

/**
 * Send a chat message to the Ask Max API
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[] = []
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
export async function initializeKnowledgeBase(): Promise<void> {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-2b0a7158/initialize`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to initialize knowledge base');
  }
}