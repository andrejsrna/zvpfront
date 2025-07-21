'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getCookieConsent,
  setCookieConsent,
  getCookiePreferences,
  setCookiePreferences,
  defaultPreferences,
  CookiePreferences,
} from '@/app/lib/cookieConsent';

export default function CookieConsent() {
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const hasConsent = getCookieConsent();
    if (!hasConsent) {
      setShowModal(true);
      // Disable scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    setPreferences(getCookiePreferences());
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      advertising: true,
      functional: true,
    };
    setCookieConsent(true);
    setCookiePreferences(allAccepted);
    setShowModal(false);
    document.body.style.overflow = 'unset';
    // Hard refresh page to apply new cookie settings
    window.location.reload();
  };

  const handleAcceptSelected = () => {
    setCookieConsent(true);
    setCookiePreferences(preferences);
    setShowModal(false);
    setShowSettings(false);
    document.body.style.overflow = 'unset';
    // Hard refresh page to apply new cookie settings
    window.location.reload();
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      advertising: false,
      functional: false,
    };
    setCookieConsent(true);
    setCookiePreferences(onlyNecessary);
    setShowModal(false);
    document.body.style.overflow = 'unset';
    // Hard refresh page to apply new cookie settings
    window.location.reload();
  };

  if (!showModal) return null;

  return (
    <>
      {/* Backdrop - cannot be closed by clicking */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 cookie-modal-backdrop" />

      {/* Cookie Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto cookie-modal-content">
          <div className="p-8">
            {/* Cookie Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <span className="text-3xl">🍪</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Táto stránka používa cookies
              </h2>
            </div>

            <p className="text-gray-600 mb-6">
              Pre fungovanie tejto stránky používame nevyhnutné súbory cookie. S
              vaším súhlasom môžeme použiť aj ďalšie súbory cookie na účely
              analýzy, personalizácie a marketingu.{' '}
              <Link
                href="/cookies"
                className="text-emerald-800 hover:underline font-medium"
              >
                Zistite viac
              </Link>
              .
            </p>

            {!showSettings ? (
              <>
                {/* Quick Accept/Reject Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAcceptAll}
                    className="w-full px-6 py-3 text-base font-medium text-white 
                      bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Prijať všetky cookies
                  </button>

                  <button
                    onClick={handleRejectAll}
                    className="w-full px-6 py-3 text-base font-medium text-gray-700 
                      bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors
                      focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Odmietnuť voliteľné cookies
                  </button>

                  <button
                    onClick={() => setShowSettings(true)}
                    className="w-full px-6 py-3 text-base font-medium text-emerald-600 
                      bg-white border-2 border-emerald-600 rounded-lg hover:bg-emerald-50 
                      transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 
                      focus:ring-offset-2"
                  >
                    Upraviť nastavenia
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Detailed Cookie Settings */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-sm text-gray-600 hover:text-gray-800 mb-4 
                      flex items-center transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Späť
                  </button>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Nastavenia cookies
                  </h3>

                  <div className="space-y-4">
                    {/* Necessary Cookies */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-start cursor-not-allowed">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="w-5 h-5 text-emerald-600 border-gray-300 rounded mt-0.5"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900">
                            Nevyhnutné cookies
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Tieto cookies sú potrebné pre správne fungovanie
                            stránky a nemôžu byť vypnuté.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={e =>
                            setPreferences({
                              ...preferences,
                              analytics: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-emerald-600 border-gray-300 rounded mt-0.5"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900">
                            Analytické cookies
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Pomáhajú nám pochopiť, ako návštevníci používajú
                            našu stránku (Google Analytics).
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Advertising Cookies */}
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.advertising}
                          onChange={e =>
                            setPreferences({
                              ...preferences,
                              advertising: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-emerald-600 border-gray-300 rounded mt-0.5"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900">
                            Reklamné cookies
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Používajú sa na zobrazovanie relevantných reklám
                            (Google AdSense).
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Functional Cookies */}
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={e =>
                            setPreferences({
                              ...preferences,
                              functional: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-emerald-600 border-gray-300 rounded mt-0.5"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900">
                            Funkčné cookies
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Umožňujú zapamätať si vaše preferencie a zlepšiť
                            funkčnosť stránky.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAcceptSelected}
                  className="w-full px-6 py-3 text-base font-medium text-white 
                    bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Uložiť moje nastavenia
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
