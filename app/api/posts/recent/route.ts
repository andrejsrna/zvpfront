import { NextResponse } from 'next/server';
import { getPosts } from '@/app/lib/content/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get('limit') || 6))
  );

  const posts = await getPosts(limit, 'date', undefined, 1);
  return NextResponse.json(posts, {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}

