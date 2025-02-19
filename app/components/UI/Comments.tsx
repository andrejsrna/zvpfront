"use client";

import { DiscussionEmbed } from 'disqus-react';

interface CommentsProps {
  url: string;
  identifier: string;
  title: string;
}

export default function Comments({ url, identifier, title }: CommentsProps) {
  const disqusConfig = {
    url: url,
    identifier: identifier,
    title: title,
    language: 'sk' // Slovak language
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Diskusia
            </h2>
            <p className="text-gray-600">
              Zapojte sa do diskusie a podeľte sa o svoje skúsenosti
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <DiscussionEmbed
              shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || 'zdravievpraxi'}
              config={disqusConfig}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
