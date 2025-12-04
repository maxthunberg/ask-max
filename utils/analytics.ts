// Google Analytics utility functions

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
 * Send a search event to Google Analytics
 * @param searchTerm The search query/chat message
 */
export function trackSearch(searchTerm: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
    console.log('GA event: search', { search_term: searchTerm });
  }
}

/**
 * Send a chat_started event to Google Analytics
 */
export function trackChatStarted() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chat_started', {
      event_category: 'engagement',
      event_label: 'User started a chat conversation',
    });
    console.log('GA event: chat_started');
  }
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
