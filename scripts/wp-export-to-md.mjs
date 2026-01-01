import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import he from 'he';

function getArgValue(args, name) {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function hasArg(args, name) {
  return args.includes(name);
}

function requireNonEmpty(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing or empty ${label}`);
  }
  return value.trim();
}

function normalizeApiBase(apiBase) {
  const trimmed = apiBase.replace(/\/+$/, '');
  if (!trimmed.endsWith('/wp-json')) return trimmed;
  return trimmed;
}

function stripHtml(html) {
  if (!html) return '';
  const withoutTags = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return he.decode(withoutTags);
}

function removeWpBlockComments(html) {
  if (!html) return '';
  return html.replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '');
}

function sanitizeFilename(name) {
  return name
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function quoteYamlString(value) {
  const str = String(value ?? '');
  const escaped = str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function toYamlFrontmatter(fields) {
  const lines = ['---'];

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${quoteYamlString(item)}`);
      continue;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
      continue;
    }
    lines.push(`${key}: ${quoteYamlString(value)}`);
  }

  lines.push('---');
  return lines.join('\n');
}

function buildTurndown() {
  const service = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '_',
  });

  service.use(gfm);

  service.addRule('wpLineBreaks', {
    filter: ['br'],
    replacement() {
      return '  \n';
    },
  });

  service.addRule('removeEmptyAnchors', {
    filter(node) {
      return (
        node.nodeName === 'A' &&
        (!node.getAttribute('href') || node.getAttribute('href')?.trim() === '') &&
        (node.textContent ?? '').trim() === ''
      );
    },
    replacement() {
      return '';
    },
  });

  return service;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function safeJoin(rootDir, relativePath) {
  const normalized = relativePath.replace(/^\/+/, '');
  const joined = path.join(rootDir, normalized);
  const resolvedRoot = path.resolve(rootDir);
  const resolvedJoined = path.resolve(joined);
  if (!resolvedJoined.startsWith(resolvedRoot + path.sep) && resolvedJoined !== resolvedRoot) {
    throw new Error(`Path traversal detected: ${relativePath}`);
  }
  return joined;
}

async function fetchWithRetry(url, options, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}${text ? `\n${text}` : ''}`);
      }
      return res;
    } catch (err) {
      lastError = err;
      const waitMs = 250 * attempt;
      await new Promise(r => setTimeout(r, waitMs));
    }
  }
  throw lastError;
}

function buildAuthHeaders({ authMode, token, basicUser, basicPass }) {
  if (authMode === 'bearer') {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }
  if (authMode === 'basic') {
    if (!basicUser || !basicPass) return {};
    const encoded = Buffer.from(`${basicUser}:${basicPass}`).toString('base64');
    return { Authorization: `Basic ${encoded}` };
  }
  return {};
}

function extractTerms(post) {
  const embedded = post?._embedded?.['wp:term'];
  if (!Array.isArray(embedded)) return { categories: [], tags: [] };

  const categories = (embedded[0] || [])
    .filter(t => t && (t.taxonomy === 'category' || !t.taxonomy))
    .map(t => t.slug || t.name)
    .filter(Boolean);

  const tags = (embedded[1] || [])
    .filter(t => t && (t.taxonomy === 'post_tag' || !t.taxonomy))
    .map(t => t.slug || t.name)
    .filter(Boolean);

  return { categories: Array.from(new Set(categories)), tags: Array.from(new Set(tags)) };
}

function extractFeaturedMediaUrl(post) {
  const media = post?._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return undefined;
  return media.media_details?.sizes?.large?.source_url || media.source_url;
}

function findWpMediaUrls(html) {
  if (!html) return [];
  const urls = new Set();

  const attrRegex = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = attrRegex.exec(html))) {
    const value = match[1];
    if (!value) continue;
    if (!/^https?:\/\//i.test(value)) continue;
    if (!/\/wp-content\/uploads\//i.test(value)) continue;
    urls.add(value);
  }

  return Array.from(urls);
}

function mediaRelPathFromUrl(urlString) {
  const url = new URL(urlString);
  const idx = url.pathname.toLowerCase().indexOf('/wp-content/uploads/');
  const rel = idx === -1 ? url.pathname.replace(/^\/+/, '') : url.pathname.slice(idx + '/wp-content/uploads/'.length);
  const cleaned = rel.replace(/^\/+/, '');
  return cleaned;
}

function hashSuffix(input) {
  return crypto.createHash('sha1').update(input).digest('hex').slice(0, 8);
}

async function downloadMedia({ url, mediaOutDir }) {
  const rel = mediaRelPathFromUrl(url);
  const ext = path.extname(rel);
  const base = path.basename(rel, ext);
  const dir = path.dirname(rel);
  const uniqueName = `${sanitizeFilename(base)}-${hashSuffix(url)}${ext || ''}`;
  const localRel = path.join(dir === '.' ? '' : dir, uniqueName);
  const fullPath = safeJoin(mediaOutDir, localRel);

  await ensureDir(path.dirname(fullPath));
  const res = await fetchWithRetry(url, { headers: { Accept: '*/*' } }, 3);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(fullPath, buf);
  return { localRel, fullPath };
}

async function main() {
  const args = process.argv.slice(2);

  if (hasArg(args, '--help')) {
    console.log(`WordPress → Markdown export

Usage:
  npm run wp:export -- [options]

Options:
  --api <url>                 WordPress API base (default: env WORDPRESS_API_URL or https://.../wp-json)
  --out <dir>                 Output directory (default: content/posts)
  --status <publish|draft|...> Post status (default: publish)
  --per-page <n>              Page size (default: 100)
  --download-media            Download wp-content/uploads assets referenced in posts
  --media-out <dir>           Where to store media (default: public/wp-media)
  --media-prefix <urlPath>    URL prefix used in markdown (default: /wp-media)
  --auth <none|bearer|basic>  Auth mode (default: bearer if WORDPRESS_AUTH_TOKEN is set, else none)
  --token <token>             Bearer token (default: env WORDPRESS_AUTH_TOKEN)
  --basic-user <user>
  --basic-pass <pass>
`);
    return;
  }

  const apiBase = normalizeApiBase(
    getArgValue(args, '--api') ||
      process.env.WORDPRESS_API_URL ||
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
      'https://admin.zdravievpraxi.sk/wp-json'
  );
  const outDir = getArgValue(args, '--out') || 'content/posts';
  const status = (getArgValue(args, '--status') || 'publish').trim();
  const perPage = Number(getArgValue(args, '--per-page') || 100);
  const downloadMediaEnabled = hasArg(args, '--download-media');
  const mediaOutDir = getArgValue(args, '--media-out') || 'public/wp-media';
  const mediaPrefix = (getArgValue(args, '--media-prefix') || '/wp-media').replace(/\/+$/, '');

  const token = getArgValue(args, '--token') || process.env.WORDPRESS_AUTH_TOKEN;
  const basicUser = getArgValue(args, '--basic-user') || process.env.WORDPRESS_BASIC_USER;
  const basicPass = getArgValue(args, '--basic-pass') || process.env.WORDPRESS_BASIC_PASS;
  const authModeArg = getArgValue(args, '--auth');
  const authMode =
    authModeArg ||
    (token ? 'bearer' : basicUser && basicPass ? 'basic' : 'none');

  if (!Number.isFinite(perPage) || perPage < 1 || perPage > 100) {
    throw new Error('--per-page must be between 1 and 100');
  }

  await ensureDir(outDir);
  if (downloadMediaEnabled) await ensureDir(mediaOutDir);

  const authHeaders = buildAuthHeaders({ authMode, token, basicUser, basicPass });
  const requestHeaders = {
    Accept: 'application/json',
    ...authHeaders,
  };

  const turndown = buildTurndown();

  const exported = [];
  const slugToFilename = new Map();

  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = new URL(`${apiBase}/wp/v2/posts`);
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('page', String(page));
    url.searchParams.set('status', status);
    url.searchParams.set('_embed', '1');
    url.searchParams.set('orderby', 'date');
    url.searchParams.set('order', 'asc');

    const res = await fetchWithRetry(url.toString(), { headers: requestHeaders }, 3);
    const headerPages = Number(res.headers.get('X-WP-TotalPages') || '1');
    totalPages = Number.isFinite(headerPages) && headerPages > 0 ? headerPages : totalPages;
    const posts = await res.json();

    if (!Array.isArray(posts)) {
      throw new Error(`Unexpected response for ${url}: ${JSON.stringify(posts).slice(0, 500)}`);
    }

    for (const post of posts) {
      const slug = requireNonEmpty(post.slug, `post.slug (id=${post?.id})`);
      const title = he.decode(post?.title?.rendered || '').trim() || slug;
      const excerpt = stripHtml(post?.excerpt?.rendered || '');
      const rawHtml = post?.content?.rendered || '';
      const html = removeWpBlockComments(rawHtml);

      const { categories, tags } = extractTerms(post);
      const featuredImageUrl = extractFeaturedMediaUrl(post);

      const seoTitle = post?.rank_math_title || post?.meta?.rank_math_title;
      const seoDescription = post?.rank_math_description || post?.meta?.rank_math_description;

      let frontmatter = toYamlFrontmatter({
        title,
        slug,
        date: post?.date,
        modified: post?.modified,
        excerpt: excerpt || undefined,
        categories: categories.length ? categories : undefined,
        tags: tags.length ? tags : undefined,
        wpId: post?.id,
        featuredImage: featuredImageUrl || undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
      });

      let markdown = turndown.turndown(html).trim();

      const refs = post?.meta?._zdroje_referencie;
      if (Array.isArray(refs) && refs.length) {
        const lines = refs
          .filter(r => r && (r.nazov || r.odkaz))
          .map(r => `- ${r.odkaz ? `[${(r.nazov || r.odkaz).trim()}](${r.odkaz.trim()})` : (r.nazov || '').trim()}`)
          .filter(Boolean);
        if (lines.length) {
          markdown += `\n\n## Zdroje a referencie\n\n${lines.join('\n')}\n`;
        }
      }

      markdown = markdown.replace(/\n{3,}/g, '\n\n').trim() + '\n';

      if (downloadMediaEnabled) {
        const urls = findWpMediaUrls(rawHtml);
        const replacements = new Map();

        if (featuredImageUrl) urls.push(featuredImageUrl);

        for (const mediaUrl of Array.from(new Set(urls))) {
          try {
            const { localRel } = await downloadMedia({ url: mediaUrl, mediaOutDir });
            const rewritten = `${mediaPrefix}/${localRel.replace(/\\/g, '/')}`;
            replacements.set(mediaUrl, rewritten);
          } catch (err) {
            console.warn(`Media download failed: ${mediaUrl}`, err?.message || err);
          }
        }

        if (replacements.size) {
          for (const [from, to] of replacements.entries()) {
            markdown = markdown.split(from).join(to);
          }
          if (featuredImageUrl && replacements.has(featuredImageUrl)) {
            frontmatter = toYamlFrontmatter({
              title,
              slug,
              date: post?.date,
              modified: post?.modified,
              excerpt: excerpt || undefined,
              categories: categories.length ? categories : undefined,
              tags: tags.length ? tags : undefined,
              wpId: post?.id,
              featuredImage: replacements.get(featuredImageUrl),
              seoTitle: seoTitle || undefined,
              seoDescription: seoDescription || undefined,
            });
          }
        }
      }

      let filename = `${sanitizeFilename(slug)}.md`;
      if (slugToFilename.has(slug)) {
        filename = `${sanitizeFilename(slug)}-${post.id}.md`;
      }
      slugToFilename.set(slug, filename);

      const filePath = safeJoin(outDir, filename);
      await fs.writeFile(filePath, `${frontmatter}\n\n${markdown}`, 'utf8');

      exported.push({
        id: post?.id,
        slug,
        title,
        file: path.posix.join(outDir.replace(/\\/g, '/'), filename),
        date: post?.date,
      });
    }

    console.log(`Fetched page ${page}/${totalPages} (posts: ${posts.length})`);
    page++;
  }

  const indexPath = safeJoin(outDir, '_index.json');
  await fs.writeFile(indexPath, JSON.stringify({ exportedAt: new Date().toISOString(), count: exported.length, posts: exported }, null, 2) + '\n', 'utf8');

  console.log(`\nDone. Exported ${exported.length} posts to ${outDir}`);
  console.log(`Index: ${indexPath}`);
  if (downloadMediaEnabled) console.log(`Media: ${mediaOutDir} (referenced as ${mediaPrefix}/...)`);
}

main().catch(err => {
  console.error(err?.stack || err);
  process.exit(1);
});
