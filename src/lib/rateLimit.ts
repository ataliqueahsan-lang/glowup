import { NextResponse } from "next/server";
import { aiConfigured } from "./ai";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function checkLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (bucket.count >= max) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

type GuardOptions = { tool: string; max: number; windowMs?: number };

/**
 * Per-visitor limit plus a daily cap on real AI calls (to protect the free quota).
 * In-memory, so it is best-effort on serverless hosting: each server instance
 * counts separately. For stronger protection, add Vercel Firewall rate limiting.
 */
export function guard(request: Request, { tool, max, windowMs = 10 * 60 * 1000 }: GuardOptions) {
  const perIp = checkLimit(`ip:${tool}:${clientKey(request)}`, max, windowMs);
  if (!perIp.ok) {
    return NextResponse.json(
      { error: "You're going a little fast. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(perIp.retryAfterSec) } },
    );
  }
  if (aiConfigured()) {
    const dailyMax = Number(process.env.AI_DAILY_LIMIT) || 400;
    const daily = checkLimit("global:daily", dailyMax, 24 * 60 * 60 * 1000);
    if (!daily.ok) {
      return NextResponse.json(
        { error: "GlowUp has reached its daily limit for the free version. Please try again tomorrow." },
        { status: 429 },
      );
    }
  }
  return null;
}
