import { NextResponse } from "next/server";
import { aiConfigured, generateJson } from "@/lib/ai";
import { aiFailure, cleanStrings, fail, isOption, readJson } from "@/lib/api";
import { guard } from "@/lib/rateLimit";
import { MAX_CONTEXT_CHARS, SITUATIONS } from "@/lib/toolOptions";
import { COACH_SYSTEM_PROMPT, buildCoachPrompt, demoCoach } from "@/lib/prompts/coach";

type RawCoach = {
  openers?: unknown;
  followUps?: unknown;
  replies?: unknown;
  cues?: unknown;
  boundaries?: unknown;
};

const asRecords = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value.filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null)
    : [];

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const blocked = guard(request, { tool: "conversation-coach", max: 12 });
  if (blocked) return blocked;

  const body = await readJson(request);
  if (!body) return fail("We couldn't read that request. Please try again.", 400);

  const { situation, context, previous } = body;

  if (!isOption(SITUATIONS, situation)) return fail("Please choose a situation.", 400);
  if (context !== undefined && typeof context !== "string") return fail("Invalid request.", 400);
  const ctx = (context ?? "").trim();
  if (ctx.length > MAX_CONTEXT_CHARS) {
    return fail(`Please keep the context under ${MAX_CONTEXT_CHARS} characters.`, 400);
  }

  const prev = cleanStrings(previous, 6, 300);

  if (!aiConfigured()) {
    return NextResponse.json({ mode: "demo", ...demoCoach(situation) });
  }

  try {
    const out = (await generateJson({
      system: COACH_SYSTEM_PROMPT,
      user: buildCoachPrompt({ situation, context: ctx, previous: prev }),
      temperature: 0.9,
    })) as RawCoach;

    const openers = asRecords(out.openers)
      .map((o) => ({ line: str(o.line, 300), note: str(o.note, 200) }))
      .filter((o) => o.line)
      .slice(0, 3);
    const replies = asRecords(out.replies)
      .map((r) => ({ theySay: str(r.theySay, 250), youCouldSay: str(r.youCouldSay, 300) }))
      .filter((r) => r.theySay && r.youCouldSay)
      .slice(0, 4);
    const followUps = cleanStrings(out.followUps, 5, 250);
    const cues = cleanStrings(out.cues, 3, 300);
    const boundaries = cleanStrings(out.boundaries, 3, 300);

    if (openers.length === 0) return fail("Something went wrong reading the result. Please try again.", 502);

    return NextResponse.json({ mode: "ai", openers, followUps, replies, cues, boundaries });
  } catch (err) {
    return aiFailure(err);
  }
}
