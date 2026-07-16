import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { useScrollProgress } from '@/hooks/useScrollProgress';

export default function Home() {
  return (
    <main className="w-full bg-ink">
      <Hero />
      <About />
      
      {/* Placeholder sections for other content */}
      <section className="py-32 px-6 border-t border-line">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-h2">Experience</h2>
          <p className="text-text-muted mt-4">Coming soon...</p>
        </div>
      </section>

      <section className="py-32 px-6 border-t border-line">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-h2">AI Projects</h2>
          <p className="text-text-muted mt-4">Coming soon...</p>
        </div>
      </section>

      <section className="py-32 px-6 border-t border-line">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-h2">Full Stack Projects</h2>
          <p className="text-text-muted mt-4">Coming soon...</p>
        </div>
      </section>

      <section className="py-32 px-6 border-t border-line">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-h2">Skills</h2>
          <p className="text-text-muted mt-4">Coming soon...</p>
        </div>
      </section>

      <section className="py-32 px-6 border-t border-line">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-h2">Contact</h2>
          <p className="text-text-muted mt-4">Coming soon...</p>
        </div>
      </section>
    </main>
  );
}
