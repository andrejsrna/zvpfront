import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { lookup as mimeLookup } from 'mime-types';

function hasArg(args, name) {
  return args.includes(name);
}

function getArgValue(args, name) {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`Missing env ${name}`);
  return value.trim();
}

function hashSuffix(input) {
  return crypto.createHash('sha1').update(input).digest('hex').slice(0, 8);
}

function sanitizeFilename(name) {
  return name
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function mediaRelPathFromUrl(urlString) {
  const url = new URL(urlString);
  const idx = url.pathname.toLowerCase().indexOf('/wp-content/uploads/');
  const rel =
    idx === -1
      ? url.pathname.replace(/^\/+/, '')
      : url.pathname.slice(idx + '/wp-content/uploads/'.length);
  return rel.replace(/^\/+/, '');
}

function deriveObjectKey({ url, prefix }) {
  const rel = mediaRelPathFromUrl(url);
  const ext = path.extname(rel);
  const base = path.basename(rel, ext);
  const dir = path.dirname(rel);
  const uniqueName = `${sanitizeFilename(base)}-${hashSuffix(url)}${ext || ''}`;
  const joined = path.posix.join(prefix.replace(/\/+$/, ''), dir === '.' ? '' : dir, uniqueName);
  return joined.replace(/^\/+/, '');
}

function encodePathSegments(p) {
  return p
    .split('/')
    .map(seg => encodeURIComponent(seg))
    .join('/');
}

function findWpUploadUrls(markdown) {
  if (!markdown) return [];
  const urls = new Set();
  const regex = /https?:\/\/[^\s)>"']+\/wp-content\/uploads\/[^\s)>"']+/gi;
  let m;
  while ((m = regex.exec(markdown))) urls.add(m[0]);
  return Array.from(urls);
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

async function listMarkdownFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listMarkdownFiles(full)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

async function fetchBinary(url) {
  const res = await fetch(url, { headers: { Accept: '*/*' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Download failed ${res.status} ${res.statusText}: ${url}${text ? `\n${text}` : ''}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType =
    res.headers.get('content-type') ||
    mimeLookup(new URL(url).pathname) ||
    'application/octet-stream';
  return { buf, contentType: String(contentType) };
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let idx = 0;

  const runners = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (true) {
      const current = idx++;
      if (current >= items.length) return;
      results[current] = await worker(items[current], current);
    }
  });

  await Promise.all(runners);
  return results;
}

async function main() {
  const args = process.argv.slice(2);

  if (hasArg(args, '--help')) {
    console.log(`Upload WordPress uploads media to Cloudflare R2 and rewrite Markdown links

Usage:
  npm run wp:media:r2 -- [options]

Options:
  --dir <dir>           Where markdown lives (default: content/posts)
  --prefix <keyPrefix>  R2 object key prefix (default: wp-media)
  --concurrency <n>     Parallel uploads (default: 5)
  --skip-existing       Skip upload if object already exists in R2

Env (read from .env.local automatically):
  R2_BUCKET_NAME, R2_ACCESS_KEY, R2_SECRET_KEY, R2_ENDPOINT_URL, R2_API_URL
`);
    return;
  }

  await readEnvFileIfPresent(path.join(process.cwd(), '.env.local'));

  const dir = getArgValue(args, '--dir') || 'content/posts';
  const prefix = getArgValue(args, '--prefix') || 'wp-media';
  const concurrency = Number(getArgValue(args, '--concurrency') || 5);
  const skipExisting = hasArg(args, '--skip-existing');

  if (!Number.isFinite(concurrency) || concurrency < 1 || concurrency > 25) {
    throw new Error('--concurrency must be between 1 and 25');
  }

  const bucket = requireEnv('R2_BUCKET_NAME');
  const accessKeyId = requireEnv('R2_ACCESS_KEY');
  const secretAccessKey = requireEnv('R2_SECRET_KEY');
  const endpoint = requireEnv('R2_ENDPOINT_URL');
  const publicBase = (
    process.env.R2_PUBLIC_URL ||
    process.env.R2_PUBLIC_BASE_URL ||
    process.env.R2_API_URL
  )
    ? String(
        process.env.R2_PUBLIC_URL ||
          process.env.R2_PUBLIC_BASE_URL ||
          process.env.R2_API_URL
      ).replace(/\/+$/, '')
    : requireEnv('R2_API_URL').replace(/\/+$/, '');

  const s3 = new S3Client({
    region: 'auto',
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });

  const mapPath = path.join(dir, '_media-r2-map.json');
  let existingMap = {};
  try {
    existingMap = JSON.parse(await fs.readFile(mapPath, 'utf8'));
  } catch (err) {
    if (err?.code !== 'ENOENT') throw err;
  }
  const urlMap = new Map(Object.entries(existingMap || {}));

  const files = await listMarkdownFiles(dir);
  if (!files.length) {
    console.log(`No markdown files found in ${dir}`);
    return;
  }

  const allUrls = new Set();
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    for (const url of findWpUploadUrls(content)) allUrls.add(url);
  }

  const urlsToProcess = Array.from(allUrls).filter(url => !urlMap.has(url));

  console.log(
    `Found ${allUrls.size} unique wp-content/uploads URLs in ${files.length} markdown files`
  );
  if (!urlsToProcess.length) {
    console.log(`Nothing new to upload (mapping already covers all URLs).`);
    return;
  }

  await mapPool(urlsToProcess, concurrency, async (url, i) => {
    const key = deriveObjectKey({ url, prefix });

    if (skipExisting) {
      try {
        await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
        urlMap.set(url, `${publicBase}/${encodePathSegments(key)}`);
        if ((i + 1) % 50 === 0) console.log(`Processed ${i + 1}/${urlsToProcess.length}`);
        return;
      } catch (err) {
        // Continue to upload on 404/NotFound; fail on other errors.
        const name = err?.name || '';
        const http = err?.$metadata?.httpStatusCode;
        if (!(http === 404 || name === 'NotFound')) throw err;
      }
    }

    const { buf, contentType } = await fetchBinary(url);
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buf,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    urlMap.set(url, `${publicBase}/${encodePathSegments(key)}`);
    if ((i + 1) % 25 === 0) console.log(`Uploaded ${i + 1}/${urlsToProcess.length}`);
  });

  // Rewrite markdown files
  let changedFiles = 0;
  for (const file of files) {
    const before = await fs.readFile(file, 'utf8');
    let after = before;
    for (const [from, to] of urlMap.entries()) {
      if (after.includes(from)) after = after.split(from).join(to);
    }
    if (after !== before) {
      await fs.writeFile(file, after, 'utf8');
      changedFiles++;
    }
  }

  await fs.writeFile(
    mapPath,
    JSON.stringify(Object.fromEntries(urlMap.entries()), null, 2) + '\n',
    'utf8'
  );

  console.log(`Done. Uploaded ${urlsToProcess.length} objects to R2 bucket "${bucket}".`);
  console.log(`Rewrote links in ${changedFiles} markdown files.`);
  console.log(`Mapping: ${mapPath}`);
}

main().catch(err => {
  console.error(err?.stack || err);
  process.exit(1);
});
