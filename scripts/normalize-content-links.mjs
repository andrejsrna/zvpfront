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

  let changed = 0;
  for (const file of files) {
    const before = await fs.readFile(file, 'utf8');
    let after = before;

    // Rewrite internal links pointing to WP admin domain to the public domain.
    after = after.replace(
      /https?:\/\/admin\.zdravievpraxi\.sk\//gi,
      'https://zdravievpraxi.sk/'
    );

    // Normalize double slashes after domain
    after = after.replace(/https:\/\/zdravievpraxi\.sk\/{2,}/gi, 'https://zdravievpraxi.sk/');

    if (after !== before) {
      await fs.writeFile(file, after, 'utf8');
      changed++;
    }
  }

  console.log(`Done. Rewrote links in ${changed}/${files.length} markdown files.`);
}

main().catch(err => {
  console.error(err?.stack || err);
  process.exit(1);
});

