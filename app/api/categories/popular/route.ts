import { NextResponse } from 'next/server';
import { getCategories } from '@/app/lib/content/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    20,
    Math.max(1, Number(searchParams.get('limit') || 4))
  );

  const categories = await getCategories();
  return NextResponse.json(categories.slice(0, limit), {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}

