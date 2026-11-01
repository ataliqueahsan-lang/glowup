import { NextResponse } from "next/server";
import { aiConfigured, generateChat, generateJson } from "@/lib/ai";
import { aiFailure, cleanStrings, fail, isOption, readJson } from "@/lib/api";
import { guard } from "@/lib/rateLimit";
import { MAX_PRACTICE_TURNS, MAX_TURN_CHARS, SCENARIOS } from "@/lib/toolOptions";
import type { PracticeTurn } from "@/lib/types";
import {
  FEEDBACK_SYSTEM_PROMPT,
  cleanReply,
  feedbackUserPrompt,
  isRepeat,
  normalizeDimensions,
  partnerMessages,
  partnerSystemPrompt,
  startSystemPrompt,
} from "@/lib/prompts/practice";

const NOT_CONFIGURED =
  "Practice Mode needs the AI assistant to hold a real conversation, and it isn't switched on for this site yet. The site owner needs to add a Gemini API key (GEMINI_API_KEY).";

function parseTurns(value: unknown): PracticeTurn[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_PRACTICE_TURNS * 2 + 1) return null;
  const turns: PracticeTurn[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null) return null;
    const { role, text } = item as { role?: unknown; text?: unknown };
    if ((role !== "user" && role !== "partner") || typeof text !== "string") return null;
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_TURN_CHARS) return null;
    turns.push({ role, text: trimmed });
  }
  return turns;
}

/**
 * Practice Mode is AI-only. There is no scripted or rule-based fallback: without a key,
 * or when the AI request fails, the caller gets an honest error and can retry.
 */
export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return fail("We couldn't read that request. Please try again.", 400);

  const { action, scenario, turns: rawTurns } = body;

  // Lets the page show a clear message up front, before anyone starts typing.
  if (action === "status") return NextResponse.json({ ai: aiConfigured() });

  const blocked = guard(request, { tool: "practice", max: 40 });
  if (blocked) return blocked;

  if (action !== "start" && action !== "reply" && action !== "feedback") return fail("Invalid request.", 400);
  if (!isOption(SCENARIOS.map((s) => ({ id: s.id })), scenario)) return fail("Please choose a scenario.", 400);
  const scene = SCENARIOS.find((s) => s.id === scenario) ?? SCENARIOS[0];

  if (action === "start") {
    if (!aiConfigured()) return NextResponse.json({ error: NOT_CONFIGURED, code: "ai_not_configured" }, { status: 503 });
    try {
      const text = await generateChat({
        system: startSystemPrompt(scenario),
        messages: [{ role: "user", text: "(The scene begins. You speak first.)" }],
        temperature: 1,
      });
      const reply = cleanReply(text, scene.partnerName);
      if (!reply) return fail("Something went wrong starting the conversation. Please try again.", 502);
      return NextResponse.json({ mode: "ai", reply });
    } catch (err) {
      return aiFailure(err);
    }
  }

  const turns = parseTurns(rawTurns);
  if (!turns) return fail("That conversation could not be read. Please restart the practice.", 400);

  const userTurnCount = turns.filter((t) => t.role === "user").length;
  if (userTurnCount === 0) return fail("Write a reply first.", 400);

  if (action === "reply") {
    if (turns[turns.length - 1].role !== "user") return fail("Invalid request.", 400);
    if (userTurnCount > MAX_PRACTICE_TURNS) {
      return fail("That is the end of this practice. Please get your feedback.", 400);
    }
    if (!aiConfigured()) return NextResponse.json({ error: NOT_CONFIGURED, code: "ai_not_configured" }, { status: 503 });
    try {
      const ask = async () =>
        cleanReply(
          await generateChat({ system: partnerSystemPrompt(scenario), messages: partnerMessages(turns), temperature: 1 }),
          scene.partnerName,
        );
      let reply = await ask();
      if (reply && isRepeat(reply, turns)) reply = (await ask()) || reply; // one more try if it repeated itself
      if (!reply) return fail("Something went wrong reading the result. Please try again.", 502);
      return NextResponse.json({ mode: "ai", reply });
    } catch (err) {
      return aiFailure(err);
    }
  }

  // action === "feedback"
  if (!aiConfigured()) return NextResponse.json({ error: NOT_CONFIGURED, code: "ai_not_configured" }, { status: 503 });
  try {
    const out = (await generateJson({
      system: FEEDBACK_SYSTEM_PROMPT,
      user: feedbackUserPrompt(scenario, turns),
      temperature: 0.4,
    })) as { summary?: unknown; dimensions?: unknown; strengths?: unknown; suggestions?: unknown };

    const summary = typeof out.summary === "string" ? out.summary.trim().slice(0, 500) : "";
    const strengths = cleanStrings(out.strengths, 3, 300);
    const suggestions = cleanStrings(out.suggestions, 4, 400);
    if (!summary && suggestions.length === 0) {
      return fail("Something went wrong reading the result. Please try again.", 502);
    }
    return NextResponse.json({
      mode: "ai",
      summary,
      dimensions: normalizeDimensions(out.dimensions),
      strengths,
      suggestions,
    });
  } catch (err) {
    return aiFailure(err);
  }
}
