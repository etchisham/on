# Screenshot Section Implementation Prompt — Tailwind CSS Only

The attached screenshot is the exact section to implement. Use it as the visual reference.

`AGENTS.md` is the binding authority for architecture, data flow, caching, security, accessibility, responsiveness, localization, testing, and completion.

## Primary styling rule

Implement all page-level and component-level styling with Tailwind CSS utilities.

Do not create ordinary CSS rules for the section.

Do not use:

* CSS Modules;
* Sass or SCSS;
* Less;
* styled-components;
* Emotion;
* inline `style` objects;
* `<style jsx>`;
* component-specific global CSS;
* manually written utility classes outside Tailwind;
* JavaScript-generated CSS;
* arbitrary CSS files for the new section.

Minimal global CSS is allowed only for:

* Tailwind imports or directives;
* global CSS resets that Tailwind does not provide;
* semantic CSS custom properties used as Tailwind design tokens;
* font-face declarations when locally hosted fonts are already approved;
* unavoidable third-party library overrides;
* global browser behavior that cannot reasonably be expressed using Tailwind.

Do not use global CSS to style the screenshot section itself.

## Task

Implement the screenshot section completely in the current repository using Tailwind CSS.

Do not return only a plan, mockup, sample component, code snippet, or suggested implementation.

Inspect the repository, make the required changes, connect the real data path, run all relevant tests, and report verified results.

## Mandatory first actions

1. Read `AGENTS.md` completely, including section 22.
2. Inspect:

   * the target page and layout;
   * existing related components;
   * the installed Tailwind version;
   * Tailwind configuration and theme declarations;
   * PostCSS configuration;
   * global CSS;
   * existing design tokens and CSS custom properties;
   * existing Tailwind utility conventions;
   * shared class-merging helpers such as `cn`, `clsx`, or `tailwind-merge`;
   * shadcn/ui configuration and components, when present;
   * locale routing and translations;
   * Strapi schemas and data-access code;
   * cache helpers and webhook revalidation;
   * tests and Playwright configuration;
   * installed Next.js, React, TypeScript, Tailwind, PostCSS, and Strapi versions.
3. Determine whether the repository uses Tailwind CSS v3 or v4.
4. Follow the conventions appropriate for the installed Tailwind version. Do not replace or downgrade the installed version without a demonstrated compatibility need.
5. Identify:

   * the exact screenshot component boundaries;
   * existing repository components that should be reused;
   * existing Tailwind tokens and utilities that should be reused;
   * any legacy CSS affecting the target page.
6. State a short repository-grounded plan, then implement it without stopping for confirmation.

## Tailwind implementation requirements

All visual styling for the new section must be implemented through Tailwind classes.

### Required practices

* Reuse the repository’s existing Tailwind theme and semantic tokens.
* Prefer semantic token utilities such as:

   * `bg-background`;
   * `text-foreground`;
   * `text-muted-foreground`;
   * `border-border`;
   * `bg-card`;
   * `text-primary`;
   * `ring-ring`.
* Use the existing `cn`, `clsx`, or equivalent helper for conditional classes.
* Use `tailwind-merge` when it is already part of the repository’s conventions.
* Use Tailwind responsive variants rather than CSS media queries.
* Use Tailwind state variants for:

   * hover;
   * focus;
   * focus-visible;
   * active;
   * disabled;
   * expanded and collapsed states;
   * selected states;
   * group and peer interactions.
* Use Tailwind dark-mode variants if the repository supports dark mode.
* Use Tailwind motion variants such as `motion-reduce:` when animation or transition is present.
* Use logical and direction-aware utilities for LTR and RTL.
* Use `rtl:` and `ltr:` variants when supported by the installed Tailwind setup.
* Prefer logical alignment and layout approaches over hardcoded left/right positioning.
* Keep class names readable and grouped consistently with repository conventions.
* Extract reusable components or variants when long class strings are repeated.
* Use Class Variance Authority when it is already the repository convention for component variants.

### Prohibited practices

Do not:

* create a new CSS Module;
* add section selectors to `globals.css`;
* translate Tailwind classes into ordinary CSS;
* use inline styles to reproduce screenshot measurements;
* use arbitrary values for most of the implementation;
* create one-off Tailwind theme values for every screenshot measurement;
* use dynamic class-name construction that Tailwind cannot statically detect;
* use broad safelist patterns to conceal dynamic class-generation problems;
* duplicate existing design tokens;
* hardcode repeated colors directly in class names when semantic tokens exist;
* use `!important` unless required for a documented third-party override;
* use absolute positioning as the main layout method when Grid or Flexbox can reproduce the layout;
* modify shared Tailwind tokens in a way that causes unrelated visual regressions.

### Arbitrary-value policy

Tailwind arbitrary values such as `w-[...]`, `tracking-[...]`, or `shadow-[...]` are allowed only when all of the following are true:

1. The value is genuinely unique to the design.
2. An existing Tailwind scale value or repository token cannot represent it accurately.
3. Reusing the value is unlikely.
4. Its use does not hide a missing reusable design token.
5. The final report explains why it was necessary.

When a visual value occurs repeatedly, add or reuse a semantic Tailwind token instead of repeating arbitrary values.

## Screenshot-specific requirements

Use the screenshot to reproduce:

* content hierarchy;
* relative spacing;
* typography hierarchy;
* alignment;
* imagery;
* borders and radii;
* responsive intent;
* interaction states;
* visual emphasis.

Do not use the screenshot as a background image.

Build semantic, accessible HTML and real reusable components.

Do not treat every pixel in the screenshot as a hardcoded absolute value. Infer a coherent responsive layout and implement it using Tailwind’s Grid, Flexbox, spacing scale, typography utilities, container utilities, and responsive variants.

When the screenshot does not show a mobile, Arabic, RTL, loading, empty, error, hover, focus, or disabled state, design those states consistently with the repository and `AGENTS.md`.

## Component boundary

Create reusable presentational components that:

* receive all business content through strict typed props;
* contain no production data;
* perform no `fetch`;
* import no Strapi client;
* read no environment variables;
* receive no raw Strapi response;
* support English and Arabic;
* support LTR and RTL;
* remain independently component-testable;
* expose intentional variants rather than accepting unrestricted styling overrides;
* use Tailwind classes internally;
* accept `className` only when composition requires it and when the repository convention permits it.

Use the required flow:

```text
Strapi
  → server-only data-access function
  → runtime schema validation
  → mapper/view model
  → page or server container
  → presentational component props
```

Do not connect Strapi directly to a client component.

Do not add `"use client"` unless the component genuinely needs client-side state, effects, or browser APIs.

Keep static presentational components as Server Components whenever possible.

## Strict data contract

Implement:

* named strict TypeScript prop types;
* readonly props and arrays;
* explicit optional and nullable fields;
* no broad `any`;
* discriminated unions for variants;
* exhaustive variant handling;
* runtime validation for external Strapi data;
* URL, locale, media, array-size, and string-length validation;
* a mapper that removes Strapi transport wrappers and internal metadata.

Add tests that:

* reject malformed external data;
* verify mapper behavior;
* prove that the component receives only the intended view model;
* verify every supported discriminated-union variant;
* prevent raw Strapi objects from reaching presentational components.

## Strapi integration

Use the existing self-hosted Strapi architecture.

* Reuse existing content types when appropriate.
* Add or update schemas only when required by the screenshot’s content.
* Localize all translatable fields.
* Request only necessary fields and relations.
* Avoid unrestricted `populate=*`.
* Keep tokens server-only.
* Use published content for normal pages.
* Keep preview and draft content isolated.
* Add deterministic seed or test content when needed for E2E tests.
* Do not place fallback production content directly inside the presentational component.

## Strict one-day caching

Every normal public CMS-backed page changed by this task must use the centralized cache constant:

```ts
PUBLIC_CONTENT_CACHE_SECONDS = 60 * 60 * 24
```

The effective TTL must be exactly `86,400` seconds.

Requirements:

* apply the policy using APIs compatible with the installed Next.js version;
* use locale-aware cache identity;
* add targeted cache tags;
* do not cache preview, draft, private, authenticated, mutation, webhook, or health-check responses under the public policy;
* verify secure Strapi webhook revalidation;
* reject arbitrary paths or tags;
* test the TTL, locale separation, preview bypass, and webhook authentication.

## Design-token implementation

* Reuse existing semantic Tailwind tokens.
* Reuse existing CSS custom properties through Tailwind utilities.
* Add semantic reusable tokens only when the screenshot introduces a genuinely reusable design concept.
* Do not create tokens named after the screenshot or a specific page.
* Do not hardcode repeated colors, sizes, spacing, shadows, radii, or transitions.
* Preserve dark mode when present.
* Keep the section reusable rather than screenshot-specific in its naming.
* Do not replace semantic tokens with raw color utilities without a documented reason.
* Do not introduce duplicate color systems between global CSS and Tailwind.

Examples of acceptable semantic token names include:

* `surface-elevated`;
* `content-subtle`;
* `section-gap`;
* `card-radius`;
* `interactive-ring`.

Examples of unacceptable screenshot-specific token names include:

* `faq-screenshot-blue`;
* `homepage-section-3-gap`;
* `desktop-card-427-width`.

## Responsive and localization requirements

Verify:

* 320 × 568;
* 360 × 800;
* 390 × 844;
* 768 × 1024;
* 1024 × 768;
* 1280 × 800;
* 1440 × 900;
* 1920 × 1080;
* 200% zoom;
* English LTR;
* Arabic RTL.

Use Tailwind responsive variants for all breakpoint behavior.

There must be no:

* unintended horizontal overflow;
* clipped text;
* overlapping content;
* broken touch targets;
* inaccessible text scaling;
* incorrect directional behavior;
* hardcoded left or right spacing that breaks RTL;
* layout that works only at the exact screenshot width.

Do not create a separate Arabic component merely to reverse the layout.

Use shared semantic markup with direction-aware Tailwind behavior.

## Accessibility requirements

Implement and verify:

* correct semantic landmarks and heading order;
* accessible names;
* keyboard operation;
* visible `focus-visible` states implemented with Tailwind;
* appropriate ARIA only where native HTML is insufficient;
* reduced-motion behavior;
* sufficient text and interactive-state contrast;
* minimum usable touch-target sizes;
* screen-reader behavior for dynamic content;
* correct expanded and collapsed state announcements where applicable;
* no accessibility regression caused by visually matching the screenshot.

## Testing requirements

Add or update:

* component tests;
* runtime validation tests;
* mapper tests;
* cache-policy tests;
* webhook revalidation tests;
* Playwright E2E tests for English and Arabic;
* desktop and mobile E2E coverage;
* automated accessibility checks;
* visual regression tests when the repository supports them.

Also test that:

* the component renders without relying on the screenshot;
* important states use the expected Tailwind classes or produce the intended computed result;
* English and Arabic layouts preserve the same component contract;
* RTL ordering and directional icons are correct;
* no target section styling depends on a newly added ordinary CSS selector;
* production builds include all required Tailwind classes;
* no dynamic Tailwind class is accidentally removed during production compilation.

Do not:

* use fixed sleeps;
* skip failing tests;
* weaken assertions merely to obtain a passing build;
* update visual snapshots without reviewing the changes;
* use production fixtures inside the component;
* use mocked success results as proof of production readiness.

## Completion requirements

Do not stop after creating the component.

Complete:

1. reusable component;
2. strict prop types;
3. Tailwind-only component styling;
4. external runtime validation;
5. Strapi query;
6. mapper and view model;
7. page integration;
8. localized content;
9. 24-hour caching;
10. targeted revalidation;
11. responsive styling;
12. RTL behavior;
13. loading, empty, and error states;
14. component and integration tests;
15. production build verification;
16. relevant Docker and runtime verification;
17. inspection for CSS rules that should not have been introduced;
18. visual comparison against the screenshot.

## Mandatory final audit

Before reporting completion:

1. Search all changed files for:

   * `.module.css`;
   * `.scss`;
   * `.sass`;
   * `<style`;
   * `style={{`;
   * `styled-components`;
   * Emotion;
   * newly added section selectors in global CSS.
2. Confirm that all section styling is implemented with Tailwind.
3. Check for excessive arbitrary Tailwind values.
4. Check for repeated class groups that should be extracted.
5. Check that Tailwind production compilation detects every class.
6. Check the target page in English and Arabic.
7. Check all required viewport sizes.
8. Run the repository’s full supported quality and production-build commands.
9. Do not report `DONE` when any required check is skipped, failing, mocked, or unverified.

## Final report

Report the following.

### Status

Use exactly one:

* `DONE`;
* `PARTIAL`;
* `BLOCKED`.

### Screenshot interpretation

Document:

* hierarchy;
* component boundaries;
* responsive decisions;
* variants;
* behavior inferred for states not shown in the screenshot.

### Tailwind implementation

Document:

* installed Tailwind version;
* configuration approach;
* semantic tokens reused;
* tokens added;
* responsive variants used;
* RTL strategy;
* dark-mode behavior;
* arbitrary values used and the justification for each one;
* confirmation that no component-specific CSS was added.

### Data flow

Show the implemented path:

```text
Strapi
  → validation
  → mapping
  → server container
  → strict component props
  → Tailwind-styled presentational component
```

### Files changed

List every material changed file and its purpose.

### Prop and validation contract

Document:

* final view model;
* component props;
* runtime schemas;
* nullable and optional behavior;
* supported variants.

### Caching

State:

* centralized constant;
* exact TTL;
* pages and functions using it;
* cache tags;
* locale isolation;
* preview exception;
* webhook authentication and behavior.

### Verification

Provide:

* exact commands;
* exit codes;
* test counts;
* build result;
* lint result;
* type-check result;
* E2E result;
* accessibility result;
* relevant Docker or runtime result.

Do not write only “tests passed.”

### Responsive, RTL, and accessibility evidence

List every tested viewport and outcome.

Report English LTR and Arabic RTL separately.

### CSS and Tailwind audit

Report:

* newly added CSS files;
* newly added ordinary CSS selectors;
* remaining inline styles;
* remaining CSS Modules affecting the section;
* arbitrary Tailwind values;
* dynamic class handling;
* whether production class generation was verified.

The expected result for new CSS files and new section selectors is zero unless an unavoidable exception is explicitly documented.

### Remaining work

For every incomplete item, state:

* blocker;
* exact next action;
* production impact;
* affected files or systems.

Do not mark the task `DONE` solely because the rendered desktop section resembles the screenshot.

Do not mark it `DONE` if the implementation uses ordinary CSS instead of Tailwind, even when the visual output is correct.
