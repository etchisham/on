# Security policy

## Supported versions

Only the latest `main` revision is supported.

## Reporting a vulnerability

Do not open a public issue for security vulnerabilities. Send a private report to the repository owner with:

- affected component and commit
- reproducible steps or proof of concept
- impact and suggested mitigation
- any secrets or personal data involved, sent through a secure channel only

Rotate exposed secrets immediately. Never add real tokens to issues, pull requests, logs, or source files.

## Current dependency gate

The current stable Next.js `16.2.12` and Sanity `6.6.0` trees report upstream transitive advisories in `postcss`, optional `sharp`, `adm-zip`, `js-yaml`, and `smol-toml` under `npm audit`. Do not run `npm audit fix --force`: npm proposes a breaking downgrade of Sanity/Next. CI keeps the high-severity audit as a release gate. Upgrade to fixed stable framework releases when available, then rerun the audit and full builds before production promotion.

The production Studio image is static and does not ship the Sanity CLI dependency tree. The vulnerable Next image optimizer dependency remains a release blocker for deployments that accept untrusted image URLs; keep `images.remotePatterns` allowlisted and review the audit before enabling image optimization at scale.
