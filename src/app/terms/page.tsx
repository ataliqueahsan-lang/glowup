import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | GlowUp",
  description:
    "Read about GlowUp's communication practice tools, AI-generated suggestions, and terms that require owner confirmation.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    type: "website",
    url: "/terms",
    title: "Terms of Service | GlowUp",
    description:
      "Read about GlowUp's communication practice tools, AI-generated suggestions, and terms that require owner confirmation.",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | GlowUp",
    description:
      "Read about GlowUp's communication practice tools, AI-generated suggestions, and terms that require owner confirmation.",
  },
};

export default function TermsPage() {
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="container-page flex-1 py-12 sm:py-16">
        <header className="max-w-3xl">
          <p className="eyebrow">Terms</p>
          <h1 className="display-heading mt-3 text-[clamp(2.2rem,5vw,3.6rem)]">
            Terms of Service
          </h1>
          <p className="lede mt-5">
            GlowUp provides tools for practicing everyday communication.
            Review the terms below and note the owner confirmations needed
            before this page can serve as a complete legal agreement.
          </p>
        </header>

        <div className="mt-10 grid max-w-4xl gap-5">
          <section className="glass p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-foreground">Using the tools</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Message Helper, Conversation Coach, and Practice Mode provide
              suggestions or simulated practice. AI-generated content can be
              incomplete or unsuitable for your situation. Review and adapt
              suggestions yourself; they are not a guarantee of how another
              person will respond or a substitute for professional care.
            </p>
          </section>

          <section className="glass p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-foreground">Availability and AI</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Tool availability depends on the application and, for AI
              features, the configured Gemini service. Message Helper and
              Conversation Coach may show demo responses when AI is not
              configured; Practice Mode requires AI. Submitted content may be
              sent to Google&apos;s Gemini API when the feature uses AI. See the{" "}
              <Link href="/privacy" className="subtle-link underline underline-offset-4">
                Privacy Policy
              </Link>{" "}
              for the code-level data handling summary.
            </p>
          </section>

          <section className="glass p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-foreground">Terms needing owner confirmation</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              The site owner must confirm the contracting entity, effective
              date, applicable law and venue, user eligibility, acceptable-use
              rules, intellectual-property terms, and any limitation,
              warranty, or dispute provisions. These have not been inferred
              or invented here. Until confirmed, this page is an informational
              summary, not a complete legal agreement.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              GlowUp&apos;s tools are for supportive practice and are not a
              substitute for professional care.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
