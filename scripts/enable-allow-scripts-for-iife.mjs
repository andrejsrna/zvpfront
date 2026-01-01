import fs from 'node:fs/promises';
import path from 'node:path';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

const IIFE_RE = /(^|\n)\(function\(\)\{[\s\S]*?\}\)\(\);\s*(?=\n|$)/m;

function splitFrontmatter(raw) {
  if (!raw.startsWith('---\n')) return null;
  const end = raw.indexOf('\n---\n', 4);
  if (end === -1) return null;
  return {
    frontmatter: raw.slice(4, end),
    body: raw.slice(end + '\n---\n'.length),
  };
}

function hasAllowScripts(frontmatter) {
  return /^\s*(allowScripts|unsafeAllowScripts)\s*:\s*(true|false)\s*$/m.test(
    frontmatter
  );
}

function addAllowScripts(frontmatter) {
  const fm = frontmatter.replace(/\s+$/g, '');
  return `${fm}\nallowScripts: true\n`;
}

async function main() {
  const entries = await fs.readdir(POSTS_DIR);
  const mdFiles = entries
    .filter(f => f.toLowerCase().endsWith('.md'))
    .filter(f => !f.startsWith('_'));

  let updated = 0;
  let skipped = 0;

  for (const file of mdFiles) {
    const filePath = path.join(POSTS_DIR, file);
    const raw = await fs.readFile(filePath, 'utf8');

    if (!IIFE_RE.test(raw)) {
      continue;
    }

    const parts = splitFrontmatter(raw);
    if (!parts) {
      skipped++;
      continue;
    }

    if (hasAllowScripts(parts.frontmatter)) {
      continue;
    }

    const nextRaw = `---\n${addAllowScripts(parts.frontmatter)}---\n${parts.body}`;
    await fs.writeFile(filePath, nextRaw, 'utf8');
    updated++;
  }

  console.log(
    JSON.stringify(
      {
        updated,
        skippedNoFrontmatter: skipped,
      },
      null,
      2
    )
  );
}

await main();

