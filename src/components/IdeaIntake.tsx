"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  ArrowRight,
  Loader2,
  Send,
  Sparkles,
  PencilLine,
  Quote,
} from "lucide-react";

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

const OPENING_QUESTION = "What are you dreaming up?";

const STARTER_IDEAS = [
  "I have a business that needs a better website…",
  "There's an app I keep wishing existed…",
  "I want AI to take the busywork off my plate…",
  "I have a creative project I can't stop thinking about…",
  "Honestly, it's still just a feeling…",
];

type Exchange = { question: string; answer: string };

type Synthesis = {
  title: string;
  summary: string;
  spark_quote: string;
  encouragement: string;
};

type Step = {
  reflection: string;
  question: string | null;
  suggestions: string[];
  done: boolean;
  synthesis: Synthesis | null;
};

type Stage = "spark" | "guiding" | "synthesis" | "sent";

const beatVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(6px)" },
};

export default function IdeaIntake() {
  const [mode, setMode] = useState<"guided" | "classic">("guided");
  const [stage, setStage] = useState<Stage>("spark");

  // Guided flow state
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [step, setStep] = useState<Step | null>(null);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [synthesis, setSynthesis] = useState<Synthesis | null>(null);
  const [editedSummary, setEditedSummary] = useState("");
  const [editingSummary, setEditingSummary] = useState(false);

  // Contact details (shared by both modes)
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

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Speculative prefetch: chip answers are requested in the background the
  // moment they're shown, so a click usually lands on a ready response.
  type CacheEntry = { promise: Promise<Step | null>; result?: Step | null };
  const prefetchCache = useRef<Map<string, CacheEntry>>(new Map());

  useEffect(() => {
    if (stage === "guiding" && !isThinking) inputRef.current?.focus();
  }, [stage, isThinking, step]);

  const currentQuestion =
    exchanges.length === 0 ? OPENING_QUESTION : step?.question ?? "";

  const stripChip = (s: string) => s.replace(/(\.\.\.|…)$/, "").trim();

  async function fetchStep(nextExchanges: Exchange[]): Promise<Step | null> {
    try {
      const res = await fetch("/v1/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchanges: nextExchanges }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) return null;
      return data.step as Step;
    } catch {
      return null;
    }
  }

  function prefetch(answer: string) {
    const trimmed = answer.trim();
    if (!trimmed) return;
    const key = `${exchanges.length}|${trimmed}`;
    if (prefetchCache.current.has(key)) return;
    const nextExchanges: Exchange[] = [
      ...exchanges,
      { question: currentQuestion, answer: trimmed },
    ];
    const entry: CacheEntry = { promise: fetchStep(nextExchanges) };
    entry.promise.then((r) => {
      entry.result = r;
    });
    prefetchCache.current.set(key, entry);
  }

  // Prefetch every suggestion as soon as a new beat renders.
  useEffect(() => {
    if (stage === "guiding" && step && !step.done) {
      step.suggestions.forEach((s) => prefetch(stripChip(s)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, stage]);

  // Prefetch the opening starters on first engagement with the card.
  const warmedStarters = useRef(false);
  function warmStarters() {
    if (warmedStarters.current || stage !== "spark") return;
    warmedStarters.current = true;
    STARTER_IDEAS.forEach((s) => prefetch(stripChip(s)));
  }

  function applyStep(next: Step) {
    setStep(next);
    if (next.done && next.synthesis) {
      setSynthesis(next.synthesis);
      setEditedSummary(next.synthesis.summary);
      setStage("synthesis");
    }
  }

  function failToClassic(nextExchanges: Exchange[]) {
    setFormData((prev) => ({
      ...prev,
      message: nextExchanges.map((e) => e.answer).join("\n\n"),
    }));
    setSubmitError(
      "Our idea guide is taking a breather — the quick form below works just as well."
    );
    setMode("classic");
  }

  async function advance(answer: string) {
    const trimmed = answer.trim();
    if (!trimmed || isThinking) return;

    const key = `${exchanges.length}|${trimmed}`;
    const cached = prefetchCache.current.get(key);

    const nextExchanges: Exchange[] = [
      ...exchanges,
      { question: currentQuestion, answer: trimmed },
    ];
    setExchanges(nextExchanges);
    setInput("");
    if (stage === "spark") setStage("guiding");

    // Already resolved prefetch → apply instantly, no thinking state at all.
    if (cached?.result && !(cached.result.done && !cached.result.synthesis)) {
      applyStep(cached.result);
      return;
    }

    setIsThinking(true);
    try {
      const next = cached ? await cached.promise : await fetchStep(nextExchanges);
      if (next && !(next.done && !next.synthesis)) {
        applyStep(next);
      } else {
        failToClassic(nextExchanges);
      }
    } finally {
      setIsThinking(false);
    }
  }

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

  async function submitLead(message: string) {
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
      if (message) payload.message = message.slice(0, 2000);

      const response = await fetch("https://api.greatidea-cs.com/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok && data.ok) {
        setSubmitSuccess(true);
        setStage("sent");
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
  }

  /* ---------- Success (both modes) ---------- */
  if (submitSuccess) {
    return (
      <div className="glow-card p-6 sm:p-8 md:p-12 rounded-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 subtle-glow">
            <Send className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl mb-3">
            {synthesis ? "Your idea is on its way" : "Thanks for reaching out!"}
          </h3>
          <p className="text-foreground/70 max-w-md mx-auto">
            {synthesis
              ? "Tim reads every one of these personally. Expect a thoughtful reply within one business day — this is the fun part."
              : "We'll be in touch within one business day."}
          </p>
        </motion.div>
      </div>
    );
  }

  /* ---------- Classic form fallback ---------- */
  if (mode === "classic") {
    return (
      <div className="glow-card p-6 sm:p-8 md:p-12 rounded-2xl">
        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-foreground/80 text-sm">{submitError}</p>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitLead(formData.message);
          }}
          className="space-y-6"
        >
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
            {formErrors.name && (
              <p className="text-destructive text-sm mt-1">{formErrors.name}</p>
            )}
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
            {formErrors.email && (
              <p className="text-destructive text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="business_type"
              className="block text-sm text-foreground/80 mb-2"
            >
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
            {formErrors.message && (
              <p className="text-destructive text-sm mt-1">{formErrors.message}</p>
            )}
          </div>

          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setTurnstileToken("")}
            onExpire={() => setTurnstileToken("")}
            options={{ theme: "dark" }}
          />

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
        <button
          type="button"
          onClick={() => {
            setSubmitError("");
            setMode("guided");
          }}
          className="mt-6 text-sm text-foreground/50 hover:text-primary transition-colors mx-auto block"
        >
          Try the guided version instead
        </button>
      </div>
    );
  }

  /* ---------- Synthesis review ---------- */
  if (stage === "synthesis" && synthesis) {
    return (
      <div className="glow-card p-6 sm:p-8 md:p-12 rounded-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6 subtle-glow">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/90">Your idea, in focus</span>
          </div>

          <h3 className="text-2xl md:text-3xl mb-2">{synthesis.title}</h3>

          <div className="flex items-start gap-2 text-foreground/50 italic mb-6">
            <Quote className="w-4 h-4 mt-1 shrink-0" />
            <span>&ldquo;{synthesis.spark_quote}&rdquo;</span>
          </div>

          {editingSummary ? (
            <textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              rows={7}
              maxLength={1600}
              autoFocus
              onBlur={() => setEditingSummary(false)}
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-primary/40 text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none mb-2"
            />
          ) : (
            <p className="text-foreground/85 leading-relaxed text-lg mb-2 whitespace-pre-line">
              {editedSummary}
            </p>
          )}
          <button
            type="button"
            onClick={() => setEditingSummary(!editingSummary)}
            className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-primary transition-colors mb-6"
          >
            <PencilLine className="w-3.5 h-3.5" />
            {editingSummary ? "Done editing" : "Edit — these are your words"}
          </button>

          <p className="text-primary/90 mb-8">{synthesis.encouragement}</p>

          <div className="border-t border-border pt-8 space-y-5">
            <p className="text-foreground/70 text-sm">
              Send it to Tim and the conversation starts from here — not from a blank page.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                placeholder="Your name"
                className={`w-full px-4 py-3 rounded-lg bg-input-background border ${
                  formErrors.name ? "border-destructive" : "border-border"
                } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-lg bg-input-background border ${
                  formErrors.email ? "border-destructive" : "border-border"
                } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
              />
            </div>
            {(formErrors.name || formErrors.email) && (
              <p className="text-destructive text-sm">
                {formErrors.name || formErrors.email}
              </p>
            )}

            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken("")}
              onExpire={() => setTurnstileToken("")}
              options={{ theme: "dark" }}
            />

            {submitError && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-destructive text-sm">{submitError}</p>
              </div>
            )}

            <button
              type="button"
              disabled={isSubmitting || !formData.name || !formData.email}
              onClick={() =>
                submitLead(`${synthesis.title}\n\n${editedSummary}`)
              }
              className="glow-button-primary w-full px-8 py-4 rounded-xl text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send My Idea
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ---------- Spark + guided beats ---------- */
  return (
    <div
      className="glow-card p-6 sm:p-8 md:p-12 rounded-2xl"
      onPointerEnter={warmStarters}
      onTouchStart={warmStarters}
    >
      {/* Progress dots */}
      {stage === "guiding" && (
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i < exchanges.length
                  ? "w-8 bg-primary/70"
                  : "w-4 bg-muted"
              }`}
            />
          ))}
          <span className="text-xs text-foreground/40 ml-2">
            a few quick beats — no wrong answers
          </span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isThinking ? (
          <motion.div
            key="thinking"
            variants={beatVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="py-10"
          >
            <div className="flex items-center gap-3 text-foreground/60">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="italic">listening between the lines…</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`beat-${exchanges.length}`}
            variants={beatVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            {/* Reflection from the previous answer */}
            {step?.reflection && stage === "guiding" && (
              <p className="text-primary/90 mb-5 leading-relaxed">
                {step.reflection}
              </p>
            )}

            <h3 className="text-2xl md:text-3xl mb-3 leading-snug">
              {exchanges.length === 0 ? (
                <>
                  What are you{" "}
                  <span className="text-primary neon-text">dreaming up</span>?
                </>
              ) : (
                step?.question
              )}
            </h3>

            {exchanges.length === 0 && (
              <>
                <p className="text-foreground/60 mb-6">
                  Don&apos;t worry about saying it right. A sentence, a feeling, a
                  half-formed thought — that&apos;s plenty to start.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {STARTER_IDEAS.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => advance(s.replace(/…$/, ""))}
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl text-base text-left bg-gradient-to-r from-primary/25 to-secondary/25 border border-primary/40 text-foreground hover:from-primary/40 hover:to-secondary/40 hover:border-primary/70 hover:-translate-y-0.5 transition-all subtle-glow"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Suggestion chips */}
            {stage === "guiding" && (step?.suggestions?.length ?? 0) > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 mt-4">
                {step!.suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => advance(s.replace(/(\.\.\.|…)$/, ""))}
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl text-base text-left bg-gradient-to-r from-primary/25 to-secondary/25 border border-primary/40 text-foreground hover:from-primary/40 hover:to-secondary/40 hover:border-primary/70 hover:-translate-y-0.5 transition-all subtle-glow"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                advance(input);
              }}
              className="mt-4"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    advance(input);
                  }
                }}
                rows={3}
                maxLength={2000}
                placeholder={
                  exchanges.length === 0
                    ? "I keep thinking about…"
                    : "Say it however it comes…"
                }
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-border text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
              <div className="flex items-center justify-between gap-4 mt-3">
                <span className="hidden sm:inline text-xs text-foreground/40">
                  Enter to send · Shift+Enter for a new line
                </span>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="glow-button-primary w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-lg text-sm text-primary-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {exchanges.length === 0 ? "Let's shape it" : "Continue"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setMode("classic")}
        className="mt-8 text-sm text-foreground/40 hover:text-primary transition-colors mx-auto block"
      >
        Prefer a simple form? It&apos;s right here.
      </button>
    </div>
  );
}
