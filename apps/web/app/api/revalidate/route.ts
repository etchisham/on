import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'

function safeSecretEqual(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided)
  const expectedBuffer = Buffer.from(expected)
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer)
}

export async function POST(request: Request) {
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET
  const providedSecret = request.headers.get('x-sanity-webhook-secret')

  if (!expectedSecret || !providedSecret || !safeSecretEqual(providedSecret, expectedSecret)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/', 'layout')
  return Response.json({ revalidated: true }, { headers: { 'Cache-Control': 'no-store' } })
}
