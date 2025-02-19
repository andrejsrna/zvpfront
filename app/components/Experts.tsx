"use client";

import Image from "next/image";
import Link from "next/link";

interface Source {
  id: number;
  name: string;
  description: string;
  image: string;
  url: string;
  reliability: string;
  type: string;
}

const SOURCES: Source[] = [
  {
    id: 1,
    name: "PubMed Central",
    description: "Databáza recenzovaných biomedicínskych štúdií z NIH.",
    image: "/logos/pubmed.png",
    url: "https://www.ncbi.nlm.nih.gov/pmc/",
    reliability: "Vedecké štúdie",
    type: "Medicínska databáza"
  },
  {
    id: 2,
    name: "WHO",
    description: "Oficiálne zdravotnícke smernice a odporúčania.",
    image: "/logos/who.png",
    url: "https://www.who.int/",
    reliability: "Medzinárodná organizácia",
    type: "Zdravotnícke smernice"
  },
  {
    id: 3,
    name: "Cochrane Library",
    description: "Systematické prehľady medicínskych výskumov.",
    image: "/logos/cochrane.webp",
    url: "https://www.cochranelibrary.com/",
    reliability: "Systematické prehľady",
    type: "Vedecká knižnica"
  },
  {
    id: 4,
    name: "ScienceDirect",
    description: "Rozsiahla databáza vedeckých a medicínskych publikácií.",
    image: "/logos/science_direct.jpg",
    url: "https://www.sciencedirect.com/",
    reliability: "Vedecké články",
    type: "Vedecká databáza"
  },
  {
    id: 5,
    name: "UpToDate",
    description: "Klinické informácie založené na dôkazoch.",
    image: "/logos/wolters.svg",
    url: "https://www.uptodate.com/",
    reliability: "Klinické dôkazy",
    type: "Medicínsky portál"
  },
  {
    id: 6,
    name: "NEJM",
    description: "Prestížny medicínsky žurnál s najnovšími výskumami.",
    image: "/logos/nejm.svg",
    url: "https://www.nejm.org/",
    reliability: "Medicínsky žurnál",
    type: "Odborný časopis"
  }
];

export default function Sources() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
            Naše zdroje
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            Odkiaľ čerpáme informácie
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SOURCES.map((source) => (
            <Link
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl p-4 hover:shadow-lg 
                transition-all duration-300 border border-gray-100 
                hover:border-emerald-100"
            >
              <div className="relative h-12 w-12 mx-auto mb-3">
                <Image
                  src={source.image}
                  alt={source.name}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-1 text-sm">
                  {source.name}
                </h3>
                <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                  {source.description}
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <span className="px-2 py-0.5 rounded-full text-xs 
                    bg-emerald-50 text-emerald-700">
                    {source.type}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Všetky naše články sú založené na dôkazoch a sú pravidelne 
            aktualizované podľa najnovších vedeckých poznatkov.
          </p>
        </div>
      </div>
    </section>
  );
}
