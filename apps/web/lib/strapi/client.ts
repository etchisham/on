import 'server-only'

type StrapiLocale = 'en' | 'ar'

const ALLOWED_LOCALES: readonly StrapiLocale[] = ['en', 'ar'] as const

function validateLocale(locale: string): StrapiLocale {
  if (!ALLOWED_LOCALES.includes(locale as StrapiLocale)) {
    throw new Error(`Invalid locale: ${locale}. Allowed: ${ALLOWED_LOCALES.join(', ')}`)
  }
  return locale as StrapiLocale
}

function getStrapiUrl(): string {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_API_URL || 'http://localhost:1337'
  return url.replace(/\/$/, '')
}

function isTimeout(err: unknown): boolean {
  return err instanceof Error && (
    err.name === 'AbortError' ||
    err.message.includes('timeout') ||
    err.message.includes('ETIMEDOUT')
  )
}

type StrapiError = {
  error?: { status?: number; message?: string }
}

type StrapiResponse<T> = {
  data: T
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } }
}

type RequestOptions = {
  populate?: string
  fields?: string[]
  filters?: Record<string, unknown>
  sort?: string
  pagination?: { page?: number; pageSize?: number }
  locale?: StrapiLocale
}

async function fetchStrapi<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<StrapiResponse<T>> {
  const { populate = '*', fields, filters, sort, pagination, locale } = options
  const url = getStrapiUrl()
  const token = process.env.STRAPI_API_TOKEN

  const params = new URLSearchParams()
  
  if (populate) params.set('populate', populate)
  if (fields && fields.length > 0) fields.forEach(f => params.append('fields', f))
  if (filters) Object.entries(filters).forEach(([key, value]) => {
    params.set(`filters[${key}]`, String(value))
  })
  if (sort) params.set('sort', sort)
  if (locale) params.set('locale', locale)
  if (pagination) {
    if (pagination.page) params.set('pagination[page]', String(pagination.page))
    if (pagination.pageSize) params.set('pagination[pageSize]', String(pagination.pageSize))
  }

  const queryString = params.toString()
  const fullUrl = `${url}/api${endpoint}${queryString ? `?${queryString}` : ''}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const response = await fetch(fullUrl, {
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    } as RequestInit)

    if (!response.ok) {
      const error = await response.json().catch(() => null) as StrapiError | null
      
      if (response.status === 401) {
        throw new Error(`Unauthorized: Check STRAPI_API_TOKEN configuration`)
      }
      if (response.status === 404) {
        throw new Error(`Not found: ${endpoint}`)
      }
      if (response.status >= 500) {
        console.error('Strapi server error', { status: response.status, endpoint })
        throw new Error(`Strapi unavailable`)
      }
      
      throw new Error(
        error?.error?.message || `Request failed with status ${response.status}`
      )
    }

    return response.json().catch(() => {
      console.error(`Failed to parse JSON response from ${endpoint}`)
      throw new Error(`Invalid JSON response from Strapi`)
    })
  } catch (err: unknown) {
    if (isTimeout(err)) {
      console.error(`Strapi request timeout for ${endpoint}`)
      throw new Error(`Request timeout`)
    }
    if (err instanceof Error) throw err
    throw new Error('Unknown error fetching from Strapi')
  }
}

export type Page = {
  documentId: string
  title: string
  slug: string
  seoTitle?: string
  seoDescription?: string
  body?: string
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: { url: string; width?: number; height?: number; alt?: string }
  publishedAt?: string
  locale?: string
  author?: Author
  categories?: Category[]
}

export type Author = {
  documentId: string
  name: string
  slug: string
  email?: string
  bio?: string
  avatar?: { url: string; width?: number; height?: number; alt?: string }
}

export type Category = {
  documentId: string
  name: string
  slug: string
  description?: string
}

export type SiteSettings = {
  title: string
  description: string
  siteUrl?: string
  logo?: { url: string; width?: number; height?: number; alt?: string }
  favicon?: { url: string }
  ogImage?: { url: string; width?: number; height?: number }
  twitterSite?: string
  contactEmail?: string
  contactPhone?: string
  defaultLocale?: StrapiLocale
  navigation?: { items: NavigationItem[] }
  socialLinks?: SocialLink[]
}

export type NavigationItem = {
  label: string
  href: string
  target?: '_self' | '_blank'
  icon?: string
  children?: NavigationItem[]
}

export type SocialLink = {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'github'
  url: string
  handle?: string
}

export async function getPages(locale: StrapiLocale = 'en'): Promise<Page[]> {
  const safeLocale = validateLocale(locale)
  const response = await fetchStrapi<Page[]>('/pages', { locale: safeLocale })
  return response.data
}

export async function getPage(slug: string, locale: StrapiLocale = 'en'): Promise<Page | null> {
  const safeLocale = validateLocale(locale)
  const response = await fetchStrapi<Page[]>('/pages', {
    locale: safeLocale,
    filters: { slug: { $eq: slug } },
  })
  return response.data[0] ?? null
}

export async function getPageById<T extends string>(id: T, locale: StrapiLocale = 'en'): Promise<Page | null> {
  const safeLocale = validateLocale(locale)
  try {
    const response = await fetchStrapi<Page>(`/pages/${id}`, { locale: safeLocale })
    return response.data ?? null
  } catch {
    return null
  }
}

export async function getSiteSettings(locale: StrapiLocale = 'en'): Promise<SiteSettings | null> {
  const safeLocale = validateLocale(locale)
  const response = await fetchStrapi<SiteSettings>('/site-setting', { locale: safeLocale })
  return response.data ?? null
}

export async function getAuthors(locale: StrapiLocale = 'en'): Promise<Author[]> {
  const safeLocale = validateLocale(locale)
  const response = await fetchStrapi<Author[]>('/authors', { locale: safeLocale })
  return response.data
}

export async function getCategories(locale: StrapiLocale = 'en'): Promise<Category[]> {
  const safeLocale = validateLocale(locale)
  const response = await fetchStrapi<Category[]>('/categories', { locale: safeLocale })
  return response.data
}

export async function getStrapiMediaUrl(url: string): Promise<string> {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const strapiUrl = getStrapiUrl()
  return `${strapiUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

export { validateLocale, getStrapiUrl }
export type { RequestOptions, StrapiResponse, StrapiLocale }
