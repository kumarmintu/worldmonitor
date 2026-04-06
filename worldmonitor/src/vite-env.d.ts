/// <reference types="vite/client" />

interface Window {
  umami?: {
    track: (event: string, data?: Record<string, unknown>) => void;
    identify: (data: Record<string, unknown>) => void;
  };
}

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly DEV?: boolean;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_WS_API_URL?: string;
  /** Your public HTTPS origin for canonical URLs / OG (no trailing slash), e.g. https://intel.example.com */
  readonly VITE_TRINETRA_PUBLIC_URL?: string;
  /** Marketing site origin when it differs from the deck (no trailing slash). In-app About / contact links use this + /about.html */
  readonly VITE_TRINETRA_MARKETING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
