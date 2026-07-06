"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { type ConsentState, deleteGaCookies, writeConsent } from "@/lib/consent";

interface ConsentContextValue {
  /** Whether the visitor has made a decision yet. */
  decided: boolean;
  /** The current decision, defaulting to analytics-off until one is made. */
  consent: ConsentState;
  /** Persist a decision and update Google Consent Mode accordingly. */
  save: (state: ConsentState) => void;
  /** Whether the preferences modal is open. */
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

const DEFAULT_CONSENT: ConsentState = { analytics: false };

function updateGoogleConsent(granted: boolean): void {
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

export function ConsentProvider({
  initialConsent,
  children,
}: {
  // Read from the consent cookie server-side, so SSR and the first client render
  // agree (no hydration mismatch, no banner flash for returning visitors).
  initialConsent: ConsentState | null;
  children: React.ReactNode;
}) {
  const [decision, setDecision] = useState<ConsentState | null>(initialConsent);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const save = useCallback((state: ConsentState) => {
    writeConsent(state);
    updateGoogleConsent(state.analytics);
    // Withdrawing analytics consent: proactively clear the GA cookies.
    setDecision((prev) => {
      if (prev?.analytics && !state.analytics) deleteGaCookies();
      return state;
    });
    setPreferencesOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      decided: decision !== null,
      consent: decision ?? DEFAULT_CONSENT,
      save,
      preferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
    }),
    [decision, save, preferencesOpen],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within a ConsentProvider");
  return ctx;
}
