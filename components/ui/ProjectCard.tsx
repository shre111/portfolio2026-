'use client';

import type { Project } from '@/lib/content';

interface ProjectCardProps {
  project: Project;
  /** Zero-based position, rendered as a mono "01" index label. */
  index: number;
  /** Featured cards get more weight: larger title, prominent metrics. */
  featured?: boolean;
}

/** The single amber accent (§4) on a featured card = the headline P&L metric. */
const isHeadlineMetric = (metric: string) => metric.includes('INR');

/** Bare-domain link → absolute href. */
const href = (url: string) => (url.startsWith('http') ? url : `https://${url}`);

/**
 * ProjectCard — one project from content.ts (CLAUDE.md §8). Mono voice for the
 * index label, tags and metrics; General Sans for prose; a single amber metric
 * on the featured card and nothing else amber (§4 one-accent rule).
 */
export function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const num = String(index + 1).padStart(2, '0');
  const kind = project.category === 'ai' ? 'AI' : 'FS';

  return (
    <article
      className={`group relative flex h-full flex-col rounded-sm border border-line bg-ink-2 transition-shadow duration-300 hover:shadow-glow-iris ${
        featured ? 'p-8 md:p-10' : 'p-6 md:p-8'
      }`}
    >
      {/* Index + featured marker */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-mono tracking-wide text-text-muted">
          {kind} / {num}
        </span>
        {featured && (
          <span className="font-mono text-mono uppercase tracking-wide text-iris-soft">
            Featured
          </span>
        )}
      </div>

      {/* Title + subtitle */}
      <h3
        className={`mb-1 font-display ${featured ? 'text-h2' : 'text-h3'}`}
      >
        {project.title}
      </h3>
      {project.subtitle && (
        <p className="mb-4 font-mono text-mono text-iris-soft">
          {project.subtitle}
        </p>
      )}

      {/* Description */}
      <p className="mb-6 leading-body text-text-muted">{project.description}</p>

      {/* Metrics (featured/showcase projects) */}
      {project.metrics && project.metrics.length > 0 && (
        <ul className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
          {project.metrics.map((metric) => (
            <li
              key={metric}
              className={`font-mono text-sm ${
                featured && isHeadlineMetric(metric)
                  ? 'text-amber'
                  : 'text-text'
              }`}
            >
              {metric}
            </li>
          ))}
        </ul>
      )}

      {/* Tags */}
      <div className="mb-6 mt-auto flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-xs border border-line px-2 py-1 font-mono text-xs text-text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      {(project.github || project.link) && (
        <div className="flex gap-5 font-mono text-sm">
          {project.github && (
            <a
              href={href(project.github)}
              target="_blank"
              rel="noreferrer"
              className="text-iris hover:text-iris-soft"
            >
              GitHub ↗
            </a>
          )}
          {project.link && (
            <a
              href={href(project.link)}
              target="_blank"
              rel="noreferrer"
              className="text-iris hover:text-iris-soft"
            >
              Live ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}
