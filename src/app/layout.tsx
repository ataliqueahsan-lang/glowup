import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://glowup-sable.vercel.app"),
  title: "GlowUp — Communication confidence for college life",
  description:
    "A personal growth companion that helps college students express themselves, practice everyday conversations, and build communication confidence.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "GlowUp — Communication confidence for college life",
    description:
      "A personal growth companion that helps college students express themselves, practice everyday conversations, and build communication confidence.",
  },
  twitter: {
    card: "summary",
    title: "GlowUp — Communication confidence for college life",
    description:
      "A personal growth companion that helps college students express themselves, practice everyday conversations, and build communication confidence.",
  },
  verification: {
    google: "17wLX_0RmGdaCuIZjqC5H_yshaQj4lqBmDaYZuC9uQs",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="site-shell min-h-full flex flex-col font-sans">
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
