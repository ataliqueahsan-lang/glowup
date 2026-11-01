"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { glowupTools } from "@/data/tools";

/** Old links used /tools#tool-id. Send them to the tool's own page. */
export default function LegacyHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    const tool = glowupTools.find((t) => t.id === id);
    if (tool) router.replace(tool.href);
  }, [router]);
  return null;
}
