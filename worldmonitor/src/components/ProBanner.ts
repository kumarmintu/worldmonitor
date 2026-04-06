import { trackGateHit } from '@/services/analytics';
import { trinetraMarketingAbsUrl } from '@/config/trinetra-marketing';

let bannerEl: HTMLElement | null = null;

/* TODO: re-enable dismiss after pro launch promotion period
const DISMISS_KEY = 'wm-pro-banner-dismissed';
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

function isDismissed(): boolean {
  const ts = localStorage.getItem(DISMISS_KEY);
  if (!ts) return false;
  if (Date.now() - Number(ts) > DISMISS_MS) {
    localStorage.removeItem(DISMISS_KEY);
    return false;
  }
  return true;
}

function dismiss(): void {
  if (!bannerEl) return;
  bannerEl.classList.add('pro-banner-out');
  setTimeout(() => {
    bannerEl?.remove();
    bannerEl = null;
  }, 300);
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}
*/

export function showProBanner(container: HTMLElement): void {
  if (bannerEl) return;
  if (window.self !== window.top) return;

  trackGateHit('trinetra-about-banner');

  const banner = document.createElement('div');
  banner.className = 'pro-banner';
  const aboutHref = trinetraMarketingAbsUrl('/about.html');
  banner.innerHTML = `
    <span class="pro-banner-badge">TRINETRA</span>
    <span class="pro-banner-text">
      <strong>Who we are</strong> — Mission, leadership, and how we build autonomous cyber defense intelligence.
    </span>
    <a class="pro-banner-cta" href="${aboutHref}">About us →</a>
  `;

  /* TODO: re-enable close button after pro launch promotion period
  banner.innerHTML += `<button class="pro-banner-close" aria-label="Dismiss">×</button>`;
  banner.querySelector('.pro-banner-close')!.addEventListener('click', (e) => {
    e.preventDefault();
    dismiss();
  });
  */

  const header = container.querySelector('.header');
  if (header) {
    header.before(banner);
  } else {
    container.prepend(banner);
  }

  bannerEl = banner;
  requestAnimationFrame(() => banner.classList.add('pro-banner-in'));
}

export function hideProBanner(): void {
  if (!bannerEl) return;
  bannerEl.classList.add('pro-banner-out');
  setTimeout(() => {
    bannerEl?.remove();
    bannerEl = null;
  }, 300);
}

export function isProBannerVisible(): boolean {
  return bannerEl !== null;
}
