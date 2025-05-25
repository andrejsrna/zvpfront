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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Nastavenia cookies
                </h2>

                <div className="space-y-4">
                  {/* Necessary Cookies */}
                  <div>
                    <label className="flex items-center cursor-not-allowed">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        Nevyhnutné cookies
                      </span>
                    </label>
                    <p className="ml-7 text-xs text-gray-500 mt-1">
                      Potrebné pre správne fungovanie stránky.
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={e =>
                          setPreferences({
                            ...preferences,
                            analytics: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        Analytické cookies
                      </span>
                    </label>
                    <p className="ml-7 text-xs text-gray-500 mt-1">
                      Google Analytics pre analýzu návštevnosti.
                    </p>
                  </div>

                  {/* Advertising Cookies */}
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.advertising}
                        onChange={e =>
                          setPreferences({
                            ...preferences,
                            advertising: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        Reklamné cookies
                      </span>
                    </label>
                    <p className="ml-7 text-xs text-gray-500 mt-1">
                      Google AdSense pre zobrazovanie reklám.
                    </p>
                  </div>

                  {/* Functional Cookies */}
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={e =>
                          setPreferences({
                            ...preferences,
                            functional: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        Funkčné cookies
                      </span>
                    </label>
                    <p className="ml-7 text-xs text-gray-500 mt-1">
                      Pre zapamätanie vašich preferencií.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                      rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Zrušiť
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 
                      rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Uložiť nastavenia
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
