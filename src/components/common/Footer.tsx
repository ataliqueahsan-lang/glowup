import Link from "next/link";
import BrandMark from "./BrandMark";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-[linear-gradient(180deg,#2b1632,#201327)]">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-10 rounded-[1.75rem] border border-border bg-[rgba(255,248,243,0.02)] p-6 sm:p-8 md:grid-cols-[1.3fr_0.8fr_0.9fr_0.8fr] md:p-10">
          <div className="max-w-sm">
            <BrandMark size="sm" />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              GlowUp helps college students practice everyday communication,
              find clearer words, and grow confidence without changing who they
              are.
            </p>
          </div>

          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent-secondary">
              Navigate
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link href="/" className="subtle-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#features" className="subtle-link">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="subtle-link">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#about" className="subtle-link">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent-secondary">
              Tools
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link href="/tools/message-helper" className="subtle-link">
                  Message Helper
                </Link>
              </li>
              <li>
                <Link href="/tools/conversation-coach" className="subtle-link">
                  Conversation Coach
                </Link>
              </li>
              <li>
                <Link href="/tools/practice-mode" className="subtle-link">
                  Practice Mode
                </Link>
              </li>
              <li>
                <Link href="/tools" className="subtle-link">
                  Tools overview
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent-secondary">
              Information
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link href="/privacy" className="subtle-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="subtle-link">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="subtle-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs leading-relaxed text-text-secondary sm:flex-row sm:items-end sm:justify-between">
          <p>
            © 2026 GlowUp. Supportive practice for communication — not a
            substitute for professional care.
          </p>
          <p>AI-assisted suggestions. Review before you send.</p>
        </div>
      </div>
    </footer>
  );
}
