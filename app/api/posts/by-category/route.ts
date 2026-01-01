import { NextResponse } from 'next/server';
import { getPosts } from '@/app/lib/content/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = Number(searchParams.get('categoryId'));
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get('limit') || 20))
  );
  const excludePostId = Number(searchParams.get('excludePostId') || 0);

  const posts = await getPosts(limit + (excludePostId ? 1 : 0), 'date', categoryId, 1);
  const filtered = excludePostId
    ? posts.filter(p => p.id !== excludePostId)
    : posts;

  return NextResponse.json(filtered.slice(0, limit), {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}
