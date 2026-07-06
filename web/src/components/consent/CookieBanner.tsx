"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConsent } from "./ConsentProvider";

const BTN_PRIMARY =
  "px-5 py-2.5 rounded-lg bg-secondary-yellow text-dark-brown font-(family-name:--font-inter) font-bold text-sm hover:bg-[#d09602] transition-colors";
const BTN_SECONDARY =
  "px-5 py-2.5 rounded-lg border-2 border-white/70 text-white font-(family-name:--font-inter) font-bold text-sm hover:bg-white/10 transition-colors";

function AnalyticsToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Analytics cookies"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-secondary-yellow" : "bg-black/25"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// Rendered only while open, so the toggle initialises from the stored choice via
// useState (no syncing effect needed).
function PreferencesModal() {
  const { consent, save, closePreferences } = useConsent();
  const [analytics, setAnalytics] = useState(consent.analytics);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreferences();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePreferences]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-6"
      onClick={closePreferences}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie preferences"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-off-white rounded-t-2xl sm:rounded-2xl p-6 md:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex flex-col gap-2">
          <h2 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown">
            Cookie preferences
          </h2>
          <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/70 leading-relaxed">
            Choose which optional cookies we can use. You can change this at any time
            from the footer. See our{" "}
            <Link
              href="/privacy"
              className="text-primary-blue underline underline-offset-2 hover:opacity-70"
            >
              Privacy &amp; Data
            </Link>{" "}
            policy for details.
          </p>
        </div>

        <div className="flex items-start justify-between gap-4 border-t border-black/10 pt-5">
          <div>
            <p className="font-(family-name:--font-bricolage-grotesque) font-semibold text-base text-dark-brown">
              Essential
            </p>
            <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/60 leading-relaxed">
              Needed for the site to work. Always on.
            </p>
          </div>
          <span className="font-(family-name:--font-bricolage-grotesque) text-sm font-semibold text-black/40 shrink-0 pt-0.5">
            Always on
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 border-t border-black/10 pt-5">
          <div>
            <p className="font-(family-name:--font-bricolage-grotesque) font-semibold text-base text-dark-brown">
              Analytics
            </p>
            <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/60 leading-relaxed">
              Google Analytics, to measure and improve how the site is used.
            </p>
          </div>
          <div className="pt-0.5">
            <AnalyticsToggle checked={analytics} onChange={setAnalytics} />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-black/10 pt-5">
          <button
            type="button"
            onClick={closePreferences}
            className="px-5 py-2.5 rounded-lg border-2 border-primary-blue/40 text-primary-blue font-(family-name:--font-inter) font-bold text-sm hover:bg-primary-blue/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => save({ analytics })}
            className="px-5 py-2.5 rounded-lg bg-primary-blue text-white font-(family-name:--font-inter) font-bold text-sm hover:bg-darker-blue transition-colors"
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieBanner() {
  const { decided, save, preferencesOpen, openPreferences } = useConsent();

  return (
    <>
      {!decided && !preferencesOpen && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 bg-primary-blue border-t-2 border-secondary-yellow px-6 py-5 md:px-12 lg:px-20"
        >
          <div className="max-w-360 mx-auto flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-10">
            <p className="font-(family-name:--font-bricolage-grotesque) text-sm md:text-base text-white/85 leading-relaxed flex-1">
              We use essential cookies to make this site work. With your consent we
              also use Google Analytics to understand how the site is used. See our{" "}
              <Link
                href="/privacy"
                className="text-secondary-yellow underline underline-offset-2 hover:opacity-80"
              >
                Privacy &amp; Data
              </Link>{" "}
              policy.
            </p>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button type="button" onClick={openPreferences} className={BTN_SECONDARY}>
                Preferences
              </button>
              <button
                type="button"
                onClick={() => save({ analytics: false })}
                className={BTN_SECONDARY}
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => save({ analytics: true })}
                className={BTN_PRIMARY}
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}

      {preferencesOpen && <PreferencesModal />}
    </>
  );
}
