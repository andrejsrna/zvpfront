'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFocusTrap } from '@/app/hooks/useFocusTrap';
import {
  getCookieConsent,
  setCookieConsent,
  getCookiePreferences,
  setCookiePreferences,
  defaultPreferences,
  CookiePreferences,
} from '@/app/lib/cookieConsent';

export default function CookieConsentModal() {
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);
  const focusTrapRef = useFocusTrap(showModal);

  useEffect(() => {
    const hasConsent = getCookieConsent();
    if (!hasConsent) {
      setShowModal(true);
      document.body.classList.add('modal-open');
    }
    setPreferences(getCookiePreferences());
  }, []);

  const closeModal = () => {
    setShowModal(false);
    document.body.classList.remove('modal-open');
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      advertising: true,
      functional: true,
    };
    setCookieConsent(true);
    setCookiePreferences(allAccepted);
    closeModal();
    // Hard refresh page to apply new cookie settings
    window.location.reload();
  };

  const handleAcceptSelected = () => {
    setCookieConsent(true);
    setCookiePreferences(preferences);
    closeModal();
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
    closeModal();
    // Hard refresh page to apply new cookie settings
    window.location.reload();
  };

  if (!showModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] cookie-modal-backdrop" />

      {/* Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div
          ref={focusTrapRef}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto cookie-modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
        >
          <div className="p-8">
            {!showSettings ? (
              <>
                {/* Main View */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/60 to-primary rounded-full mb-4 shadow-lg">
                    <span className="text-4xl">🍪</span>
                  </div>
                  <h2
                    id="cookie-modal-title"
                    className="text-3xl font-bold text-gray-900 mb-2"
                  >
                    Cookies & Súkromie
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Používame cookies na vylepšenie vášho zážitku. Môžete si
                    vybrať, ktoré typy cookies chcete povoliť.
                  </p>
                </div>

                {/* Cookie Categories Preview */}
                <div className="mb-8 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <span className="text-sm font-medium text-gray-800">
                      Nevyhnutné
                    </span>
                    <span className="text-sm text-primary font-medium">
                      Vždy aktívne
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📊</span>
                      <span className="font-medium text-gray-900">
                        Analytické
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">Voliteľné</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📢</span>
                      <span className="font-medium text-gray-900">
                        Reklamné
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">Voliteľné</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAcceptAll}
                    className="w-full px-6 py-4 text-base font-semibold text-white 
                      bg-gradient-to-r from-primary to-primary/90 rounded-xl 
                      hover:from-primary/90 hover:to-primary/80 transition-all 
                      transform hover:scale-[1.02] shadow-lg cookie-button"
                  >
                    Prijať všetky cookies
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-3 text-sm font-medium text-gray-700 
                        bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cookie-button"
                    >
                      Len nevyhnutné
                    </button>

                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-4 py-3 text-sm font-medium text-primary 
                        bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors cookie-button"
                    >
                      Upraviť výber
                    </button>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-500 mt-6">
                  Prečítajte si naše{' '}
                  <Link
                    href="/cookies"
                    target="_blank"
                    className="text-primary hover:underline font-medium"
                  >
                    zásady používania cookies
                  </Link>
                </p>
              </>
            ) : (
              <>
                {/* Settings View */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-sm text-gray-600 hover:text-gray-800 mb-6 
                      flex items-center transition-colors group"
                  >
                    <svg
                      className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
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
                    Späť na prehľad
                  </button>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Prispôsobte si cookies
                  </h3>
                  <p className="text-gray-600">
                    Vyberte, ktoré kategórie cookies chcete povoliť.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {/* Necessary Cookies */}
                  <div className="bg-primary/10 border border-primary/20 p-5 rounded-xl">
                    <label className="flex items-start cursor-not-allowed">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="cookie-checkbox mt-0.5"
                      />
                      <div className="ml-4">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">🔒</span>
                          <span className="font-semibold text-gray-900">
                            Nevyhnutné cookies
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Zabezpečujú základné funkcie stránky ako navigáciu a
                          prístup k zabezpečeným oblastiam. Bez nich stránka
                          nemôže správne fungovať.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="bg-white border border-gray-200 p-5 rounded-xl hover:border-primary/30 transition-colors">
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
                        className="cookie-checkbox mt-0.5"
                      />
                      <div className="ml-4">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">📊</span>
                          <span className="font-semibold text-gray-900">
                            Analytické cookies
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Pomáhajú nám pochopiť, ako návštevníci používajú
                          stránku. Všetky údaje sú anonymizované. (Google
                          Analytics)
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Advertising Cookies */}
                  <div className="bg-white border border-gray-200 p-5 rounded-xl hover:border-primary/30 transition-colors">
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
                        className="cookie-checkbox mt-0.5"
                      />
                      <div className="ml-4">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">📢</span>
                          <span className="font-semibold text-gray-900">
                            Reklamné cookies
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Používajú sa na zobrazovanie relevantných reklám.
                          Pomáhajú nám udržať stránku bezplatnú. (Google
                          AdSense)
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Functional Cookies */}
                  <div className="bg-white border border-gray-200 p-5 rounded-xl hover:border-primary/30 transition-colors">
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
                        className="cookie-checkbox mt-0.5"
                      />
                      <div className="ml-4">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">⚙️</span>
                          <span className="font-semibold text-gray-900">
                            Funkčné cookies
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Umožňujú rozšírené funkcie a personalizáciu, ako
                          napríklad uložené preferencie a nastavenia.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleAcceptSelected}
                  className="w-full px-6 py-4 text-base font-semibold text-white 
                    bg-gradient-to-r from-primary to-primary/90 rounded-xl 
                    hover:from-primary/90 hover:to-primary/80 transition-all 
                    transform hover:scale-[1.02] shadow-lg cookie-button"
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
