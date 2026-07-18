import type { Metadata } from 'next';
import './globals.css';
import { LayoutProvider } from '@/components/providers/LayoutProvider';

export const metadata: Metadata = {
  title: 'Shreya Dantani | Senior Full Stack Engineer',
  description: 'AI/LLM Integration · RAG Pipelines · Multi-Agent Systems · Generative AI · Full Stack.',
  keywords: [
    'Full Stack Engineer',
    'AI Systems',
    'LLM Integration',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
  ],
  authors: [{ name: 'Shreya Dantani', url: 'https://shreya-dantani.com' }],
  creator: 'Shreya Dantani',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shreya-dantani.com',
    siteName: 'Shreya Dantani',
    title: 'Shreya Dantani | Senior Full Stack Engineer',
    description: 'AI/LLM Integration · RAG Pipelines · Multi-Agent Systems · Generative AI · Full Stack.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@shreya_dantani',
  },
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
