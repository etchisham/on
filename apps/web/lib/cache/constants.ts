export const PUBLIC_CONTENT_CACHE_SECONDS = 60 * 60 * 24;

export const CACHE_TAGS = {
  FAQ: 'strapi-faq',
  PAGE: 'strapi-page',
  SITE_SETTINGS: 'strapi-site-setting',
} as const;

export type CacheTag = typeof CACHE_TAGS[keyof typeof CACHE_TAGS];

export function getLocaleAwareCacheTag(baseTag: string, locale: string): string {
  const validLocale = locale === 'en' || locale === 'ar' ? locale : 'en';
  return `${baseTag}-${validLocale}`;
}
