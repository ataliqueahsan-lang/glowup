# GlowUp launch and growth notes

This document describes the code and routes in this repository as inspected on 19 October 2026. It does not confirm what is currently deployed, whether Gemini or GA4 is configured in production, or whether Google has indexed any page.

## Google Search Console

The root layout already contains Google site-verification metadata. Keep that existing value; do not replace it with a placeholder. The sitemap and robots routes are implemented at `/sitemap.xml` and `/robots.txt`. The sitemap lists the home page, tools index, three tool pages, Privacy Policy, Terms, and Contact (eight URLs). `robots.txt` allows public pages, disallows `/api/`, and points to the sitemap.

To verify the current production URL and submit the sitemap:

1. Open [Google Search Console](https://search.google.com/search-console/) while signed into the Google account that should own the property.
2. Use the property selector and choose **Add property** > **URL prefix**.
3. Enter exactly `https://glowup-sable.vercel.app/` (including `https://` and the trailing slash).
4. Choose the **HTML tag** verification method. Compare Google's `content` value with the existing `verification.google` value in `src/app/layout.tsx`. The deployed page must include that tag; if the current deployment predates it, verification will wait until an approved deployment contains it.
5. Click **Verify** in Search Console. A success message there is the evidence of ownership verification.
6. Open **Indexing** > **Sitemaps**, enter `sitemap.xml`, and choose **Submit**. The resulting status in Search Console is the evidence that Google received it.
7. Later, inspect **Pages** and use **URL inspection** for individual pages. A submitted sitemap does not guarantee crawling or indexing.

No Search Console account access or verification has been performed as part of this work.

## Product Hunt draft

### Tagline

Find your words for everyday college conversations.

### Short description

Three gentle tools to draft a message, find conversation openers, or rehearse a college-life conversation at your own pace.

### Long description

GlowUp is a communication-confidence companion for college life. Use Message Helper to shape a message in your own voice, Conversation Coach to explore openers and follow-ups for everyday situations, or Practice Mode to role-play a conversation and get gentle feedback. It is designed for low-pressure practice, not a personality makeover. Message Helper and Conversation Coach clearly identify whether a result is AI-generated or a demo. Practice Mode requires the site's AI service to be configured. Suggestions are starting points; you decide what to say.

### Audience and benefits

- College students who find everyday messages or social moments hard to start.
- Students preparing to speak with classmates, join a group, ask a professor a question, or participate in a seminar.
- People who want to rehearse privately, edit suggestions, and keep their own voice.
- No scores, timers, leaderboards, or pressure to keep a conversation going.

### Screenshot and demo-video checklist

- Capture the home page and its illustrated story on desktop and a narrow mobile viewport.
- Show the three tool cards and each tool's actual first screen.
- In Message Helper and Conversation Coach, show the demo/AI mode label with all personal text removed from the capture.
- If showing Practice Mode, use an approved test configuration and a fictional conversation; show its scenario chooser, chat, and feedback. Do not imply live AI is available until production configuration is verified.
- Record a short flow: choose a scenario, generate or view a result, edit/copy where supported, and return to the tools index. Keep the consent choice and analytics setting visible only if relevant to the launch story.
- Check legibility, focus, and cropping at mobile size. Use original app screenshots and avoid fabricated testimonials, user counts, or outcome claims.

### Launch announcement draft

Hi Product Hunt — I made GlowUp for the small college conversations that can take more energy than they seem to: sending a message, joining a group, or finding a first thing to say. It brings together a Message Helper, Conversation Coach, and Practice Mode in one calm place. You can edit every suggestion and keep your own voice. The first two tools label demo results when AI is not configured; Practice Mode needs the site's AI service. I would love feedback on which moments you wish you could rehearse and what would make the practice feel more useful.

### Maker introduction draft

Hi, I’m the maker of GlowUp. I built it around a simple idea: confidence can grow through small, low-pressure practice, without asking you to become someone else. I’d especially value feedback from students about the situations that feel hardest to start and whether the tools give them a useful next step.

Replace this draft with your name and personal background before posting; no personal identity or testimonial is assumed here.

### Frequently asked questions

**What can I do with GlowUp?** Draft everyday messages, explore conversation openers and follow-ups, or rehearse one of six everyday scenarios in Practice Mode.

**Is every response generated by AI?** No. Message Helper and Conversation Coach can return clearly labelled demo content when the server has no Gemini key. Practice Mode requires Gemini and reports when it is unavailable.

**Does GlowUp send what I type to an AI provider?** When Gemini is configured, relevant message/context or practice turns are sent by the server to Gemini to generate a result. Avoid entering passwords or sensitive personal details. Review Google's current API terms and data handling before enabling live use.

**Does GlowUp score me?** Practice feedback uses plain-language observations across five areas; the interface says it is feedback on one simulated conversation, not a measure of you. There are no scores, leaderboards, or timers.

**Do I need to create an account?** The inspected application has no sign-in flow. Re-check the live site before launch in case the deployed version differs.

**Can I use the tools if AI is off?** Message Helper and Conversation Coach show demo responses. Practice Mode needs the AI service.

**Is this therapy or a promise about real conversations?** No. It is a practice aid, and a simulated partner cannot predict how a real person will respond.

## Organic growth plan

### Useful original articles to consider

Publish only pieces you can make specific, practical, and genuinely helpful. A small, maintained set is better than a large batch of generic SEO pages.

1. **How to start a conversation before class:** low-pressure openers, context cues, and ways to let the exchange end naturally.
2. **How to ask a professor for clarification:** a short email structure, respectful examples, and what details to include.
3. **How to join a group conversation without interrupting:** noticing pauses, using the shared context, and respecting signals.
4. **How to decline a college invitation kindly:** direct examples that are warm without overexplaining.
5. **How to recover from an awkward pause:** practical options and reassurance that silence is ordinary.

For each article, use an original student-life example, offer a few editable sample lines, state limits, cite any external facts, and link naturally to the one tool that helps with that situation. Add an articles index only once there are several complete articles worth browsing. Avoid near-duplicate pages targeting slight keyword variations.

### Internal linking and page metadata

The current home page links to the tools; the tools index links to each tool; the footer links the public routes; tool pages have their own canonical URL, title, and description. No missing high-value internal link or obviously weak title/description was identified, so metadata was left alone. If articles are added, link each one to its relevant tool, link tools back to related guidance, and include a visible path to Privacy, Terms, and Contact.

### Practical distribution

- Share genuinely useful excerpts in college and student communities only where self-promotion is allowed; disclose that you made GlowUp and follow each community's rules.
- Ask student clubs, peer mentors, campus writing centres, orientation teams, and student-support staff whether a free resource link or feedback session would help their students. Do not imply endorsement without permission.
- Invite a small group of students to try a fictional scenario and give consent-based feedback. Do not publish names, quotes, or screenshots without explicit permission.
- Offer the articles to campus newsletters or student-resource pages when relevant, with no payment or reciprocal-link demand.
- Track referral visits and user feedback only with the site's configured consent-respecting analytics. Review Search Console queries and indexing status periodically; do not promise a ranking or traffic outcome.

Do not buy backlinks, automate comments, mass-submit directories, or exchange links solely to manipulate rankings.

## Controlled AI test and likely cost

No Gemini request was made during inspection. Before a real test, the site owner should select a model currently available to their Google AI Studio project, review its current rate limits, billing tier, data handling and pricing, and choose a small test cap. Configure `GEMINI_API_KEY` only in the server environment (`.env.local` for local testing or Vercel's server-side project environment settings for production). Never use a `NEXT_PUBLIC_` name for this key. Keep `AI_DAILY_LIMIT` low for a controlled check, then test one short Message Helper request and one Practice Mode turn with fictional text, confirm the UI labels the result as AI, and review provider usage before any broader test.

Costs depend on model, input/output token counts, billing tier, and current free-tier eligibility. Transient 429/503 responses can be retried up to two times; invalid JSON can trigger one additional generation attempt. Practice Mode can make an extra attempt if a partner reply repeats itself. Therefore one click can produce multiple provider calls in edge cases. See Google's current [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing), [model list](https://ai.google.dev/gemini-api/docs/models), and [billing guide](https://ai.google.dev/gemini-api/docs/billing) before enabling it. This plan does not approve a real request or any Vercel setting change.
