// Ambient typing for the global gtag() defined by the Google Analytics inline
// script (see components/consent/GoogleAnalytics.tsx).
interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
