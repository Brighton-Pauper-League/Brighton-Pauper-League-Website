"use client";

import { useConsent } from "./ConsentProvider";

// Footer link that reopens the cookie preferences modal so visitors can change
// or withdraw their consent at any time.
export function CookieSettingsLink({ className }: { className?: string }) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      Cookie settings
    </button>
  );
}
