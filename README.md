# GlowUp

GlowUp is a communication-confidence companion for college life. It helps people prepare for everyday conversations through message drafting, conversation ideas, and low-pressure role-play. The homepage includes the illustrated, scroll-driven story **“A Little More You.”**

**Live site:** [glowup-sable.vercel.app](https://glowup-sable.vercel.app/)

## Features

- **Illustrated story:** Five custom SVG scenes play as the home page scrolls. A reduced-motion preference switches the story to a static, readable scene gallery.
- **Message Helper:** Refine a message by recipient, tone, and goal; compare or regenerate suggestions and copy a version.
- **Conversation Coach:** Get openers, follow-up questions, possible reply ideas, and tips for everyday college situations.
- **Practice Mode:** Role-play one of six situations in a short multi-turn conversation and receive gentle feedback. Practice Mode requires the Gemini service; it does not use demo replies.
- **Clear AI/demo labeling:** Message Helper and Conversation Coach use clearly labelled demo responses when a Gemini key is not configured, and AI responses when it is.
- **Separate tool routes:** Each tool has a direct URL that can be bookmarked and shared.
- **Privacy and site information:** Privacy, terms, contact, sitemap, and robots pages/routes are included.
- **Optional analytics:** Google Analytics is inactive unless a measurement ID is configured, and the script loads only after the visitor opts in. Visitors can change consent using the analytics settings control.

## Technology

- Next.js **16.4.0** with the App Router
- React and React DOM **19.3.0**
- TypeScript **5.x**, strict checking enabled
- Tailwind CSS **4.x** through its PostCSS plugin
- Three.js-related packages are listed as dependencies, but the current story is drawn as SVG; the application does not currently mount a React Three Fiber canvas.
- Google Gemini API through server-side `fetch` requests (optional key)
- ESLint 9 with the Next.js Core Web Vitals and TypeScript configurations

## Architecture

The App Router UI lives in `src/app`. Client-side tool components submit JSON to three server routes under `src/app/api`. Those routes validate inputs, apply in-memory request limits, and call the shared Gemini integration in `src/lib/ai.ts` when configured. Without a Gemini key, Message Helper and Conversation Coach return local demo content; Practice Mode reports that AI is unavailable.

The API key is read only in server code and sent to Google in the request header. It is not intended to be exposed to the browser. The homepage story is composed from React SVG components in `src/components/story/art`; its scroll animation and reduced-motion rendering are implemented in `AnimeStory.tsx` and the site CSS.

The current project has **no sign-in/authentication system and no database integration**. Tool drafts are held in browser memory while the user works and are not written to browser storage by the client code. Analytics consent is stored separately in local storage when analytics is configured.

## Requirements

- Node.js **20.9 or newer** (the installed Next.js package declares `>=20.9.0`).
- npm and the dependencies in `package-lock.json`.
- Network access during dependency installation and potentially during `next/font/google` build-time font retrieval.
- A Gemini API key only if you want real AI results and Practice Mode locally. Message Helper and Conversation Coach can run in labelled demo mode without one.

## Installation

Clone the repository, enter the project directory, and install the exact dependency tree from the lockfile:

```bash
npm ci
```

Create your local environment file from the safe template:

```powershell
Copy-Item .env.example .env.local
```

On macOS or Linux:

```bash
cp .env.example .env.local
```

Edit `.env.local` locally if you want to configure Gemini or analytics. The file is ignored by Git; never commit it or paste real keys into source code, browser-visible variables, issues, or logs.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | No | Server-only Google AI Studio key. Leave empty for demo mode in Message Helper and Conversation Coach. Practice Mode requires this key. |
| `GEMINI_MODEL` | No | Server-side Gemini model ID. Defaults to `gemini-flash-latest`. |
| `AI_DAILY_LIMIT` | No | Daily AI-call cap per server process; defaults to `400`. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Optional public GA4 measurement ID. Analytics remains inactive until a visitor opts in. This is an identifier, not a secret. |

Keep `GEMINI_API_KEY` server-only: do not rename it with a `NEXT_PUBLIC_` prefix. `.env.example` contains placeholders only. No real environment values should be committed.

## Local development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The main routes are:

| Route | Purpose |
| --- | --- |
| `/` | Home page and illustrated story |
| `/tools` | Tools overview |
| `/tools/message-helper` | Message Helper |
| `/tools/conversation-coach` | Conversation Coach |
| `/tools/practice-mode` | Practice Mode |
| `/privacy` | Privacy information |
| `/terms` | Terms information |
| `/contact` | Contact information/status |
| `/api/message-helper` | Message Helper API (`POST`) |
| `/api/conversation-coach` | Conversation Coach API (`POST`) |
| `/api/practice` | Practice Mode API (`POST`) |
| `/sitemap.xml`, `/robots.txt` | Search crawler metadata |

The project scripts are:

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run test:ai-json
npm run test:smoke
npm run build
npm run start
```

`test:smoke` checks the site over HTTP and needs a running server. Start the app in one terminal, then run the test command in another. `test:ai-json` exercises the AI response JSON parser without making a Gemini API call. For a live Practice Mode check using a fictional conversation, use `node scripts/live-practice-check.mjs` while the app is running and Gemini is configured; this makes real provider requests and is optional.

## Production build

Create and run the optimized build locally:

```bash
npm run build
npm run start
```

Then open [http://localhost:3000](http://localhost:3000). This verifies/builds the local app; it does not deploy it.

## Project structure

```text
glowup/
├── docs/
│   └── LAUNCH_AND_GROWTH.md       # Launch, privacy, and growth notes
├── public/                        # Static SVG and favicon assets
├── scripts/
│   ├── ai-json.test.mjs           # Unit tests for safe AI JSON parsing
│   ├── live-practice-check.mjs    # Optional live Gemini practice check
│   └── smoke.test.mjs             # HTTP route smoke checks
├── src/
│   ├── app/                       # Pages, layouts, metadata, API routes
│   ├── components/                # Navigation, tools, analytics consent, story
│   ├── data/tools.ts              # Tool descriptions and scenario metadata
│   └── lib/                       # AI client, API validation, prompts, limits, state
├── .env.example                   # Safe environment template
├── .gitignore                     # Local secrets and generated-file exclusions
├── package.json                   # Scripts and dependencies
├── package-lock.json              # Locked npm dependency tree
├── postcss.config.mjs             # Tailwind PostCSS integration
├── eslint.config.mjs              # ESLint configuration
├── next.config.ts                 # Next.js configuration
└── tsconfig.json                  # Strict TypeScript configuration
```

## Privacy and security

- Never commit `.env.local`, API keys, service credentials, or private connection settings. `.env*` files are ignored except the placeholder `.env.example`; `.mcp.json` is also ignored.
- When Gemini is configured, the relevant message or conversation text is sent from the server to Google's Gemini API to generate a response. Avoid submitting passwords or sensitive personal details. Review Google's current API and data-retention terms before enabling live use.
- The inspected application code does not persist submitted tool text to a database or log request bodies. Hosting and AI providers may independently process request metadata or retain requests; this project cannot verify their practices.
- Request limits use process memory and the forwarded/real IP address. They are best-effort and reset with server instances; they are not durable abuse prevention on serverless hosting.
- Optional analytics sends page-path data only after consent. Tool text and conversation content are not attached to analytics events by the application.
- The privacy and terms pages identify owner confirmations still needed before those pages can be treated as complete legal notices.

## Known limitations

- Gemini availability depends on server configuration, provider access, and the selected model. Practice Mode is unavailable without a key; Message Helper and Conversation Coach then use labelled demos.
- Rate limits are in-memory per server instance and can be bypassed by spreading traffic across instances.
- The illustrated story is custom SVG animation rather than a real-time 3D scene. React Three packages are currently unused by the rendered interface.
- Contact details and some legal-policy information still require confirmation from the site owner.
- Google Analytics is optional and disabled until both configured and accepted by the visitor.
- Automated checks cover selected behavior only; they do not prove provider behavior, production configuration, or real-world outcomes.

## Existing supporting documentation

See [`CHANGES.md`](CHANGES.md) for recent implementation notes and [`docs/LAUNCH_AND_GROWTH.md`](docs/LAUNCH_AND_GROWTH.md) for launch drafts and operational considerations. Review those materials before external reuse.
