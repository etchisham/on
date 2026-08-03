import 'server-only';

import { 
  validateFaqItems, 
  isValidLocale,
  type ValidatedFaqItem,
} from '@/lib/validation';
import { 
  PUBLIC_CONTENT_CACHE_SECONDS, 
  CACHE_TAGS,
  getLocaleAwareCacheTag,
} from '@/lib/cache';

type StrapiLocale = 'en' | 'ar';

function getStrapiUrl(): string {
  const url = process.env.STRAPI_PUBLIC_URL ?? 'http://localhost:1337';
  return url.replace(/\/$/, '');
}

async function fetchWithCache<T>(
  url: string, 
  locale: StrapiLocale
): Promise<T> {
  const token = process.env.STRAPI_API_TOKEN;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers,
    next: {
      revalidate: PUBLIC_CONTENT_CACHE_SECONDS,
      tags: [getLocaleAwareCacheTag(CACHE_TAGS.FAQ, locale)],
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Check STRAPI_API_TOKEN');
    }
    if (response.status >= 500) {
      throw new Error('Strapi unavailable');
    }
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function mapFaqToData(info: ValidatedFaqItem) {
  return {
    id: info.documentId,
    question: info.question,
    answer: info.answer,
    sortOrder: info.sortOrder,
  };
}

export async function getFaqs(locale: string = 'en') {
  const validatedLocale: StrapiLocale = isValidLocale(locale) ? locale : 'en';
  
  const strapiUrl = getStrapiUrl();
  const url = `${strapiUrl}/api/faqs?locale=${validatedLocale}&sort[0]=sortOrder&filters[publishedAt][$ne]=null`;

  try {
    const response = await fetchWithCache<{ data: unknown[] }>(url, validatedLocale);
    const validated = validateFaqItems(response.data);
    
    return validated
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(mapFaqToData);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to fetch FAQs:', error);
    }
    return [];
  }
}

export type { ValidatedFaqItem };
