import type { Metadata } from 'next';
import './globals.css';
import { LayoutProvider } from '@/components/providers/LayoutProvider';
import { content } from '@/lib/content';

const { identity } = content;
const DESCRIPTION =
  'AI/LLM Integration · RAG Pipelines · Multi-Agent Systems · Generative AI · Full Stack.';
const TITLE = `${identity.name} | ${identity.title}`;

// Set NEXT_PUBLIC_SITE_URL to the deployed origin (e.g. the Vercel URL) so
// absolute OG/canonical URLs resolve. Falls back to localhost in development.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'Full Stack Engineer',
    'AI Systems',
    'LLM Integration',
    'RAG',
    'Multi-Agent Systems',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
  ],
  authors: [{ name: identity.name, url: `https://${identity.links.github}` }],
  creator: identity.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: identity.name,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

/** Structured data (§9). Real values only — straight from content.ts (§8). */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: identity.name,
  jobTitle: identity.title,
  email: `mailto:${identity.email}`,
  telephone: identity.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  url: SITE_URL,
  sameAs: [
    `https://${identity.links.linkedin}`,
    `https://${identity.links.github}`,
  ],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: content.education.institution,
  },
  knowsAbout: content.skills.flatMap((group) => group.skills),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#08080F" />
        <meta name="color-scheme" content="dark" />
        {/* Preload the display face only (§7) — it renders the LCP headline. */}
        <link
          rel="preload"
          href="/fonts/clash-display-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        {/* First focusable element — lets keyboard users bypass the nav (§9). */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
