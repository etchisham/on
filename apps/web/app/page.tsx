import { FaqAccordion, type FaqItemViewModel } from '@/components/faq-accordion';
import { getFaqs } from '@/lib/strapi/faq';

const capabilities = [
  {
    number: '01',
    title: 'Composable delivery',
    description: 'Next.js App Router gives teams a fast, typed surface for content-led experiences and APIs.',
  },
  {
    number: '02',
    title: 'Governed content',
    description: 'Strapi schemas keep content structured, reusable, and ready for localization and approval workflows.',
  },
  {
    number: '03',
    title: 'Operational confidence',
    description: 'Health checks, security headers, reproducible containers, and a documented release path start on day one.',
  },
]

export default async function HomePage() {
  let faqItems: FaqItemViewModel[] = [];
  
  try {
    const faqs = await getFaqs('en');
    faqItems = faqs.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    }));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to load FAQs:', error);
    }
  }

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-clamp(2rem,8vw,8rem) items-center pt-clamp(4rem,10vw,8rem) pb-clamp(4rem,10vw,8rem) container">
        <div className="max-w-[47rem]">
          <p className="eyebrow"><span className="statusdot" aria-hidden="true" /> Enterprise web foundation</p>
          <h1 className="max-w-[13ch] mb-6 text-clamp(3.3rem,7.5vw,7rem) font-medium">
            Content systems built for <em className="text-brand font-serif font-normal">momentum.</em>
          </h1>
          <p className="max-w-[36rem] mb-8 text-ink-muted text-clamp(1.05rem,1.6vw,1.3rem)">
            A secure, observable starting point for digital products that need to move quickly without making future teams pay for today&apos;s shortcuts.
          </p>
          <div className="flex flex-wrap gap-3">
            <a className="btn btnprimary" href="#capabilities">Explore foundation <span aria-hidden="true">↗</span></a>
            <a className="btn btnsecondary" href="#operating-model">See operating model</a>
          </div>
        </div>
        <div className="min-h-[24rem] p-6 border border-line rounded-radius-lg bg-surface shadow-panel" aria-label="Platform status">
          <div className="flex justify-between gap-4 text-ink-muted text-xs font-bold tracking-widest uppercase">
            <span>Platform status</span>
            <span className="text-brand"><span className="livedot" aria-hidden="true" /> Live</span>
          </div>
          <div className="relative h-[13rem] my-8 overflow-hidden border-b border-line bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3.1rem,var(--color-line)_3.15rem)]" aria-hidden="true">
            <span className="absolute h-0.5 origin-left bg-brand left-[8%] top-[69%] w-[30%] -rotate-[28deg]" />
            <span className="absolute h-0.5 origin-left bg-brand left-[37%] top-[55%] w-[30%] rotate-[21deg]" />
            <span className="absolute h-0.5 origin-left bg-brand left-[66%] top-[66%] w-[28%] -rotate-[37deg]" />
            <span className="absolute w-2.5 h-2.5 border-3 border-surface rounded-full bg-accent shadow-[0_0_0_2px_var(--color-accent)] left-[7%] top-[66%]" />
            <span className="absolute w-2.5 h-2.5 border-3 border-surface rounded-full bg-accent shadow-[0_0_0_2px_var(--color-accent)] left-[36%] top-[52%]" />
            <span className="absolute w-2.5 h-2.5 border-3 border-surface rounded-full bg-accent shadow-[0_0_0_2px_var(--color-accent)] left-[65%] top-[63%]" />
            <span className="absolute w-2.5 h-2.5 border-3 border-surface rounded-full bg-accent shadow-[0_0_0_2px_var(--color-accent)] right-[3%] top-[45%]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1"><strong className="text-2xl tracking-tight">99.95%</strong><span className="text-ink-muted text-xs">availability target</span></div>
            <div className="flex flex-col gap-1"><strong className="text-2xl tracking-tight">&lt;300ms</strong><span className="text-ink-muted text-xs">response budget</span></div>
          </div>
        </div>
      </section>

      <section className="border-t border-b border-line bg-surface-muted" aria-label="Platform principles">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-4 py-5">
          <div className="flex flex-col gap-1"><strong className="text-sm font-bold">Secure</strong><span className="text-ink-muted text-xs">defense in depth</span></div>
          <div className="flex flex-col gap-1"><strong className="text-sm font-bold">Typed</strong><span className="text-ink-muted text-xs">contracts at boundaries</span></div>
          <div className="flex flex-col gap-1"><strong className="text-sm font-bold">Observable</strong><span className="text-ink-muted text-xs">signals before incidents</span></div>
          <div className="flex flex-col gap-1"><strong className="text-sm font-bold">Portable</strong><span className="text-ink-muted text-xs">self-hostable runtime</span></div>
        </div>
      </section>

      <section id="capabilities" className="py-clamp(5rem,10vw,9rem) container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mb-14">
          <div>
            <p className="eyebrow mb-0">The foundation</p>
            <h2 className="mb-0 text-clamp(2.5rem,5vw,4.5rem)">Less ceremony. More signal.</h2>
          </div>
          <p className="max-w-[25rem] mb-0 text-ink-muted">Practical defaults that keep product, content, and platform teams moving in the same direction.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {capabilities.map((capability) => (
            <article className="relative min-h-[20rem] md:min-h-[20rem] p-6 border-t border-ink" key={capability.number}>
              <span className="text-brand text-xs font-extrabold">{capability.number}</span>
              <h3 className="max-w-[10ch] mt-20 md:mt-20 mb-4 text-3xl">{capability.title}</h3>
              <p className="max-w-[19rem] mb-0 text-ink-muted text-sm">{capability.description}</p>
              <span className="absolute top-5 right-4 text-brand text-xl" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="operating-model" className="py-clamp(4rem,9vw,7rem) bg-brand text-bg">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div>
            <p className="eyebrow text-accent">Operating model</p>
            <h2 className="max-w-[9ch] mb-0 text-clamp(2.8rem,6vw,5rem)">Make the safe path the fast path.</h2>
          </div>
          <div className="border-t border-white/35">
            <div className="grid grid-cols-[3rem_1fr] gap-4 py-5 border-b border-white/35">
              <span className="text-accent text-xs font-extrabold">01</span>
              <p className="mb-0 text-lg">Content stays in its system of record. Experiences stay composable.</p>
            </div>
            <div className="grid grid-cols-[3rem_1fr] gap-4 py-5 border-b border-white/35">
              <span className="text-accent text-xs font-extrabold">02</span>
              <p className="mb-0 text-lg">Secrets stay server-side. Public configuration stays intentionally public.</p>
            </div>
            <div className="grid grid-cols-[3rem_1fr] gap-4 py-5 border-b border-white/35">
              <span className="text-accent text-xs font-extrabold">03</span>
              <p className="mb-0 text-lg">Every deploy has a health check, a rollback path, and an owner.</p>
            </div>
          </div>
        </div>
      </section>

      <FaqAccordion items={faqItems} />

      <section id="contact" className="pt-clamp(5rem,10vw,9rem) pb-clamp(6rem,12vw,11rem) container">
        <p className="eyebrow">Ready when you are</p>
        <h2 className="max-w-[12ch] mb-8 text-clamp(3rem,7vw,6rem)">Build the next version with room to grow.</h2>
        <a className="btn btnprimary" href="mailto:hello@example.com">Start a conversation <span aria-hidden="true">↗</span></a>
      </section>
    </>
  )
}
