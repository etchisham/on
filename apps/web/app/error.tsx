'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Unexpected application error', { digest: error.digest })
  }, [error])

  return (
    <section className="container closing-section" aria-labelledby="error-title">
      <p className="eyebrow">Something went wrong</p>
      <h1 id="error-title">We hit a temporary problem.</h1>
      <button className="button button-primary" type="button" onClick={() => reset()}>Try again</button>
    </section>
  )
}
