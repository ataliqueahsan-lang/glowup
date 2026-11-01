import { NextResponse } from "next/server";
import { AiError } from "./ai";

export const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  let text: string;
  try {
    text = await request.text();
  } catch {
    return null;
  }
  if (text.length === 0 || text.length > 30000) return null;
  try {
    const value: unknown = JSON.parse(text);
    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function isOption(list: readonly { id: string }[], id: unknown): id is string {
  return typeof id === "string" && list.some((item) => item.id === id);
}

export function cleanStrings(value: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, maxItems)
    .map((v) => v.slice(0, maxLen));
}

export function aiFailure(err: unknown) {
  if (err instanceof AiError) {
    if (err.kind === "quota_exceeded") {
      return NextResponse.json(
        {
          error: "The Gemini quota for this model has been reached. Please try again after it resets or check the Gemini plan and billing.",
          code: "ai_quota_exceeded",
        },
        { status: err.upstreamStatus ?? 429 },
      );
    }
    if (err.kind === "upstream") {
      const status = err.upstreamStatus ?? 503;
      const error =
        status === 429
          ? "The AI service is busy right now. Wait a minute and try again."
          : "The AI service isn't available right now. Please try again shortly.";
      return NextResponse.json({ error, code: "ai_upstream_error" }, { status });
    }
    if (err.kind === "rate_limited") {
      return NextResponse.json(
        { error: "The AI service is busy right now. Wait a minute and try again.", code: "ai_rate_limited" },
        { status: 429 },
      );
    }
    if (err.kind === "bad_output") {
      return fail("Something went wrong reading the result. Please try again.", 502);
    }
  }
  return NextResponse.json(
    { error: "The AI service isn't available right now. Please try again shortly.", code: "ai_unavailable" },
    { status: 503 },
  );
}
