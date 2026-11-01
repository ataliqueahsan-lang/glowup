import Link from "next/link";
import { ArrowLeft, Compass, MessageSquare, Smile } from "lucide-react";
import { glowupTools, type ToolId } from "@/data/tools";

const icons = {
  "message-helper": MessageSquare,
  "conversation-coach": Compass,
  "practice-mode": Smile,
} as const;

/** Shared frame for every tool page: back link, title, switcher, honest AI note. */
export default function ToolShell({ id, children }: { id: ToolId; children: React.ReactNode }) {
  const tool = glowupTools.find((t) => t.id === id) ?? glowupTools[0];
  const Icon = icons[tool.id];

  return (
    <>
      <Link
        href="/tools"
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All tools
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-text-dark">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="eyebrow">Tool {tool.number}</p>
            <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              {tool.title}
            </h1>
          </div>
        </div>

        <nav aria-label="Switch tool" className="glass-pill !p-1">
          {glowupTools.map((t) => (
            <Link
              key={t.id}
              href={t.href}
              aria-current={t.id === id ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                t.id === id ? "bg-accent text-text-dark" : "text-text-secondary hover:text-foreground"
              }`}
            >
              {t.title}
            </Link>
          ))}
        </nav>
      </header>

      <p className="lede mt-4">{tool.tagline} {tool.detail}</p>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Good for">
        {tool.samplePrompts.map((prompt) => (
          <li
            key={prompt}
            className="rounded-full border border-border bg-background-secondary/50 px-3.5 py-1.5 text-xs text-text-secondary"
          >
            {prompt}
          </li>
        ))}
      </ul>

      <section aria-label={tool.title} className="glass mt-8 overflow-hidden">
        {children}
      </section>
    </>
  );
}
