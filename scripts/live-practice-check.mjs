/* global fetch, console, process */
// Live check of Practice Mode against YOUR running server and YOUR Gemini key.
//
//   1. Put GEMINI_API_KEY in .env.local and run:  npm run dev
//   2. In a second terminal:                      node scripts/live-practice-check.mjs
//      Optional: node scripts/live-practice-check.mjs college-event
//      Optional: BASE_URL=https://your-site.vercel.app node scripts/live-practice-check.mjs
//
// It plays a short, deliberately messy conversation and prints the transcript.
// The automatic checks below only catch obvious breakage. YOU decide whether the replies
// feel natural: read the transcript.

const BASE = process.env.BASE_URL || "http://localhost:3000";
const scenario = process.argv[2] || "new-classmate";

const STUDENT = [
  "Hey, how are you?",
  "I'm good too. By the way, what's your name?",
  "I'm Rahul. Which course are you studying?",
  "haha nice",
  "really?",
  "why?",
  "random question, do you like biryani?",
  "wait what was my name again?",
];

async function call(body) {
  const res = await fetch(`${BASE}/api/practice`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => null) };
}

const status = await call({ action: "status" });
if (!status.json?.ai) {
  console.log("The server says the AI assistant is not configured (GEMINI_API_KEY missing). Nothing to test.");
  process.exit(1);
}

const started = await call({ action: "start", scenario });
if (started.status !== 200) {
  console.log("Could not start:", started.status, started.json?.error);
  process.exit(1);
}

const turns = [{ role: "partner", text: started.json.reply }];
console.log(`Scenario: ${scenario}\n\nPARTNER: ${started.json.reply}\n`);

for (const line of STUDENT) {
  turns.push({ role: "user", text: line });
  const r = await call({ action: "reply", scenario, turns });
  if (r.status !== 200) {
    console.log(`YOU    : ${line}\nERROR  : ${r.status} ${r.json?.error}`);
    process.exit(1);
  }
  turns.push({ role: "partner", text: r.json.reply });
  console.log(`YOU    : ${line}\nPARTNER: ${r.json.reply}\n`);
}

const replies = turns.filter((t) => t.role === "partner").map((t) => t.text.toLowerCase());
const checks = [
  ["every reply is non-empty", replies.every((t) => t.length > 0)],
  ["no reply is repeated word for word", new Set(replies).size === replies.length],
  ["the partner remembers the name from earlier (Rahul)", replies[replies.length - 1].includes("rahul")],
  ["the partner never says it is a script or demo", !replies.some((t) => /demo|script|as an ai language model/.test(t))],
];
console.log("Automatic checks:");
for (const [name, ok] of checks) console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}`);
console.log("\nNow read the transcript above. Does it feel like a real person who listens and remembers?");
process.exit(checks.every(([, ok]) => ok) ? 0 : 1);
