import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Nav />
      <Hero />
      <Audience />
      <Services />
      <Ai />
      <Process />
      <Outcomes />
      <Cta />
      <Footer />
    </div>
  );
}

/* ------------------------------- Nav ------------------------------- */

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-surface/70 border-b border-border">
      <div className="container-page h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold tracking-tight">Great Idea</span>
          <span className="text-muted text-sm">CS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          <a href="#services" className="hover:text-ink transition-colors">Services</a>
          <a href="#approach" className="hover:text-ink transition-colors">Approach</a>
          <a href="#process" className="hover:text-ink transition-colors">Process</a>
          <a href="#contact" className="hover:text-ink transition-colors">Contact</a>
        </nav>
        <Link href="#contact" className="btn btn-primary btn-sm">Start a project</Link>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <span
      aria-hidden
      className="inline-block w-7 h-7 rounded-sm shadow-soft bg-gradient-brand"
    />
  );
}

/* ------------------------------- Hero (Hook 1) ------------------------------- */

function Hero() {
  return (
    <section className="bg-gradient-hero relative overflow-hidden">
      <div className="container-page pt-20 pb-28 lg:pt-28 lg:pb-36">
        <div className="max-w-3xl reveal">
          <span className="t-eyebrow">Creative Services · Tech that fits</span>
          <h1 className="mt-5 t-display">
            Your great idea,
            <br />
            <span className="text-gradient-brand">built right.</span>
          </h1>
          <p className="mt-6 t-body-lg max-w-2xl">
            We design websites, apps, and the quiet systems that run your business —
            so you can spend your time on the part only you can do.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="#contact" className="btn btn-primary">
              Tell us the idea
              <ArrowRight />
            </Link>
            <a href="#services" className="btn btn-ghost">See what we build</a>
          </div>

          <div className="mt-12 flex items-center gap-6 t-body-sm">
            <Avatars />
            <span>Trusted by coaches, agents, and creators across the U.S.</span>
          </div>
        </div>

        <FloatingPreview />
      </div>
    </section>
  );
}

function FloatingPreview() {
  return (
    <div className="hidden lg:block absolute right-[-40px] top-24 w-[460px] reveal">
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-8 rounded-2xl blur-2xl opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(245,158,11,0.28), transparent 70%)",
          }}
        />
        <div className="relative card shadow-lift p-5">
          <div className="flex items-center gap-1.5 pb-3 border-b border-border">
            <span className="w-2.5 h-2.5 rounded-pill bg-border-strong" />
            <span className="w-2.5 h-2.5 rounded-pill bg-border-strong" />
            <span className="w-2.5 h-2.5 rounded-pill bg-border-strong" />
            <span className="ml-3 text-xs text-muted">your-studio.com</span>
          </div>
          <div className="pt-5 space-y-4">
            <div className="h-3 w-1/3 rounded-pill bg-surface-alt" />
            <div className="h-7 w-3/4 rounded-sm bg-ink/90" />
            <div className="h-3 w-2/3 rounded-pill bg-surface-alt" />
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="aspect-square rounded-md bg-brand-soft" />
              <div className="aspect-square rounded-md bg-gradient-brand-soft" />
              <div className="aspect-square rounded-md bg-accent-soft" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-8 w-24 rounded-pill bg-ink" />
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Spark /> Live
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -left-10 top-44 rotate-[-6deg] chip">
          <Spark /> Booking automated
        </div>
        <div className="absolute -right-6 -bottom-6 rotate-[4deg] chip">
          <span className="inline-block w-2 h-2 rounded-pill bg-accent" />
          +38% qualified leads
        </div>
      </div>
    </div>
  );
}

function Avatars() {
  const bgs = [
    "linear-gradient(135deg,#c7d2fe,#fde68a)",
    "linear-gradient(135deg,#fde68a,#fbcfe8)",
    "linear-gradient(135deg,#bae6fd,#c7d2fe)",
    "linear-gradient(135deg,#fbcfe8,#bbf7d0)",
  ];
  return (
    <div className="flex -space-x-2">
      {bgs.map((bg, i) => (
        <span
          key={i}
          aria-hidden
          className="w-8 h-8 rounded-pill border-2 border-surface"
          style={{ background: bg }}
        />
      ))}
    </div>
  );
}

/* --------------------- Audience recognition (Hook 2) --------------------- */

function Audience() {
  const niches = [
    "Real estate agents",
    "Coaches",
    "Fitness studios",
    "Content creators",
    "Therapists",
    "Boutique brands",
    "Consultants",
    "Local services",
  ];
  return (
    <section id="approach" className="border-y border-border bg-surface">
      <div className="container-page section-y">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <span className="t-eyebrow">Built for the work you actually do</span>
            <h2 className="mt-4 t-h1">
              You started this to <span className="text-brand">do the thing</span>.
              <br />
              Not to wrestle with the tech.
            </h2>
            <p className="mt-5 t-body-lg">
              The clients. The classes. The listings. The work itself. We handle the
              software, the look, the wiring underneath — so the parts that need
              <em> you </em> get all of you.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {niches.map((n) => (
                <div key={n} className="chip justify-start">{n}</div>
              ))}
              <div
                className="rounded-md px-4 py-4 text-sm col-span-2 sm:col-span-1 flex items-center justify-center text-center bg-gradient-brand"
                style={{ color: "var(--color-on-brand)" }}
              >
                + You
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Services ------------------------------- */

function Services() {
  const items = [
    { title: "Websites that earn their place", desc: "Modern, fast, search-friendly sites that turn visitors into clients.", icon: <IconBrowser /> },
    { title: "Apps & business tools", desc: "Custom web apps, internal tools, and dashboards built around how you work.", icon: <IconApp /> },
    { title: "Video & content", desc: "Short-form, long-form, and brand films tuned for the platforms you live on.", icon: <IconPlay /> },
    { title: "Design systems", desc: "A consistent, scalable visual language that grows with your brand.", icon: <IconLayers /> },
    { title: "eCommerce", desc: "Storefronts, checkouts, and product flows that feel as good as they convert.", icon: <IconBag /> },
    { title: "Automation & reporting", desc: "Quiet systems that run bookings, follow-ups, and the metrics that matter.", icon: <IconChart /> },
  ];

  return (
    <section id="services" className="bg-gradient-band">
      <div className="container-page section-y">
        <div className="max-w-2xl">
          <span className="t-eyebrow">What we do</span>
          <h2 className="mt-4 t-h1">Everything around the idea — so the idea can breathe.</h2>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it) => (
            <div key={it.title} className="card card-interactive">
              <div className="w-11 h-11 rounded-md flex items-center justify-center mb-5 bg-accent-soft text-accent">
                {it.icon}
              </div>
              <h3 className="t-h3">{it.title}</h3>
              <p className="mt-2 t-body-sm">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------- AI section (Hook 3, calm) --------------------- */

function Ai() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page section-y">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="t-eyebrow">A quiet advantage</span>
            <h2 className="mt-4 t-h1">
              Craft you can feel.
              <br />
              <span className="text-muted">Speed you can&rsquo;t.</span>
            </h2>
            <p className="mt-5 t-body-lg">
              We use AI the way good studios use any sharp tool — to take the
              friction out of the work and put more of our attention on you. You get
              the thinking of a senior team, on a timeline that used to require one.
            </p>
            <ul className="mt-7 space-y-3 text-[15px]">
              {[
                "Drafts and explorations in days, not weeks",
                "Content, copy, and assets that stay on-brand",
                "Automations that handle the repetitive — invisibly",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="panel p-8 sm:p-10 overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Spark /> Working on your project
                </div>
                <PulseLine label="Drafting hero concepts" pct={92} />
                <PulseLine label="Wiring booking flow" pct={64} />
                <PulseLine label="Writing on-brand copy" pct={78} />
                <PulseLine label="Setting up reporting" pct={40} />
              </div>
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <span className="t-body-sm">Senior team · AI-accelerated</span>
                <span className="text-xs font-medium px-3 py-1.5 rounded-pill bg-brand-soft text-brand">
                  ~3 weeks to launch
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PulseLine({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-ink">{label}</span>
        <span className="text-muted">{pct}%</span>
      </div>
      <div className="h-2 rounded-pill bg-surface-alt overflow-hidden">
        <div
          className="h-full rounded-pill bg-gradient-brand"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------- Process ------------------------------- */

function Process() {
  const steps = [
    { n: "01", t: "Listen", d: "A real conversation about your business — not a discovery template." },
    { n: "02", t: "Shape", d: "We turn the idea into something you can see, click, and react to." },
    { n: "03", t: "Build", d: "Senior craft, fast iterations, and you in the loop the whole way." },
    { n: "04", t: "Launch & care", d: "Go live with confidence. We stay on for the long arc." },
  ];

  return (
    <section id="process" className="bg-surface border-t border-border">
      <div className="container-page section-y">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="t-eyebrow">How it works</span>
            <h2 className="mt-4 t-h1">
              Simple on the outside.
              <br />
              <span className="text-muted">Serious underneath.</span>
            </h2>
          </div>
          <p className="t-body max-w-sm">
            Most projects launch in three to six weeks. No bloated decks. No surprises.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={s.n} className="card bg-surface-alt">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-medium px-2 py-1 rounded-xs bg-surface text-brand">
                  {s.n}
                </span>
                {i < steps.length - 1 && (
                  <span className="hidden lg:block flex-1 h-px bg-border-strong" />
                )}
              </div>
              <h3 className="t-h3">{s.t}</h3>
              <p className="mt-2 t-body-sm">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Outcomes ------------------------------- */

function Outcomes() {
  const stats = [
    { v: "3–6 wk", l: "Typical time to launch" },
    { v: "100%", l: "Senior hands on every project" },
    { v: "1:1", l: "Direct line to your designer & dev" },
  ];
  return (
    <section className="border-t border-border" style={{ background: "var(--gradient-band)" }}>
      <div className="container-page py-20 lg:py-24">
        <div className="grid sm:grid-cols-3 gap-10 sm:gap-6">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="text-5xl sm:text-6xl font-semibold tracking-tight text-gradient-ink">
                {s.v}
              </div>
              <div className="mt-2 t-body">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Closing CTA (Hook 4) ----------------------- */

function Cta() {
  return (
    <section id="contact" className="bg-surface">
      <div className="container-page section-y">
        <div className="relative overflow-hidden rounded-panel border border-border bg-gradient-cta p-10 sm:p-16">
          <div className="max-w-2xl">
            <span className="t-eyebrow">Let&rsquo;s start</span>
            <h2 className="mt-4 t-h1">
              Tell us the idea.
              <br />
              <span className="text-gradient-brand">We&rsquo;ll show you what&rsquo;s possible.</span>
            </h2>
            <p className="mt-5 t-body-lg">
              A 20-minute call. No pitch. You leave with a clear sense of what to
              build, what it costs, and what it takes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="mailto:hello@greatidea.cs" className="btn btn-primary">
                Book a 20-min call
                <ArrowRight />
              </a>
              <a href="mailto:hello@greatidea.cs" className="btn btn-ghost">hello@greatidea.cs</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Footer ------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-12 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold tracking-tight">Great Idea</span>
          <span className="text-muted text-sm">CS</span>
        </div>
        <div className="t-body-sm">
          © {new Date().getFullYear()} Great Idea Creative Services. Built with care.
        </div>
        <div className="flex items-center gap-5 t-body-sm">
          <a href="#services" className="hover:text-ink">Services</a>
          <a href="#process" className="hover:text-ink">Process</a>
          <a href="#contact" className="hover:text-ink">Contact</a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------- Icons ------------------------------- */

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="var(--color-accent-soft)" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function Spark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  );
}
function IconBrowser() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18" />
      <circle cx="6.5" cy="6.5" r="0.6" fill="currentColor" />
      <circle cx="8.8" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
function IconApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </svg>
  );
}
function IconPlay() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
      <path d="M3 17l9 5 9-5" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14l-1.2 11.2a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 16v-5M12 16V8M16 16v-3" />
    </svg>
  );
}
