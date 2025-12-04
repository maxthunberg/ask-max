// Google Analytics utility functions
// 
// Session tracking implementation:
// - Each chat conversation gets a unique session ID (chat_12345...)
// - Session ID is generated when chat starts and persists until reset
// - All events include the session ID to tie messages together
// 
// Events tracked:
// 1. chat_started - Fired once when user initiates first message
// 2. search - Fired for each message with:
//    - search_term: the user's question OR AI's response
//    - chat_id: the session ID
//    - sender_type: 'user' or 'ai'
//    - response_type (optional): 'success', 'unknown', or 'error' (only for AI responses)
//
// Example GA data:
// chat_started { chat_id: "chat_1733..." }
// search { search_term: "what is ux", chat_id: "chat_1733...", sender_type: "user" }
// search { search_term: "UX is about...", chat_id: "chat_1733...", sender_type: "ai", response_type: "success" }
// search { search_term: "who are you", chat_id: "chat_1733...", sender_type: "user" }
// search { search_term: "I don't have that...", chat_id: "chat_1733...", sender_type: "ai", response_type: "unknown" }

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
 * Send a search event to Google Analytics
 * @param searchTerm The search query/chat message
 * @param sessionId The unique session/chat ID
 * @param senderType 'user' or 'ai'
 * @param responseType Optional type of response (e.g., "unknown", "success") for AI responses
 */
export function trackSearch(
  searchTerm: string,
  sessionId: string,
  senderType: 'user' | 'ai',
  responseType?: 'success' | 'unknown' | 'error'
) {
  if (typeof window !== 'undefined' && window.gtag) {
    const params: Record<string, any> = {
      search_term: searchTerm,
      chat_id: sessionId,
      sender_type: senderType,
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
 */
export function trackChatStarted(sessionId: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chat_started', {
      event_category: 'engagement',
      event_label: 'User started a chat conversation',
      chat_id: sessionId,
    });
    console.log('GA event: chat_started', { chat_id: sessionId });
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