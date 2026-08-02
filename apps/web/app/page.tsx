const capabilities = [
  {
    number: '01',
    title: 'Composable delivery',
    description: 'Next.js App Router gives teams a fast, typed surface for content-led experiences and APIs.',
  },
  {
    number: '02',
    title: 'Governed content',
    description: 'Sanity schemas keep content structured, reusable, and ready for localization and approval workflows.',
  },
  {
    number: '03',
    title: 'Operational confidence',
    description: 'Health checks, security headers, reproducible containers, and a documented release path start on day one.',
  },
]

export default function HomePage() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" aria-hidden="true" /> Enterprise web foundation</p>
          <h1>Content systems built for <em>momentum.</em></h1>
          <p className="hero-lede">
            A secure, observable starting point for digital products that need to move quickly without making future teams pay for today&apos;s shortcuts.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#capabilities">Explore foundation <span aria-hidden="true">↗</span></a>
            <a className="button button-secondary" href="#operating-model">See operating model</a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Platform status">
          <div className="panel-topline"><span>Platform status</span><span className="live-label"><span className="live-dot" aria-hidden="true" /> Live</span></div>
          <div className="signal-graph" aria-hidden="true">
            <span className="graph-line graph-line-one" />
            <span className="graph-line graph-line-two" />
            <span className="graph-line graph-line-three" />
            <span className="graph-node node-one" />
            <span className="graph-node node-two" />
            <span className="graph-node node-three" />
            <span className="graph-node node-four" />
          </div>
          <div className="panel-metrics">
            <div><strong>99.95%</strong><span>availability target</span></div>
            <div><strong>&lt;300ms</strong><span>response budget</span></div>
          </div>
        </div>
      </section>

      <section className="metrics-strip" aria-label="Platform principles">
        <div className="container metrics-grid">
          <div><strong>Secure</strong><span>defense in depth</span></div>
          <div><strong>Typed</strong><span>contracts at boundaries</span></div>
          <div><strong>Observable</strong><span>signals before incidents</span></div>
          <div><strong>Portable</strong><span>self-hostable runtime</span></div>
        </div>
      </section>

      <section id="capabilities" className="section container">
        <div className="section-heading">
          <p className="eyebrow">The foundation</p>
          <h2>Less ceremony. More signal.</h2>
          <p>Practical defaults that keep product, content, and platform teams moving in the same direction.</p>
        </div>
        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article className="capability-card" key={capability.number}>
              <span className="card-number">{capability.number}</span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="operating-model" className="operating-section">
        <div className="container operating-grid">
          <div>
            <p className="eyebrow">Operating model</p>
            <h2>Make the safe path the fast path.</h2>
          </div>
          <div className="principles-list">
            <div><span>01</span><p>Content stays in its system of record. Experiences stay composable.</p></div>
            <div><span>02</span><p>Secrets stay server-side. Public configuration stays intentionally public.</p></div>
            <div><span>03</span><p>Every deploy has a health check, a rollback path, and an owner.</p></div>
          </div>
        </div>
      </section>

      <section id="contact" className="closing-section container">
        <p className="eyebrow">Ready when you are</p>
        <h2>Build the next version with room to grow.</h2>
        <a className="button button-primary" href="mailto:hello@example.com">Start a conversation <span aria-hidden="true">↗</span></a>
      </section>
    </>
  )
}
