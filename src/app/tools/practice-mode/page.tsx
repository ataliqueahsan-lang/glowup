import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import PracticeMode from "@/components/tools/PracticeMode";

export const metadata: Metadata = {
  title: "Practice Mode | GlowUp",
  description: "Role-play an everyday conversation at your own pace and get gentle feedback.",
  alternates: {
    canonical: "/tools/practice-mode",
  },
  openGraph: {
    type: "website",
    url: "/tools/practice-mode",
    title: "Practice Mode | GlowUp",
    description: "Role-play an everyday conversation at your own pace and get gentle feedback.",
  },
  twitter: {
    card: "summary",
    title: "Practice Mode | GlowUp",
    description: "Role-play an everyday conversation at your own pace and get gentle feedback.",
  },
};

export default function Page() {
  return (
    <ToolShell id="practice-mode">
      <PracticeMode />
    </ToolShell>
  );
}
