import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AnimeStory from "@/components/story/AnimeStory";
import { glowupTools } from "@/data/tools";
import {
  ArrowRight,
  MessageSquare,
  Compass,
  Smile,
} from "lucide-react";

const processSteps = [
  {
    number: "01",
    title: "Choose a situation",
    copy: "Pick a moment that feels familiar — a message, a class, a room you want to walk into with more ease.",
  },
  {
    number: "02",
    title: "Practice expressing yourself",
    copy: "Try the words in a quiet space first. Adjust the tone until it sounds like you, not a script.",
  },
  {
    number: "03",
    title: "Learn and grow",
    copy: "Carry the small win into real life. Confidence here is built in repeats, not reinventions.",
  },
];

const toolIcons = {
  "message-helper": MessageSquare,
  "conversation-coach": Compass,
  "practice-mode": Smile,
};

export default function Home() {
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <Navbar />

      <main className="relative">
        <AnimeStory>
          <div className="max-w-xl">
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              For college conversations
            </p>

            <h1 className="display-heading mt-5">
              Become the version of yourself you&apos;re proud of.
            </h1>

            <p className="lede mt-6 text-lg">
              Build confidence in the way you communicate, express yourself,
              and navigate everyday college life, without performing a
              different personality.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/tools" className="btn btn-primary">
                Open the tools
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="#tools" className="btn btn-secondary">
                Skip the story
              </Link>
            </div>

            <p className="mt-8 flex items-center gap-2 text-sm text-text-secondary">
              <span className="h-px w-8 bg-accent-secondary/60" aria-hidden="true" />
              Scroll to watch &ldquo;A Little More You&rdquo;
            </p>
          </div>
        </AnimeStory>

        <section
          id="tools"
          className="scroll-mt-24 py-[var(--section-y)]"
        >
          <div id="features" className="container-page scroll-mt-24">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Three tools, one practice</p>
                <h2 className="section-heading mt-3">
                  Support for the moments that stall you.
                </h2>
              </div>
              <p className="lede md:max-w-sm">
                Three tools you can try now. They use AI to suggest wording
                and to play practice partners, and each result tells you
                whether it came from AI.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-12">
              {glowupTools.map((tool, index) => {
                const Icon = toolIcons[tool.id];
                const featured = index === 0;

                return (
                  <article
                    key={tool.id}
                    className={`feature-card flex flex-col ${featured ? "feature-card--featured lg:col-span-7" : "lg:col-span-5"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-serif text-3xl italic text-accent-secondary/80">
                        {tool.number}
                      </span>
                    </div>

                    <div
                      className={`mt-8 grid h-12 w-12 place-items-center rounded-xl ${
                        tool.identity === "coral"
                          ? "bg-accent text-text-dark"
                          : tool.identity === "peach"
                            ? "bg-accent-secondary text-text-dark"
                            : "bg-background-soft text-accent-secondary"
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <h3 className="mt-5 font-serif text-2xl font-medium tracking-tight text-foreground">
                      {tool.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-accent-secondary">
                      {tool.tagline}
                    </p>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
                      {tool.description}
                    </p>

                    {featured ? (
                      <ul className="mt-8 space-y-3 text-sm text-text-secondary">
                        {tool.highlights.map((feature) => (
                          <li key={feature} className="flex gap-2.5">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-6 text-xs text-text-secondary">{tool.detail}</p>
                    )}

                    <Link
                      href={tool.href}
                      className="btn btn-secondary btn-sm mt-8 self-start"
                    >
                      Open {tool.title}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 py-[var(--section-y)]">
          <div className="container-page">
            <p className="eyebrow">A quiet process</p>
            <h2 className="section-heading mt-3">How GlowUp works</h2>
            <p className="lede mt-4">
              No leaderboards. No personality makeover. Just a repeatable way
              to prepare for real conversations.
            </p>

            <ol className="relative mt-14 grid gap-5 lg:grid-cols-3 lg:gap-8">
              <span
                className="pointer-events-none absolute top-[2rem] right-[8%] left-[8%] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
                aria-hidden="true"
              />

              {processSteps.map((step) => (
                <li key={step.number} className="process-card relative">
                  <div className="relative z-10 flex items-start gap-4 lg:block">
                    <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-background font-serif text-lg italic text-accent shadow-[0_12px_28px_-18px_rgba(255,128,102,0.9)]">
                      {step.number}
                    </span>
                    <div className="lg:mt-7">
                      <h3 className="font-serif text-2xl font-medium text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary sm:text-base">
                        {step.copy}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-24 border-y border-border bg-[rgba(255,248,243,0.02)] py-[var(--section-y)]"
        >
          <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="eyebrow">Why GlowUp exists</p>
              <h2 className="section-heading mt-3">
                You already have a voice. Some days it just needs a clearer
                path out.
              </h2>
              <p className="lede mt-6">
                College is full of small interactions that can take more energy
                than they look like they should. GlowUp is a calm practice
                space for those moments — drafting, rehearsing, and showing up
                as yourself.
              </p>
              <p className="lede mt-4">
                This is not a request to become louder, sparkier, or someone
                else. The work is simpler: find language that feels honest, and
                use it when you are ready.
              </p>
            </div>

            <blockquote className="quote-card p-8 sm:p-10">
              <p className="font-serif text-2xl leading-snug text-foreground sm:text-[1.85rem]">
                “Confidence here is not a costume. It is the feeling of sending
                the message, joining the table, and still recognizing yourself
                afterwards.”
              </p>
              <footer className="mt-6 text-sm text-text-secondary">
                The GlowUp idea, built with care
              </footer>
            </blockquote>
          </div>
        </section>

        <section className="py-[var(--section-y)]">
          <div className="container-page">
            <div className="cta-panel grid overflow-hidden border border-border lg:grid-cols-[1.3fr_0.7fr]">
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="eyebrow">Begin quietly</p>
                <h2 className="section-heading mt-3">
                  Start with one conversation, not a new identity.
                </h2>
                <p className="lede mt-5">
                  Try a tool when you are ready, or scroll back up to the
                  story whenever you want a gentler way in.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-3 border-t border-border bg-[rgba(255,248,243,0.02)] p-8 sm:p-12 lg:border-t-0 lg:border-l">
                <Link href="/tools" className="btn btn-primary">
                  Open the tools
                </Link>
                <Link href="#story" className="btn btn-secondary">
                  Replay the story
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
