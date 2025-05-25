'use client';

import { useEffect } from 'react';
import { initializeConsent } from '@/app/lib/cookieConsent';

export default function CookieConsentInit() {
  useEffect(() => {
    initializeConsent();
  }, []);

  return null;
}
