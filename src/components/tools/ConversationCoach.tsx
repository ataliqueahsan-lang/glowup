"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { useDraft, useDraftChoice, useHydrated, useLifecycleLog } from "@/lib/clientState";
import { postJson } from "@/lib/postJson";
import { MAX_CONTEXT_CHARS, SITUATIONS } from "@/lib/toolOptions";
import type { CoachResponse } from "@/lib/types";
import ChoiceGroup from "./ChoiceGroup";
import { CopyButton, ErrorNote, ModeNote, PrivacyNote, Spinner, fieldClass } from "./ui";

export default function ConversationCoach() {
  useLifecycleLog("ConversationCoach");
  const hydrated = useHydrated();
  const [situation, setSituation] = useDraftChoice("cc:situation", SITUATIONS[0].id);
  const [context, setContext] = useDraft("cc:context");
  const [result, setResult] = useState<(CoachResponse & { situation: string }) | null>(null);
  const [previous, setPrevious] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inFlight = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  async function generate(isRegenerate: boolean) {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    const prior = isRegenerate && result?.situation === situation ? previous : [];
    const controller = new AbortController();
    abortRef.current = controller;
    const res = await postJson<CoachResponse>(
      "/api/conversation-coach",
      { situation, context: context.trim(), previous: prior },
      controller.signal,
    );
    inFlight.current = false;
    if (!res.ok) {
      if (res.aborted) return;
      setLoading(false);
      setError(res.error);
      return;
    }
    setLoading(false);
    setResult({ ...res.data, situation });
    setPrevious([...prior, ...res.data.openers.map((o) => o.line)].slice(-6));
  }

  const situationLabel = SITUATIONS.find((s) => s.id === result?.situation)?.label;

  return (
    <div className="tool-panel-grid p-6 sm:p-8" data-split="coach">
      <div className="min-w-0">
        <ChoiceGroup legend="What is the situation?" name="cc-situation" options={SITUATIONS} value={situation} onChange={setSituation} layout="list" disabled={!hydrated} />

        <label htmlFor="cc-context" className="eyebrow mt-6 block">
          Tell us a bit more (optional)
        </label>
        <textarea
          id="cc-context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          maxLength={MAX_CONTEXT_CHARS}
          rows={4}
          disabled={!hydrated}
          placeholder="For example: first week of semester, I sit near them in physics but we have never spoken."
          className={`${fieldClass} resize-y`}
        />
        <p className="mt-1.5 text-right text-xs text-text-secondary">
          {context.length}/{MAX_CONTEXT_CHARS}
        </p>

        {error && <ErrorNote message={error} />}

        <button type="button" onClick={() => generate(false)} disabled={loading || !hydrated} className="btn btn-primary mt-6 w-full sm:w-auto">
          {loading ? <Spinner /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
          {loading ? "Thinking it through..." : "Get conversation ideas"}
        </button>
        <PrivacyNote />
      </div>

      <div className="result-pane" aria-live="polite" aria-busy={loading}>
        <p className="eyebrow">Your ideas</p>

        {loading && !result && (
          <div className="mt-4 space-y-3" aria-hidden="true">
            <div className="h-4 w-full animate-pulse rounded bg-background-soft" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-background-soft" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-background-soft" />
          </div>
        )}

        {!loading && !result && (
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Choose a situation and you will get three openers, follow-up questions, ideas for different replies, and
            tips on reading the moment. Everything here is a suggestion to adapt, not a script.
          </p>
        )}

        {result && (
          <div className={`space-y-7 ${loading ? "opacity-60" : ""}`}>
            <div className="mt-2 space-y-2">
              {situationLabel ? <p className="text-sm font-medium text-foreground">{situationLabel}</p> : null}
              <ModeNote mode={result.mode} />
            </div>

            <section>
              <h3 className="font-serif text-lg text-foreground">Ways to start</h3>
              <ul className="mt-3 space-y-3">
                {result.openers.map((o) => (
                  <li key={o.line} className="rounded-xl border border-border bg-background-secondary/60 p-4">
                    <p className="text-sm leading-relaxed text-foreground">{o.line}</p>
                    {o.note && <p className="mt-1.5 text-xs text-text-secondary">{o.note}</p>}
                    <div className="mt-3">
                      <CopyButton text={o.line} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {result.followUps.length > 0 && (
              <section>
                <h3 className="font-serif text-lg text-foreground">To keep it going</h3>
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  {result.followUps.map((q) => (
                    <li key={q} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {q}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {result.replies.length > 0 && (
              <section>
                <h3 className="font-serif text-lg text-foreground">If they reply...</h3>
                <ul className="mt-3 space-y-3">
                  {result.replies.map((r) => (
                    <li key={r.theySay} className="rounded-xl border border-border p-4 text-sm">
                      <p className="text-text-secondary">
                        <span className="font-semibold text-accent-secondary">They say: </span>
                        {r.theySay}
                      </p>
                      <p className="mt-2 text-foreground">
                        <span className="font-semibold text-accent-secondary">You could say: </span>
                        {r.youCouldSay}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              {result.cues.length > 0 && (
                <section>
                  <h3 className="font-serif text-lg text-foreground">Reading the moment</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary">
                    {result.cues.map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                    Cues can mean many things. Treat them as hints, not facts about what someone thinks.
                  </p>
                </section>
              )}
              {result.boundaries.length > 0 && (
                <section>
                  <h3 className="font-serif text-lg text-foreground">Respecting boundaries</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary">
                    {result.boundaries.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <p className="text-xs leading-relaxed text-text-secondary">
              People respond in many different ways, and no line works every time. Go at a pace that feels
              comfortable, and it is always okay to step away.
            </p>

            {result.mode === "ai" && (
              <button type="button" onClick={() => generate(true)} disabled={loading} className="btn btn-secondary btn-sm">
                {loading ? <Spinner /> : <RefreshCw className="h-4 w-4" aria-hidden="true" />}
                Get fresh ideas
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
