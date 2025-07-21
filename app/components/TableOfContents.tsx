'use client';

import { useState, useEffect } from 'react';
import { ListBulletIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean);

      const scrollPosition = window.scrollY + 150;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    hash: string
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(hash);
    if (targetElement) {
      const offset = 100;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      setIsExpanded(false);
    }
  };

  const isActive = (id: string) => activeHeading === id;

  if (headings.length === 0) return null;

  return (
    <div className="mb-12 bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 
          transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 
          focus:ring-inset group"
        aria-expanded={isExpanded}
        aria-controls="table-of-contents"
      >
        <h2 className="text-xl font-heading font-bold text-gray-900 flex items-center">
          <ListBulletIcon className="w-5 h-5 mr-2 text-emerald-800 group-hover:text-emerald-900 transition-colors" />
          Obsah článku
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-2">{headings.length} sekcií</span>
          <svg
            className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Collapsible content */}
      <div
        id="table-of-contents"
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <nav className="px-6 pb-4" aria-label="Obsah článku">
          <ul className="space-y-1">
            {headings.map((heading, index) => (
              <li
                key={index}
                className={`${heading.level === 2 ? 'ml-0' : 'ml-6'} toc-item`}
              >
                <button
                  onClick={e => handleLinkClick(e, heading.id)}
                  className={clsx(
                    'group flex items-center text-sm py-2 px-2 -mx-2 rounded-lg transition-all duration-200',
                    isActive(heading.id)
                      ? 'bg-emerald-100 text-emerald-800 font-bold'
                      : 'text-gray-600 hover:text-emerald-800 hover:bg-gray-100'
                  )}
                  style={{ paddingLeft: `${heading.level * 1.5}rem` }}
                >
                  <span
                    className={clsx(
                      'w-6 h-6 rounded-full text-xs flex items-center justify-center mr-3 transition-all duration-200 toc-number',
                      isActive(heading.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="truncate">{heading.text}</span>
                  {isActive(heading.id) && (
                    <CheckCircleIcon className="w-4 h-4 text-emerald-800 ml-2" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* SEO Schema - hidden but crawlable */}
      <div className="sr-only">
        <h2>Navigácia v článku</h2>
        <ol>
          {headings.map((heading, index) => (
            <li key={index}>
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
