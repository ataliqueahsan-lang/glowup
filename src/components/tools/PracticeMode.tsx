"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Send } from "lucide-react";
import { useDraft, useDraftChoice, useHydrated, useLifecycleLog } from "@/lib/clientState";
import { postJson } from "@/lib/postJson";
import { MAX_PRACTICE_TURNS, MAX_TURN_CHARS, SCENARIOS } from "@/lib/toolOptions";
import type {
  FeedbackLevel,
  PracticeFeedbackResponse,
  PracticeReplyResponse,
  PracticeTurn,
} from "@/lib/types";
import ChoiceGroup from "./ChoiceGroup";
import { ErrorNote, ModeNote, PrivacyNote, Spinner, fieldClass } from "./ui";

type Phase = "choose" | "chat" | "feedback";

const levelClass: Record<FeedbackLevel, string> = {
  Strong: "bg-accent text-text-dark",
  Solid: "border border-accent-secondary text-accent-secondary",
  "Getting started": "border border-border text-text-secondary",
};

const scenarioOptions = SCENARIOS.map((s) => ({ id: s.id, label: s.title, hint: s.description }));

export default function PracticeMode() {
  useLifecycleLog("PracticeMode");
  const hydrated = useHydrated();
  const [scenarioId, setScenarioId] = useDraftChoice("pm:scenario", SCENARIOS[0].id);
  const [draft, setDraft] = useDraft("pm:draft");
  const [phase, setPhase] = useState<Phase>("choose");
  const [turns, setTurns] = useState<PracticeTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ai, setAi] = useState<"checking" | "ready" | "missing" | "unreachable">("checking");
  const [failedSend, setFailedSend] = useState(false);
  const [feedback, setFeedback] = useState<PracticeFeedbackResponse | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const userTurnCount = turns.filter((t) => t.role === "user").length;
  const atLimit = userTurnCount >= MAX_PRACTICE_TURNS;

  async function checkAi() {
    setAi("checking");
    const res = await postJson<{ ai: boolean }>("/api/practice", { action: "status" });
    setAi(res.ok ? (res.data.ai ? "ready" : "missing") : "unreachable");
  }

  useEffect(() => {
    let cancelled = false;
    postJson<{ ai: boolean }>("/api/practice", { action: "status" }).then((res) => {
      if (!cancelled) setAi(res.ok ? (res.data.ai ? "ready" : "missing") : "unreachable");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, loading]);

  async function start() {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    const res = await postJson<PracticeReplyResponse>(
      "/api/practice",
      { action: "start", scenario: scenarioId },
      controller.signal,
    );
    inFlight.current = false;
    if (!res.ok) {
      if (res.aborted) return;
      setLoading(false);
      setError(res.error); // stays on the scenario screen so you can try again
      return;
    }
    setLoading(false);
    setTurns([{ role: "partner", text: res.data.reply }]);
    setDraft("");
    setFeedback(null);
    setFailedSend(false);
    setPhase("chat");
  }

  function backToChoose() {
    abortRef.current?.abort();
    inFlight.current = false;
    setLoading(false);
    setPhase("choose");
    setTurns([]);
    setDraft("");
    setError(null);
    setFeedback(null);
    setFailedSend(false);
  }

  async function send() {
    if (inFlight.current || atLimit) return;
    const text = draft.trim();
    if (!text) {
      setError("Write a reply first. There is no rush.");
      return;
    }
    inFlight.current = true;
    const before = turns;
    const next: PracticeTurn[] = [...turns, { role: "user", text }];
    setTurns(next);
    setDraft("");
    setError(null);
    setFailedSend(false);
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    const res = await postJson<PracticeReplyResponse>(
      "/api/practice",
      { action: "reply", scenario: scenarioId, turns: next },
      controller.signal,
    );
    inFlight.current = false;

    if (!res.ok) {
      if (res.aborted) return;
      // Nothing is lost: the conversation goes back to how it was, and the text returns to the box.
      setLoading(false);
      setTurns(before);
      setDraft(text);
      setError(res.error);
      setFailedSend(true);
      return;
    }
    setLoading(false);
    setTurns([...next, { role: "partner", text: res.data.reply }]);
  }

  async function finish() {
    if (inFlight.current) return;
    if (userTurnCount === 0) {
      setError("Say at least one thing in the conversation first, then you can get feedback.");
      return;
    }
    inFlight.current = true;
    setError(null);
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const res = await postJson<PracticeFeedbackResponse>(
      "/api/practice",
      { action: "feedback", scenario: scenarioId, turns },
      controller.signal,
    );
    inFlight.current = false;
    if (!res.ok) {
      if (res.aborted) return;
      setLoading(false);
      setError(res.error); // the conversation stays on screen so you can try again
      return;
    }
    setLoading(false);
    setFeedback(res.data);
    setPhase("feedback");
  }

  if (phase === "choose") {
    return (
      <div className="tool-panel-grid p-6 sm:p-8" data-split="practice">
        <div className="min-w-0">
          <ChoiceGroup legend="Choose a scenario" name="pm-scenario" options={scenarioOptions} value={scenarioId} onChange={setScenarioId} layout="list" disabled={!hydrated} />
          {ai === "missing" && (
            <p role="status" className="mt-5 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm leading-relaxed text-foreground">
              <strong className="font-semibold">Practice Mode needs the AI assistant.</strong> A real conversation
              with a simulated person needs a Gemini API key, and none is set for this site yet. Nothing here is
              pre-scripted, so Practice Mode stays switched off until the site owner adds{" "}
              <code className="rounded bg-background-secondary px-1">GEMINI_API_KEY</code>.
            </p>
          )}
          {ai === "unreachable" && (
            <p role="alert" className="mt-5 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm leading-relaxed text-foreground">
              We couldn&apos;t check whether the AI assistant is available.{" "}
              <button type="button" onClick={() => void checkAi()} className="font-semibold underline underline-offset-2">
                Check again
              </button>
            </p>
          )}
          {error && <ErrorNote message={error} />}
          <button
            type="button"
            onClick={() => void start()}
            disabled={!hydrated || ai !== "ready" || loading}
            className="btn btn-primary mt-6 w-full sm:w-auto"
          >
            {loading ? <Spinner /> : null}
            {loading ? "Starting..." : ai === "checking" ? "Checking the AI assistant..." : "Start practising"}
          </button>
          <PrivacyNote />
        </div>

        <div className="result-pane">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 font-serif text-xl text-foreground">{scenario.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{scenario.description}</p>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            You will talk with {scenario.partnerName}, a simulated person. Reply in your own words and take as long
            as you like, for up to {MAX_PRACTICE_TURNS} turns. {scenario.partnerName} is played live by AI, so the
            conversation goes wherever you take it. When you are done, you get gentle, specific feedback in plain
            words. There are no scores and no timer.
          </p>
        </div>
      </div>
    );
  }

  if (phase === "feedback" && feedback) {
    return (
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-xl">
            <p className="eyebrow">Feedback: {scenario.title}</p>
            <div className="mt-2">
              <ModeNote mode={feedback.mode} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => void start()} disabled={loading} className="btn btn-secondary btn-sm">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Practise this again
            </button>
            <button type="button" onClick={backToChoose} className="btn btn-secondary btn-sm">
              Choose another scenario
            </button>
          </div>
        </div>

        {error && <ErrorNote message={error} />}

        {feedback.summary && <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground">{feedback.summary}</p>}

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {feedback.dimensions.map((d) => (
            <li key={d.key} className="result-pane !p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-lg text-foreground">{d.label}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${levelClass[d.level]}`}>{d.level}</span>
              </div>
              {d.note && <p className="mt-2 text-sm leading-relaxed text-text-secondary">{d.note}</p>}
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {feedback.strengths.length > 0 && (
            <section className="rounded-xl border border-border p-4">
              <h3 className="font-serif text-lg text-foreground">What worked</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary">
                {feedback.strengths.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </section>
          )}
          {feedback.suggestions.length > 0 && (
            <section className="rounded-xl border border-border p-4">
              <h3 className="font-serif text-lg text-foreground">Things you could try</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary">
                {feedback.suggestions.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <details className="mt-6 rounded-xl border border-border px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-foreground">See the conversation</summary>
          <ul className="mt-3 space-y-2 text-sm">
            {turns.map((t, i) => (
              <li key={i} className={t.role === "user" ? "text-foreground" : "text-text-secondary"}>
                <span className="font-semibold text-accent-secondary">{t.role === "user" ? "You" : scenario.partnerName}: </span>
                {t.text}
              </li>
            ))}
          </ul>
        </details>

        <p className="mt-6 text-xs leading-relaxed text-text-secondary">
          This feedback is about one practice conversation. It is not a measure of you, and real people will respond
          in their own ways.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="eyebrow">{scenario.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{scenario.description}</p>
          <p className="mt-2 text-xs leading-relaxed text-text-secondary">
            {scenario.partnerName} is a simulated person, played live by AI.
          </p>
        </div>
        <button type="button" onClick={backToChoose} className="btn btn-secondary btn-sm">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Start over
        </button>
      </div>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Practice conversation"
        className="result-pane mt-5 max-h-[26rem] space-y-3 overflow-y-auto"
      >
        {turns.map((t, i) => (
          <div key={i} className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                t.role === "user" ? "bg-accent text-text-dark" : "border border-border bg-background-secondary/70 text-foreground"
              }`}
            >
              <p className={`mb-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${t.role === "user" ? "text-text-dark/70" : "text-accent-secondary"}`}>
                {t.role === "user" ? "You" : scenario.partnerName}
              </p>
              {t.text}
            </div>
          </div>
        ))}
        {loading && (
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <Spinner />
            {userTurnCount > 0 && turns[turns.length - 1]?.role === "user" ? `${scenario.partnerName} is replying...` : "Working on it..."}
          </p>
        )}
      </div>

      {error && (
        <ErrorNote message={failedSend ? `${error} Your message is still in the box. Press Send to try again.` : error} />
      )}

      <label htmlFor="pm-draft" className="eyebrow mt-5 block">
        Your reply
      </label>
      <textarea
        id="pm-draft"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            void send();
          }
        }}
        maxLength={MAX_TURN_CHARS}
        rows={3}
        disabled={atLimit || !hydrated}
        placeholder={atLimit ? "That is a full practice round. Get your feedback below." : "Reply in your own words..."}
        className={`${fieldClass} resize-y`}
      />
      <p className="mt-1.5 text-xs text-text-secondary">
        Enter sends, Shift+Enter adds a new line. Turn {Math.min(userTurnCount + 1, MAX_PRACTICE_TURNS)} of up to{" "}
        {MAX_PRACTICE_TURNS}.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => void send()} disabled={loading || atLimit || !hydrated} className="btn btn-primary">
          <Send className="h-4 w-4" aria-hidden="true" />
          Send
        </button>
        <button type="button" onClick={() => void finish()} disabled={loading || userTurnCount === 0} className="btn btn-secondary">
          End and get feedback
        </button>
      </div>
    </div>
  );
}
