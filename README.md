# Northstar enterprise content platform

Secure starter for a Next.js 16 frontend with self-hosted Strapi Community Edition CMS and PostgreSQL.

## Architecture

- `apps/web`: Next.js App Router, TypeScript, standalone production output, nonce-based CSP, health endpoint.
- `apps/cms`: Self-hosted Strapi 5 Community Edition with PostgreSQL backend.
- `compose.dev.yaml`: Local hot-reload containers for Next.js, Strapi, and PostgreSQL.
- `compose.prod.yaml`: Non-root containers behind Caddy with automatic TLS.
- `infra/Caddyfile`: Production reverse proxy configuration.

**Fully self-hosted**: No dependency on Sanity Cloud or Strapi Cloud. All data stays in your PostgreSQL database and local volumes.

## Prerequisites

- Node.js `24.13.0` and npm `11+`
- Docker Engine `29+` and Docker Compose v2

## Local setup

1. Create local configuration:

   ```powershell
   Copy-Item .env.local.example .env.local
   ```

2. Generate required secrets:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Run this for each of:
   - `APP_KEYS` (comma-separated, at least 2 keys)
   - `API_TOKEN_SALT`
   - `ADMIN_JWT_SECRET`
   - `TRANSFER_TOKEN_SALT`
   - `JWT_SECRET`
   - `STRAPI_WEBHOOK_SECRET`
   - `POSTGRES_PASSWORD`

3. Set all generated values in `.env.local`.

4. Install and validate:

   ```powershell
   npm.cmd install
   npm.cmd run typecheck
   npm.cmd run lint
   ```

5. Run with Docker hot reload:

   ```powershell
   docker compose --env-file .env.local -f compose.dev.yaml up --build
   ```

   This starts:
   - PostgreSQL on `localhost:5432`
   - Strapi CMS on `localhost:1337`
   - Next.js on `localhost:3000`

6. Access Strapi Admin:
   
   Open `http://localhost:1337/admin` and create your first admin user.

## Production deployment

1. Copy and fill production values:

   ```powershell
   Copy-Item .env.production.example .env.production
   ```

2. Generate all secrets as described above. Use unique, high-entropy values.

3. Set:
   - `APP_DOMAIN` and `CMS_DOMAIN` to real DNS names
   - `TLS_CONTACT_EMAIL` for certificate operations
   - All `APP_KEYS`, salts, and secrets

4. Start the stack:

   ```powershell
   docker compose --env-file .env.production -f compose.prod.yaml up -d --build
   ```

5. Verify:

   ```powershell
   Invoke-WebRequest https://$env:APP_DOMAIN/api/health
   docker compose --env-file .env.production -f compose.prod.yaml ps
   ```

## Internationalization

The CMS supports English (`en`) and Arabic (`ar`) locales out of the box.

- English is the default locale
- Arabic pages use RTL layout automatically
- All content types support per-locale translations
- Slugs are localized for SEO

To add a new locale:

1. Edit `apps/cms/config/plugins.ts`
2. Add the locale code and name to `i18n.config.locales` and `localeStrings`
3. Rebuild the Strapi container

## Content model

### Pages

- `title` (string, required, localized)
- `slug` (UID, required, localized)
- `seoDescription` (text, max 160 chars, localized)
- `body` (rich text blocks, localized)

### Site Settings

- `title` (string, required, localized)
- `description` (text, required, max 160 chars, localized)

## Webhooks and revalidation

Strapi webhooks trigger Next.js revalidation through `/api/revalidate`:

1. Configure a webhook in Strapi Admin pointing to `https://$APP_DOMAIN/api/revalidate`
2. Set the `x-strapi-webhook-secret` header to your `STRAPI_WEBHOOK_SECRET`
3. Content changes automatically revalidate affected pages

## Security

- CSP nonce generated per request
- Security headers: HSTS, frame denial, MIME sniffing protection
- PostgreSQL runs on an internal Docker network, not publicly exposed
- Strapi admin panel requires authentication
- Public API has read-only access by default
- Secrets validated at production startup
- Non-root containers with dropped capabilities
- Read-only filesystems with explicit tmpfs

## Backup

PostgreSQL data persists in Docker volumes. Back up regularly:

```powershell
docker compose --env-file .env.production -f compose.prod.yaml exec postgres pg_dump -U strapi strapi > backup.sql
```

Restore:

```powershell
docker compose --env-file .env.production -f compose.prod.yaml exec -T postgres psql -U strapi strapi < backup.sql
```

## Commands

```text
npm run dev:web       Next.js local development
npm run dev:cms       Strapi local development
npm run build:web     Next.js production build
npm run build:cms     Strapi production build
npm run typecheck     TypeScript validation
npm run lint          ESLint validation
npm run audit         High-severity npm audit gate
```

## Monitoring

Monitor:
- `/api/health` endpoint on the web app
- `/_health` endpoint on Strapi
- Caddy certificate renewals
- Container restarts
- CPU/memory saturation
- 5xx rate
- Strapi API error rate

Recommended SLOs:
- Availability: `99.95%` over 30 days
- Latency: `99%` under `300ms`
- Recovery: rollback within 15 minutes
