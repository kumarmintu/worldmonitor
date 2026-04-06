# TRINETRA — Deployment guide

**Phase 1 (now):** put the **TRINETRA Intelligence Deck** (World Monitor engine, TRINETRA branding) **live on the web**.  
**Phase 2 (later):** deploy the rest of your TRINETRA platform (marketing site, APIs, etc.) and link everything together.

Upstream architecture and troubleshooting: `worldmonitor/SELF_HOSTING.md` and [World Monitor docs](https://www.worldmonitor.app/docs/getting-started).

---

## Phase 1 — Deck live on the internet (TRINETRA branding)

The app in `worldmonitor/` is already rebranded for **TRINETRA** (title, PWA name, share text, noscript copy). Canonical and Open Graph URLs use **`VITE_TRINETRA_PUBLIC_URL`** at **build time** so they match **your** domain.

### 1. Get a server and domain

- A **VPS** (DigitalOcean, Hetzner, AWS EC2, etc.) with Docker, **or** any host that can run Docker Compose.  
- Point a DNS **A record** to the server, e.g. `intel.yourdomain.com`.

### 2. TLS (HTTPS)

Terminate TLS in front of the app (required for PWA and sane browser behavior):

- **Caddy** (auto Let’s Encrypt), **Traefik**, or **nginx** + Certbot.  
- Reverse-proxy **HTTPS :443** → `http://127.0.0.1:3000` (or whatever `WM_PORT` you set).

### 3. Configure `worldmonitor/.env` on the server

Create `worldmonitor/.env` (never commit it):

```bash
# Required for correct title/canonical/OG when users share links (HTTPS, no trailing slash)
VITE_TRINETRA_PUBLIC_URL=https://intel.yourdomain.com

# API keys (optional but recommended — see table below)
GROQ_API_KEY=
AISSTREAM_API_KEY=
AVIATIONSTACK_API=
NASA_FIRMS_API_KEY=

# Optional: change host binding port (default 3000)
# WM_PORT=3000
```

`docker compose` reads `.env` for **build args** and **runtime** env. **`.env` is excluded from the Docker build context** (see `worldmonitor/.dockerignore`) so secrets are not copied into image layers; runtime still receives keys from Compose.

### 4. Build and run

```bash
cd worldmonitor
npm install
docker compose up -d --build
./scripts/run-seeders.sh
```

Open `https://intel.yourdomain.com` (through your reverse proxy). The UI should show **TRINETRA** as the product name.

### 5. Rebuild when the public URL changes

If you change domain or path, set `VITE_TRINETRA_PUBLIC_URL` and rebuild:

```bash
docker compose build --no-cache worldmonitor && docker compose up -d
```

### 6. Point your marketing site at the live deck

When Phase 1 is up, update the parent folder’s **`deck.html`** and **`index.html`** so buttons and links use your real URL (e.g. `https://intel.yourdomain.com`) instead of `https://www.worldmonitor.app`.

---

## Phase 2 — Full TRINETRA platform (later)

- Host **`index.html` / `deck.html`** on the same domain, a subdomain (`www.`), or a static host (S3, Cloudflare Pages, Netlify).  
- Keep the deck on **`intel.`** (or similar) so cookies, APIs, and CSP stay predictable.  
- Optional: same-site iframe only if you serve both from one origin and relax `frame-ancestors` / `X-Frame-Options` on the deck — see security notes in older sections.

---

## Security first

- **Never commit API keys.** Use `worldmonitor/.env` or a secrets manager.  
- Rotate any key that was ever exposed in chat or tickets.

---

## License (World Monitor)

World Monitor is **AGPL-3.0**. Non-commercial self-hosting is allowed with license/source obligations. **Commercial SaaS or paid rebranding** needs a **commercial license** from the upstream maintainer. See the [repository LICENSE](https://github.com/koala73/worldmonitor/blob/main/LICENSE).

---

## What you are deploying

| Piece | Role |
|--------|------|
| **TRINETRA deck** | `worldmonitor/` — Docker **:3000** (default), TRINETRA-branded UI |
| **TRINETRA marketing** | `index.html`, `deck.html` — static; deploy in Phase 2 or alongside |

### API keys (optional)

| Provider | Variable |
|----------|----------|
| Groq | `GROQ_API_KEY` |
| AISStream | `AISSTREAM_API_KEY` |
| AviationStack | `AVIATIONSTACK_API` |
| NASA FIRMS | `NASA_FIRMS_API_KEY` |

---

## Path B — Local preview only (no public URL)

```bash
cd worldmonitor
cp .env.example .env.local
# Set VITE_TRINETRA_PUBLIC_URL=http://127.0.0.1:5173 for local meta tests (optional)
npm install
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173). Parent **`deck.html?local=1`** iframes this URL.

---

## Public hosting checklist

- [ ] `VITE_TRINETRA_PUBLIC_URL` matches the URL users type in the browser  
- [ ] TLS on **443**  
- [ ] Firewall: only **80/443** public; Redis not exposed  
- [ ] `./scripts/run-seeders.sh` after deploy (and on a schedule if needed)  
- [ ] AGPL / commercial license reviewed for your use case  

---

## Useful references

| Topic | Where |
|--------|--------|
| Docker / seeders / ports | `worldmonitor/SELF_HOSTING.md` |
| Env vars | `worldmonitor/.env.example` |
| Upstream | [koala73/worldmonitor](https://github.com/koala73/worldmonitor) |

---

*TRINETRA deployment guide · World Monitor remains copyright its authors; comply with AGPL (and commercial terms if applicable).*
