import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import MessageHelper from "@/components/tools/MessageHelper";

export const metadata: Metadata = {
  title: "Message Helper | GlowUp",
  description: "Make your message sound like you: choose who it is for, the tone, and what you want help with.",
  alternates: {
    canonical: "/tools/message-helper",
  },
  openGraph: {
    type: "website",
    url: "/tools/message-helper",
    title: "Message Helper | GlowUp",
    description: "Make your message sound like you: choose who it is for, the tone, and what you want help with.",
  },
  twitter: {
    card: "summary",
    title: "Message Helper | GlowUp",
    description: "Make your message sound like you: choose who it is for, the tone, and what you want help with.",
  },
};

export default function Page() {
  return (
    <ToolShell id="message-helper">
      <MessageHelper />
    </ToolShell>
  );
}
