import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // WordPress legacy: /?p=123
  const p = request.nextUrl.searchParams.get('p');
  if (p && /^\d+$/.test(p)) {
    const url = request.nextUrl.clone();
    url.pathname = `/p/${p}`;
    url.searchParams.delete('p');
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
