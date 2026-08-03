# AGENTS.md — Enterprise Engineering Instructions

This file is the binding engineering contract for every AI coding agent, developer, reviewer, and automation working in this repository.

The target is a production-grade, secure, accessible, responsive, multilingual website built with:

- Next.js
- TypeScript
- Self-hosted Strapi Community Edition
- PostgreSQL
- Docker
- English and Arabic initially
- Additional locales in the future

These instructions apply to planning, implementation, review, testing, documentation, deployment, and maintenance.

---

## 1. Non-negotiable operating rules

Before changing code:

1. Inspect the repository structure and existing conventions.
2. Read the relevant package files, framework configuration, Docker files, environment examples, tests, and documentation.
3. Determine the installed versions of Next.js, React, TypeScript, Strapi, Node.js, and the package manager.
4. Reuse existing abstractions and design patterns when they are sound.
5. Do not invent files, APIs, routes, environment variables, content types, or infrastructure that have not been verified.
6. Do not replace working architecture without a documented reason.
7. Do not stop after analysis or scaffolding when implementation was requested.
8. Do not claim completion until the required verification commands have actually run.
9. Never weaken security, typing, validation, accessibility, or tests to make a check pass.
10. Keep changes focused. Do not perform unrelated rewrites.

If a required external credential or service is unavailable, complete all work that can be done locally and mark only the affected verification as `BLOCKED`.

---

## 2. Definition of done

A task is `DONE` only when all applicable conditions are true:

- The complete user journey works through the real production data path.
- No mock, placeholder, fake response, hardcoded production content, or disconnected UI remains.
- Server-side validation and authorization are enforced.
- Data is persisted and retrieved from the authoritative source.
- English and Arabic behavior works.
- RTL behavior works where Arabic is used.
- The implementation is responsive.
- Keyboard and screen-reader behavior is correct.
- Error, loading, empty, offline, and permission-denied states are handled.
- Security requirements are implemented.
- Observability is adequate.
- Unit, integration, and end-to-end tests are added or updated.
- Existing tests still pass.
- Linting, type checking, builds, and container checks pass.
- Documentation is updated.
- No known high-severity regression remains.

Use these statuses in reports:

- `DONE`
- `PARTIAL`
- `BLOCKED`
- `NOT APPLICABLE`

Never use `DONE` when a required check was not run.

---

## 3. Architecture boundaries

### Next.js

- Prefer Server Components by default.
- Use Client Components only when browser state, effects, event handlers, or browser APIs are required.
- Keep secrets and privileged data access server-only.
- Use Route Handlers and Server Actions carefully and validate every input server-side.
- Avoid unnecessary client-side fetching.
- Avoid duplicated business logic across server and client layers.
- Use framework-supported caching and revalidation deliberately.
- Prevent accidental caching of private, draft, preview, or user-specific data.
- Keep route-specific code close to the route while sharing stable domain logic through well-defined modules.

### Strapi

- Use self-hosted Strapi Community Edition only unless a paid feature is explicitly approved.
- Use PostgreSQL for shared and production environments.
- Deny public mutation access by default.
- Public users may read only explicitly approved published content.
- Draft content must never be returned to normal public requests.
- Keep Strapi API tokens server-side.
- Never expose private tokens through `NEXT_PUBLIC_*`.
- Validate custom controllers, policies, services, lifecycle hooks, and webhook payloads.
- Keep content models structured. Do not put the entire site into unrestricted JSON fields.
- Use components, dynamic zones, relations, media fields, and localized fields appropriately.
- Use explicit population and field selection. Avoid unbounded `populate=*` in production code.
- Apply pagination and query limits.

### PostgreSQL

- Do not expose PostgreSQL publicly.
- Use a dedicated least-privilege application user.
- Use migrations and backups safely.
- Do not run destructive production migrations without a backup and rollback plan.
- Verify persistence across container recreation.

### Docker

- Use multi-stage builds.
- Run application containers as non-root users.
- Keep runtime images minimal.
- Do not bake secrets into images or build arguments.
- Use health checks and graceful shutdown.
- Use persistent volumes for PostgreSQL and local media storage.
- Isolate internal services on private Docker networks.
- Expose only services that must be public.
- Pin compatible base image versions.
- Drop unnecessary capabilities and enable `no-new-privileges`.
- Use read-only root filesystems where compatible.
- Configure log rotation and resource limits for production.

---

## 4. Design system and CSS rules

The UI must be driven by reusable design tokens.

### Mandatory token policy

Use CSS custom properties for all reusable visual values, including:

- colors;
- backgrounds;
- foregrounds;
- borders;
- shadows;
- radii;
- spacing scale;
- container widths;
- typography families;
- font sizes;
- font weights;
- line heights;
- letter spacing;
- control heights;
- icon sizes;
- z-index layers;
- transitions;
- animation durations;
- breakpoints when the selected tooling supports them;
- focus-ring styles.

Do not place raw reusable design values inside components.

Forbidden in component code unless explicitly justified:

- arbitrary hexadecimal colors;
- arbitrary RGB/HSL values;
- repeated pixel values;
- unexplained magic numbers;
- one-off shadows;
- one-off border radii;
- duplicated transition values;
- hardcoded light-only or dark-only colors.

Example token structure:

```css
:root {
  --color-background: 0 0% 100%;
  --color-foreground: 222 47% 11%;
  --color-surface: 210 40% 98%;
  --color-border: 214 32% 91%;
  --color-primary: 221 83% 53%;
  --color-primary-foreground: 210 40% 98%;
  --color-danger: 0 72% 51%;

  --font-sans: "Project Sans", system-ui, sans-serif;
  --font-arabic: "Project Arabic", "Noto Sans Arabic", sans-serif;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  --radius-sm: 0.375rem;
  --radius-md: 0.625rem;
  --radius-lg: 1rem;

  --shadow-sm: 0 1px 2px hsl(222 47% 11% / 0.08);
  --shadow-md: 0 8px 24px hsl(222 47% 11% / 0.12);

  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --easing-standard: cubic-bezier(0.2, 0, 0, 1);
}
```

If Tailwind is used:

- Map Tailwind theme values to CSS variables.
- Prefer semantic classes such as `bg-background` and `text-foreground`.
- Avoid arbitrary values such as `text-[#123456]`, `w-[347px]`, or `rounded-[11px]`.
- An arbitrary value is allowed only when it is truly content-specific, cannot reasonably be represented by an existing token, and is documented.
- Repeated arbitrary values must be promoted to tokens.

### Semantic tokens

Use semantic names, not visual names.

Prefer:

- `--color-primary`
- `--color-surface`
- `--color-danger`
- `--color-muted-foreground`

Avoid:

- `--blue-500-for-button`
- `--gray-card`
- `--red-error-text-only`

Components must consume semantic tokens so themes can change without rewriting component code.

### Dark mode

When dark mode exists:

- Define dark-mode semantic token overrides.
- Do not duplicate entire component styles for dark mode.
- Verify contrast in light and dark themes.
- Use the selected application theme strategy consistently.

### Component rules

- Prefer small, composable components.
- Reuse established UI primitives.
- Do not duplicate the same component with minor visual changes; use controlled variants.
- Use a typed variant system where one already exists.
- Preserve native HTML semantics.
- Avoid `div` and `span` when a semantic element is appropriate.
- Every interactive element must have visible hover, focus, active, disabled, loading, and error states where applicable.
- Do not use color as the only way to convey meaning.
- Icons must have accessible labels or be marked decorative.
- Decorative images must use empty alt text.
- Meaningful images require localized alt text.

---

## 5. Responsive design requirements

Every interface must be mobile-first and responsive.

### Required viewport coverage

At minimum, verify layouts at:

- 320 × 568
- 360 × 800
- 390 × 844
- 768 × 1024
- 1024 × 768
- 1280 × 800
- 1440 × 900
- 1920 × 1080

Also test zoom at 200%.

### Responsive rules

- Start with the smallest layout and progressively enhance.
- Do not design desktop first and patch mobile afterward.
- No unintended horizontal scrolling.
- Do not use fixed widths for main content.
- Use fluid sizing with `min()`, `max()`, `clamp()`, grid, flexbox, and container queries where appropriate.
- Use logical CSS properties:
  - `margin-inline`
  - `padding-inline`
  - `inset-inline`
  - `border-inline`
  - `text-align: start`
- Avoid physical left/right properties unless the behavior must remain physical in both LTR and RTL.
- Tables must have a deliberate mobile strategy.
- Long words, URLs, email addresses, and translated labels must not break layouts.
- Controls must remain usable with touch.
- Minimum touch target should be approximately 44 × 44 CSS pixels where practical.
- Navigation must work on mobile with keyboard and screen readers.
- Images must reserve dimensions to prevent layout shift.
- Use responsive image sizing and modern formats.
- Test Arabic text expansion and mixed Arabic/English content.

A UI task is not complete until responsive behavior is verified, not merely assumed.

---

## 6. Internationalization and RTL

Supported locales initially:

- `en`
- `ar`

The locale system must be centralized and extensible.

### Locale requirements

- Use locale-prefixed routes such as `/en/...` and `/ar/...`.
- Validate locales against a centralized allowlist.
- Do not construct backend queries from unchecked locale strings.
- Do not hardcode locale checks throughout unrelated files.
- User-facing text must come from translation resources or localized CMS content.
- Missing translation behavior must be explicit.
- Do not silently publish English text under an Arabic canonical URL unless approved as a fallback policy.
- Use `Intl` APIs for dates, numbers, currencies, percentages, lists, and relative time.
- Do not manually format locale-sensitive values.

### RTL requirements

For Arabic:

```html
<html lang="ar" dir="rtl">
```

For English:

```html
<html lang="en" dir="ltr">
```

- Use logical CSS properties.
- Verify menus, breadcrumbs, dialogs, forms, carousels, pagination, icons, tables, and navigation in RTL.
- Mirror directional icons only when their meaning is directional.
- Never mirror logos or universal media controls.
- Handle mixed-direction text, emails, URLs, phone numbers, and code correctly.
- Use Arabic-capable fonts.
- Keep keyboard order and DOM order logical.
- Do not reverse DOM order solely to create a visual RTL layout.

### Language switcher

The language switcher must:

- be keyboard accessible;
- have an accessible name;
- indicate the active language;
- preserve the equivalent route where possible;
- preserve only safe query parameters;
- avoid redirect loops;
- work without losing user context.

---

## 7. Accessibility requirements

Target WCAG 2.2 AA.

Every UI change must consider:

- semantic HTML;
- keyboard access;
- visible focus;
- logical focus order;
- skip links;
- landmarks;
- headings;
- accessible names;
- form labels;
- field instructions;
- error identification;
- live-region announcements where needed;
- contrast;
- reduced motion;
- high zoom;
- screen readers;
- language and direction attributes;
- touch targets;
- no keyboard traps.

Additional rules:

- Do not suppress outlines without providing an equal or better focus indicator.
- Do not attach click behavior only to non-interactive elements.
- Dialogs must trap and restore focus correctly.
- Loading states must be announced when needed.
- Validation messages must be linked to their controls.
- Animations must respect `prefers-reduced-motion`.
- Autoplaying media is prohibited unless it follows accessibility requirements.
- Include automated accessibility checks, but do not treat them as a replacement for manual keyboard and screen-reader review.

---

## 8. Security requirements

Security is part of every feature.

### Input and output

- Validate all external input on the server.
- Use schema validation for route parameters, query strings, forms, request bodies, CMS payloads, webhook payloads, and environment variables.
- Set size and length limits.
- Escape or sanitize untrusted content according to context.
- Never render unrestricted HTML from CMS content.
- Use an allowlisted renderer for rich content.
- Validate external URLs and reject dangerous schemes.
- Prevent open redirects.
- Protect server-side URL fetching against SSRF.

### Authentication and authorization

Where authentication exists:

- Authenticate server-side.
- Authorize every protected read and mutation.
- Deny by default.
- Never trust roles, user IDs, tenant IDs, or permissions supplied by the browser.
- Prevent IDOR and privilege escalation.
- Use secure cookies.
- Do not publicly cache private responses.

### Secrets

- Secrets must remain server-only.
- Never commit secrets.
- Never log secrets.
- Never expose secrets through `NEXT_PUBLIC_*`.
- Validate required production environment variables at startup.
- Provide sanitized `.env.example` files.
- Use separate development, test, staging, and production credentials.
- Document rotation procedures.

### Headers and browser security

Implement and verify applicable production headers:

- Content Security Policy
- Strict Transport Security
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- frame protection
- cross-origin policies where compatible
- safe cache controls

The production CSP must not rely on broad wildcards or permanently permissive directives.

### Rate limiting and abuse

Apply production-suitable rate limiting to abuse-sensitive endpoints such as:

- authentication;
- contact forms;
- newsletter forms;
- search;
- preview;
- webhooks;
- expensive APIs.

Do not use an in-memory-only limiter for multi-instance production deployments.

### Errors and logs

- Do not expose stack traces, file paths, internal hosts, database errors, or secret-bearing error objects to users.
- Use structured logs.
- Add request or correlation IDs where practical.
- Redact authorization headers, cookies, tokens, passwords, and sensitive personal data.
- Provide safe user-facing error messages.

---

## 9. SEO requirements

Every public localized page must consider:

- localized title;
- localized description;
- canonical URL;
- reciprocal `hreflang`;
- `x-default` where appropriate;
- localized Open Graph data;
- localized social metadata;
- localized structured data;
- indexability;
- robots directives;
- sitemap inclusion;
- meaningful status codes.

Additional rules:

- Draft, preview, admin, internal, and error routes must not be indexed.
- Do not generate sitemap entries for drafts.
- Avoid duplicate canonical URLs.
- Do not hide primary content behind client-only rendering.
- Use semantic heading structure.
- Ensure images have dimensions and appropriate alt text.
- Monitor Core Web Vitals.

---

## 10. Performance requirements

- Avoid unnecessary JavaScript in the browser.
- Prefer Server Components.
- Lazy-load non-critical client code.
- Use code splitting deliberately.
- Optimize images and fonts.
- Self-host fonts where practical and legally permitted.
- Prevent layout shift.
- Avoid waterfalls in data fetching.
- Use caching and revalidation intentionally.
- Do not cache draft or private data.
- Use database and API queries that request only required fields.
- Avoid unbounded relation population.
- Set request timeouts.
- Avoid infinite retries.
- Add performance budgets where practical.
- Measure before and after major changes.

Do not trade accessibility, correctness, or security for minor performance gains.

---

## 11. TypeScript and code quality

- Use strict TypeScript.
- Do not introduce `any` unless there is no reasonable alternative and the reason is documented.
- Prefer `unknown` with runtime validation.
- Avoid unsafe type assertions.
- Keep domain types explicit.
- Validate network and CMS responses at runtime.
- Use exhaustive handling for discriminated unions.
- Keep functions focused.
- Prefer clear names over comments that explain unclear code.
- Add comments for rationale, security boundaries, and non-obvious constraints.
- Remove dead code.
- Do not leave commented-out production code.
- Do not leave `TODO` or `FIXME` without an issue or clearly documented follow-up.
- Follow the repository’s formatter, lint rules, import conventions, and path aliases.
- Do not disable lint rules globally to bypass failures.

---

## 12. Testing strategy

Testing is required for every meaningful feature and bug fix.

Use the repository’s established test tools. If no suitable tools exist, add compatible tools with minimal justified complexity.

### Test pyramid

Use the appropriate combination of:

1. Unit tests
2. Component tests
3. Integration tests
4. Contract tests
5. End-to-end tests
6. Accessibility tests
7. Visual-regression tests
8. Security-focused tests
9. Container smoke tests

### Unit tests

Test:

- pure business logic;
- validation;
- locale helpers;
- formatting helpers;
- permission rules;
- URL validation;
- content transformations;
- error mapping.

### Integration tests

Test real boundaries where practical:

- Next.js to Strapi;
- Strapi to PostgreSQL;
- preview and draft behavior;
- webhook revalidation;
- media handling;
- localized content;
- cache invalidation;
- authorization and validation.

Do not replace all integration tests with mocks.

### End-to-end tests

Use Playwright unless the repository has another established E2E framework.

Every critical user journey must have E2E coverage, including as applicable:

- English home page;
- Arabic home page;
- language switching;
- navigation;
- localized content pages;
- responsive menus;
- forms;
- validation failures;
- successful submissions;
- 404 behavior;
- CMS content rendering;
- preview and exit-preview flow;
- protected routes;
- error and empty states.

E2E requirements:

- Test Chromium at minimum.
- Add Firefox and WebKit in CI when practical.
- Include mobile and desktop projects.
- Do not depend on uncontrolled production data.
- Use deterministic fixtures or seeded test data.
- Avoid fixed sleeps.
- Wait for observable UI or network conditions.
- Use stable locators, preferably roles, labels, and test IDs only when necessary.
- Capture traces, screenshots, and videos on failure.
- Retry only in CI and only a small number of times.
- Fix flaky tests; do not normalize flakiness.

Example Playwright project coverage:

```ts
projects: [
  {
    name: "desktop-chromium",
    use: { browserName: "chromium", viewport: { width: 1440, height: 900 } }
  },
  {
    name: "mobile-chromium",
    use: { browserName: "chromium", viewport: { width: 390, height: 844 } }
  },
  {
    name: "desktop-firefox",
    use: { browserName: "firefox", viewport: { width: 1440, height: 900 } }
  },
  {
    name: "desktop-webkit",
    use: { browserName: "webkit", viewport: { width: 1440, height: 900 } }
  }
]
```

### Accessibility tests

Include automated checks using an established accessibility engine when compatible.

Test at minimum:

- English key pages;
- Arabic key pages;
- dialogs;
- menus;
- forms;
- error states.

Also perform manual keyboard verification for critical flows.

### Visual regression

Use visual snapshots for stable, high-value pages and components:

- English desktop;
- Arabic desktop;
- English mobile;
- Arabic mobile;
- light/dark themes when applicable.

Avoid snapshotting unstable timestamps or dynamic external content.

### Security tests

Test applicable controls:

- invalid input rejection;
- unauthorized access;
- public draft denial;
- preview secret rejection;
- webhook signature rejection;
- open redirect prevention;
- dangerous URL rejection;
- rate limiting;
- security headers;
- client bundle secret absence;
- public mutation denial;
- locale allowlisting.

### Test quality

- Tests must verify behavior, not implementation details.
- Every bug fix requires a regression test where practical.
- Do not delete tests to make CI pass.
- Do not reduce assertions to hide failures.
- Do not mark failing tests as skipped without a documented blocker.

---

## 13. Required verification commands

Before reporting completion, run the commands supported by the repository.

Typical checks include:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm build
docker compose config
docker compose build
docker compose up -d
docker compose ps
```

Use the repository’s actual package manager and scripts.

Also verify:

- health endpoints;
- Next.js-to-Strapi connectivity;
- Strapi-to-PostgreSQL connectivity;
- English routes;
- Arabic routes;
- RTL attributes;
- production headers;
- public draft denial;
- persistence after container recreation;
- no exposed PostgreSQL port;
- non-root container users;
- log redaction.

Report the exact commands and exit results.

---

## 14. Content and CMS migration rules

If replacing an existing CMS:

1. Inventory schemas, queries, media, relationships, locales, drafts, slugs, and SEO data.
2. Create an explicit source-to-target mapping.
3. Back up source data before destructive changes.
4. Use repeatable migration scripts.
5. Make migration scripts restartable and idempotent where practical.
6. Log failed and skipped records without exposing secrets.
7. Reconcile source and destination counts.
8. Verify media, relationships, slugs, publication status, and translations.
9. Remove the old runtime only after the new production path is verified.
10. Preserve rollback capability.

No migration is complete when only empty Strapi content types exist.

---

## 15. Observability and operations

Production features must be operable.

Implement or update as applicable:

- structured logs;
- request IDs;
- health checks;
- readiness checks;
- error monitoring;
- latency monitoring;
- webhook failure monitoring;
- authentication failure monitoring;
- container restart monitoring;
- disk and volume monitoring;
- PostgreSQL backup monitoring;
- alerts;
- dashboards;
- runbooks.

Never log:

- passwords;
- tokens;
- cookies;
- authorization headers;
- private CMS drafts;
- complete database URLs;
- secret environment values.

Document:

- deployment;
- rollback;
- backup;
- restore;
- secret rotation;
- incident response;
- common failure recovery.

---

## 16. Dependency policy

- Use the existing package manager and lockfile.
- Add dependencies only when justified.
- Prefer mature, actively maintained packages.
- Avoid packages that duplicate existing capabilities.
- Remove unused dependencies.
- Review licenses.
- Review security advisories.
- Do not run forced upgrades blindly.
- Keep framework versions compatible.
- Pin critical production dependencies appropriately.
- Commit lockfile changes.
- Add automated dependency update tooling when appropriate.

---

## 17. Git and change-management rules

- Keep commits focused and understandable.
- Do not mix unrelated refactors with feature changes.
- Never commit secrets, local databases, build output, test artifacts, or editor-specific temporary files.
- Do not force-push unless explicitly authorized.
- Do not rewrite shared history.
- Do not delete user work.
- Before destructive Git operations, confirm the impact.
- Include migration and rollback notes for breaking changes.
- Update `.gitignore` and `.dockerignore` when necessary.

---

## 18. Documentation requirements

Update documentation whenever behavior, configuration, architecture, or operations change.

Document:

- architecture;
- environment variables;
- local setup;
- production deployment;
- Docker topology;
- Strapi content model;
- localization;
- adding a new locale;
- preview and draft workflow;
- webhooks;
- security controls;
- CSP maintenance;
- tests;
- backups;
- restore;
- rollback;
- monitoring;
- troubleshooting.

Documentation must match the implemented code.

---

## 19. AI-agent execution protocol

For every assigned task:

### Step 1: Inspect

Read the relevant code, configuration, tests, and documentation.

### Step 2: Define acceptance

Restate the concrete, testable completion conditions.

### Step 3: Plan

Create a short implementation plan grounded in the repository.

### Step 4: Implement

Make the complete change through the real data and runtime path.

### Step 5: Test

Add or update tests and run them.

### Step 6: Verify production behavior

Build production artifacts and verify runtime behavior where tools permit.

### Step 7: Report

Report:

- files inspected;
- files changed;
- commands run;
- tests passed;
- tests failed;
- blockers;
- remaining risks;
- exact status.

Do not output only a plan when implementation was requested.

Do not say “should work.” Demonstrate that it works.

---

## 20. Forbidden shortcuts

Never:

- create a UI shell without the backend path required by the task;
- use fake data in production code;
- mark placeholder behavior as complete;
- bypass server validation;
- trust client authorization;
- expose secret tokens;
- expose drafts publicly;
- use unrestricted `populate=*` without justification;
- use permissive CORS;
- use broad production CSP wildcards;
- expose PostgreSQL publicly;
- run production containers as root without a documented blocker;
- hardcode reusable colors and sizes in components;
- ignore mobile or RTL behavior;
- remove focus indicators;
- suppress TypeScript errors;
- add `any` broadly;
- disable tests;
- delete failing tests;
- skip E2E coverage for a critical user flow;
- claim completion without executing verification;
- silently discard content during CMS migration;
- perform irreversible production changes without backup and rollback.

---

## 21. Final completion report template

Use this structure:

```md
# Completion Report

## Status
DONE | PARTIAL | BLOCKED | NOT APPLICABLE

## Architecture inspected
- ...

## Files changed
- `path`: reason

## Implementation completed
- ...

## Tests added or updated
- ...

## Commands executed
| Command | Exit code | Result |
|---|---:|---|
| `...` | 0 | Passed |

## Responsive verification
- Mobile:
- Tablet:
- Desktop:
- 200% zoom:
- RTL:

## Accessibility verification
- Automated:
- Keyboard:
- Screen reader:

## Security verification
- ...

## Remaining blockers
- ...

## Remaining risks
- ...

## Exact next action
- ...
```

The report must be factual and based on executed work.

---

## 22. Screenshot-driven section implementation contract

This section applies whenever an agent receives a screenshot, mockup, design reference, or visual specification for a page section or component.

The screenshot defines the intended visual result. This file remains the authority for architecture, security, accessibility, responsiveness, data flow, typing, caching, testing, and completion.

### 22.1 Screenshot interpretation

Before implementation:

1. Inspect the screenshot carefully.
2. Identify:
   - visual hierarchy;
   - semantic regions;
   - probable reusable components;
   - content groups;
   - interaction states;
   - desktop and mobile intent;
   - likely RTL behavior;
   - image and media behavior;
   - spacing relationships;
   - typography hierarchy;
   - repeated patterns that should become component variants.
3. Inspect the repository for:
   - matching existing components;
   - design tokens;
   - page layouts;
   - Strapi schemas;
   - translation resources;
   - existing data-access functions;
   - existing cache helpers;
   - existing tests and fixtures.
4. Implement real semantic HTML and CSS. Never use the screenshot itself as a production background or substitute for real components.
5. Do not embed screenshot text as permanent component-owned production data.
6. Do not implement only the visible desktop state.
7. Do not infer unavailable business rules silently. Use repository evidence and clearly report unresolved requirements.

### 22.2 Mandatory component/data separation

Presentational components must be reusable and independent of where their data originates.

A presentational component must never:

- call `fetch`;
- call Strapi;
- call PostgreSQL;
- import a Strapi client;
- read environment variables;
- read cookies or request headers unless it is explicitly a route/container concern;
- contain CMS queries;
- contain API tokens;
- contain production content arrays;
- contain page-specific hardcoded content;
- receive raw Strapi response objects;
- know Strapi field names such as `data`, `attributes`, `documentId`, or internal relation wrappers;
- assume the route from which it is rendered;
- perform authorization;
- perform server mutations;
- decide cache behavior.

The mandatory public-content flow is:

```text
Strapi
  → server-only query/data-access function
  → strict runtime validation
  → domain normalization
  → CMS-to-view-model mapper
  → page or server container
  → reusable presentational component through typed props
```

Each layer has one responsibility:

- **Data-access layer:** communicates with Strapi and applies request policy.
- **Validation layer:** rejects malformed or unexpected external data.
- **Domain layer:** represents authoritative application concepts.
- **Mapper layer:** converts domain/CMS data into a stable UI view model.
- **Page/container:** composes data, locale, metadata, caching, and components.
- **Presentational component:** renders valid props and local visual interaction only.

Local component state is allowed for UI behavior such as:

- disclosure state;
- tabs;
- carousel position;
- mobile menu state;
- selected visual option;
- focus and keyboard interaction.

Authoritative content and business data must still enter through props.

### 22.3 Reusable component requirements

Every screenshot-derived component must:

- receive all business content through props;
- receive links and URLs through props;
- receive images and media metadata through props;
- receive accessibility labels through props or translation resources;
- accept locale-neutral view models;
- support both LTR and RTL;
- be independently renderable in a component test;
- be usable with another valid dataset;
- avoid route-specific assumptions;
- expose only the smallest necessary prop surface;
- use composable subcomponents when the screenshot contains repeatable structures;
- use explicit variants rather than duplicated near-identical components;
- preserve semantic HTML;
- avoid unnecessary `"use client"` boundaries.

Do not over-generalize a one-off section into a vague “universal component.” Generalize only the stable visual and behavioral pattern evidenced by the repository or screenshot.

### 22.4 No production data inside components

Production components must not define their own business content.

Forbidden:

```tsx
const cards = [
  { title: "Service One", description: "..." },
  { title: "Service Two", description: "..." }
];
```

Forbidden:

```tsx
export function FeatureSection() {
  return <h2>Hardcoded production heading</h2>;
}
```

Required:

```tsx
export interface FeatureSectionProps {
  readonly heading: string;
  readonly items: readonly FeatureItemViewModel[];
}

export function FeatureSection({
  heading,
  items,
}: FeatureSectionProps) {
  return (
    <section>
      <h2>{heading}</h2>
      {/* Render validated props only. */}
    </section>
  );
}
```

Hardcoded data is allowed only in clearly isolated:

- tests;
- stories;
- local fixtures;
- seed scripts;
- development-only previews.

Production pages must not import test or story fixtures.

### 22.5 Strict TypeScript and prop contracts

Use the strictest TypeScript settings compatible with the repository.

Prefer enabling and preserving, where supported:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "useUnknownInCatchVariables": true
  }
}
```

Do not alter repository-wide compiler settings without checking the impact and fixing resulting issues in scope.

Component prop contracts must:

- use named exported interfaces or types for meaningful components;
- use `readonly` fields;
- use readonly arrays;
- distinguish required, optional, and nullable values;
- avoid broad `any`;
- prefer `unknown` at untrusted boundaries;
- avoid unsafe assertions;
- use discriminated unions for meaningful visual variants;
- use exhaustive variant handling;
- explicitly type callbacks;
- use stable IDs for repeated items;
- avoid generic index signatures unless arbitrary keys are truly required;
- use `satisfies` where it strengthens compile-time validation;
- avoid leaking raw CMS types into UI components.

Example:

```tsx
export type FeatureSectionTone =
  | "default"
  | "muted"
  | "brand";

export interface ResponsiveImageViewModel {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly blurDataURL?: string;
}

export interface FeatureItemViewModel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image?: ResponsiveImageViewModel;
  readonly href?: string;
}

export interface FeatureSectionProps {
  readonly eyebrow?: string;
  readonly heading: string;
  readonly description?: string;
  readonly items: readonly FeatureItemViewModel[];
  readonly tone?: FeatureSectionTone;
}
```

### 22.6 Runtime data and prop validation

TypeScript does not validate data received from Strapi, HTTP, environment variables, files, or webhooks at runtime.

Use the repository’s established runtime validation library. If none exists, use a mature compatible schema validator such as Zod.

Validate untrusted data at the server boundary before mapping it to component props.

Runtime schemas must validate, as applicable:

- required and optional fields;
- nullability;
- unknown fields;
- string lengths;
- arrays and maximum item counts;
- locale values;
- enum values;
- identifiers;
- URL schemes;
- internal and external links;
- media MIME types;
- image width and height;
- numeric ranges;
- dates;
- publication state;
- nested components;
- dynamic-zone discriminators;
- relation shapes.

Prefer strict object parsing where forward compatibility does not require unknown fields.

Example:

```ts
const featureItemSchema = z
  .object({
    id: z.string().min(1).max(128),
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().min(1).max(1200),
    href: safeHrefSchema.optional(),
  })
  .strict();

const featureSectionSchema = z
  .object({
    heading: z.string().trim().min(1).max(200),
    items: z.array(featureItemSchema).min(1).max(24),
  })
  .strict();
```

Runtime validation belongs in the external-data boundary, not scattered inside pure presentational components.

Presentational components may defensively handle valid empty or optional states defined by their prop contract. They must not silently repair malformed authoritative data with fake content.

### 22.7 Prop-contract enforcement and improper-data detection

For every important reusable component:

- add compile-time prop coverage through TypeScript;
- add component tests with valid minimum and maximum prop sets;
- add negative validation tests for malformed external data;
- add mapper tests ensuring raw CMS structures do not leak into props;
- add exhaustive tests for discriminated variants;
- add lint or architecture rules when the repository supports boundary enforcement;
- prevent server-only modules from being imported into client components;
- prevent test fixtures from being imported by production entry points;
- prevent `NEXT_PUBLIC_*` secrets;
- prevent direct Strapi imports from presentational component directories.

Where practical, add automated dependency-boundary rules, for example:

- `components/**` may import UI types and utilities but not `lib/strapi/**`;
- `lib/strapi/**` must remain server-only;
- `app/**/page.tsx` may compose data functions and presentational components;
- client components may not import server-only modules.

Use the project’s existing ESLint architecture rules or add focused rules without introducing unnecessary tooling.

### 22.8 Strapi query and mapping requirements

For CMS-backed screenshot sections:

1. Inspect the actual Strapi content model.
2. Reuse an existing content type or component when appropriate.
3. Add or change Strapi schemas only when the content cannot be represented correctly.
4. Localize the correct fields.
5. Apply Draft and Publish where applicable.
6. Apply required-field, length, relation, and media validation.
7. Preserve least-privilege public read permissions.
8. Do not grant public create, update, or delete access.

Next.js Strapi queries must:

- run server-side;
- use the internal Docker URL for server-to-server traffic;
- keep API tokens private;
- request only necessary fields;
- explicitly populate only required relations;
- use pagination and maximum limits;
- include the validated locale;
- distinguish published and preview content;
- set request timeouts;
- avoid infinite retries;
- return safe errors;
- use stable cache tags;
- validate responses before mapping them.

Avoid unrestricted production queries such as `populate=*`.

The UI mapper must:

- remove Strapi transport wrappers;
- normalize media URLs;
- normalize optional values;
- convert CMS fields into semantic view-model names;
- omit internal IDs and metadata not needed by the browser;
- preserve stable public IDs where needed;
- produce a type accepted directly by the presentational component.

### 22.9 Strict 24-hour public caching policy

All normal public, published, CMS-backed pages must use a centralized maximum cache lifetime of exactly one day:

```ts
export const PUBLIC_CONTENT_CACHE_SECONDS =
  60 * 60 * 24;
```

The effective value must be:

```text
86,400 seconds
```

Rules:

- Do not repeat unexplained `86400` literals throughout the codebase.
- Apply the policy using APIs compatible with the installed Next.js version.
- Declare or inherit the policy explicitly for every CMS-backed public page.
- Apply cache tags for targeted revalidation.
- Include locale and content identity in tags or cache keys.
- English and Arabic content must never collide in cache identity.
- Cache published content only.
- Do not use `no-store` for normal public CMS pages without a documented requirement.
- Do not use browser storage as a substitute for server caching.
- Do not cache private, authenticated, preview, draft, mutation, webhook, or health-check responses under the public policy.
- Do not expose a cacheable response containing secrets or user-specific data.
- Verify caching in a production build because development behavior differs.

Acceptable mechanisms depend on the actual Next.js version and may include:

```ts
export const revalidate =
  PUBLIC_CONTENT_CACHE_SECONDS;
```

or:

```ts
fetch(url, {
  next: {
    revalidate: PUBLIC_CONTENT_CACHE_SECONDS,
    tags: [contentTag],
  },
});
```

or a compatible framework cache primitive.

Do not assume the exact API before inspecting the installed framework version.

### 22.10 Cache exceptions

The following must not use the normal public 24-hour cache:

- Draft Mode;
- preview pages;
- authenticated private pages;
- user-specific pages;
- mutation handlers;
- webhook handlers;
- health and readiness checks;
- explicitly approved real-time content.

Each exception must have an explicit cache policy and a documented reason.

Preview and draft data must use non-public caching behavior and must never poison the published cache.

### 22.11 Secure on-demand revalidation

The 24-hour cache is a maximum stale period. Relevant Strapi publish/update events should refresh affected content immediately through secure on-demand revalidation.

The revalidation implementation must:

- authenticate Strapi webhook requests;
- validate request content type and body size;
- validate the runtime payload;
- validate content type and locale;
- use timing-safe secret comparison where applicable;
- reject arbitrary paths and arbitrary tags;
- map known content types to approved tags or routes;
- invalidate only affected content where practical;
- avoid global revalidation for local changes;
- remain idempotent;
- log result metadata without secrets;
- return safe status codes;
- include positive and negative tests.

Recommended tag structure:

```text
cms:<content-type>:<locale>
cms:<content-type>:<document-id>:<locale>
page:<route-key>:<locale>
```

Use the repository’s established naming conventions when they already exist.

### 22.12 Screenshot-specific CSS and design-token requirements

All screenshot-derived styling must follow the design system.

Use semantic CSS variables for reusable:

- colors;
- backgrounds;
- foregrounds;
- spacing;
- section padding;
- container width;
- control dimensions;
- media aspect ratios;
- radii;
- shadows;
- type scale;
- line height;
- icon size;
- transitions;
- z-index;
- focus styles.

Do not create screenshot-specific tokens such as:

- `--screenshot-blue`;
- `--figma-card-gray`;
- `--image-347-width`.

Use semantic names that remain meaningful after redesign.

Prefer fluid layout tokens:

```css
:root {
  --section-padding-block:
    clamp(3rem, 7vw, 7rem);
  --section-gap:
    clamp(1.5rem, 4vw, 4rem);
  --content-max-width: 75rem;
}
```

Reuse existing tokens first. Promote repeated arbitrary values into tokens.

### 22.13 Responsive screenshot implementation

Every screenshot-derived section is mobile-first.

At minimum verify:

- 320 × 568;
- 360 × 800;
- 390 × 844;
- 768 × 1024;
- 1024 × 768;
- 1280 × 800;
- 1440 × 900;
- 1920 × 1080;
- 200% browser zoom.

Mandatory behavior:

- no unintended horizontal overflow;
- no clipped text;
- no overlapping controls;
- no desktop-only fixed main widths;
- no essential content removed on mobile;
- stable media aspect ratio;
- safe long-word and URL wrapping;
- usable touch targets;
- correct DOM and reading order;
- correct Arabic text expansion;
- correct LTR and RTL layout;
- responsive navigation and interactions;
- reserved image dimensions to prevent layout shift.

Screenshot fidelity applies at the closest matching viewport. Other viewports must preserve the same design intent rather than scaling the screenshot mechanically.

### 22.14 English, Arabic, and RTL for screenshot sections

Every screenshot-derived public section must support:

- `en`;
- `ar`.

Business content must come from localized Strapi content or translation resources.

The component must not own English-only production content.

Verify:

- `lang`;
- `dir`;
- logical spacing;
- `text-align: start`;
- directional icons;
- navigation direction;
- mixed Arabic and English;
- emails, phone numbers, numbers, and URLs;
- localized image alt text;
- Arabic-capable typography;
- equivalent semantic DOM order.

Do not mirror logos or nondirectional symbols.

### 22.15 Required component states

Implement all applicable states, even when the screenshot shows only the default state:

- loading;
- empty;
- partial optional content;
- error;
- disabled;
- hover;
- focus-visible;
- active;
- selected;
- expanded;
- collapsed;
- missing image;
- missing localized version;
- CMS timeout;
- CMS unavailable.

Do not display fake production content when authoritative data is missing.

Choose and document one safe behavior:

- omit an optional section;
- render a localized empty state;
- render an error boundary;
- return an appropriate status;
- serve framework-approved stale cached content.

### 22.16 Screenshot-section testing requirements

Each meaningful screenshot-derived section requires applicable tests.

#### Component tests

Test:

- minimum valid props;
- full props;
- optional props;
- empty collections when allowed;
- maximum supported item count;
- long English content;
- long Arabic content;
- semantic structure;
- accessible names;
- keyboard interaction;
- RTL behavior;
- each visual variant;
- exhaustive handling.

The component test must not require Strapi or network access.

#### Data-boundary tests

Test:

- valid Strapi response parsing;
- malformed response rejection;
- unknown-field behavior;
- required-field failures;
- locale allowlisting;
- unsafe URL rejection;
- media validation;
- published versus draft behavior;
- correct CMS-to-view-model mapping;
- absence of raw Strapi wrappers in the result.

#### Cache tests

Test:

- public TTL equals `86,400`;
- the centralized constant is used;
- locale-specific cache identity;
- published content caching;
- preview bypass;
- private-data bypass;
- invalid webhook authentication rejection;
- malformed webhook rejection;
- allowlisted targeted revalidation;
- arbitrary tag/path rejection.

#### E2E tests

Use the repository’s established E2E framework, preferably Playwright.

Test:

- English desktop;
- Arabic desktop;
- English mobile;
- Arabic mobile;
- RTL direction;
- screenshot section visibility;
- critical interaction;
- responsive navigation where relevant;
- real or deterministic Strapi-backed data flow;
- safe empty/error behavior where practical;
- no horizontal overflow;
- page metadata where relevant.

Avoid fixed sleeps. Use role-, label-, or stable test-ID-based locators.

#### Visual regression

Where visual testing exists, capture stable snapshots for:

- English desktop;
- Arabic desktop;
- English mobile;
- Arabic mobile;
- dark theme when applicable.

Stabilize or mask genuinely dynamic content.

#### Accessibility tests

Run automated accessibility checks on English and Arabic versions and manually verify keyboard behavior for interactive sections.

### 22.17 Story and fixture rules

When Storybook or an established isolated preview tool exists, add stories for:

- default English;
- default Arabic;
- minimum content;
- maximum content;
- long text;
- missing optional media;
- empty state;
- each supported variant;
- dark mode when applicable.

Fixtures may live only in story, test, seed, or development-only directories.

Production entry points must not import story or test fixtures.

### 22.18 Performance rules for screenshot sections

- Prefer a Server Component for the outer section.
- Isolate `"use client"` to the smallest interactive subtree.
- Do not serialize raw CMS responses to the browser.
- Do not send private CMS metadata to the browser.
- Use the established Next.js image strategy.
- provide width and height or an explicit aspect ratio;
- avoid layout shift;
- avoid duplicate requests;
- avoid client-side fetching when server rendering is suitable;
- avoid unnecessary dependencies;
- verify cache behavior in production mode;
- preserve accessibility and correctness before micro-optimizing.

### 22.19 Screenshot-task completion gate

A screenshot-derived section is `DONE` only when all applicable items pass:

- visual structure matches the screenshot’s intent;
- component is reusable;
- component owns no production data;
- component performs no CMS fetching;
- strict prop types exist;
- external data is runtime validated;
- a CMS-to-view-model mapper exists;
- real page integration exists;
- Strapi content is localized where required;
- English works;
- Arabic works;
- RTL works;
- centralized 24-hour cache policy is applied;
- secure targeted revalidation exists or is verified;
- loading/empty/error behavior is intentional;
- responsive checks pass;
- accessibility checks pass;
- component tests pass;
- data-boundary tests pass;
- cache tests pass;
- E2E tests pass;
- production build passes.

A visually similar but disconnected component is `PARTIAL`, not `DONE`.


