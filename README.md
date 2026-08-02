# Northstar enterprise content platform

Secure starter for a Next.js 16 frontend and a self-hosted Sanity Studio.

## Architecture

- `apps/web`: Next.js App Router, TypeScript, standalone production output, nonce-based CSP, health endpoint, Sanity server client.
- `apps/studio`: TypeScript Sanity Studio with validation-first schemas.
- `compose.dev.yaml`: local hot-reload containers on ports `3000` and `3333`.
- `compose.prod.yaml`: non-root app containers behind Caddy with automatic TLS on ports `80` and `443`.
- `infra/Caddyfile`: production reverse proxy policy.

Sanity Studio is a static browser application. This repository self-hosts Studio; Sanity Content Lake remains Sanity-managed. If you need a fully on-premises content database, choose a CMS with an on-premise storage option instead.

## Prerequisites

- Node.js `24.13.0` and npm `11+`
- Docker Engine `29+` and Docker Compose v2
- A Sanity project with a private `production` dataset for production use

## Local setup

1. Create local configuration:

   ```powershell
   Copy-Item .env.local.example .env.local
   ```

2. Set `SANITY_STUDIO_PROJECT_ID` in `.env.local`. Use the same project ID in `NEXT_PUBLIC_SANITY_PROJECT_ID` if the frontend will query Sanity.

3. Install and validate:

   ```powershell
   npm.cmd install
   npm.cmd run typecheck
   npm.cmd run lint
   ```

4. Run without Docker:

   ```powershell
   npm.cmd run dev:web
   npm.cmd run dev:studio
   ```

5. Run with Docker hot reload:

   ```powershell
   docker compose --env-file .env.local -f compose.dev.yaml up --build
   ```

Open `http://localhost:3000` and `http://localhost:3333`.

Add the local Studio origin to Sanity CORS settings:

```powershell
npm.cmd --workspace apps/studio exec sanity cors add http://localhost:3333
```

## Production self-hosting

1. Copy and fill production values. Keep secrets out of Git:

   ```powershell
   Copy-Item .env.production.example .env.production
   ```

2. Set:

   - `APP_DOMAIN` and `STUDIO_DOMAIN` to real DNS names pointing at this host.
   - `TLS_CONTACT_EMAIL` for certificate operations.
   - `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`.
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
   - `SANITY_API_READ_TOKEN` only if the frontend reads a private dataset.
   - `SANITY_REVALIDATE_SECRET` to a long random secret used only in the `x-sanity-webhook-secret` header.

3. Add `https://$STUDIO_DOMAIN` to Sanity project CORS settings. Do not add a wildcard production origin.

4. Start the stack:

   ```powershell
   docker compose --env-file .env.production -f compose.prod.yaml up -d --build
   ```

5. Verify:

   ```powershell
   Invoke-WebRequest https://$env:APP_DOMAIN/api/health
   docker compose --env-file .env.production -f compose.prod.yaml ps
   ```

Caddy owns TLS and persists certificate state in the `caddy_data` volume. Back up that volume and keep Sanity dataset backups enabled in Sanity Manage.

## Secure defaults

- CSP nonce generated per request through Next.js `proxy.ts`; development alone permits `unsafe-eval` for React debugging.
- Security headers: HSTS in production, frame denial, MIME sniffing protection, strict referrer policy, permissions policy, COOP, CORP.
- No client-side Sanity token. `SANITY_API_READ_TOKEN` is server-only.
- Production web and Studio containers run as non-root users. Containers drop Linux capabilities, use read-only filesystems, resource limits, health checks, and `no-new-privileges`.
- Revalidation endpoint requires a constant-time compared secret header and returns generic unauthorized errors.
- Studio schemas enforce title, slug, description, and content constraints at the CMS boundary.

## Sanity initialization

The Studio is initialized in `apps/studio` with typed `sanity.config.ts`, `sanity.cli.ts`, and schema types. To connect an existing project, set environment values then run:

```powershell
npm.cmd --workspace apps/studio run dev
```

For a new Sanity project, authenticate with Sanity and use the current CLI initializer, then keep the generated project ID and dataset in environment variables:

```powershell
npm.cmd exec sanity@6.6.0 -- init --typescript --template clean --output-path apps/studio
```

Do not place `SANITY_AUTH_TOKEN`, `SANITY_API_READ_TOKEN`, or deployment tokens in `sanity.config.ts`, client components, `NEXT_PUBLIC_*` variables, or Docker images. CI deploy tokens belong in the CI secret store.

Self-hosted Studio builds are static. If you need Sanity Dashboard discovery and schema-aware features, deploy the schema manifest as part of the Studio release process:

```powershell
npm.cmd --workspace apps/studio exec sanity schema deploy
```

## Release and operations

CI runs dependency installation from the lockfile, type checks, lint, the Next.js production build, and a high-severity dependency audit. Recommended production SLOs for this starter:

- Availability: `99.95%` over 30 days for valid frontend requests.
- Latency: `99%` of successful dynamic requests under `300ms`, excluding third-party asset transfer.
- Recovery: rollback to the previous image tag within 15 minutes.

Monitor the web health endpoint, Caddy certificate renewals, container restarts, CPU/memory saturation, 5xx rate, and Sanity API error rate. Abort a rollout if health checks fail, 5xx increases materially, or latency burns the error budget.

## Commands

```text
npm.cmd run dev:web       Next.js local development
npm.cmd run dev:studio    Sanity Studio local development
npm.cmd run build:web     Next.js production build
npm.cmd run build:studio  Sanity static build; requires Studio env
npm.cmd run typecheck     TypeScript validation for both apps
npm.cmd run lint          ESLint validation for both apps
npm.cmd run audit         High-severity npm audit gate
```
