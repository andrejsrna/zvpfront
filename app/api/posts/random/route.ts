import { NextResponse } from 'next/server';
import { getRandomPost } from '@/app/lib/content/server';

export async function GET() {
  const posts = await getRandomPost();
  return NextResponse.json(
    { post: posts[0] || null },
    { headers: { 'Cache-Control': 'public, max-age=300' } }
  );
}

