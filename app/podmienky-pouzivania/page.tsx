export default function TermsPage() {
  return (
    <div className="bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Podmienky používania
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-600 mb-8">
              Používaním tejto webovej stránky súhlasíte s nasledujúcimi podmienkami 
              používania. Prosíme, prečítajte si ich pozorne.
            </p>

            <section className="mb-12">
              <h2>1. Všeobecné ustanovenia</h2>
              <p>
                Prevádzkovateľom webovej stránky zdravievpraxi.sk je spoločnosť 
                Enhold s.r.o. Používaním našej stránky vyjadrujete súhlas 
                s týmito podmienkami.
              </p>
            </section>

            <section className="mb-12">
              <h2>2. Obsah stránky</h2>
              <p>
                Všetok obsah na tejto stránke slúži len na informačné účely. 
                Nenahrádza odborné lekárske poradenstvo, diagnózu ani liečbu. 
                Vždy sa poraďte so svojím lekárom alebo iným kvalifikovaným 
                zdravotníckym pracovníkom.
              </p>
              <p>
                Vyhradzujeme si právo kedykoľvek zmeniť alebo odstrániť 
                akýkoľvek obsah stránky bez predchádzajúceho upozornenia.
              </p>
            </section>

            <section className="mb-12">
              <h2>3. Duševné vlastníctvo</h2>
              <p>
                Všetok obsah na tejto stránke, vrátane textov, grafiky, logotypov, 
                obrázkov a softvéru, je chránený autorskými právami a inými 
                právami duševného vlastníctva.
              </p>
              <ul>
                <li>
                  Obsah nemôžete kopírovať, reprodukovať, upravovať ani distribuovať 
                  bez nášho písomného súhlasu
                </li>
                <li>
                  Môžete zdieľať odkazy na naše články pri dodržaní zásad 
                  správneho citovania
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>4. Zodpovednosť používateľa</h2>
              <p>Pri používaní našej stránky sa zaväzujete:</p>
              <ul>
                <li>Poskytovať pravdivé a presné informácie</li>
                <li>Neporušovať práva tretích strán</li>
                <li>Nezasahovať do bezpečnosti stránky</li>
                <li>Dodržiavať všetky platné zákony a predpisy</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>5. Obmedzenie zodpovednosti</h2>
              <p>
                Naša stránka je poskytovaná &quot;tak ako je&quot; bez akýchkoľvek záruk. 
                Nezodpovedáme za:
              </p>
              <ul>
                <li>Presnosť alebo úplnosť informácií</li>
                <li>Škody vzniknuté používaním stránky</li>
                <li>Výpadky alebo nedostupnosť služby</li>
                <li>Škody spôsobené vírusmi alebo škodlivým kódom</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>6. Odkazy na tretie strany</h2>
              <p>
                Naša stránka môže obsahovať odkazy na externé webové stránky. 
                Nemáme kontrolu nad obsahom týchto stránok a nenesieme 
                zodpovednosť za ich obsah ani praktiky ochrany súkromia.
              </p>
            </section>

            <section className="mb-12">
              <h2>7. Ukončenie používania</h2>
              <p>
                Vyhradzujeme si právo obmedziť alebo ukončiť prístup 
                k našej stránke ktorémukoľvek používateľovi, ktorý porušuje 
                tieto podmienky používania.
              </p>
            </section>

            <section>
              <h2>8. Zmeny podmienok</h2>
              <p>
                Vyhradzujeme si právo kedykoľvek zmeniť tieto podmienky používania. 
                Zmeny nadobúdajú účinnosť ihneď po ich zverejnení na tejto stránke.
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
