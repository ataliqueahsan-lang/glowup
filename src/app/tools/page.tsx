import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, MessageSquare, Smile } from "lucide-react";
import LegacyHashRedirect from "@/components/tools/LegacyHashRedirect";
import { glowupTools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Tools | GlowUp",
  description: "Message Helper, Conversation Coach and Practice Mode: three tools for everyday college conversations.",
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    type: "website",
    url: "/tools",
    title: "Tools | GlowUp",
    description: "Message Helper, Conversation Coach and Practice Mode: three tools for everyday college conversations.",
  },
  twitter: {
    card: "summary",
    title: "Tools | GlowUp",
    description: "Message Helper, Conversation Coach and Practice Mode: three tools for everyday college conversations.",
  },
};

const icons = {
  "message-helper": MessageSquare,
  "conversation-coach": Compass,
  "practice-mode": Smile,
} as const;

export default function ToolsPage() {
  return (
    <>
      <LegacyHashRedirect />

      <header className="max-w-2xl">
        <p className="eyebrow">Tools</p>
        <h1 className="display-heading mt-3 text-[clamp(2.2rem,5vw,3.6rem)]">Pick a place to start.</h1>
        <p className="lede mt-5">
          Draft a message, prepare for a conversation, or practise one first. Each tool opens on its own page, and
          you can switch between them any time.
        </p>
      </header>

      <aside className="glass mt-10 p-5 sm:p-6">
        <p className="font-serif text-lg text-foreground">Honest about AI</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
          These tools use an AI model to suggest wording, openers and practice replies. Every result says whether it
          came from AI or from a basic demo. Suggestions are starting points, and you decide what to say or send.
        </p>
      </aside>

      <ul className="mt-10 grid gap-5 lg:grid-cols-3">
        {glowupTools.map((tool) => {
          const Icon = icons[tool.id];
          return (
            <li key={tool.id} className="flex">
              <Link
                href={tool.href}
                className="glass group flex w-full flex-col p-6 transition-transform duration-200 hover:-translate-y-0.5 sm:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-serif text-2xl italic text-accent-secondary/80">{tool.number}</span>
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl ${
                      tool.identity === "coral"
                        ? "bg-accent text-text-dark"
                        : tool.identity === "peach"
                          ? "bg-accent-secondary text-text-dark"
                          : "bg-background-soft text-accent-secondary"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <h2 className="mt-6 font-serif text-2xl font-medium text-foreground">{tool.title}</h2>
                <p className="mt-2 text-sm font-medium text-accent-secondary">{tool.tagline}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{tool.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  Open {tool.title}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
