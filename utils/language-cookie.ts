/**
 * Language preference cookie utilities
 * Saves and retrieves language preference between sessions
 */

const LANGUAGE_COOKIE_NAME = 'portfolio-language';
const COOKIE_EXPIRY_DAYS = 365; // 1 year

/**
 * Save language preference to cookie
 */
export function saveLanguagePreference(language: 'en' | 'sv'): void {
  if (typeof document === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + (COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${language};${expires};path=/;SameSite=Lax`;
  console.log('💾 Language preference saved:', language);
}

/**
 * Get language preference from cookie
 * Returns 'en' as default if no preference is saved
 */
export function getLanguagePreference(): 'en' | 'sv' {
  if (typeof document === 'undefined') return 'en';
  
  const name = LANGUAGE_COOKIE_NAME + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  
  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      const value = cookie.substring(name.length);
      if (value === 'sv' || value === 'en') {
        console.log('📖 Language preference loaded from cookie:', value);
        return value;
      }
    }
  }
  
  console.log('📖 No language preference found, defaulting to English');
  return 'en';
}

/**
 * Clear language preference cookie
 */
export function clearLanguagePreference(): void {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${LANGUAGE_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  console.log('🗑️ Language preference cleared');
}
