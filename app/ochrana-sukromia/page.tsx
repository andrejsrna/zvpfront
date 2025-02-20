export default function PrivacyPage() {
  return (
    <div className="bg-white pt-40 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Ochrana súkromia
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-600 mb-8">
              Vaše súkromie je pre nás dôležité. Tento dokument vysvetľuje, ako 
              zhromažďujeme, používame a chránime vaše osobné údaje.
            </p>

            <section className="mb-12">
              <h2>Aké údaje zbierame</h2>
              <p>
                Pri návšteve našej stránky môžeme zhromažďovať nasledujúce informácie:
              </p>
              <ul>
                <li>Informácie o vašom prehliadači a zariadení</li>
                <li>IP adresa</li>
                <li>Čas strávený na stránke</li>
                <li>Navštívené stránky</li>
                <li>Cookies a podobné technológie</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>Ako používame vaše údaje</h2>
              <p>Vaše údaje používame na:</p>
              <ul>
                <li>Zlepšovanie našich služieb a obsahu</li>
                <li>Analýzu návštevnosti</li>
                <li>Personalizáciu obsahu</li>
                <li>Zabezpečenie funkčnosti webu</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>Cookies</h2>
              <p>
                Používame cookies na zlepšenie vášho zážitku z prehliadania. 
                Môžete ich kedykoľvek zakázať v nastaveniach prehliadača, 
                ale môže to ovplyvniť funkčnosť stránky.
              </p>
            </section>

            <section className="mb-12">
              <h2>Zdieľanie údajov</h2>
              <p>
                Vaše osobné údaje nezdieľame s tretími stranami, okrem prípadov:
              </p>
              <ul>
                <li>Keď je to vyžadované zákonom</li>
                <li>S vašim výslovným súhlasom</li>
                <li>
                  S poskytovateľmi služieb, ktorí nám pomáhajú prevádzkovať web 
                  (viazaní mlčanlivosťou)
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>Bezpečnosť</h2>
              <p>
                Implementujeme primerané bezpečnostné opatrenia na ochranu vašich 
                údajov pred neoprávneným prístupom, zmenou, zverejnením alebo 
                zničením.
              </p>
            </section>

            <section className="mb-12">
              <h2>Vaše práva</h2>
              <p>Máte právo:</p>
              <ul>
                <li>Požiadať o prístup k vašim údajom</li>
                <li>Požiadať o opravu nepresných údajov</li>
                <li>Požiadať o vymazanie údajov</li>
                <li>Namietať proti spracovaniu</li>
                <li>Požiadať o prenosnosť údajov</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>Kontaktujte nás</h2>
              <p>
                Ak máte akékoľvek otázky týkajúce sa ochrany súkromia, 
                kontaktujte nás na{' '}
                <a href="mailto:privacy@zdravievpraxi.sk" 
                  className="text-emerald-600 hover:text-emerald-700">
                  privacy@zdravievpraxi.sk
                </a>
              </p>
            </section>

            <section>
              <h2>Zmeny v ochrane súkromia</h2>
              <p>
                Vyhradzujeme si právo aktualizovať tieto zásady ochrany súkromia. 
                Zmeny budú účinné ihneď po zverejnení na tejto stránke.
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
