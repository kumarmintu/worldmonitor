const TRINETRA_MARKETING_FALLBACK = 'https://steady-cannoli-edb9f6.netlify.app';

function isLocalHostname(): boolean {
  if (typeof window === 'undefined' || !window.location?.hostname) return false;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1';
}

/**
 * Absolute URL for TRINETRA marketing pages (about, contact).
 * Override with VITE_TRINETRA_MARKETING_URL (HTTPS, no trailing slash). On non-localhost builds, defaults to the Netlify marketing site when unset.
 */
export function trinetraMarketingAbsUrl(path: string): string {
  const envBase = (import.meta.env.VITE_TRINETRA_MARKETING_URL as string | undefined)?.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  const base =
    envBase ||
    (typeof window !== 'undefined' && !isLocalHostname() ? TRINETRA_MARKETING_FALLBACK : '');
  if (base) return `${base}${p}`;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${p}`;
  }
  return p;
}
