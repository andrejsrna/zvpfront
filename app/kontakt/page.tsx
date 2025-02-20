export default function ContactPage() {
  return (
    <div className="bg-white pt-40 pb-16">
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
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Kontaktné údaje
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg 
                      className="w-6 h-6 text-emerald-600 mt-1 mr-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href="mailto:info@zdravievpraxi.sk" 
                        className="text-emerald-600 hover:text-emerald-700">
                        info@zdravievpraxi.sk
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg 
                      className="w-6 h-6 text-emerald-600 mt-1 mr-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Adresa</p>
                      <p className="text-gray-600">
                        Enhold s.r.o.<br />
                        Drobného 1900/2<br />
                        841 02 Bratislava - mestská časť Dúbravka
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg 
                      className="w-6 h-6 text-emerald-600 mt-1 mr-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Fakturačné údaje</p>
                      <p className="text-gray-600">
                        IČO: 55400817<br />
                        DIČ: 2121985954<br />
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
