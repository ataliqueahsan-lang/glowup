"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
const validMeasurementId = /^G-[A-Z0-9]+$/i.test(measurementId);
const storageKey = "glowup.analyticsConsent";
const deniedConsent = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;
const grantedConsent = {
  analytics_storage: "granted",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function AnalyticsConsent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<"unknown" | "accepted" | "rejected">("unknown");
  const [ready, setReady] = useState(false);
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    if (!validMeasurementId) return;
    const saved = window.localStorage.getItem(storageKey);
    // Read browser-only consent after hydration to avoid server/client markup mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "accepted" || saved === "rejected") setChoice(saved);
  }, []);

  useEffect(() => {
    if (!validMeasurementId || !ready || choice !== "accepted" || !pathname) return;
    if (lastPage.current === pathname) return;
    lastPage.current = pathname;
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
    });
  }, [choice, pathname, ready]);

  if (!validMeasurementId) return null;

  function saveChoice(next: "accepted" | "rejected") {
    window.localStorage.setItem(storageKey, next);
    setChoice(next);
    if (next === "rejected") {
      window.gtag?.("consent", "update", deniedConsent);
      setReady(false);
    } else {
      window.gtag?.("consent", "update", grantedConsent);
      lastPage.current = null;
    }
  }

  return (
    <>
      {choice === "accepted" && (
        <>
          <Script id="ga4-queue" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; window.gtag = window.gtag || function(){window.dataLayer.push(arguments)}; window.gtag('consent','default',${JSON.stringify(deniedConsent)}); window.gtag('consent','update',${JSON.stringify(grantedConsent)}); window.gtag('js',new Date()); window.gtag('config',${JSON.stringify(measurementId)},{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});`}
          </Script>
          <Script
            id="ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
            strategy="afterInteractive"
            onReady={() => setReady(true)}
          />
        </>
      )}
      <aside
        aria-label="Analytics preferences"
        className="fixed bottom-4 right-4 z-[100] max-w-[calc(100vw-2rem)]"
      >
        {choice === "unknown" ? (
          <div className="w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-border bg-[#2b1632] p-4 text-sm text-white shadow-2xl">
            <p>
              Optional, privacy-limited analytics help us understand site visits. GlowUp will not send your messages or conversation content to analytics. Choose whether to allow Google Analytics.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-full bg-white px-4 py-2 font-semibold text-[#2b1632]" onClick={() => saveChoice("accepted")}>Accept analytics</button>
              <button className="rounded-full border border-white/50 px-4 py-2" onClick={() => saveChoice("rejected")}>Reject</button>
            </div>
            <a className="mt-2 inline-block underline underline-offset-2" href="/privacy">Privacy Policy</a>
          </div>
        ) : (
          <button
            className="rounded-full border border-border bg-[#2b1632] px-4 py-2 text-xs text-white shadow-lg"
            onClick={() => {
              if (choice === "accepted") window.gtag?.("consent", "update", deniedConsent);
              window.localStorage.removeItem(storageKey);
              setReady(false);
              setChoice("unknown");
            }}
          >
            Analytics settings
          </button>
        )}
      </aside>
    </>
  );
}
