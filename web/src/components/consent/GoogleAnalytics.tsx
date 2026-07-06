"use client";

import { Suspense, useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID } from "@/lib/consent";

// Google Analytics 4 with Consent Mode v2. gtag.js loads on every page, but
// `analytics_storage` starts denied (no _ga cookies) until the visitor opts in
// via the consent UI. `initialAnalyticsConsent` is computed server-side from the
// consent cookie so a returning, consented visitor is measured on first paint.

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // GA4's config command already sends the first page_view; skip it here so the
  // initial load isn't counted twice.
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (!window.gtag) return;
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics({
  initialAnalyticsConsent,
}: {
  initialAnalyticsConsent: boolean;
}) {
  if (!GA_MEASUREMENT_ID) return null;

  const defaultAnalytics = initialAnalyticsConsent ? "granted" : "denied";

  return (
    <>
      <Script id="ga-consent-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: '${defaultAnalytics}'
          });
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Script
        id="ga-lib"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
