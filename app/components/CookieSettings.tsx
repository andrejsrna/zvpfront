'use client';

import { useState } from 'react';
import {
  getCookiePreferences,
  setCookiePreferences,
  CookiePreferences,
} from '@/app/lib/cookieConsent';

export default function CookieSettings() {
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(
    getCookiePreferences()
  );

  const handleSave = () => {
    setCookiePreferences(preferences);
    setShowModal(false);
    // Reload page to apply new settings
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={() => {
          setPreferences(getCookiePreferences());
          setShowModal(true);
        }}
        className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
      >
        Nastavenia cookies
      </button>

      {showModal && (
        <>
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Prispôsobiť súhlas
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-gray-100 rounded-lg">
                    <input
                      id="necessary"
                      type="checkbox"
                      className="w-4 h-4 text-emerald-800 border-gray-300 rounded
                        focus:ring-emerald-500 cursor-not-allowed"
                      checked
                      disabled
                    />
                    <div className="ml-3 text-sm">
                      <label htmlFor="necessary" className="flex items-center">
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          Nevyhnutné cookies
                        </span>
                      </label>
                      <p className="ml-7 text-xs text-gray-500 mt-1">
                        Potrebné pre správne fungovanie stránky.
                      </p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start p-3 bg-white rounded-lg border">
                    <input
                      id="analytics"
                      type="checkbox"
                      className="w-4 h-4 text-emerald-800 border-gray-300 rounded
                        focus:ring-emerald-500"
                      checked={preferences.analytics}
                      onChange={e =>
                        setPreferences({
                          ...preferences,
                          analytics: e.target.checked,
                        })
                      }
                    />
                    <div className="ml-3 text-sm">
                      <label htmlFor="analytics" className="flex items-center">
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          Analytické cookies
                        </span>
                      </label>
                      <p className="ml-7 text-xs text-gray-500 mt-1">
                        Google Analytics pre analýzu návštevnosti.
                      </p>
                    </div>
                  </div>

                  {/* Advertising Cookies */}
                  <div className="flex items-start p-3 bg-white rounded-lg border">
                    <input
                      id="advertising"
                      type="checkbox"
                      className="w-4 h-4 text-emerald-800 border-gray-300 rounded
                        focus:ring-emerald-500"
                      checked={preferences.advertising}
                      onChange={e =>
                        setPreferences({
                          ...preferences,
                          advertising: e.target.checked,
                        })
                      }
                    />
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="advertising"
                        className="flex items-center"
                      >
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          Reklamné cookies
                        </span>
                      </label>
                      <p className="ml-7 text-xs text-gray-500 mt-1">
                        Google AdSense pre zobrazovanie reklám.
                      </p>
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="flex items-start p-3 bg-white rounded-lg border">
                    <input
                      id="functional"
                      type="checkbox"
                      className="w-4 h-4 text-emerald-800 border-gray-300 rounded
                        focus:ring-emerald-500"
                      checked={preferences.functional}
                      onChange={e =>
                        setPreferences({
                          ...preferences,
                          functional: e.target.checked,
                        })
                      }
                    />
                    <div className="ml-3 text-sm">
                      <label htmlFor="functional" className="flex items-center">
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          Funkčné cookies
                        </span>
                      </label>
                      <p className="ml-7 text-xs text-gray-500 mt-1">
                        Pre zapamätanie vašich preferencií.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100
                      rounded-lg hover:bg-gray-200"
                  >
                    Zrušiť
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-700
                      rounded-lg hover:bg-emerald-800"
                  >
                    Uložiť
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowModal(false)}
          />
        </>
      )}
    </>
  );
}
