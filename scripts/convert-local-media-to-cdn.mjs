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

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`Missing env ${name}`);
  return value.trim();
}

async function readEnvFileIfPresent(envPath) {
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (!key) continue;
      if (process.env[key] !== undefined) continue;

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  } catch (err) {
    if (err?.code !== 'ENOENT') throw err;
  }
}

async function main() {
  await readEnvFileIfPresent(path.join(process.cwd(), '.env.local'));
  const cdnBase = requireEnv('R2_PUBLIC_URL').replace(/\/+$/, '');
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const files = await listMarkdownFiles(postsDir);

  let changed = 0;
  for (const file of files) {
    const before = await fs.readFile(file, 'utf8');
    let after = before;

    // Absolute media URLs for markdown and frontmatter.
    after = after.replace(
      /(\]\()\/wp-media\//g,
      `$1${cdnBase}/wp-media/`
    );
    after = after.replace(
      /(!\[[^\]]*]\()\/wp-media\//g,
      `$1${cdnBase}/wp-media/`
    );
    after = after.replace(
      /(\nfeaturedImage:\s+["']?)\/wp-media\//g,
      `$1${cdnBase}/wp-media/`
    );
    after = after.replace(
      /(\s)\/wp-media\//g,
      `$1${cdnBase}/wp-media/`
    );

    if (after !== before) {
      await fs.writeFile(file, after, 'utf8');
      changed++;
    }
  }

  console.log(`Done. Rewrote /wp-media links to CDN in ${changed}/${files.length} markdown files.`);
}

main().catch(err => {
  console.error(err?.stack || err);
  process.exit(1);
});
