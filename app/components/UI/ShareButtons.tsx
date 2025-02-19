"use client";

import { useState, useEffect } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [isClient, setIsClient] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const shareData = {
    url: url,
    title: title,
    text: description || title,
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const shareButtons = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: 'bg-[#1877F2] hover:bg-[#0d6ce4]',
    },
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'bg-black hover:bg-gray-900',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      color: 'bg-[#0A66C2] hover:bg-[#084d91]',
    },
  ];

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center space-y-4 fixed left-8 top-1/2 
      transform -translate-y-1/2 z-10">
      {/* Share buttons */}
      <div className="flex flex-col space-y-2">
        {shareButtons.map((button) => (
          <a
            key={button.name}
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${button.color} text-white p-3 rounded-full 
              transform transition-all duration-200 hover:scale-110 
              hover:shadow-lg group relative`}
            aria-label={`Zdieľať na ${button.name}`}
          >
            {button.icon}
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 
              text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 
              group-hover:visible transition-all duration-200 whitespace-nowrap">
              Zdieľať na {button.name}
            </span>
          </a>
        ))}

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full 
            transform transition-all duration-200 hover:scale-110 
            hover:shadow-lg relative group"
          aria-label="Kopírovať odkaz"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span className={`absolute left-full ml-2 px-2 py-1 bg-gray-900 
            text-white text-sm rounded transition-all duration-200 
            whitespace-nowrap ${
              showTooltip 
                ? 'opacity-100 visible' 
                : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
            }`}>
            {showTooltip ? 'Odkaz skopírovaný!' : 'Kopírovať odkaz'}
          </span>
        </button>

        {/* Native Share Button (mobile) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 
              rounded-full transform transition-all duration-200 hover:scale-110 
              hover:shadow-lg group relative md:hidden"
            aria-label="Zdieľať"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 
              text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 
              group-hover:visible transition-all duration-200 whitespace-nowrap">
              Zdieľať
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
