# GlowUp: bug fixes, illustrated story, glass redesign

## Root causes found
1. **Tool navigation:** tools were tabs inside one page, selected by a `hashchange` listener. Next.js `<Link>`
   changes the hash with `history.pushState`, which never fires `hashchange`, so links such as the footer's
   `/tools#practice-mode` (clicked while already on `/tools`) did nothing. There were also no real URLs for
   the tools. Reproduced in Chromium against the previous page (see report). Fix: each tool has its own route.
2. **Footer links** still used the old `/tools#...` anchors. Fixed.
3. **Message Helper input disappearing:** NOT reproduced in isolated real-browser tests (see report). Defensive
   fixes: form disabled until hydrated, in-memory draft store, double-submit guard, abort on unmount, errors
   never clear input, dev-only mount/unmount log to catch remounts.
4. Layout bugs found by the new tests: grid tracks could overflow narrow screens, and unlayered CSS overrode
   Tailwind column utilities. Fixed with `.tool-panel-grid` rules.
5. Hydration mismatch in the new artwork (floating point in trig) found by the tests. Fixed by rounding.

## Files
See the final report in chat for the full created / modified / deleted lists.

## Practice Mode: unrelated replies (fixed)
- **Cause:** with no `GEMINI_API_KEY` the route used `demoPartnerReply`, which picked a scripted line by turn
  number and never read the student's message. The reply "Nice, I wasn't sure. I'm Ananya..." was one of them.
- **Fix:** the demo partner now reads the latest message (name, studies, hometown, day, hobbies, greetings,
  thanks, goodbyes, yes/no, self-introductions, lecture questions) and answers in character. Anything it does
  not understand gets an honest "I'm not sure" reply, never an unrelated script. Partner bubbles are labelled
  "(demo)" and a demo banner is shown.
- **Real AI path:** the character sheet, the latest message to answer first, and earlier partner lines (to
  avoid repeats) are now part of the prompt. Failed AI requests return an error and never fall back to demo text.
- **Not verified:** real Gemini conversations (no key or network in my environment).

## Practice Mode is now AI-only (no demo, no rule-based replies)
- Removed the rule-based demo partner and demo feedback completely.
- **No key:** the page shows a clear message and Start is disabled; the API answers 503 `ai_not_configured`.
- **AI failure:** an honest error; your message stays in the box and you can press Send again.
- **Real multi-turn chat:** the whole conversation is sent to Gemini as alternating user/model turns, replies come
  back as plain text, the scene only sets context and personality, and even the opening line is written by the model.
- **Live check:** `node scripts/live-practice-check.mjs` plays a messy 8-turn conversation against your running server
  and your key and prints the transcript. The live conversation has NOT been verified by me (no key or network).
