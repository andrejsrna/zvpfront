import fs from 'node:fs/promises';
import path from 'node:path';

async function listMarkdownFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listMarkdownFiles(full)));
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) out.push(full);
  }
  return out;
}

async function main() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const files = await listMarkdownFiles(postsDir);

  const r2Prefix = process.env.R2_API_URL
    ? process.env.R2_API_URL.replace(/\/+$/, '') + '/'
    : '';

  let changed = 0;
  for (const file of files) {
    const before = await fs.readFile(file, 'utf8');
    let after = before;

    // Replace the exact R2_API_URL prefix if provided (e.g. https://.../fitd/)
    if (r2Prefix) {
      after = after.split(r2Prefix).join('/');
    }

    // Fallback: replace the known endpoint/bucket prefix
    after = after
      .replace(
        /https?:\/\/[a-f0-9]{32}\.r2\.cloudflarestorage\.com\/[^/]+\//gi,
        '/'
      )
      // Ensure media stays under /wp-media/
      .replace(/\/wp-media\//g, '/wp-media/');

    if (after !== before) {
      await fs.writeFile(file, after, 'utf8');
      changed++;
    }
  }

  console.log(`Done. Rewrote R2 URLs to local paths in ${changed}/${files.length} markdown files.`);
}

main().catch(err => {
  console.error(err?.stack || err);
  process.exit(1);
});

