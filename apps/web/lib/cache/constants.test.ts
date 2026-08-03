import { PUBLIC_CONTENT_CACHE_SECONDS, CACHE_TAGS, getLocaleAwareCacheTag } from './constants';

describe('Cache Constants', () => {
  describe('PUBLIC_CONTENT_CACHE_SECONDS', () => {
    it('equals exactly 24 hours in seconds', () => {
      expect(PUBLIC_CONTENT_CACHE_SECONDS).toBe(86400);
    });

    it('is calculated from 60 * 60 * 24', () => {
      expect(PUBLIC_CONTENT_CACHE_SECONDS).toBe(60 * 60 * 24);
    });
  });

  describe('CACHE_TAGS', () => {
    it('contains FAQ tag', () => {
      expect(CACHE_TAGS.FAQ).toBe('strapi-faq');
    });

    it('contains PAGE tag', () => {
      expect(CACHE_TAGS.PAGE).toBe('strapi-page');
    });

    it('contains SITE_SETTINGS tag', () => {
      expect(CACHE_TAGS.SITE_SETTINGS).toBe('strapi-site-setting');
    });
  });

  describe('getLocaleAwareCacheTag', () => {
    it('appends en locale to tag', () => {
      expect(getLocaleAwareCacheTag('strapi-faq', 'en')).toBe('strapi-faq-en');
    });

    it('appends ar locale to tag', () => {
      expect(getLocaleAwareCacheTag('strapi-faq', 'ar')).toBe('strapi-faq-ar');
    });

    it('defaults to en for invalid locale', () => {
      expect(getLocaleAwareCacheTag('strapi-faq', 'de')).toBe('strapi-faq-en');
    });

    it('defaults to en for empty string', () => {
      expect(getLocaleAwareCacheTag('strapi-faq', '')).toBe('strapi-faq-en');
    });
  });
});
