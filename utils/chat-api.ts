import { projectId, publicAnonKey } from './supabase/info';

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

  return response.json();
}

/**
 * Initialize the knowledge base (should be called once on deployment)
 */
export async function initializeKnowledgeBase(): Promise<void> {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-2b0a7158/init-kb`,
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