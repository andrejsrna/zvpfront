import { NextResponse } from 'next/server';
import { advancedSearch } from '@/app/lib/content/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const perPage = Math.min(
    50,
    Math.max(1, Number(searchParams.get('perPage') || 10))
  );
  const page = Math.max(1, Number(searchParams.get('page') || 1));

  const result = await advancedSearch(q, perPage, page);
  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}

