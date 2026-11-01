import type { Metadata } from "next";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Contact | GlowUp",
  description:
    "Find out how to contact GlowUp and what contact information the site owner still needs to provide.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact | GlowUp",
    description:
      "Find out how to contact GlowUp and what contact information the site owner still needs to provide.",
  },
  twitter: {
    card: "summary",
    title: "Contact | GlowUp",
    description:
      "Find out how to contact GlowUp and what contact information the site owner still needs to provide.",
  },
};

export default function ContactPage() {
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="container-page flex-1 py-12 sm:py-16">
        <header className="max-w-3xl">
          <p className="eyebrow">Contact</p>
          <h1 className="display-heading mt-3 text-[clamp(2.2rem,5vw,3.6rem)]">
            Contact GlowUp
          </h1>
          <p className="lede mt-5">
            A public contact channel has not been provided for this site.
            There is no contact form on this page, and submitting a message
            here will not send it to anyone.
          </p>
        </header>

        <section className="glass mt-10 max-w-3xl p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-foreground">For the site owner</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Add a monitored contact method before publishing this page as a
            way to reach GlowUp. No email address, business address, or
            organization identity is listed because none was confirmed for
            this project.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
