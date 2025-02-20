"use client";

import { useEffect, useState } from "react";
import { getCategories, WordPressCategory } from "../lib/WordPress";
import Link from "next/link";
import Image from "next/image";

// Definujeme obrázky a farby pre každú kategóriu
const CATEGORY_DETAILS = {
  "vyziva": {
    image: "/categories/nutrition.jpeg",
    gradient: "from-green-500/80 to-emerald-700/80",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    )
  },
  "pohyb": {
    image: "/categories/exercise.jpeg",
    gradient: "from-blue-500/80 to-cyan-700/80",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  "zdravie": {
    image: "/categories/health.jpeg",
    gradient: "from-rose-500/80 to-red-700/80",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  "lifestyle": {
    image: "/categories/lifestyle.jpeg",
    gradient: "from-purple-500/80 to-indigo-700/80",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  "default": {
    image: "/categories/default.jpeg",
    gradient: "from-gray-500/80 to-gray-700/80",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
      </svg>
    )
  }
};

export default function PopularCategories() {
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await getCategories();
        const mainCategories = cats
          .filter(cat => !cat.parent && cat.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);
        setCategories(mainCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-64"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Objavte naše kategórie
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Preskúmajte rôzne oblasti zdravého životného štýlu a nájdite články, 
            ktoré vás zaujímajú
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const details = CATEGORY_DETAILS[category.slug as keyof typeof CATEGORY_DETAILS] || 
              CATEGORY_DETAILS.default;
            
            return (
              <Link
                href={`/kategoria/${category.slug}`}
                key={category.id}
                className="group relative h-64 overflow-hidden rounded-2xl 
                  transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Obrázok na pozadí */}
                <div className="absolute inset-0">
                  <Image
                    src={details.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 
                      group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${details.gradient} 
                    transition-opacity duration-500 group-hover:opacity-90`}>
                  </div>
                </div>

                {/* Obsah */}
                <div className="relative h-full p-6 flex flex-col justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      {details.icon}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 text-sm">
                        {category.count} článkov
                      </span>
                      <span className="bg-white/20 rounded-full p-2 
                        backdrop-blur-sm transition-transform duration-300 
                        group-hover:translate-x-1">
                        <svg className="w-4 h-4 text-white" fill="none" 
                          stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" 
                            strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
