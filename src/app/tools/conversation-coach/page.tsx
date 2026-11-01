import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import ConversationCoach from "@/components/tools/ConversationCoach";

export const metadata: Metadata = {
  title: "Conversation Coach | GlowUp",
  description: "Openers, follow-up questions and tips for everyday college conversations.",
  alternates: {
    canonical: "/tools/conversation-coach",
  },
  openGraph: {
    type: "website",
    url: "/tools/conversation-coach",
    title: "Conversation Coach | GlowUp",
    description: "Openers, follow-up questions and tips for everyday college conversations.",
  },
  twitter: {
    card: "summary",
    title: "Conversation Coach | GlowUp",
    description: "Openers, follow-up questions and tips for everyday college conversations.",
  },
};

export default function Page() {
  return (
    <ToolShell id="conversation-coach">
      <ConversationCoach />
    </ToolShell>
  );
}
