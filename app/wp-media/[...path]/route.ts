import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`Missing env ${name}`);
  return value.trim();
}

function safeKey(pathSegments: string[]): string {
  const cleaned = pathSegments
    .map(seg => seg.trim())
    .filter(Boolean)
    .join('/');

  if (!cleaned || cleaned.includes('..')) {
    throw new Error('Invalid path');
  }

  return `wp-media/${cleaned}`.replace(/^\/+/, '');
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  try {
    const bucket = getEnv('R2_BUCKET_NAME');
    const endpoint = getEnv('R2_ENDPOINT_URL');
    const accessKeyId = getEnv('R2_ACCESS_KEY');
    const secretAccessKey = getEnv('R2_SECRET_KEY');

    const key = safeKey(Array.isArray(segments) ? segments : []);

    const s3 = new S3Client({
      region: 'auto',
      endpoint,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey },
    });

    const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

    const body = obj.Body;
    if (!body) return new Response('Not found', { status: 404 });

    const contentType = obj.ContentType || 'application/octet-stream';
    const cacheControl =
      obj.CacheControl || 'public, max-age=31536000, immutable';

    let buf: Buffer;
    if (body instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of body) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      buf = Buffer.concat(chunks);
    } else {
      const ab = await (body as any).arrayBuffer();
      buf = Buffer.from(ab);
    }

    const bodyBytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);

    return new Response(bodyBytes as any, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        ...(obj.ETag ? { ETag: obj.ETag } : {}),
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
