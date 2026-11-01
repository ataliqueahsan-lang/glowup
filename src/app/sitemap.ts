import type { MetadataRoute } from "next";

const siteUrl = "https://glowup-sable.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    { url: `${siteUrl}/tools` },
    { url: `${siteUrl}/tools/message-helper` },
    { url: `${siteUrl}/tools/conversation-coach` },
    { url: `${siteUrl}/tools/practice-mode` },
    { url: `${siteUrl}/privacy` },
    { url: `${siteUrl}/terms` },
    { url: `${siteUrl}/contact` },
  ];
}
