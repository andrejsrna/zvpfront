import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';

const root = process.cwd();
const postsDir = path.join(root, 'content', 'posts');
const outputPath = path.join(root, 'public', 'content-index.json');

function stableIntId(input) {
  const hex = crypto.createHash('sha1').update(input).digest('hex').slice(0, 8);
  return parseInt(hex, 16);
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) return lower.charAt(0).toUpperCase() + lower.slice(1);
      return lower;
    })
    .join(' ');
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripMarkdown(md) {
  return String(md || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~`-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function termFromSlug(slug, taxonomy) {
  const cleanSlug = slugify(slug);
  return {
    id: stableIntId(`${taxonomy}:${cleanSlug}`),
    name: titleFromSlug(cleanSlug),
    slug: cleanSlug,
    taxonomy,
  };
}

function normalizeTerms(value, taxonomy) {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => {
      if (typeof item === 'string') return termFromSlug(item, taxonomy);
      if (item && typeof item === 'object') {
        const slug = slugify(item.slug || item.name);
        if (!slug) return null;
        return {
          id: Number(item.id) || stableIntId(`${taxonomy}:${slug}`),
          name: String(item.name || titleFromSlug(slug)),
          slug,
          taxonomy,
        };
      }
      return null;
    })
    .filter(Boolean);
}

function dateValue(value, fallback) {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : fallback;
}

const files = (await fs.readdir(postsDir))
  .filter(file => file.toLowerCase().endsWith('.md'))
  .filter(file => !file.startsWith('_'));

const posts = [];

for (const file of files) {
  const fullPath = path.join(postsDir, file);
  const raw = await fs.readFile(fullPath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data || {};
  const slug = slugify(data.slug || path.basename(file, '.md'));
  if (!slug) continue;

  const title = String(data.title || titleFromSlug(slug));
  const excerptText =
    typeof data.excerpt === 'string' && data.excerpt.trim()
      ? data.excerpt.trim()
      : stripMarkdown(parsed.content).slice(0, 180);
  const fallbackDate = new Date(0).toISOString();
  const date = dateValue(data.date, fallbackDate);
  const modified = dateValue(data.modified || data.date, date);
  const categories = normalizeTerms(data.categories, 'category');
  const tags = normalizeTerms(data.tags, 'post_tag');
  const id = Number(data.wpId) || stableIntId(`post:${slug}`);

  posts.push({
    id,
    date,
    modified,
    slug,
    title: { rendered: title },
    excerpt: { rendered: excerptText },
    content: { rendered: '' },
    categories,
    tags,
    featuredImage: data.featuredImage || undefined,
    seoTitle: data.seoTitle || undefined,
    seoDescription: data.seoDescription || undefined,
    searchText: stripMarkdown(`${title} ${excerptText} ${parsed.content}`).toLowerCase(),
  });
}

posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const categoryMap = new Map();
const tagMap = new Map();

for (const post of posts) {
  for (const category of post.categories) {
    const current = categoryMap.get(category.slug) || { ...category, count: 0 };
    current.count += 1;
    categoryMap.set(category.slug, current);
  }
  for (const tag of post.tags) {
    const current = tagMap.get(tag.slug) || { ...tag, count: 0 };
    current.count += 1;
    tagMap.set(tag.slug, current);
  }
}

const categories = Array.from(categoryMap.values())
  .map(category => ({
    ...category,
    description: '',
    link: '',
    parent: 0,
    children: [],
  }))
  .sort((a, b) => b.count - a.count);

const tags = Array.from(tagMap.values()).sort((a, b) => b.count - a.count);

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(
  outputPath,
  JSON.stringify({ generatedAt: new Date().toISOString(), posts, categories, tags })
);

console.log(`Generated ${path.relative(root, outputPath)} with ${posts.length} posts.`);
