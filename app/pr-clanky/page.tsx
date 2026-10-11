import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Publikovanie PR článkov a reklamná spolupráca | Zdravie v praxi',
  description: 'Reklamná spolupráca na Zdravie v praxi: tematické PR články o zdraví a životnom štýle s transparentným označením a zodpovedným obsahom.',
  alternates: { canonical: 'https://zdravievpraxi.sk/pr-clanky' },
};

export default function PRClankyPage() {
  return (
    <main className="bg-white text-gray-900 pt-32 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        <header className="max-w-3xl border-l-4 border-primary pl-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Spolupráca so Zdravím v praxi</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Publikovanie PR článkov a reklamná spolupráca</h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">Predstavte svoju službu alebo značku v kontexte zdravia a každodennej starostlivosti o seba. Pri reklamnom obsahu kladieme dôraz na zrozumiteľnosť, relevantnosť a dôveru čitateľov.</p>
          <a href="mailto:info@zdravievpraxi.sk?subject=Z%C3%A1ujem%20o%20PR%20%C4%8Dl%C3%A1nok" className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Mám záujem o publikovanie článku</a>
        </header>
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <section><h2 className="text-2xl font-semibold">Témy, ktoré dávajú zmysel</h2><p className="mt-4 leading-relaxed text-gray-600">Prevencia, zdravý životný štýl, výživa, starostlivosť o telo a relevantné zdravotné služby. Posúdime, či téma zapadá do portálu a či prináša čitateľovi užitočné informácie.</p></section>
          <section><h2 className="text-2xl font-semibold">Forma spolupráce</h2><p className="mt-4 leading-relaxed text-gray-600">Môžete dodať vlastný PR článok na kontrolu alebo požiadať o prípravu textu podľa zadania. Rozsah, podklady, odkazy, cenu a termín dohodneme pred publikovaním.</p></section>
        </div>
        <section className="mt-14 rounded-xl bg-primary/5 border border-primary/20 p-6 md:p-10"><h2 className="text-2xl font-semibold">Od návrhu k publikovaniu</h2><ol className="mt-5 list-decimal pl-5 space-y-4 leading-relaxed"><li>Pošlite tému, predstavenie značky alebo služby, cieľovú URL a prípadný hotový text.</li><li>Preveríme vhodnosť a dohodneme rozsah spolupráce, cenu aj termín.</li><li>Skontrolujeme text a podklady a po dohode pripravíme publikovanie.</li></ol></section>
        <section className="mt-14 max-w-3xl"><h2 className="text-2xl font-semibold">Zdravotný obsah má svoje hranice</h2><p className="mt-4 leading-relaxed text-gray-600">Neprijímame zavádzajúce zdravotné tvrdenia, nepodložené sľuby vyliečenia ani reklamu, ktorá nabáda nahradiť odbornú starostlivosť produktom. Pri odborných tvrdeniach požadujeme primerané dôveryhodné podklady. Nevhodné ponuky môžeme odmietnuť.</p><p className="mt-4 leading-relaxed text-gray-600">Platené články transparentne označujeme ako reklamu alebo sponzorovaný obsah a platené externé odkazy atribútom rel=&quot;sponsored&quot;. Negarantujeme pozície vo vyhľadávaní a neponúkame odkazy na manipuláciu hodnotenia webov.</p></section>
        <section className="mt-14 border-t pt-8"><h2 className="text-2xl font-semibold">Dohodnime si spoluprácu</h2><p className="mt-4 leading-relaxed">Napíšte na <a className="text-primary underline underline-offset-4" href="mailto:info@zdravievpraxi.sk">info@zdravievpraxi.sk</a>. Uveďte tému, značku, požadovaný rozsah a termín.</p><Link className="mt-4 inline-block text-primary underline underline-offset-4" href="/kontakt">Kontaktné údaje</Link></section>
      </div>
    </main>
  );
}
