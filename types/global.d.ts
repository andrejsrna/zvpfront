// Global type definitions for external scripts
declare global {
  interface Window {
    loadAds?: () => void;
    adsLoaded?: boolean;
    adsbygoogle?: Array<Record<string, unknown>>;
    loadAnalytics?: () => void;
    analyticsLoaded?: boolean;
  }
}

export {};
