import Cookies from 'js-cookie';

export type CookieCategory =
  | 'necessary'
  | 'analytics'
  | 'advertising'
  | 'functional';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

export const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true
  analytics: false,
  advertising: false,
  functional: false,
};

export function getCookieConsent(): boolean {
  return Cookies.get(COOKIE_CONSENT_KEY) === 'true';
}

export function setCookieConsent(consent: boolean): void {
  Cookies.set(COOKIE_CONSENT_KEY, consent.toString(), {
    expires: 365,
    sameSite: 'strict',
  });
}

export function getCookiePreferences(): CookiePreferences {
  const stored = Cookies.get(COOKIE_PREFERENCES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultPreferences;
    }
  }
  return defaultPreferences;
}

export function setCookiePreferences(preferences: CookiePreferences): void {
  // Necessary cookies are always enabled
  preferences.necessary = true;

  Cookies.set(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences), {
    expires: 365,
    sameSite: 'strict',
  });

  // Apply preferences
  applyPreferences(preferences);
}

export function applyPreferences(preferences: CookiePreferences): void {
  // Google Analytics
  if (preferences.analytics) {
    // Enable GA
    window.gtag?.('consent', 'update', {
      analytics_storage: 'granted',
    });
  } else {
    // Disable GA
    window.gtag?.('consent', 'update', {
      analytics_storage: 'denied',
    });
    // Remove GA cookies
    removeGoogleAnalyticsCookies();
  }

  // Google AdSense
  if (preferences.advertising) {
    // Enable AdSense
    window.gtag?.('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
    // Reload ads if needed
    if (window.adsbygoogle) {
      window.location.reload();
    }
  } else {
    // Disable AdSense
    window.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    // Remove advertising cookies
    removeAdvertisingCookies();
  }
}

function removeGoogleAnalyticsCookies(): void {
  // Remove GA cookies
  const gaCookies = ['_ga', '_gid', '_gat', '_ga_*'];
  gaCookies.forEach(cookieName => {
    // Remove from all domains
    Cookies.remove(cookieName);
    Cookies.remove(cookieName, { domain: '.zdravievpraxi.sk' });
    Cookies.remove(cookieName, { domain: window.location.hostname });
  });
}

function removeAdvertisingCookies(): void {
  // Remove common advertising cookies
  const adCookies = ['__gads', '__gpi', '_gcl_*', 'IDE', 'DSID', 'FLC'];
  adCookies.forEach(cookieName => {
    Cookies.remove(cookieName);
    Cookies.remove(cookieName, { domain: '.zdravievpraxi.sk' });
    Cookies.remove(cookieName, { domain: '.doubleclick.net' });
  });
}

// Initialize consent on page load
export function initializeConsent(): void {
  const hasConsent = getCookieConsent();
  const preferences = getCookiePreferences();

  // Set default consent state for Google
  window.gtag?.('consent', 'default', {
    ad_storage: hasConsent && preferences.advertising ? 'granted' : 'denied',
    ad_user_data: hasConsent && preferences.advertising ? 'granted' : 'denied',
    ad_personalization:
      hasConsent && preferences.advertising ? 'granted' : 'denied',
    analytics_storage:
      hasConsent && preferences.analytics ? 'granted' : 'denied',
    functionality_storage:
      hasConsent && preferences.functional ? 'granted' : 'denied',
    personalization_storage:
      hasConsent && preferences.functional ? 'granted' : 'denied',
    security_storage: 'granted',
  });

  if (hasConsent) {
    applyPreferences(preferences);
  }
}
