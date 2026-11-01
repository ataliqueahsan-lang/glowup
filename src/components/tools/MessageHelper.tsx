"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { useDraft, useDraftChoice, useHydrated, useLifecycleLog } from "@/lib/clientState";
import { postJson } from "@/lib/postJson";
import { MAX_MESSAGE_CHARS, OBJECTIVES, RECIPIENTS, TONES } from "@/lib/toolOptions";
import type { MessageHelperResponse } from "@/lib/types";
import ChoiceGroup from "./ChoiceGroup";
import { CopyButton, ErrorNote, ModeNote, PrivacyNote, Spinner, fieldClass } from "./ui";

type Result = MessageHelperResponse & { original: string };

export default function MessageHelper() {
  useLifecycleLog("MessageHelper");
  const hydrated = useHydrated();

  // The message and options live in an in-memory draft store, so nothing the
  // user typed is lost if this component is ever remounted.
  const [message, setMessage] = useDraft("mh:message");
  const [recipient, setRecipient] = useDraftChoice("mh:recipient", RECIPIENTS[0].id);
  const [tone, setTone] = useDraftChoice("mh:tone", TONES[0].id);
  const [objective, setObjective] = useDraftChoice("mh:objective", OBJECTIVES[0].id);

  const [result, setResult] = useState<Result | null>(null);
  const [previous, setPrevious] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inFlight = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const lastSource = useRef("");

  useEffect(() => () => abortRef.current?.abort(), []);

  async function generate(isRegenerate: boolean) {
    if (inFlight.current) return; // ignore double clicks and double Enter
    const text = message.trim();
    if (!text) {
      setError("Please type or paste a message first.");
      return;
    }
    inFlight.current = true;
    setLoading(true);
    setError(null);

    // "Another version" only avoids earlier versions of the same message.
    const prior = isRegenerate && lastSource.current === text ? previous : [];
    const controller = new AbortController();
    abortRef.current = controller;

    const res = await postJson<MessageHelperResponse>(
      "/api/message-helper",
      { message: text, recipient, tone, objective, previous: prior },
      controller.signal,
    );
    inFlight.current = false;

    if (!res.ok) {
      if (res.aborted) return; // component went away
      setLoading(false);
      setError(res.error); // the message stays exactly as the user typed it
      return;
    }
    setLoading(false);
    lastSource.current = text;
    setResult({ ...res.data, original: text });
    setPrevious([...prior, res.data.improved].slice(-3));
  }

  function clearAll() {
    setMessage("");
    setResult(null);
    setPrevious([]);
    setError(null);
    lastSource.current = "";
  }

  return (
    <div className="tool-panel-grid p-6 sm:p-8">
      <div className="min-w-0">
        <label htmlFor="mh-message" className="eyebrow">
          Your message
        </label>
        <textarea
          id="mh-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={MAX_MESSAGE_CHARS}
          rows={6}
          disabled={!hydrated}
          placeholder={hydrated ? "Type or paste what you want to say..." : "Loading..."}
          className={`${fieldClass} resize-y`}
        />
        <div className="mt-1.5 flex items-center justify-between gap-3 text-xs text-text-secondary">
          <button
            type="button"
            onClick={clearAll}
            disabled={!message && !result}
            className="font-semibold text-accent-secondary underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
          >
            Clear message
          </button>
          <span>
            {message.length}/{MAX_MESSAGE_CHARS}
          </span>
        </div>

        <div className="mt-5 space-y-5">
          <ChoiceGroup legend="Who is it for?" name="mh-recipient" options={RECIPIENTS} value={recipient} onChange={setRecipient} disabled={!hydrated} />
          <ChoiceGroup legend="Tone" name="mh-tone" options={TONES} value={tone} onChange={setTone} disabled={!hydrated} />
          <ChoiceGroup legend="What do you want help with?" name="mh-objective" options={OBJECTIVES} value={objective} onChange={setObjective} disabled={!hydrated} />
        </div>

        {error && <ErrorNote message={error} />}

        <button
          type="button"
          onClick={() => generate(false)}
          disabled={loading || !hydrated}
          className="btn btn-primary mt-6 w-full sm:w-auto"
        >
          {loading ? <Spinner /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
          {loading ? "Working on it..." : "Improve my message"}
        </button>
        <PrivacyNote />
      </div>

      <div className="result-pane" aria-live="polite" aria-busy={loading}>
        <p className="eyebrow">Improved version</p>

        {loading && !result && (
          <div className="mt-4 space-y-3" aria-hidden="true">
            <div className="h-4 w-full animate-pulse rounded bg-background-soft" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-background-soft" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-background-soft" />
          </div>
        )}

        {!loading && !result && (
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Write your message, pick who it is for, and your improved version will show up here. You can copy it,
            ask for another version, and compare it with your original.
          </p>
        )}

        {result && (
          <div className={loading ? "opacity-60" : ""}>
            <div className="mt-2">
              <ModeNote mode={result.mode} />
            </div>

            <div className="mt-4 whitespace-pre-wrap rounded-xl border border-accent/40 bg-background-secondary/70 px-4 py-4 text-sm leading-relaxed text-foreground">
              {result.improved}
            </div>

            {result.notes.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-xs leading-relaxed text-text-secondary">
                {result.notes.map((n) => (
                  <li key={n}>• {n}</li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <CopyButton text={result.improved} />
              {result.mode === "ai" ? (
                <button type="button" onClick={() => generate(true)} disabled={loading} className="btn btn-secondary btn-sm">
                  {loading ? <Spinner /> : <RefreshCw className="h-4 w-4" aria-hidden="true" />}
                  Try another version
                </button>
              ) : null}
            </div>
            <p className="mt-3 text-xs text-text-secondary">
              Not quite right? Edit your message on the left and press Improve again.
            </p>

            <details open className="mt-6 rounded-xl border border-border px-4 py-3">
              <summary className="cursor-pointer text-sm font-medium text-foreground">Compare with your original</summary>
              <div className="mt-3 grid gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Original</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{result.original}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-secondary">Improved</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{result.improved}</p>
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
