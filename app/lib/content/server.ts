import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import he from 'he';

import type {
  ContentCategory,
  ContentPost,
  ContentSearchResult,
  ContentTag,
  ContentTerm,
} from './types';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function stableIntId(input: string): number {
  const hex = crypto.createHash('sha1').update(input).digest('hex').slice(0, 8);
  return parseInt(hex, 16);
}

function titleFromSlug(slug: string): string {
  const smallWords = new Set([
    'a',
    'i',
    'v',
    'vo',
    'na',
    'nad',
    'pod',
    'pre',
    'pri',
    'do',
    'od',
    'z',
    'zo',
    's',
    'so',
    'u',
    'k',
    'ku',
    'bez',
    'cez',
    'medzi',
    'o',
  ]);

  const acronyms = new Set([
    'adhd',
    'cbd',
    'cbg',
    'dha',
    'epa',
    'hpv',
    'hiv',
    'bmi',
    'pms',
    'covid',
    'sars',
    'pcr',
    'ibs',
    'gaba',
    'htp',
  ]);

  const parts = slug
    .split('-')
    .map(p => p.trim())
    .filter(Boolean);

  if (!parts.length) return '';

  const words = parts.map((part, idx) => {
    const lower = part.toLowerCase();

    if (acronyms.has(lower)) {
      return lower.toUpperCase();
    }

    if (idx > 0 && smallWords.has(lower)) {
      return lower;
    }

    // Keep numeric-ish tokens as-is (e.g. "3", "omega3", "5")
    if (/\d/.test(part)) {
      // Capitalize leading letter if any (e.g. omega-3 -> Omega 3)
      return part.charAt(0).toUpperCase() + part.slice(1);
    }

    if (idx === 0) {
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    return lower;
  });

  return words.join(' ');
}

function escapeHtml(text: string): string {
  return he.encode(text ?? '', { useNamedReferences: true });
}

function stripMarkdown(md: string): string {
  if (!md) return '';
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/[#>*_~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wrapStandaloneIifeScripts(markdown: string): string {
  // Support legacy WP-injected IIFE scripts that were exported as plain text in Markdown.
  // Only wraps when the IIFE appears as a standalone block (line/paragraph), not inline prose.
  const re = /(^|\n)\(function\(\)\{[\s\S]*?\}\)\(\);\s*(?=\n|$)/g;

  return markdown.replace(re, (match: string, prefix: string) => {
    const raw = match.slice(prefix.length).trim();
    const js = raw
      .replace(/\\_/g, '_')
      .replace(/<\/script/gi, '<\\/script');

    return `${prefix}<script>\n${js}\n</script>`;
  });
}

async function markdownToHtml(
  markdown: string,
  options?: { allowScripts?: boolean }
): Promise<string> {
  const allowScripts = Boolean(options?.allowScripts);

  const schema = {
    ...defaultSchema,
    tagNames: Array.from(
      new Set([
        ...(defaultSchema.tagNames || []),
        'table',
        'thead',
        'tbody',
        'tfoot',
        'tr',
        'th',
        'td',
        'figure',
        'figcaption',
        'iframe',
        'video',
        'source',
        ...(allowScripts ? ['script'] : []),
      ])
    ),
    attributes: {
      ...(defaultSchema.attributes || {}),
      a: Array.from(
        new Set([...(defaultSchema.attributes?.a || []), 'target', 'rel'])
      ),
      iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'loading', 'referrerpolicy', 'title'],
      img: Array.from(
        new Set([...(defaultSchema.attributes?.img || []), 'loading', 'decoding'])
      ),
      ...(allowScripts
        ? {
            script: ['src', 'async', 'defer', 'type', 'id', 'crossorigin', 'referrerpolicy'],
          }
        : {}),
      table: Array.from(new Set([...(defaultSchema.attributes?.table || []), 'border'])),
      td: Array.from(new Set([...(defaultSchema.attributes?.td || []), 'colspan', 'rowspan'])),
      th: Array.from(new Set([...(defaultSchema.attributes?.th || []), 'colspan', 'rowspan', 'scope'])),
    },
    protocols: {
      ...(defaultSchema.protocols || {}),
      src: ['http', 'https'],
    },
  };

  const normalizedMarkdown = allowScripts
    ? wrapStandaloneIifeScripts(markdown)
    : markdown;

  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(normalizedMarkdown);
  return String(file);
}

function toTerms(
  values: unknown,
  taxonomy: 'category' | 'post_tag'
): ContentTerm[] {
  if (!Array.isArray(values)) return [];
  const slugs = values
    .map(v => (typeof v === 'string' ? v : ''))
    .map(v => v.trim())
    .filter(Boolean);

  const unique = Array.from(new Set(slugs));
  return unique.map(slug => ({
    id: stableIntId(`${taxonomy}:${slug}`),
    slug,
    name: titleFromSlug(slug),
    taxonomy,
  }));
}

function normalizeDate(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value.trim();
  return new Date(0).toISOString();
}

function postListSortDesc(a: ContentPost, b: ContentPost): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

type LoadedPost = ContentPost & { _searchText: string };

function stripInternalFields(post: LoadedPost): ContentPost {
  const {
    _searchText: internalSearch,
    _filePath: internalFilePath,
    ...rest
  } = post as LoadedPost & { _filePath?: string };
  void internalSearch;
  void internalFilePath;
  return rest;
}

type LoadedPostInternal = LoadedPost & { _filePath: string };

const loadAllPosts = unstable_cache(
  async (): Promise<LoadedPostInternal[]> => {
  let entries: string[];
  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch (err) {
    const error = err as NodeJS.ErrnoException;
    if (error?.code === 'ENOENT') return [];
    throw err;
  }

  const mdFiles = entries
    .filter(f => f.toLowerCase().endsWith('.md'))
    .filter(f => !f.startsWith('_'))
    .map(f => path.join(POSTS_DIR, f));

  const posts: LoadedPostInternal[] = [];

  for (const filePath of mdFiles) {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = matter(raw);
    const data = parsed.data || {};

    const slug =
      (typeof data.slug === 'string' && data.slug.trim()) ||
      path.basename(filePath, path.extname(filePath));
    const titleText =
      (typeof data.title === 'string' && data.title.trim()) ||
      titleFromSlug(slug);
    const excerptText =
      (typeof data.excerpt === 'string' && data.excerpt.trim()) ||
      stripMarkdown(parsed.content).slice(0, 200);

    const date = normalizeDate(data.date);
    const modified = normalizeDate(data.modified || data.date);

    const categories = toTerms(data.categories, 'category');
    const tags = toTerms(data.tags, 'post_tag');

    const featuredImage =
      typeof data.featuredImage === 'string' ? data.featuredImage : undefined;

    const seoTitle =
      typeof data.seoTitle === 'string' ? data.seoTitle : undefined;
    const seoDescription =
      typeof data.seoDescription === 'string' ? data.seoDescription : undefined;

    const id =
      typeof data.wpId === 'number' && Number.isFinite(data.wpId)
        ? data.wpId
        : stableIntId(`post:${slug}`);

    const post: LoadedPostInternal = {
      id,
      slug,
      date,
      modified,
      title: { rendered: escapeHtml(titleText) },
      excerpt: { rendered: escapeHtml(excerptText) },
      content: { rendered: '' },
      categories,
      tags,
      featuredImage,
      seoTitle: seoTitle ? escapeHtml(seoTitle) : undefined,
      seoDescription: seoDescription ? escapeHtml(seoDescription) : undefined,
      _filePath: filePath,
      _searchText: `${titleText} ${excerptText} ${stripMarkdown(parsed.content)}`
        .toLowerCase()
        .slice(0, 200000),
    };

    posts.push(post);
  }

  posts.sort(postListSortDesc);
  return posts;
  },
  ['content-posts-v3'],
  { revalidate: 3600, tags: ['content'] }
);

export const transformUrl = (url: string): string => url;

export const getAllPosts = cache(async (): Promise<ContentPost[]> => {
  const posts = await loadAllPosts();
  return posts.map(stripInternalFields);
});

const renderPostHtmlByFile = unstable_cache(
  async (filePath: string, mtimeMs: number): Promise<string> => {
    void mtimeMs;
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = matter(raw);
    const data = parsed.data || {};
    const allowScripts = Boolean(
      (data as Record<string, unknown>)?.allowScripts ||
        (data as Record<string, unknown>)?.unsafeAllowScripts
    );
    return markdownToHtml(parsed.content, { allowScripts });
  },
  ['content-post-html-v4'],
  { revalidate: 3600, tags: ['content'] }
);

export const getPostBySlug = cache(
  async (slug: string): Promise<ContentPost | null> => {
    if (!slug || typeof slug !== 'string') return null;
    const posts = await loadAllPosts();
    const found = posts.find(p => p.slug === slug);
    if (!found) return null;
    const stat = await fs.stat(found._filePath);
    const html = await renderPostHtmlByFile(found._filePath, stat.mtimeMs);
    return {
      ...stripInternalFields(found),
      content: { rendered: html },
    };
  }
);

export const getCategories = cache(async (): Promise<ContentCategory[]> => {
  const posts = await loadAllPosts();
  const map = new Map<string, { name: string; count: number }>();

  for (const post of posts) {
    for (const cat of post.categories) {
      const current = map.get(cat.slug);
      if (!current) {
        map.set(cat.slug, { name: cat.name, count: 1 });
      } else {
        current.count += 1;
      }
    }
  }

  const categories: ContentCategory[] = Array.from(map.entries()).map(
    ([slug, v]) => ({
      id: stableIntId(`category:${slug}`),
      slug,
      name: v.name,
      count: v.count,
      description: '',
      link: '',
      taxonomy: 'category',
      parent: 0,
      children: [],
    })
  );

  categories.sort((a, b) => b.count - a.count);
  return categories;
});

export const getTags = cache(async (): Promise<ContentTag[]> => {
  const posts = await loadAllPosts();
  const map = new Map<string, { name: string; count: number }>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const current = map.get(tag.slug);
      if (!current) {
        map.set(tag.slug, { name: tag.name, count: 1 });
      } else {
        current.count += 1;
      }
    }
  }

  const tags: ContentTag[] = Array.from(map.entries()).map(([slug, v]) => ({
    id: stableIntId(`tag:${slug}`),
    slug,
    name: v.name,
    count: v.count,
    taxonomy: 'post_tag',
  }));

  tags.sort((a, b) => b.count - a.count);
  return tags;
});

export const getCategoryBySlug = cache(
  async (slug: string): Promise<ContentCategory | null> => {
    if (!slug || typeof slug !== 'string') return null;
    const categories = await getCategories();
    return categories.find(c => c.slug === slug) || null;
  }
);

export const getTagBySlug = cache(
  async (slug: string): Promise<ContentTag | null> => {
    if (!slug || typeof slug !== 'string') return null;
    const tags = await getTags();
    return tags.find(t => t.slug === slug) || null;
  }
);

export async function getPosts(
  perPage: number = 12,
  orderby: string = 'date',
  categoryId?: number,
  page: number = 1
): Promise<ContentPost[]> {
  const posts = await getAllPosts();
  let filtered = posts;

  if (typeof categoryId === 'number' && Number.isFinite(categoryId)) {
    filtered = posts.filter(p => p.categories.some(c => c.id === categoryId));
  }

  if (orderby === 'modified') {
    filtered = filtered
      .slice()
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
  } else {
    filtered = filtered.slice().sort(postListSortDesc);
  }

  const start = Math.max(0, (page - 1) * perPage);
  return filtered.slice(start, start + perPage);
}

export async function getPostsByTagSlug(
  tagSlug: string,
  perPage: number = 12,
  page: number = 1
): Promise<ContentPost[]> {
  const posts = await getAllPosts();
  const filtered = posts.filter(p => p.tags.some(t => t.slug === tagSlug));
  const start = Math.max(0, (page - 1) * perPage);
  return filtered.slice(start, start + perPage);
}

export async function getRandomPost(): Promise<ContentPost[]> {
  const posts = await getAllPosts();
  if (!posts.length) return [];
  const idx = Math.floor(Math.random() * posts.length);
  return [posts[idx]];
}

export const advancedSearch = cache(
  async (
    query: string,
    perPage: number = 10,
    page: number = 1
  ): Promise<ContentSearchResult> => {
    const q = (query || '').trim().toLowerCase();
    const posts = await loadAllPosts();

    if (q.length < 2) {
      return { posts: [], total: 0, totalPages: 0 };
    }

    const words = q.split(/\s+/).filter(w => w.length > 2);

    const scored = posts
      .map(post => {
        let score = 0;
        if (post._searchText.includes(q)) score += 50;
        for (const w of words) {
          if (post._searchText.includes(w)) score += 5;
        }
        return { post, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    const total = scored.length;
    const totalPages = Math.ceil(total / perPage);
    const start = Math.max(0, (page - 1) * perPage);
    const pageItems = scored
      .slice(start, start + perPage)
      .map(x => stripInternalFields(x.post));

    return { posts: pageItems, total, totalPages };
  }
);
