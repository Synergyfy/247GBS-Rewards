import type { NextRequest } from 'next/server';

/**
 * Resolve the public-facing origin for redirects.
 *
 * Next.js can see the internal upstream address (for example
 * `http://localhost:3006`) when the app runs behind a reverse proxy. Prefer
 * the explicitly configured `APP_URL`, then standard forwarded headers, and
 * only fall back to the request URL for local development.
 */
export function getPublicOrigin(request: NextRequest): string {
  const configured = process.env.APP_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  if (forwardedHost) {
    const forwardedProto =
      request.headers.get('x-forwarded-proto') || 'https';
    return `${forwardedProto}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}
