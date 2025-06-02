import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle WordPress API proxy
  if (request.nextUrl.pathname.startsWith('/wp-json/')) {
    const wpUrl = new URL(
      request.url.replace(
        request.nextUrl.origin,
        'https://admin.zdravievpraxi.sk'
      )
    );

    return fetch(wpUrl.toString(), {
      method: request.method,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'NextJS-Frontend/1.0',
      },
    })
      .then(response => {
        return response.json().then(data => {
          return NextResponse.json(data, {
            status: response.status,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Cache-Control':
                'public, s-maxage=300, stale-while-revalidate=600',
            },
          });
        });
      })
      .catch(() => {
        return NextResponse.json(
          { error: 'Failed to fetch WordPress data' },
          { status: 500 }
        );
      });
  }

  // Handle WordPress image proxy
  if (request.nextUrl.pathname.startsWith('/wp-content/')) {
    const wpUrl = new URL(
      request.url.replace(
        request.nextUrl.origin,
        'https://admin.zdravievpraxi.sk'
      )
    );

    return fetch(wpUrl.toString())
      .then(response => {
        return new NextResponse(response.body, {
          status: response.status,
          headers: {
            'Content-Type':
              response.headers.get('Content-Type') || 'image/jpeg',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      })
      .catch(() => {
        return new NextResponse('Image not found', { status: 404 });
      });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/wp-json/:path*', '/wp-content/:path*'],
};
