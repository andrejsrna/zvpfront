export default function CookiesPage() {
  return (
    <div className="bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Zásady používania cookies
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-600 mb-8">
              Na našej stránke používame cookies a podobné technológie na zlepšenie 
              vášho zážitku z prehliadania a poskytovanie personalizovaného obsahu.
            </p>

            <section className="mb-12">
              <h2>Čo sú cookies?</h2>
              <p>
                Cookies sú malé textové súbory, ktoré sa ukladajú vo vašom prehliadači 
                pri návšteve webových stránok. Pomáhajú nám:
              </p>
              <ul>
                <li>Zapamätať si vaše prihlasovacie údaje</li>
                <li>Zabezpečiť správne fungovanie stránky</li>
                <li>Pochopiť, ako používate našu stránku</li>
                <li>Personalizovať obsah a reklamy</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>Aké cookies používame</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Nevyhnutné cookies</h3>
                  <p>
                    Tieto cookies sú potrebné pre základné fungovanie stránky. 
                    Bez nich by stránka nefungovala správne.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Analytické cookies</h3>
                  <p>
                    Pomáhajú nám pochopiť, ako návštevníci používajú našu stránku. 
                    Všetky informácie sú anonymné.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Funkčné cookies</h3>
                  <p>
                    Umožňujú stránke zapamätať si vaše voľby (napríklad jazyk) 
                    a poskytovať vylepšené funkcie.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Marketingové cookies</h3>
                  <p>
                    Používajú sa na sledovanie návštevníkov naprieč webovými stránkami. 
                    Zámerom je zobrazovať reklamy, ktoré sú relevantné a zaujímavé.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2>Ako kontrolovať cookies</h2>
              <p>
                Väčšina webových prehliadačov automaticky akceptuje cookies. 
                Môžete ich však kedykoľvek vymazať alebo nastaviť svoj prehliadač 
                tak, aby ich blokoval.
              </p>
              <p className="mt-4">
                Návod na správu cookies v populárnych prehliadačoch:
              </p>
              <ul>
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/sk/kb/cookies-informacie-ktore-si-stranky-ukladaju" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/sk-sk/microsoft-edge/odstrániť-súbory-cookie-v-prehliadači-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700">
                    Microsoft Edge
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/sk-sk/guide/safari/sfri11471/mac" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700">
                    Safari
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>Upozornenie</h2>
              <p>
                Blokovanie niektorých typov cookies môže ovplyvniť vašu skúsenosť 
                na našich stránkach a služby, ktoré sme schopní ponúknuť.
              </p>
            </section>

            <section>
              <h2>Zmeny v zásadách cookies</h2>
              <p>
                Vyhradzujeme si právo kedykoľvek upraviť tieto zásady používania cookies. 
                Akékoľvek zmeny budú účinné ihneď po zverejnení na tejto stránke.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Posledná aktualizácia: {new Date().toLocaleDateString('sk-SK')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
