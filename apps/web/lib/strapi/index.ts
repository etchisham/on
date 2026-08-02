export { 
  getPages,
  getPage,
  getPageById,
  getSiteSettings,
  getAuthors,
  getCategories,
  getStrapiMediaUrl,
  validateLocale,
  getStrapiUrl,
} from './client';

export type {
  Page,
  Author,
  Category,
  SiteSettings,
  NavigationItem,
  SocialLink,
  RequestOptions,
  StrapiResponse,
  StrapiLocale,
} from './client';
