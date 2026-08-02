import { sanityClient } from './client'

export function sanityFetch<T>(query: string, params: Record<string, unknown> = {}) {
  return sanityClient.fetch<T>(query, params, {
    next: { revalidate: 60 },
  })
}
