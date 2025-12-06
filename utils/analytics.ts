// Google Analytics utility functions
// 
// GA4 BigQuery Tracking Implementation
// =====================================
// All events follow GA4 → BigQuery export format for daily data analysis.
// Backend fetches last N questions to strengthen the AI twin's knowledge base.
// No personal data is stored.
//
// Session tracking implementation:
// - Each chat conversation gets a unique session ID (chat_12345...)
// - Session ID is generated when chat starts and persists until reset
// - All events include the session ID to tie messages together
// 
// Events tracked:
// 1. chat_started - Fired once when user initiates first message
//    Params: chat_id, ui_language, chat_language
//
// 2. chat_message - Fired for each message (user + assistant)
//    Params: chat_id, sender ("user" or "assistant"), message_text, language, message_number, response_type (optional)
//
// 3. chat_end - Fired when user closes chat or resets conversation
//    Params: chat_id, messages_total, duration_seconds
//
// 4. chat_error - Fired when quota exceeded, timeout, or API issues occur
//    Params: chat_id, error_type ("quota_exceeded", "timeout", "other"), error_message
//
// Example JSON payloads:
// {
//   "event": "chat_started",
//   "chat_id": "chat_1733...",
//   "ui_language": "en",
//   "chat_language": "en"
// }
// {
//   "event": "chat_message",
//   "chat_id": "chat_1733...",
//   "sender": "user",
//   "message_text": "what is ux",
//   "language": "en",
//   "message_number": 1
// }
// {
//   "event": "chat_message",
//   "chat_id": "chat_1733...",
//   "sender": "assistant",
//   "message_text": "UX is about...",
//   "language": "en",
//   "message_number": 2,
//   "response_type": "success"
// }
// {
//   "event": "chat_end",
//   "chat_id": "chat_1733...",
//   "messages_total": 6,
//   "duration_seconds": 143
// }
// {
//   "event": "chat_error",
//   "chat_id": "chat_1733...",
//   "error_type": "quota_exceeded",
//   "error_message": "Daily quota exceeded"
// }

// Type for the gtag function
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Generate a unique session ID for tracking conversations
 */
export function generateSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Send a chat message event to Google Analytics (for BigQuery export)
 * @param messageText The chat message content
 * @param sessionId The unique session/chat ID
 * @param isUser true for user messages, false for AI responses
 * @param language The language of the message ('en' or 'sv')
 * @param messageNumber Sequential number of message in conversation
 * @param responseType Optional type of response (e.g., "unknown", "success") for AI responses
 */
export function trackChatMessage(
  messageText: string,
  sessionId: string,
  isUser: boolean,
  language: 'en' | 'sv',
  messageNumber: number,
  responseType?: 'success' | 'unknown' | 'error'
) {
  if (typeof window !== 'undefined' && window.gtag) {
    const params: Record<string, any> = {
      chat_id: sessionId,
      sender: isUser ? 'user' : 'assistant',
      message_text: messageText,
      language: language,
      message_number: messageNumber,
    };
    
    if (responseType) {
      params.response_type = responseType;
    }
    
    window.gtag('event', 'chat_message', params);
    console.log('GA event: chat_message', params);
  }
}

/**
 * @deprecated Use trackChatMessage instead for BigQuery compatibility
 * Send a search event to Google Analytics
 * @param searchTerm The search query/chat message
 * @param sessionId The unique session/chat ID
 * @param senderType 'user' or 'ai'
 * @param messageNumber Sequential number of message in conversation
 * @param responseType Optional type of response (e.g., "unknown", "success") for AI responses
 */
export function trackSearch(
  searchTerm: string,
  sessionId: string,
  senderType: 'user' | 'ai',
  messageNumber: number,
  responseType?: 'success' | 'unknown' | 'error'
) {
  if (typeof window !== 'undefined' && window.gtag) {
    const params: Record<string, any> = {
      search_term: searchTerm,
      chat_id: sessionId,
      sender_type: senderType,
      message_number: messageNumber,
    };
    
    if (responseType) {
      params.response_type = responseType;
    }
    
    window.gtag('event', 'search', params);
    console.log('GA event: search', params);
  }
}

/**
 * Send a chat_started event to Google Analytics
 * @param sessionId The unique session/chat ID
 * @param uiLanguage The UI language ('en' or 'sv')
 * @param chatLanguage The chat language ('en' or 'sv')
 */
export function trackChatStarted(sessionId: string, uiLanguage: 'en' | 'sv', chatLanguage: 'en' | 'sv') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chat_started', {
      event_category: 'engagement',
      event_label: 'User started a chat conversation',
      chat_id: sessionId,
      ui_language: uiLanguage,
      chat_language: chatLanguage,
    });
    console.log('GA event: chat_started', { chat_id: sessionId, ui_language: uiLanguage, chat_language: chatLanguage });
  }
}

/**
 * Send a chat_end event to Google Analytics
 * @param sessionId The unique session/chat ID
 * @param messagesTotal Total number of messages in the conversation
 * @param durationSeconds Duration of the chat in seconds
 */
export function trackChatEnd(sessionId: string, messagesTotal: number, durationSeconds: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chat_end', {
      event_category: 'engagement',
      event_label: 'User ended a chat conversation',
      chat_id: sessionId,
      messages_total: messagesTotal,
      duration_seconds: durationSeconds,
    });
    console.log('GA event: chat_end', { chat_id: sessionId, messages_total: messagesTotal, duration_seconds: durationSeconds });
  }
}

/**
 * Send a chat_error event to Google Analytics
 * @param sessionId The unique session/chat ID
 * @param errorType Type of error ("quota_exceeded", "timeout", "other")
 * @param errorMessage The error message
 */
export function trackChatError(sessionId: string, errorType: 'quota_exceeded' | 'timeout' | 'other', errorMessage: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chat_error', {
      event_category: 'error',
      event_label: 'Chat error occurred',
      chat_id: sessionId,
      error_type: errorType,
      error_message: errorMessage,
    });
    console.log('GA event: chat_error', { chat_id: sessionId, error_type: errorType, error_message: errorMessage });
  }
}

/**
 * Detect if AI response indicates it doesn't know the answer
 * @param response The AI's response text
 * @returns true if the response indicates unknown/can't answer
 */
export function detectUnknownResponse(response: string): boolean {
  const lowerResponse = response.toLowerCase();
  
  // Swedish patterns
  const swedishPatterns = [
    'har jag inte i min',
    'kan inte svara på det',
    'har inte den informationen',
    'vet inte',
    'har inte tillgång till',
    'kan tyvärr inte',
    'inte baserat på materialet',
    'inte i materialet',
    'inte i min kunskapsbas',
    'inte tränad på',
  ];
  
  // English patterns
  const englishPatterns = [
    "don't have that in my",
    "can't answer that",
    "don't have that information",
    "don't know",
    "don't have access to",
    "unfortunately can't",
    'not based on the material',
    'not in the material',
    'not in my knowledge base',
    'not trained on',
    "i'm not able to answer",
    'outside my knowledge',
  ];
  
  const allPatterns = [...swedishPatterns, ...englishPatterns];
  
  return allPatterns.some(pattern => lowerResponse.includes(pattern));
}

/**
 * Send a custom event to Google Analytics
 * @param eventName The name of the event
 * @param params Additional parameters for the event
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
    console.log('GA event:', eventName, params);
  }
}