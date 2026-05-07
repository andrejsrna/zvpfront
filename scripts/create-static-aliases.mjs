import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const outDir = path.join(root, 'out');
const postsDir = path.join(root, 'content', 'posts');
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zdravievpraxi.sk';

function cleanPath(value) {
  return String(value || '')
    .trim()
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

function redirectHtml(destination) {
  const escaped = destination.replace(/"/g, '&quot;');
  return `<!doctype html>
<html lang="sk">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=${escaped}">
  <link rel="canonical" href="${escaped}">
  <title>Presmerovanie</title>
</head>
<body>
  <p>Stránka bola presunutá na <a href="${escaped}">${escaped}</a>.</p>
</body>
</html>
`;
}

async function writeAlias(sourcePath, destination) {
  const cleaned = cleanPath(sourcePath);
  if (!cleaned || cleaned.includes('..')) return false;
  const targetDir = path.join(outDir, cleaned);
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.join(targetDir, 'index.html'), redirectHtml(destination));
  return true;
}

const files = (await fs.readdir(postsDir))
  .filter(file => file.toLowerCase().endsWith('.md'))
  .filter(file => !file.startsWith('_'));

const redirects = [
  ['/home', '/'],
  ['/vyhladavanie', '/search'],
  ['/feed', '/feed.xml'],
  ['/rss', '/feed.xml'],
  ['/rss.xml', '/feed.xml'],
  ['/sitemap_index.xml', '/sitemap.xml'],
  ['/wp-sitemap.xml', '/sitemap.xml'],
];
const categorySlugs = new Set();
const tagSlugs = new Set();

for (const file of files) {
  const fullPath = path.join(postsDir, file);
  const raw = await fs.readFile(fullPath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data || {};
  const slug = cleanPath(data.slug || path.basename(file, '.md'));
  if (!slug) continue;

  redirects.push([`/${slug}/amp`, `/${slug}`]);

  const date = data.date ? new Date(data.date) : null;
  if (date && Number.isFinite(date.getTime())) {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    redirects.push([`/${year}/${month}/${day}/${slug}`, `/${slug}`]);
  }

  if (Array.isArray(data.categories)) {
    for (const category of data.categories) {
      const categorySlug = cleanPath(
        typeof category === 'string' ? category : category?.slug || category?.name
      );
      if (categorySlug) categorySlugs.add(categorySlug);
    }
  }

  if (Array.isArray(data.tags)) {
    for (const tag of data.tags) {
      const tagSlug = cleanPath(typeof tag === 'string' ? tag : tag?.slug || tag?.name);
      if (tagSlug) tagSlugs.add(tagSlug);
    }
  }

  if (data.wpId) {
    redirects.push([`/p/${data.wpId}`, `/${slug}`]);
  }

  if (Array.isArray(data.aliases)) {
    for (const alias of data.aliases) {
      const cleaned = cleanPath(alias);
      if (cleaned && cleaned !== slug) redirects.push([`/${cleaned}`, `/${slug}`]);
    }
  }
}

for (const slug of categorySlugs) {
  redirects.push([`/category/${slug}`, `/kategoria/${slug}`]);
  redirects.push([`/category/${slug}/page/1`, `/kategoria/${slug}`]);
}

for (const slug of tagSlugs) {
  redirects.push([`/tag/${slug}/page/1`, `/tag/${slug}`]);
}

redirects.push(['/clanky/page/1', '/clanky']);

const seen = new Set();
let count = 0;
const redirectLines = [];
const htaccessLines = ['RewriteEngine On'];

redirectLines.push('/category/:slug /kategoria/:slug 301');
redirectLines.push('/category/:slug/page/:page /kategoria/:slug 301');
redirectLines.push('/tag/:slug/page/:page /tag/:slug 301');
redirectLines.push('/clanky/page/:page /clanky 301');
redirectLines.push('/:slug/amp /:slug 301');
redirectLines.push('/:year/:month/:day/:slug /:slug 301');

htaccessLines.push('RewriteRule ^category/([^/]+)/?$ /kategoria/$1 [R=301,L]');
htaccessLines.push('RewriteRule ^category/([^/]+)/page/[0-9]+/?$ /kategoria/$1 [R=301,L]');
htaccessLines.push('RewriteRule ^tag/([^/]+)/page/[0-9]+/?$ /tag/$1 [R=301,L]');
htaccessLines.push('RewriteRule ^clanky/page/[0-9]+/?$ /clanky [R=301,L]');
htaccessLines.push('RewriteRule ^([^/]+)/amp/?$ /$1 [R=301,L]');
htaccessLines.push('RewriteRule ^[0-9]{4}/[0-9]{2}/[0-9]{2}/([^/]+)/?$ /$1 [R=301,L]');

for (const [source, destination] of redirects) {
  const sourcePath = cleanPath(source);
  const destPath = destination.startsWith('http') ? destination : `${baseUrl}${destination}`;
  const key = `${sourcePath}->${destPath}`;
  if (seen.has(key)) continue;
  seen.add(key);
  if (await writeAlias(sourcePath, destPath)) count += 1;
  redirectLines.push(`/${sourcePath} ${destination} 301`);
  htaccessLines.push(`Redirect 301 /${sourcePath} ${destination}`);
}

await fs.writeFile(path.join(outDir, '_redirects'), `${redirectLines.join('\n')}\n`);
await fs.writeFile(path.join(outDir, '.htaccess'), `${htaccessLines.join('\n')}\n`);

console.log(`Generated ${count} static redirect alias pages.`);
