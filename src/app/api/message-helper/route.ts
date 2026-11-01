import { NextResponse } from "next/server";
import { aiConfigured, generateJson } from "@/lib/ai";
import { aiFailure, cleanStrings, fail, isOption, readJson } from "@/lib/api";
import { guard } from "@/lib/rateLimit";
import { MAX_MESSAGE_CHARS, OBJECTIVES, RECIPIENTS, TONES } from "@/lib/toolOptions";
import { MESSAGE_SYSTEM_PROMPT, buildMessagePrompt, demoMessage } from "@/lib/prompts/messageHelper";

export async function POST(request: Request) {
  const blocked = guard(request, { tool: "message-helper", max: 15 });
  if (blocked) return blocked;

  const body = await readJson(request);
  if (!body) return fail("We couldn't read that request. Please try again.", 400);

  const { message, recipient, tone, objective, previous } = body;

  if (typeof message !== "string" || message.trim().length === 0) {
    return fail("Please type or paste a message first.", 400);
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return fail(`Please keep your message under ${MAX_MESSAGE_CHARS} characters.`, 400);
  }
  if (!isOption(RECIPIENTS, recipient) || !isOption(TONES, tone) || !isOption(OBJECTIVES, objective)) {
    return fail("Please choose who it is for, a tone and a goal.", 400);
  }

  const prev = cleanStrings(previous, 3, 1500);

  if (!aiConfigured()) {
    return NextResponse.json({ mode: "demo", ...demoMessage(message, recipient, tone, prev.length) });
  }

  try {
    const out = (await generateJson({
      system: MESSAGE_SYSTEM_PROMPT,
      user: buildMessagePrompt({ message: message.trim(), recipient, tone, objective, previous: prev }),
      temperature: 0.9,
    })) as { improved?: unknown; notes?: unknown };

    const improved = typeof out.improved === "string" ? out.improved.trim() : "";
    const notes = cleanStrings(out.notes, 3, 200);
    if (!improved) return fail(notes[0] ?? "I can't help improve that message.", 422);

    return NextResponse.json({ mode: "ai", improved, notes });
  } catch (err) {
    return aiFailure(err);
  }
}
