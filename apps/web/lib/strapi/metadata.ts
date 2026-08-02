import { Metadata } from 'next'
import { getSiteSettings } from '@/lib/strapi/client'
import { getStrapiUrl } from '@/lib/strapi/client'

export async function generateOGImage(ogImageUrl: string | undefined): Promise<string | undefined> {
  if (!ogImageUrl) return undefined
  if (ogImageUrl.startsWith('http')) return ogImageUrl
  return `${getStrapiUrl()}${ogImageUrl}`
}

export async function buildPageMetadata(locale: 'en' | 'ar' = 'en'): Promise<Metadata> {
  const siteSettings = await getSiteSettings(locale)
  
  if (!siteSettings) {
    return {
      title: {
        default: 'Northstar | Enterprise content platform',
        template: '%s | Northstar',
      },
      description: 'A secure, resilient foundation for enterprise digital experiences.',
    }
  }

  return {
    title: {
      default: siteSettings.title,
      template: `%s | ${siteSettings.title}`,
    },
    description: siteSettings.description,
    openGraph: {
      title: siteSettings.title,
      description: siteSettings.description,
      images: siteSettings.ogImage ? [{ url: siteSettings.ogImage.url }] : undefined,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteSettings.title,
      description: siteSettings.description,
      site: siteSettings.twitterSite,
      images: siteSettings.ogImage ? [siteSettings.ogImage.url] : undefined,
    },
  }
}

export async function buildAlternateLocaleLinks(locale: 'en' | 'ar'): Promise<{ language: string; href: string; title?: string }[]> {
  const opposite = locale === 'en' ? 'ar' : 'en'
  const otherSettings = await getSiteSettings(opposite)
  
  return otherSettings ? [{ language: opposite, href: `${otherSettings.siteUrl || ''}/${opposite}` }] : []
}
