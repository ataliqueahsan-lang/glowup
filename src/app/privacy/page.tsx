import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | GlowUp",
  description:
    "Learn how GlowUp handles text submitted to its communication practice tools and what data practices still need owner confirmation.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    type: "website",
    url: "/privacy",
    title: "Privacy Policy | GlowUp",
    description:
      "Learn how GlowUp handles text submitted to its communication practice tools and what data practices still need owner confirmation.",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | GlowUp",
    description:
      "Learn how GlowUp handles text submitted to its communication practice tools and what data practices still need owner confirmation.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="container-page flex-1 py-12 sm:py-16">
        <header className="max-w-3xl">
          <p className="eyebrow">Privacy</p>
          <h1 className="display-heading mt-3 text-[clamp(2.2rem,5vw,3.6rem)]">
            Privacy Policy
          </h1>
          <p className="lede mt-5">
            This page describes data handling visible in GlowUp&apos;s
            application code. Hosting-provider and AI-provider practices are
            separate and have not been verified here.
          </p>
        </header>

        <div className="mt-10 grid max-w-4xl gap-5">
          <section className="glass p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-foreground">Optional analytics</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              If the site owner configures a Google Analytics Measurement ID, analytics remains off until you choose Accept. Your choice is stored in this browser&apos;s local storage under a GlowUp preference; you can change it at any time using Analytics settings. If you accept, GlowUp sends page paths and page locations only. It does not send message text, conversation turns, or tool content to analytics. Ads personalization and Google signals are disabled. You can reject analytics and continue using the site.
            </p>
          </section>

          <section className="glass p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-foreground">Text you submit</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Message Helper receives your message and selected options.
              Conversation Coach receives the selected situation, optional
              context, and prior generated suggestions. Practice Mode sends
              your scenario and conversation turns for replies or feedback.
              The browser keeps tool drafts in memory while you navigate; this
              draft state is not written by the client code to local storage,
              session storage, or cookies, and is lost when the page is
              reloaded. A separate analytics consent preference may be stored
              in local storage if analytics is configured.
            </p>
          </section>

          <section className="glass p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-foreground">AI processing</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Tool submissions go to GlowUp&apos;s API routes. When Gemini is
              configured, Message Helper and Conversation Coach send the
              relevant input to Google&apos;s Gemini API to generate results.
              Practice Mode requires Gemini and sends conversation turns for
              replies and feedback. If Gemini is not configured, Message
              Helper and Conversation Coach use demo responses; Practice Mode
              is unavailable. The server-side integration uses the
              <code className="mx-1 rounded bg-background-secondary px-1">GEMINI_API_KEY</code>
              and optional
              <code className="mx-1 rounded bg-background-secondary px-1">GEMINI_MODEL</code>
              environment variables; their values are not exposed in the
              browser.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              The inspected application routes do not write submitted text to
              a database or log request bodies. This does not establish what
              Google or the hosting provider may retain or log. Their
              processing terms and retention settings need to be checked by
              the site owner. Avoid entering passwords or sensitive personal
              details.
            </p>
          </section>

          <section className="glass p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-foreground">Request limits</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              The API uses the request&apos;s forwarded or real IP address to
              apply in-memory per-tool rate limits. When AI is configured, an
              in-memory daily counter also limits AI calls; its default is
              400 and the server can override it with
              <code className="mx-1 rounded bg-background-secondary px-1">AI_DAILY_LIMIT</code>.
              These are best-effort process-memory counters, not a durable
              user profile. Hosting infrastructure may process request
              metadata independently.
            </p>
          </section>

          <section className="glass p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-foreground">Owner confirmation needed</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Before relying on this as a complete legal privacy notice, the
              site owner should confirm the responsible legal entity and
              contact, applicable jurisdiction and user rights, any age
              requirements, deployment and provider retention practices,
              and an effective date. This application-code summary cannot
              verify those matters.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              For current contact-page status, see{" "}
              <Link href="/contact" className="subtle-link underline underline-offset-4">
                Contact GlowUp
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
