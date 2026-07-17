'use client';

import { useScrollStore } from '@/lib/store';

const NAV_ITEMS: Array<{ id: string; label: string }> = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'ai-projects', label: 'AI' },
  { id: 'fullstack-projects', label: 'Full-Stack' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Nav — a fixed dot rail that reflects the active section (CLAUDE.md §6) and
 * jumps to a section on click. Scrolling is delegated to Lenis via a custom
 * event so smoothing stays consistent. Keyboard-operable with a visible focus
 * ring (§9). Hidden on small screens where the page just scrolls.
 */
export function Nav() {
  const activeSection = useScrollStore((s) => s.activeSection);

  const go = (id: string) => {
    window.dispatchEvent(
      new CustomEvent('lenis:scrollTo', { detail: `#${id}` })
    );
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 md:flex"
    >
      {NAV_ITEMS.map((item) => {
        const active = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => go(item.id)}
            aria-current={active ? 'true' : undefined}
            aria-label={item.label}
            className="group flex items-center justify-end gap-3 rounded-full outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-iris"
          >
            <span
              className={`font-mono text-xs uppercase tracking-wide transition-opacity ${
                active
                  ? 'text-iris-soft opacity-100'
                  : 'text-text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
              }`}
            >
              {item.label}
            </span>
            <span
              className={`h-2 w-2 rounded-full border transition-colors ${
                active
                  ? 'border-iris bg-iris'
                  : 'border-text-muted group-hover:border-iris-soft'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
