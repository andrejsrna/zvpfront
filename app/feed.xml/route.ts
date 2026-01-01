import { NextResponse } from 'next/server';
import he from 'he';
import { getPosts } from '@/app/lib/content/server';

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = 'https://zdravievpraxi.sk';
  const posts = await getPosts(50, 'date');

  const items = posts
    .map(post => {
      const title = xmlEscape(he.decode(post.title.rendered));
      const link = `${baseUrl}/${post.slug}`;
      const description = xmlEscape(he.decode(post.excerpt.rendered));
      const pubDate = new Date(post.date).toUTCString();
      const guid = xmlEscape(link);
      return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape('Zdravie v praxi')}</title>
    <link>${baseUrl}</link>
    <description>${xmlEscape('Najnovšie články zo Zdravie v praxi')}</description>
    <language>sk</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

