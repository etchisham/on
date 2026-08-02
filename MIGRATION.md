# Sanity to Strapi Migration Report

## Migration Status: DONE

## Architecture Comparison

### Previous Sanity Architecture
- **Frontend**: Next.js 16 with `@sanity/client` and GROQ queries
- **CMS**: Self-hosted Sanity Studio (static build) connecting to Sanity Content Lake
- **Storage**: Sanity's proprietary cloud database
- **Images**: Sanity CDN (cdn.sanity.io)
- **Preview**: Sanity preview mode
- **Webhooks**: Sanity webhooks to `/api/revalidate`

### New Strapi Architecture
- **Frontend**: Next.js 16 with typed REST client
- **CMS**: Self-hosted Strapi 5 Community Edition
- **Database**: PostgreSQL 17 (self-hosted)
- **Storage**: Docker volumes for PostgreSQL data and media uploads
- **Images**: Self-hosted Strapi media library
- **Preview**: Next.js Draft Mode with Strapi tokens
- **Webhooks**: Strapi webhooks to `/api/revalidate`
- **Network**: Private Docker network (internal for database, public for apps)

## Content Model Mapping

| Sanity Schema | Strapi Content Type | Notes |
|----------------|---------------------|-------|
| `page` document | `Page` collection type | Direct mapping with blocks support |
| `siteSettings` document | `SiteSetting` single type | Global site configuration |

### Field Mappings

| Sanity Field | Strapi Field | Validation |
|--------------|--------------|------------|
| `title` (string) | `title` (string) | min 3, max 120 chars, required |
| `slug` (slug) | `slug` (uid) | max 96 chars, required, localized |
| `seoDescription` (text) | `seoDescription` (text) | max 160 chars |
| `body` (portable text) | `body` (blocks) | Rich text blocks |

## Removed Sanity Components

| Component | Action |
|-----------|--------|
| `@sanity/client` dependency | Removed from package.json |
| `apps/studio/` directory | Deleted entirely |
| `apps/studio/package.json` | Deleted |
| `apps/studio/sanity.config.ts` | Deleted |
| `apps/studio/sanity.cli.ts` | Deleted |
| `apps/studio/src/schemaTypes/` | Deleted |
| `apps/studio/Dockerfile` | Deleted |
| `apps/studio/nginx.conf` | Deleted |
| `apps/web/lib/sanity/client.ts` | Replaced with Strapi client |
| `cdn.sanity.io` in CSP | Replaced with Strapi media host |
| Sanity environment variables | Removed |

## New Strapi Components

| Component | Location |
|-----------|----------|
| Strapi application | `apps/cms/` |
| Package configuration | `apps/cms/package.json` |
| Server configuration | `apps/cms/config/server.ts` |
| Database configuration | `apps/cms/config/database.ts` |
| i18n configuration | `apps/cms/config/plugins.ts` |
| CORS configuration | `apps/cms/config/cors.ts` |
| Admin configuration | `apps/cms/config/admin.ts` |
| Security configuration | `apps/cms/config/middlewares.ts` |
| Page schema | `apps/cms/src/api/page/content-types/page/schema.json` |
| SiteSetting schema | `apps/cms/src/api/site-setting/content-types/site-setting/schema.json` |
| Strapi Dockerfile | `apps/cms/Dockerfile` |
| Strapi API client | `apps/web/lib/strapi/client.ts` |
| Metadata helpers | `apps/web/lib/strapi/metadata.ts` |

## Environment Variables

### Removed
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_APP_ID`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_READ_TOKEN`
- `SANITY_REVALIDATE_SECRET`

### Added
- `STRAPI_PUBLIC_URL` - Public Strapi URL (for browser)
- `STRAPI_INTERNAL_URL` - Internal Docker URL (for SSR)
- `STRAPI_API_TOKEN` - Server-side read token
- `STRAPI_WEBHOOK_SECRET` - Revalidation webhook secret
- `POSTGRES_DB` - Database name
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- `APP_KEYS` - Strapi app keys (comma-separated)
- `API_TOKEN_SALT` - API token generation salt
- `ADMIN_JWT_SECRET` - Admin JWT signing secret
- `TRANSFER_TOKEN_SALT` - Transfer token salt
- `JWT_SECRET` - General JWT secret
- `CMS_DOMAIN` - CMS domain for reverse proxy

## Security Configuration

### Secrets Validation
- All Strapi secrets validated at production startup
- Weak secret patterns rejected
- Minimum key count enforced (2 for APP_KEYS)

### API Permissions
- Public API: read-only access to pages and site-settings
- Admin panel: requires authentication
- No public create/update/delete permissions

### Network Security
- PostgreSQL on internal Docker network only
- No public exposure of database port 5432
- Caddy reverse proxy with TLS
- Non-root containers with dropped capabilities

### Container Security
- `read_only` root filesystem
- `no-new-privileges`
- `cap_drop: ALL`
- Health checks for all services
- Resource limits (pids, memory)

## Docker Services

### Development (`compose.dev.yaml`)
| Service | Port | Purpose |
|---------|------|---------|
| `postgres` | 5432 | PostgreSQL database |
| `cms` | 1337 | Strapi CMS |
| `web` | 3000 | Next.js frontend |

### Production (`compose.prod.yaml`)
| Service | Port | Purpose |
|---------|------|---------|
| `postgres` | (internal only) | PostgreSQL database |
| `cms` | (internal only) | Strapi CMS |
| `web` | (internal only) | Next.js frontend |
| `proxy` | 80, 443 | Caddy reverse proxy |

## Verification Commands

```powershell
# Type check
npm run typecheck:web
# Result: PASS (no errors)

# Lint
npm run lint:web
# Result: PASS (no errors)

# Build
npm run build:web
# Result: PASS
# Routes: /, /_not-found, /api/health, /api/revalidate, /robots.txt, /sitemap.xml
```

## Remaining Work

None. The migration is complete.

The repository now uses:
- Self-hosted Strapi Community Edition
- Self-hosted PostgreSQL
- No dependency on Sanity Cloud or Strapi Cloud
- Full i18n support for English and Arabic
- Secure production configuration with Docker

## Backup and Rollback

Before deployment:
1. Export Sanity data if credentials exist (N/A - no existing content)
2. Backup Docker volumes: `postgres_data`, `cms_uploads`

Post-deployment backup:
```powershell
docker compose exec postgres pg_dump -U strapi strapi > backup.sql
```

Rollback:
1. Stop Strapi containers
2. Restore previous deployment image
3. Restore previous database backup if needed
