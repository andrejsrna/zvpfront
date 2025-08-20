'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NewsletterFormData {
  email: string;
  acceptPrivacy: boolean;
}

export default function Newsletter() {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    acceptPrivacy: false,
  });
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptPrivacy) {
      setErrorMessage('Prosím, potvrďte súhlas so spracovaním osobných údajov');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

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
      setFormData({ email: '', acceptPrivacy: false });
    } catch {
      setStatus('error');
      setErrorMessage(
        'Nastala chyba pri prihlásení na odber. Skúste to prosím neskôr.'
      );
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Zostaňte v obraze
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Prihláste sa na odber noviniek a dostávajte pravidelne čerstvé
              informácie o zdraví a životnom štýle priamo do vašej schránky.
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
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Zadajte váš email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 
                      focus:outline-none focus:ring-2 focus:ring-primary 
                      focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="privacy-policy"
                    name="privacy-policy"
                    type="checkbox"
                    checked={formData.acceptPrivacy}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        acceptPrivacy: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary
        focus:ring-primary"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="privacy-policy"
                    className="text-sm text-gray-700"
                  >
                    Súhlasím s{' '}
                    <Link
                      href="/ochrana-sukromia"
                      className="text-primary hover:text-primary/80"
                    >
                      podmienkami ochrany súkromia
                    </Link>
                    .
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
                  bg-primary rounded-lg hover:bg-primary/80 
                  transition-all duration-200 disabled:opacity-50 
                  disabled:cursor-not-allowed focus:outline-none focus:ring-2 
                  focus:ring-primary focus:ring-offset-2"
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Prihlasujem...
                  </span>
                ) : (
                  'Prihlásiť sa na odber'
                )}
              </button>

              {status === 'success' && (
                <div className="text-primary text-sm text-center mt-2">
                  Úspešne ste sa prihlásili na odber noviniek!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
