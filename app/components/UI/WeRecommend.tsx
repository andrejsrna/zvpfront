'use client';

import Image from 'next/image';
import Link from 'next/link';

interface WeRecommendProps {
  productName: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  benefits: string[];
}

const defaultProduct = {
  productName: 'Najsilnejšia kĺbová výživa',
  description:
    'Komplexná formula pre zdravie vašich kĺbov s obsahom glukozamínu, chondroitínu, MSM a kolagénu.',
  imageUrl: '/products/klbova-vyziva.webp',
  productUrl: 'https://najsilnejsiaklbovavyziva.sk',
  benefits: [
    'Podporuje zdravie kĺbov a chrupaviek',
    'Pomáha pri regenerácii kĺbového tkaniva',
    'Zmierňuje bolesť a zápal',
    '100% prírodné zloženie',
    'Klinicky testované zložky',
  ],
};

export default function WeRecommend({
  productName = defaultProduct.productName,
  description = defaultProduct.description,
  imageUrl = defaultProduct.imageUrl,
  productUrl = defaultProduct.productUrl,
  benefits = defaultProduct.benefits,
}: Partial<WeRecommendProps>) {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="relative aspect-square md:aspect-auto">
                <Image
                  src={imageUrl}
                  alt={productName}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center">
                <div className="mb-6">
                  <span
                    className="text-primary font-semibold text-sm 
                    uppercase tracking-wider"
                  >
                    Zdravie v praxi odporúča
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">
                    {productName}
                  </h2>
                  <p className="text-gray-600 mb-6">{description}</p>
                </div>

                {/* Benefits */}
                <ul className="space-y-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary mt-1 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 
                    border border-transparent text-base font-medium rounded-lg 
                    text-white bg-primary hover:bg-primary/80 
                    transition-colors duration-200"
                >
                  Zistiť viac
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
