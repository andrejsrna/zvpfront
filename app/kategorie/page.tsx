import { getCategories } from '@/app/lib/WordPress';
import Link from 'next/link';

export default async function CategoriesPage() {
  const categories = await getCategories();

  // Filter len parent kategórie (nultý stupeň)
  const parentCategories = categories.filter(cat => cat.parent === 0);

  // Nájdi child kategórie pre parent
  const getChildCategories = (parentId: number) => {
    return categories.filter(cat => cat.parent === parentId);
  };

  return (
    <div className="bg-white pt-40 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Všetky kategórie
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {parentCategories.map(parent => (
            <div
              key={parent.id}
              className="bg-white rounded-xl shadow-sm p-6 
              hover:shadow-md transition-shadow"
            >
              <Link
                href={`/kategoria/${parent.slug}`}
                className="text-xl font-bold text-gray-900 hover:text-primary 
                  transition-colors mb-4 block"
              >
                {parent.name}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({parent.count})
                </span>
              </Link>

              {/* Child kategórie */}
              <div className="mt-4 space-y-2">
                {getChildCategories(parent.id).map(child => (
                  <Link
                    key={child.id}
                    href={`/kategoria/${child.slug}`}
                    className="block text-gray-600 hover:text-primary 
                      transition-colors text-sm"
                  >
                    {child.name}
                    <span className="text-gray-400 ml-1">({child.count})</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Kategórie | Zdravie v praxi',
  description:
    'Prehľad všetkých kategórií článkov o zdraví, životnom štýle a wellness',
};
