import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { connection } from 'next/server'
import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Northstar | Enterprise content platform',
    template: '%s | Northstar',
  },
  description: 'A secure, resilient foundation for enterprise digital experiences.',
  applicationName: 'Northstar',
  category: 'technology',
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  await connection()

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <header className="site-header">
          <div className="container header-inner">
            <Link className="brand" href="/" aria-label="Northstar home">
              <span className="brand-mark" aria-hidden="true">N</span>
              <span>Northstar</span>
            </Link>
            <nav className="primary-nav" aria-label="Primary navigation">
              <a href="#capabilities">Capabilities</a>
              <a href="#operating-model">Operating model</a>
              <a href="#contact">Contact</a>
            </nav>
            <ThemeToggle />
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div className="container footer-inner">
            <p>Northstar content platform</p>
            <p className="muted">Secure by default. Observable by design.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
