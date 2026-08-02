import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container closing-section" aria-labelledby="not-found-title">
      <p className="eyebrow">404</p>
      <h1 id="not-found-title">Page not found.</h1>
      <Link className="button button-primary" href="/">Return home</Link>
    </section>
  )
}
