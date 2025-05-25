declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (command: string, ...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[];
  }
}

export {};
