import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from 'cloudflare:workers';

/**
 * Lazy-loads the Cloudflare R2 Client to ensure Environment Variables
 * are fully hydrated by the Edge before instantiation.
 */
function getR2Client() {
  const accountId = (env as any).R2_ACCOUNT_ID;
  const accessKeyId = (env as any).R2_ACCESS_KEY_ID;
  const secretAccessKey = (env as any).R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.warn('[WARN] Cloudflare R2 credentials missing. Image operations will fail.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId || '',
      secretAccessKey: secretAccessKey || '',
    },
  });
}

function getBucketName() {
  return (env as any).R2_BUCKET_NAME || 'symeno-media';
}

/**
 * Generates a temporary, secure URL allowing the frontend to upload a file directly to R2.
 * Time-to-Live (TTL) is strictly 5 minutes.
 */
export async function generateUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    ContentType: contentType,
  });

  // URL expires in 300 seconds (5 minutes)
  return getSignedUrl(getR2Client(), command, { expiresIn: 300 });
}

/**
 * Deletes an object from the R2 bucket. Used for catalog cleanup.
 */
export async function deleteAsset(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  await getR2Client().send(command);
}

/**
 * EDGE OPTIMIZATION UPGRADE: Cloudflare Image Pipeline 
 * Formats the raw R2 key into a `/cdn-cgi/image/` request to serve AVIF/WebP automatically.
 * Use this in your frontend UI to render product photos instead of raw URLs.
 */
export function getOptimizedImageUrl(key: string, width = 800, quality = 85): string {
  if (!key) return '';
  return `/cdn-cgi/image/width=${width},quality=${quality},format=auto/${key}`;
}