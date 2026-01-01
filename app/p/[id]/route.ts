import { NextResponse } from 'next/server';
import { getAllPosts } from '@/app/lib/content/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId) || numericId <= 0) {
    return new NextResponse('Not found', { status: 404 });
  }

  const posts = await getAllPosts();
  const match = posts.find(p => p.id === numericId);
  if (!match) {
    return new NextResponse('Not found', { status: 404 });
  }

  const target = new URL(`/${match.slug}`, request.url);
  return NextResponse.redirect(target, 301);
}

