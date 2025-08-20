'use client';

import {
  EnvelopeIcon as MailIcon,
  PhoneIcon,
  MapIcon as LocationMarkerIcon,
} from '@heroicons/react/24/outline';

export default function KontaktPage() {
  return (
    <div className="bg-white text-gray-900 pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Kontaktujte nás
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-600 mb-12">
              Máte otázky, návrhy alebo spätnú väzbu? Neváhajte nás kontaktovať.
              Sme tu pre vás.
            </p>

            {/* Kontaktné informácie */}
            <section className="grid gap-8 mb-12">
              <div className="bg-primary/10 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Kontaktné údaje
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MailIcon className="w-6 h-6 text-primary mt-1 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Email
                      </h3>
                      <p className="text-gray-600">
                        Napíšte nám na{' '}
                        <a
                          href="mailto:info@zdravievpraxi.sk"
                          className="text-primary hover:text-primary/80"
                        >
                          info@zdravievpraxi.sk
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <LocationMarkerIcon className="w-6 h-6 text-primary mt-1 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Adresa
                      </h3>
                      <p className="text-gray-600">
                        Enhold s.r.o.
                        <br />
                        Drobného 1900/2
                        <br />
                        841 02 Bratislava - mestská časť Dúbravka
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <PhoneIcon className="w-6 h-6 text-primary mt-1 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Fakturačné údaje
                      </h3>
                      <p className="text-gray-600">
                        IČO: 55400817
                        <br />
                        DIČ: 2121985954
                        <br />
                        IČ DPH: SK2121985954
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Mapa */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Kde nás nájdete
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2663.5546947537007!2d17.03519187633115!3d48.1140669158552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c8c3b0b0b0b0b%3A0x0!2zRHJvYm7DqWhvIDE5MDAvMiwgODQxIDAyIEJyYXRpc2xhdmEgLSBtZXN0c2vDoSDEjWFzxaUgRMO6YnJhdmth!5e0!3m2!1sen!2s!4v1708701495776!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
