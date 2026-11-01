// Server-side AI access. Never import this file from a client component.

export type AiErrorKind = "rate_limited" | "quota_exceeded" | "unavailable" | "bad_output" | "upstream";

export class AiError extends Error {
  kind: AiErrorKind;
  upstreamStatus?: number;
  constructor(kind: AiErrorKind, message: string, upstreamStatus?: number) {
    super(message);
    this.kind = kind;
    this.upstreamStatus = upstreamStatus;
  }
}

export function aiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

/** One turn of a conversation, in Gemini's vocabulary ("model" = the AI's earlier replies). */
export type ChatMessage = { role: "user" | "model"; text: string };

type BaseRequest = {
  system: string;
  temperature?: number;
  maxOutputTokens?: number;
};
type JsonRequest = BaseRequest & { user: string };
type ChatRequest = BaseRequest & { messages: ChatMessage[] };

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

type GeminiErrorDetail = {
  "@type"?: unknown;
  retryDelay?: unknown;
};

type GeminiErrorResponse = {
  error?: {
    code?: unknown;
    status?: unknown;
    message?: unknown;
    details?: GeminiErrorDetail[];
  };
};

const MAX_TRANSIENT_RETRIES = 2;
const MAX_RETRY_DELAY_MS = 5000;

function retryAfterMs(value: string | null): number | null {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const date = Date.parse(value);
  return Number.isNaN(date) ? null : Math.max(0, date - Date.now());
}

function providerRetryAfterMs(details: GeminiErrorDetail[] | undefined): number | null {
  if (!Array.isArray(details)) return null;
  const retryInfo = details.find(
    (detail) => typeof detail?.["@type"] === "string" && detail["@type"].includes("RetryInfo"),
  );
  const delay = retryInfo?.retryDelay;
  if (typeof delay !== "string") return null;
  const match = /^(\d+(?:\.\d+)?)s$/.exec(delay);
  return match ? Number(match[1]) * 1000 : null;
}

function safeProviderMessage(value: unknown, secrets: string[]): string {
  if (typeof value !== "string") return "";
  let message = value;
  for (const secret of secrets) {
    if (secret) message = message.replaceAll(secret, "[REDACTED]");
  }
  return message.replace(/\s+/g, " ").trim().slice(0, 500);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gemini wants alternating user/model turns that start with a user turn.
 * Merge neighbours with the same role and add a neutral first turn if needed.
 */
export function toContents(messages: ChatMessage[], opener = "(The scene begins.)") {
  const merged: ChatMessage[] = [];
  for (const m of messages) {
    const prev = merged[merged.length - 1];
    if (prev && prev.role === m.role) prev.text += `\n${m.text}`;
    else merged.push({ ...m });
  }
  if (merged.length === 0 || merged[0].role !== "user") merged.unshift({ role: "user", text: opener });
  return merged.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
}

async function requestGemini(
  system: string,
  contents: ReturnType<typeof toContents>,
  temperature: number,
  maxOutputTokens: number,
  json: boolean,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new AiError("unavailable", "No API key configured.");
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-flash-latest";
  const secrets = [apiKey, system, ...contents.flatMap((content) => content.parts.map((part) => part.text))];

  for (let attempt = 0; attempt <= MAX_TRANSIENT_RETRIES; attempt++) {
    let res: Response;
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents,
            generationConfig: {
              temperature,
              maxOutputTokens,
              ...(json ? { responseMimeType: "application/json" } : {}),
            },
          }),
          signal: AbortSignal.timeout(30000),
          cache: "no-store",
        },
      );
    } catch {
      throw new AiError("unavailable", "The AI service did not respond.");
    }

    if (!res.ok) {
      const errorBody = (await res.json().catch(() => null)) as GeminiErrorResponse | null;
      const providerMessage = safeProviderMessage(errorBody?.error?.message, secrets);
      const retryAfter = retryAfterMs(res.headers.get("retry-after")) ?? providerRetryAfterMs(errorBody?.error?.details);
      const retryDelay = retryAfter ?? 300 * 2 ** attempt;
      const canRetry = res.status === 429 || res.status === 503;
      const quotaExceeded =
        res.status === 429 &&
        (errorBody?.error?.status === "RESOURCE_EXHAUSTED" &&
          (/quota/i.test(providerMessage) ||
            errorBody.error.details?.some(
              (detail) => typeof detail?.["@type"] === "string" && detail["@type"].includes("QuotaFailure"),
            )));
      const willRetry =
        !quotaExceeded &&
        canRetry &&
        attempt < MAX_TRANSIENT_RETRIES &&
        retryDelay <= MAX_RETRY_DELAY_MS;

      console.error(
        "Gemini upstream error",
        JSON.stringify({
          status: res.status,
          providerStatus: typeof errorBody?.error?.status === "string" ? errorBody.error.status : undefined,
          providerCode: typeof errorBody?.error?.code === "number" ? errorBody.error.code : undefined,
          model,
          message: providerMessage,
          retryAfter: retryAfter === null ? undefined : res.headers.get("retry-after"),
          quotaExceeded,
          retrying: willRetry,
          attempt: attempt + 1,
        }),
      );

      if (willRetry) {
        await wait(retryDelay);
        continue;
      }
      throw new AiError(
        quotaExceeded ? "quota_exceeded" : "upstream",
        "The AI service returned an error.",
        res.status,
      );
    }

    let data: GeminiResponse;
    try {
      data = (await res.json()) as GeminiResponse;
    } catch {
      throw new AiError("bad_output", "The AI response could not be read.");
    }
    return (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("");
  }

  throw new AiError("unavailable", "The AI service did not respond.");
}

async function jsonOnce(req: Required<JsonRequest>) {
  const raw = await requestGemini(req.system, toContents([{ role: "user", text: req.user }]), req.temperature, req.maxOutputTokens, true);
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  return parseJsonObject(cleaned);
}

/** Parse the structured object expected by every JSON-mode API route. */
export function parseJsonObject(raw: string): Record<string, unknown> {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new AiError("bad_output", "The AI reply could not be read.");
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new AiError("bad_output", "The AI reply could not be read.");
  }
  return value as Record<string, unknown>;
}

/**
 * Provider-independent entry point: ask for a JSON object. Only Gemini is
 * implemented. To switch providers later, change this one function.
 * Retries once if the model returns malformed JSON.
 */
export async function generateJson(req: JsonRequest): Promise<unknown> {
  const full = { temperature: 0.8, maxOutputTokens: 4096, ...req };
  try {
    return await jsonOnce(full);
  } catch (err) {
    if (err instanceof AiError && err.kind === "bad_output") return jsonOnce(full);
    throw err;
  }
}

/**
 * Multi-turn chat: the whole conversation is sent as real user/model turns, and
 * the answer comes back as plain text.
 */
export async function generateChat(req: ChatRequest): Promise<string> {
  const { system, messages, temperature = 1, maxOutputTokens = 2048 } = req;
  const contents = toContents(messages);
  const text = (await requestGemini(system, contents, temperature, maxOutputTokens, false)).trim();
  if (text) return text;
  throw new AiError("bad_output", "The AI returned an empty reply.");
}
