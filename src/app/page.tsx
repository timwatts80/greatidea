"use client";

import {
  Lightbulb,
  Sparkles,
  Zap,
  Rocket,
  Code2,
  Cpu,
  ArrowRight,
  Menu,
  X,
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Mail,
  Send,
  Loader2,
  Search,
  MessageSquareText,
  TrendingUp,
  Bot,
  Target,
  Quote,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Turnstile } from "@marsidev/react-turnstile";
import { AdminCard } from "@/components/AdminCard";
import BookingModal from "@/components/BookingModal";

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const phrases = [
    { line1: "Transform Your", line2: "Digital Vision" },
    { line1: "Elevate Your", line2: "Business with AI" },
    { line1: "Create Your", line2: "Next Innovation" },
  ];

  const [subheader, setSubheader] = useState(
    "Custom AI solutions for creative projects, business workflows, and digital innovation. From intelligent automation to cutting-edge interactive experiences."
  );

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business_type: "",
    message: "",
  });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Detect admin mode on client
  useEffect(() => {
    setIsAdminMode(
      new URLSearchParams(window.location.search).get("admin") === "1"
    );
  }, []);

  // Fetch hero content
  useEffect(() => {
    const cachedHero = sessionStorage.getItem("hero-content");

    if (!isAdminMode && cachedHero) {
      try {
        const parsed = JSON.parse(cachedHero);
        if (parsed.subheader) {
          setSubheader(parsed.subheader);
        }
      } catch {
        // keep fallback
      }
    } else {
      fetch("https://api.greatidea-cs.com/v1/content/hero")
        .then((res) => res.json())
        .then((data) => {
          const content = { subheader: data.subheader || subheader };
          setSubheader(content.subheader);
          sessionStorage.setItem("hero-content", JSON.stringify(content));
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (formErrors[e.target.name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitError("");

    if (!turnstileToken) {
      setSubmitError("Please complete the spam check.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        turnstile_token: turnstileToken,
      };
      if (formData.business_type) payload.business_type = formData.business_type;
      if (formData.message) payload.message = formData.message;

      const response = await fetch("https://api.greatidea-cs.com/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setSubmitSuccess(true);
      } else if (response.status === 400 && data.errors) {
        setFormErrors(data.errors);
      } else if (response.status === 400 && data.error === "spam_check_failed") {
        setSubmitError("Please complete the spam check and try again.");
        setTurnstileToken("");
      } else if (response.status === 429) {
        setSubmitError("Too many submissions. Please wait a few minutes.");
      } else {
        setSubmitError(
          "Something went wrong. Please email hello@greatidea-cs.com directly."
        );
      }
    } catch {
      setSubmitError(
        "Something went wrong. Please email hello@greatidea-cs.com directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 subtle-glow">
                <Lightbulb className="w-6 h-6 md:w-7 md:h-7 text-primary" strokeWidth={2.5} />
              </div>
              <span className="text-lg md:text-xl tracking-tight">
                <span className="text-primary neon-text">great idea</span>
                <span className="text-muted-foreground"> cs</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#solutions" className="text-foreground/80 hover:text-primary transition-colors">Solutions</a>
              <a href="#aeo" className="text-foreground/80 hover:text-primary transition-colors">AEO</a>
              <a href="#use-cases" className="text-foreground/80 hover:text-primary transition-colors">Use Cases</a>
              <a href="#learning" className="text-foreground/80 hover:text-primary transition-colors">Learning</a>
              <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors">Contact</a>
              <a href="#contact" className="glow-button-primary px-6 py-2.5 rounded-lg text-sm text-primary-foreground">
                Get Started
              </a>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-card/95 backdrop-blur-xl border-t border-border">
            <div className="px-4 py-6 space-y-4">
              <a href="#solutions" className="block text-foreground/80 hover:text-primary transition-colors py-2">Solutions</a>
              <a href="#aeo" className="block text-foreground/80 hover:text-primary transition-colors py-2">AEO</a>
              <a href="#use-cases" className="block text-foreground/80 hover:text-primary transition-colors py-2">Use Cases</a>
              <a href="#learning" className="block text-foreground/80 hover:text-primary transition-colors py-2">Learning</a>
              <a href="#contact" className="block text-foreground/80 hover:text-primary transition-colors py-2">Contact</a>
              <a href="#contact" className="glow-button-primary w-full px-6 py-3 rounded-lg text-sm text-primary-foreground mt-4 block text-center">
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-8 subtle-glow">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground/90">Powered by Advanced AI</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight font-bold leading-none">
              <div className="relative h-[1.2em] -mb-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`line1-${currentPhrase}`}
                    initial={{ y: 5, opacity: 0, filter: "blur(8px)", scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ y: -10, opacity: 0, filter: "blur(8px)", scale: 0.98 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 0.03, 0.26, 1.0],
                      y: { duration: 0.7, ease: [0.61, 1, 0.88, 1] },
                    }}
                    className="block absolute inset-0"
                  >
                    {phrases[currentPhrase].line1}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="relative h-[1.2em] pb-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`line2-${currentPhrase}`}
                    initial={{ y: 5, opacity: 0, filter: "blur(8px)", scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ y: -10, opacity: 0, filter: "blur(8px)", scale: 0.98 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 0.03, 0.26, 1.0],
                      y: { duration: 0.7, ease: [0.61, 1, 0.88, 1] },
                      delay: 0.05,
                    }}
                    className="block absolute inset-0 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent neon-text"
                  >
                    {phrases[currentPhrase].line2}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed">
              {subheader}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="glow-button-primary px-8 py-4 rounded-xl text-primary-foreground w-full sm:w-auto text-center">
                Start Your Project
              </a>
              <a href="#aeo" className="glow-button-secondary px-8 py-4 rounded-xl text-foreground w-full sm:w-auto flex items-center justify-center gap-2">
                Win at AEO/SEO
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
      </section>

      {/* AI Highlight */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background:
              "radial-gradient(ellipse 180% 150% at 0% 0%, #a8f0ed 0%, transparent 60%)",
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="glow-card p-8 md:p-12 lg:p-16 rounded-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6 subtle-glow">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/90">Best-in-Class AI</span>
                </div>
                <h2 className="text-3xl md:text-4xl mb-6">
                  Built on the <span className="text-primary neon-text">Best AI</span> for the Job
                </h2>
                <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
                  We work with the most capable AI systems available—from Anthropic&apos;s Claude
                  to OpenAI and beyond—and choose the right model for each problem, rather than
                  forcing every job through one tool.
                </p>
                <p className="text-foreground/60 leading-relaxed mb-8">
                  Whether it&apos;s automating complex workflows, generating creative content, or
                  building sophisticated tools, we pair the strongest model with thoughtful
                  engineering to deliver solutions that truly understand and adapt to your needs.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Advanced Reasoning", value: "Context-aware analysis" },
                  { label: "Creative Output", value: "Natural language mastery" },
                  { label: "Code Generation", value: "Multiple languages" },
                  { label: "Vision Capabilities", value: "Image understanding" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border"
                  >
                    <div className="text-sm text-foreground/60 mb-2">{feature.label}</div>
                    <div className="text-foreground">{feature.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 gradient-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-4">
              <span className="text-primary neon-text">AI-Powered</span> Solutions
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Intelligent capabilities tailored to your unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Cpu, title: "AI-Powered Automation", description: "Streamline workflows with intelligent automation that understands context and adapts to your processes." },
              { icon: Code2, title: "Custom Tools", description: "Bespoke applications and integrations built to solve your specific challenges." },
              { icon: Sparkles, title: "Creative AI", description: "Generate sophisticated content, design assets, and interactive experiences with advanced language and image models." },
              { icon: Zap, title: "Smart Analytics", description: "Transform data into actionable insights with AI-powered analysis and visualization." },
              { icon: Rocket, title: "Rapid Prototyping", description: "Go from concept to working prototype in days, not months, with AI-accelerated development." },
              { icon: Lightbulb, title: "Innovation Lab", description: "Explore cutting-edge AI capabilities for games, apps, and experimental projects." },
            ].map((solution, index) => (
              <div key={index} className="glow-card p-6 md:p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 subtle-glow">
                  <solution.icon className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-xl mb-3">{solution.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AEO — Answer Engine Optimization */}
      <section id="aeo" className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 140% 120% at 100% 0%, #b897b3 0%, transparent 55%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6 subtle-glow">
              <Search className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground/90">Answer Engine Optimization</span>
            </div>
            <h2 className="text-3xl md:text-5xl mb-4">
              Get Found by <span className="text-primary neon-text">AI Answer Engines</span>
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Search is shifting from blue links to direct answers. We optimize your brand
              to be the source Claude, ChatGPT, Perplexity, and Google AI Overviews cite—
              so you win the customer before they ever reach a results page.
            </p>
          </div>

          {/* Stat callout */}
          <div className="glow-card p-8 md:p-12 rounded-3xl mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { stat: "60%+", label: "of searches now end without a click to a website" },
                { stat: "1 answer", label: "is what AI engines surface—being it is everything" },
                { stat: "Always-on", label: "monitoring as models and citations change weekly" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-4xl md:text-5xl font-bold text-primary neon-text mb-2">
                    {item.stat}
                  </div>
                  <p className="text-foreground/60 leading-relaxed">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What we do */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: MessageSquareText,
                title: "Conversational Content",
                description:
                  "Restructure your messaging into the question-and-answer formats that LLMs parse, trust, and quote verbatim.",
              },
              {
                icon: Quote,
                title: "Citation Engineering",
                description:
                  "Build the authoritative, well-sourced pages and schema markup that make your business the reference answer engines pull from.",
              },
              {
                icon: Bot,
                title: "LLM Visibility Audits",
                description:
                  "See exactly how Claude, ChatGPT, Perplexity, and Gemini describe your brand today—and where competitors are winning the answer.",
              },
              {
                icon: Target,
                title: "Entity & Brand Authority",
                description:
                  "Strengthen your knowledge-graph footprint so AI consistently associates your name with the services you want to be known for.",
              },
              {
                icon: TrendingUp,
                title: "Answer Share Tracking",
                description:
                  "Measure how often you're cited across answer engines over time and tie it back to real pipeline and revenue.",
              },
              {
                icon: Sparkles,
                title: "AI-Powered Optimization",
                description:
                  "We use advanced AI to model how answer engines interpret your content and generate the precise updates that earn more citations.",
              },
            ].map((feature, index) => (
              <div key={index} className="glow-card p-6 md:p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 subtle-glow">
                  <feature.icon className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-xl mb-3">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#contact"
              className="glow-button-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-primary-foreground"
            >
              Audit My AI Visibility
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-4">
              Built for <span className="text-primary neon-text">Every Vision</span>
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              From enterprise workflows to creative experiments
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glow-card p-8 md:p-10 rounded-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center subtle-glow shrink-0">
                  <Code2 className="w-7 h-7 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl mb-2">Business &amp; Enterprise</h3>
                  <p className="text-foreground/60">Optimize operations and scale efficiently</p>
                </div>
              </div>
              <ul className="space-y-4 text-foreground/70">
                {[
                  "Workflow automation and process optimization",
                  "Custom CRM and data management systems",
                  "AI-powered customer service solutions",
                  "Analytics dashboards and reporting tools",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glow-card p-8 md:p-10 rounded-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center subtle-glow shrink-0">
                  <Sparkles className="w-7 h-7 text-secondary" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl mb-2">Creative &amp; Digital</h3>
                  <p className="text-foreground/60">Bring your creative ideas to life</p>
                </div>
              </div>
              <ul className="space-y-4 text-foreground/70">
                {[
                  "Interactive web experiences and games",
                  "AI-assisted content generation tools",
                  "Custom apps and digital products",
                  "Prototypes and proof-of-concept builds",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Learning */}
      <section id="learning" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 gradient-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6 subtle-glow">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground/90">AI Education &amp; Training</span>
            </div>
            <h2 className="text-3xl md:text-5xl mb-4">
              Master <span className="text-primary neon-text">AI</span> for Your Future
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Comprehensive education on modern AI—from fundamentals to advanced implementation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              {
                icon: BookOpen,
                title: "AI Fundamentals",
                description: "Understand the capabilities and core concepts behind today's leading AI systems.",
                topics: ["The LLM Landscape", "LLMs & Generative AI", "Prompt Engineering", "AI Ethics & Safety"],
              },
              {
                icon: Code2,
                title: "Practical Implementation",
                description: "Learn to integrate AI into your workflows and build custom solutions.",
                topics: ["AI API Integration", "Automation Workflows", "Custom AI Tools", "Best Practices"],
              },
              {
                icon: Rocket,
                title: "Advanced Strategies",
                description: "Leverage AI for competitive advantage and innovative applications.",
                topics: ["AI Strategy", "Scaling Solutions", "ROI Optimization", "Future Trends"],
              },
            ].map((track, index) => (
              <div key={index} className="glow-card p-6 md:p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 subtle-glow">
                  <track.icon className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-xl mb-3">{track.title}</h3>
                <p className="text-foreground/70 mb-6 leading-relaxed">{track.description}</p>
                <div className="space-y-2">
                  {track.topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground/60">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="glow-card p-8 rounded-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center subtle-glow shrink-0">
                  <Users className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl mb-2">Team Workshops</h3>
                  <p className="text-foreground/60">Customized training for your organization</p>
                </div>
              </div>
              <ul className="space-y-3 text-foreground/70 mb-6">
                {[
                  "On-site or remote sessions",
                  "Tailored to your industry and use cases",
                  "Hands-on exercises and real-world projects",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="glow-button-secondary px-6 py-3 rounded-lg text-foreground w-full text-center block"
              >
                Book a Workshop
              </button>
            </div>

            <div className="glow-card p-8 rounded-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center subtle-glow shrink-0">
                  <Trophy className="w-6 h-6 text-secondary" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl mb-2">1-on-1 Mentorship</h3>
                  <p className="text-foreground/60">Personalized guidance for your journey</p>
                </div>
              </div>
              <ul className="space-y-3 text-foreground/70 mb-6">
                {[
                  "Custom learning path based on your goals",
                  "Project-based learning with real deliverables",
                  "Ongoing support and Q&A",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="glow-button-secondary px-6 py-3 rounded-lg text-foreground w-full text-center block">
                Apply for Mentorship
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glow-card p-10 md:p-16 rounded-3xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6 subtle-glow">
              <Lightbulb className="w-8 h-8 text-primary" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl md:text-5xl mb-6">
              Ready to Build Something <span className="text-primary neon-text">Great</span>?
            </h2>
            <p className="text-foreground/70 text-lg mb-10 max-w-2xl mx-auto">
              Let&apos;s turn your ideas into reality with custom AI solutions designed for your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="glow-button-primary px-8 py-4 rounded-xl text-primary-foreground w-full sm:w-auto flex items-center justify-center gap-2">
                Start a Project
                <ArrowRight className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="glow-button-secondary px-8 py-4 rounded-xl text-foreground w-full sm:w-auto text-center"
              >
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 gradient-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6 subtle-glow">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground/90">Let&apos;s Talk</span>
            </div>
            <h2 className="text-3xl md:text-5xl mb-4">
              Let&apos;s Make Something <span className="text-primary neon-text">Together</span>
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Tell me what you&apos;re dreaming up. The best work starts as a conversation, not a
              contract—so let&apos;s just talk it through.
            </p>
          </div>

          <div className="glow-card p-8 md:p-12 rounded-2xl">
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl mb-3">Thanks for reaching out!</h3>
                <p className="text-foreground/70">We&apos;ll be in touch within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm text-foreground/80 mb-2">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg bg-input-background border ${
                      formErrors.name ? "border-destructive" : "border-border"
                    } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                    placeholder="Your name"
                  />
                  {formErrors.name && <p className="text-destructive text-sm mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-foreground/80 mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg bg-input-background border ${
                      formErrors.email ? "border-destructive" : "border-border"
                    } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && <p className="text-destructive text-sm mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="business_type" className="block text-sm text-foreground/80 mb-2">
                    Type of Business
                  </label>
                  <select
                    id="business_type"
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3 rounded-lg bg-input-background border ${
                      formErrors.business_type ? "border-destructive" : "border-border"
                    } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                  >
                    <option value="">Select...</option>
                    <option value="Real estate">Real estate</option>
                    <option value="Coach">Coach</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Creator">Creator</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.business_type && (
                    <p className="text-destructive text-sm mt-1">{formErrors.business_type}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-foreground/80 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows={6}
                    maxLength={2000}
                    className={`w-full px-4 py-3 rounded-lg bg-input-background border ${
                      formErrors.message ? "border-destructive" : "border-border"
                    } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none`}
                    placeholder="Tell us about your project..."
                  />
                  {formErrors.message && <p className="text-destructive text-sm mt-1">{formErrors.message}</p>}
                </div>

                <div>
                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken("")}
                    onExpire={() => setTurnstileToken("")}
                    options={{ theme: "dark" }}
                  />
                </div>

                {submitError && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-destructive text-sm">{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="glow-button-primary w-full px-8 py-4 rounded-xl text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                <Lightbulb className="w-5 h-5 text-primary" strokeWidth={2.5} />
              </div>
              <span className="text-sm tracking-tight">
                <span className="text-primary">great idea</span>
                <span className="text-muted-foreground"> cs</span>
              </span>
            </div>
            <p className="text-sm text-foreground/60">
              © 2026 great idea cs. AI-powered solutions for the digital age.
            </p>
          </div>
        </div>
      </footer>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />

      {isAdminMode && <AdminCard />}
    </div>
  );
}
