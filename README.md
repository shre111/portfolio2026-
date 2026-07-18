# Shreya Dantani — 3D Interactive Portfolio

A single-page, scroll-driven portfolio that lives inside a **"Latent Space"** — a field of thousands of GPU particles that drifts, reacts to the cursor, and reconfigures into structures representing each part of the work.

> Design, content and constraints are specified in `CLAUDE.md` (kept locally, not committed). It is the source of truth for the concept, tech stack, design tokens, performance budget and all copy.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| 3D | React Three Fiber 9 + drei 10 + postprocessing 3 |
| Scroll | Lenis + GSAP ScrollTrigger |
| State | Zustand |
| Styling | Tailwind CSS + CSS-variable design tokens |
| Fonts | Clash Display · General Sans · JetBrains Mono (self-hosted) |
| Deploy | Vercel |

> **Version note:** Next 15 serves React 19 to the client, so React 19 + R3F v9 must stay aligned. R3F v8 with React 18 crashes the canvas with a `ReactCurrentOwner` error.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Architecture

```
/app          layout (metadata, JSON-LD, fonts), page (composes sections), OG image
/components
  /canvas     Scene (single <Canvas>), LatentField (the particle system), CameraRig
  /sections   Hero, About, Experience, AIProjects, FullStackProjects, Skills, Contact
  /ui         Nav, Cursor, ProjectCard, Reveal
/lib          content.ts (all copy/data), store.ts (Zustand), formations.ts, shaders/
/hooks        useLenis, useSectionTracker, useDeviceTier, useRenderActive, …
/public/fonts self-hosted woff2
```

One `<Canvas>` for the whole page; sections are HTML layered over it.

### Particle formations

Each section can map to a target position buffer that the field GPU-lerps into, then relaxes back:

| Section | Formation |
|---|---|
| Hero | ambient nebula |
| AI Projects (first half) | network graph — multi-agent |
| AI Projects (second half) | candlestick / equity terrain (cyan) — AI Trader |
| Skills | constellation, one cluster per skill group |

## Performance & accessibility

- DPR clamped to `[1, 1.75]`; particle count scales by device tier (high ≈ 15k, mid ≈ 8k, low skips the field and falls back to 2D).
- Rendering pauses when the tab is hidden or the canvas is off-screen.
- The 3D scene is lazy-loaded (`next/dynamic`, `ssr: false`) so first paint isn't blocked.
- `prefers-reduced-motion`: the field freezes entirely, no camera travel, reveals are instant — the site stays fully readable in 2D.
- Skip-to-content link, visible focus rings, semantic landmarks, `aria-hidden` decorative canvas, contrast scrims over the field.

## Deploying to Vercel

1. Push this repo to GitHub (already at `github.com/shre111/portfolio2026-`).
2. In Vercel, **Add New → Project** and import the repository.
3. Framework preset is detected automatically as **Next.js** — no build settings to change (`next build`, output `.next`).
4. Add an environment variable so absolute OG/canonical URLs resolve:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | your deployed origin, e.g. `https://your-domain.vercel.app` |

   Set it for **Production** (and Preview if you want correct previews). Without it, metadata falls back to `http://localhost:3000`.
5. **Deploy.** Then, if you attach a custom domain, update `NEXT_PUBLIC_SITE_URL` to match and redeploy so share cards point at the right origin.

### After deploying

- Check the share card at `/opengraph-image`.
- Validate the `Person` structured data with Google's Rich Results Test.
- Run Lighthouse on the deployed URL (mobile + desktop) to confirm the performance budget on real hardware.
