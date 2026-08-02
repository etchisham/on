import { timingSafeEqual } from 'node:crypto'
import { revalidatePath, revalidateTag } from 'next/cache'

function safeSecretEqual(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided)
  const expectedBuffer = Buffer.from(expected)
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  )
}

interface StrapiWebhookPayload {
  event: string
  model: string
  entry: {
    id: number
    documentId: string
    slug?: string
    locale?: string
  }
  createdAt: string
  updatedAt: string
}

const ALLOWED_MODELS = new Set(['page', 'site-setting'])
const LOCALE_TO_ROUTE: Record<string, string> = {
  en: '',
  ar: '/ar',
}

export async function POST(request: Request) {
  const expectedSecret = process.env.STRAPI_WEBHOOK_SECRET
  const providedSecret = request.headers.get('x-strapi-webhook-secret')

  if (!expectedSecret || !providedSecret || !safeSecretEqual(providedSecret, expectedSecret)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const contentType = request.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return Response.json({ error: 'Invalid content type' }, { status: 400 })
  }

  let payload: StrapiWebhookPayload
  
  try {
    const text = await request.text()
    if (text.length > 10000) {
      return Response.json({ error: 'Payload too large' }, { status: 413 })
    }
    payload = JSON.parse(text)
  } catch {
    return Response.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  if (!payload.event || !payload.model || !payload.entry) {
    return Response.json({ error: 'Invalid payload structure' }, { status: 400 })
  }

  const model = payload.model.replace('api::', '').split('.')[0]
  
  if (!ALLOWED_MODELS.has(model)) {
    return Response.json({ ignored: true, reason: 'Model not watched' }, { status: 200 })
  }

  const locales = new Set<string>()
  
  if (payload.entry.locale) {
    locales.add(payload.entry.locale)
  } else {
    locales.add('en')
    locales.add('ar')
  }

  const revalidatedRoutes: string[] = []
  const revalidationErrors: Array<{ path: string; error: string }> = []

  for (const locale of locales) {
    const localePrefix = LOCALE_TO_ROUTE[locale] ?? ''

    try {
      revalidatePath(localePrefix || '/', 'layout')
      revalidatedRoutes.push(localePrefix || '/')
    } catch (error) {
      revalidationErrors.push({
        path: localePrefix || '/',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    if (model === 'page' && payload.entry.slug) {
      const pagePath = payload.entry.slug === 'home' || payload.entry.slug === '/' 
        ? localePrefix || '/'
        : `${localePrefix}/${payload.entry.slug}`
      
      try {
        revalidatePath(pagePath, 'page')
        revalidatedRoutes.push(pagePath)
      } catch (error) {
        revalidationErrors.push({
          path: pagePath,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    const tagName = `strapi-${model}-${locale}`
    try {
      revalidateTag(tagName, 'default')
      revalidatedRoutes.push(`tag:${tagName}`)
    } catch (error) {
      revalidationErrors.push({
        path: `tag:${tagName}`,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  if (revalidationErrors.length > 0) {
    console.error('Strapi webhook revalidation errors:', {
      eventId: request.headers.get('x-request-id') ?? 'unknown',
      model,
      errors: revalidationErrors,
    })
  }

  return Response.json(
    {
      revalidated: revalidatedRoutes.length > 0,
      routes: revalidatedRoutes,
      errors: revalidationErrors.length > 0 ? revalidationErrors : undefined,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'X-Request-Id': request.headers.get('x-request-id') ?? crypto.randomUUID(),
      },
    },
  )
}

export async function GET() {
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}
