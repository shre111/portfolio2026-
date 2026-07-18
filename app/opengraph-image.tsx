import { ImageResponse } from 'next/og';
import { content } from '@/lib/content';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${content.identity.name} — ${content.identity.title}`;

/**
 * Social share card (§9). Generated at build time in the site's own palette
 * (iris on ink) so the link preview matches the page. Real content only.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#08080F',
          backgroundImage:
            'radial-gradient(circle at 75% 30%, rgba(110,99,242,0.35) 0%, rgba(8,8,15,0) 55%)',
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#A79DF9',
            marginBottom: 28,
          }}
        >
          Latent Space
        </div>

        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            color: '#E9EAF3',
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          {content.identity.name}
        </div>

        <div
          style={{
            fontSize: 34,
            color: '#E9EAF3',
            marginBottom: 20,
          }}
        >
          {content.identity.title}
        </div>

        <div
          style={{
            fontSize: 24,
            color: '#7A7E9A',
            maxWidth: 900,
          }}
        >
          AI/LLM Integration · RAG Pipelines · Multi-Agent Systems · Next.js
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 22,
            color: '#F5B451',
          }}
        >
          {content.identity.links.github}
        </div>
      </div>
    ),
    { ...size }
  );
}
