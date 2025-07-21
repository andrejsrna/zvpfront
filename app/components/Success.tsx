'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Testimonial {
  id: number;
  name: string;
  age: number;
  image: string;
  story: string;
  achievement: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Mária K.',
    age: 34,
    image: '/images/testimonials/maria.jpg',
    story: 'Vďaka článkom o zdravom stravovaní som zmenila svoj životný štýl',
    achievement: 'Schudla 15kg za 6 mesiacov',
    quote:
      'Zdravie v praxi mi ukázalo, že zdravý životný štýl nemusí byť komplikovaný. Malé zmeny priniesli veľké výsledky.',
  },
  {
    id: 2,
    name: 'Peter M.',
    age: 45,
    image: '/images/testimonials/peter.jpg',
    story: 'Prekonanie chronických bolestí chrbta pomocou cvičenia',
    achievement: 'Bez bolesti už 1 rok',
    quote:
      'Pravidelné cvičenie podľa odporúčaní odborníkov mi zmenilo život. Konečne môžem žiť aktívne bez bolesti.',
  },
  {
    id: 3,
    name: 'Jana H.',
    age: 29,
    image: '/images/testimonials/jana.jpg',
    story: 'Od úzkosti k vnútornému pokoju cez mindfulness',
    achievement: 'Lepší spánok a menej stresu',
    quote:
      'Techniky mindfulness a relaxácie, ktoré som sa naučila z článkov, mi pomohli nájsť rovnováhu v živote.',
  },
];

export default function Success() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-emerald-800 font-semibold text-sm uppercase tracking-wider">
              Príbehy našich čitateľov
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              Inšpiratívne príbehy úspechu
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Spoznajte ľudí, ktorým sme pomohli zmeniť ich život k lepšiemu
              prostredníctvom zdravého životného štýlu
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Main Testimonial */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full min-h-[400px]">
                  <Image
                    src={TESTIMONIALS[activeIndex].image}
                    alt={TESTIMONIALS[activeIndex].name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 
                    via-transparent to-transparent"
                  />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div
                      className="bg-emerald-600/90 backdrop-blur-sm rounded-lg px-4 py-2 
                      inline-block mb-3"
                    >
                      {TESTIMONIALS[activeIndex].achievement}
                    </div>
                    <h3 className="text-2xl font-bold mb-1">
                      {TESTIMONIALS[activeIndex].name}
                    </h3>
                    <p className="text-white/90">
                      {TESTIMONIALS[activeIndex].age} rokov
                    </p>
                  </div>
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <svg
                    className="w-12 h-12 text-emerald-500 mb-6 opacity-20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-600 text-lg mb-8 italic">
                    &quot;{TESTIMONIALS[activeIndex].quote}&quot;
                  </p>
                  <p className="text-gray-900 font-medium mb-6">
                    {TESTIMONIALS[activeIndex].story}
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="grid grid-cols-3 gap-4">
              {TESTIMONIALS.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative rounded-xl overflow-hidden h-24 transition-all 
                    ${
                      activeIndex === index
                        ? 'ring-2 ring-emerald-500 ring-offset-2'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                >
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 
                    to-transparent"
                  />
                  <div className="absolute bottom-2 left-3 right-3">
                    <p className="text-white text-sm font-medium truncate">
                      {testimonial.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Odporúčané čítanie
          </h2>
          {/* Assuming 'posts' is defined elsewhere or will be added */}
          {/* For now, a placeholder for the grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <Link
                  href="/clanky/zdravy-zivotny-styly"
                  className="hover:text-emerald-700"
                >
                  Zdravý životný štýl: Odporúčania pre úspech
                </Link>
              </h3>
              <div
                className="text-sm text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html:
                    'Vytvorte si zdravý životný štýl, ktorý vás bude motivovať k úspechu a šťastiu. Odporúčania pre každý deň.',
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <Link
                  href="/clanky/zdravy-jedlo"
                  className="hover:text-emerald-700"
                >
                  Zdravé jedlo: Odporúčania pre zdravý život
                </Link>
              </h3>
              <div
                className="text-sm text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html:
                    'Zdravé jedlo je základom zdravého života. Naučte sa, ako zostaviť zdravé jedlo a zlepšiť svoje zdravie.',
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <Link
                  href="/clanky/zdravy-spavanie"
                  className="hover:text-emerald-700"
                >
                  Zdravý spánok: Odporúčania pre lepší život
                </Link>
              </h3>
              <div
                className="text-sm text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html:
                    'Spánok je kľúčový pre zdravý život. Naučte sa, ako zlepšiť svoj spánok a zdravie.',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
