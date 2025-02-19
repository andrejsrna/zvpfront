"use client";

import { useState } from "react";
import Link from "next/link";

interface NewsletterFormData {
  email: string;
  acceptPrivacy: boolean;
}

export default function Newsletter() {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: "",
    acceptPrivacy: false
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptPrivacy) {
      setErrorMessage("Prosím, potvrďte súhlas so spracovaním osobných údajov");
      return;
    }

    setStatus('loading');
    setErrorMessage("");

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Nepodarilo sa prihlásiť na odber');
      }

      setStatus('success');
      setFormData({ email: "", acceptPrivacy: false });
    } catch {
      setStatus('error');
      setErrorMessage("Nastala chyba pri prihlásení na odber. Skúste to prosím neskôr.");
    }
  };

  return (
    <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-5 items-center">
            {/* Left Content */}
            <div className="md:col-span-3 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Zostaňte v obraze
              </h2>
              <p className="text-gray-600 mb-8">
                Prihláste sa na odber noviniek a dostávajte pravidelne čerstvé informácie 
                o zdraví a životnom štýle priamo do vašej schránky.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Emailová adresa
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        email: e.target.value 
                      }))}
                      placeholder="Zadajte váš email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 
                        focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      checked={formData.acceptPrivacy}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        acceptPrivacy: e.target.checked 
                      }))}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 
                        focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="privacy" className="text-sm text-gray-600 cursor-pointer">
                      Súhlasím so spracovaním osobných údajov a{' '}
                      <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
                        podmienkami ochrany súkromia
                      </Link>
                    </label>
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-6 py-3 text-base font-semibold text-white 
                    bg-emerald-600 rounded-lg hover:bg-emerald-700 
                    transition-all duration-200 disabled:opacity-50 
                    disabled:cursor-not-allowed focus:outline-none focus:ring-2 
                    focus:ring-emerald-500 focus:ring-offset-2"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" 
                          stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Prihlasujem...
                    </span>
                  ) : (
                    'Prihlásiť sa na odber'
                  )}
                </button>

                {status === 'success' && (
                  <div className="text-emerald-600 text-sm text-center mt-2">
                    Úspešne ste sa prihlásili na odber noviniek!
                  </div>
                )}
              </form>
            </div>

            {/* Right Decorative Section */}
            <div className="hidden md:block md:col-span-2 bg-gradient-to-br 
              from-emerald-500 to-teal-600 p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <svg className="w-12 h-12 mb-6 text-white/90" fill="none" 
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="space-y-2">
                  <div className="w-32 h-2 rounded bg-white/20"></div>
                  <div className="w-24 h-2 rounded bg-white/20"></div>
                  <div className="w-20 h-2 rounded bg-white/20"></div>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute right-0 bottom-0 transform translate-x-1/3 
                translate-y-1/3">
                <div className="w-64 h-64 rounded-full border-4 border-white/20"></div>
              </div>
              <div className="absolute right-0 bottom-0 transform translate-x-1/2 
                translate-y-1/2">
                <div className="w-80 h-80 rounded-full border-4 border-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
