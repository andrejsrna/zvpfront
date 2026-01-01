import { redirect } from 'next/navigation';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q ? `q=${encodeURIComponent(params.q)}` : '';
  const page = params.page ? `page=${encodeURIComponent(params.page)}` : '';
  const join = q && page ? '&' : '';
  redirect(`/search?${q}${join}${page}`);
}
