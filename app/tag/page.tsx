import Link from 'next/link';
import { getTags } from '@/app/lib/content/server';

export default async function TagsIndexPage() {
  const tags = await getTags();

  return (
    <div className="bg-white pt-40 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tagy</h1>

        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full
                hover:bg-gray-200 transition-colors"
            >
              #{tag.name}{' '}
              <span className="text-gray-400 ml-1">({tag.count})</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Tagy | Zdravie v praxi',
  description: 'Prehľad tagov článkov',
};

