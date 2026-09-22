import { Quote } from "lucide-react";
import { testimonials, type Testimonial } from "@/lib/testimonials";

// Inline SVG rather than the ↗ glyph, which renders at the typeface's own
// weight and looks pasted on next to medium-weight button text.
function ArrowUpRight() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="ml-1.5 shrink-0"
    >
      <path
        d="M3.2 8.8L8.8 3.2M8.8 3.2H4.6M8.8 3.2V7.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="glow-card rounded-2xl overflow-hidden flex flex-col">
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <figcaption className="flex items-center gap-4 mb-8">
          <div
            aria-hidden="true"
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center subtle-glow shrink-0 text-primary font-bold tracking-wide"
          >
            {initials(t.client.name)}
          </div>
          <div>
            <div className="text-lg font-semibold leading-tight">{t.client.name}</div>
            <div className="text-sm text-foreground/60">{t.client.title}</div>
          </div>
        </figcaption>

        <div className="space-y-6 flex-1">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-foreground/50 mb-2">
              Before
            </div>
            <blockquote className="text-foreground/60 leading-relaxed">
              &ldquo;{t.before}&rdquo;
            </blockquote>
          </div>

          <div className="border-l-2 border-primary/40 pl-4">
            <div className="text-xs uppercase tracking-[0.16em] text-primary mb-2">
              After
            </div>
            <blockquote className="text-foreground/90 text-lg leading-relaxed">
              &ldquo;{t.after}&rdquo;
            </blockquote>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
          <span className="text-sm text-foreground/50">{t.site.domain}</span>
          <a
            href={t.site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-button-secondary inline-flex items-center px-5 py-2.5 rounded-lg text-sm text-foreground"
          >
            See {t.client.firstName}&apos;s site
            <ArrowUpRight />
          </a>
        </div>
      </div>

      <div className="px-6 md:px-8 py-3 bg-primary/5 border-t border-border text-xs text-foreground/60">
        Designed and built by <span className="text-primary">Great Idea CS</span>
      </div>
    </figure>
  );
}

export default function Testimonials() {
  return (
    <section id="clients" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6 subtle-glow">
            <Quote className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/90">Client Stories</span>
          </div>
          <h2 className="text-3xl md:text-5xl mb-4">
            Before and <span className="text-primary neon-text">After</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            In their own words, from the coaches whose sites Great Idea CS designed and built.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((t) => (
            <TestimonialCard key={t.slug} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
