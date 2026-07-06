import type { Metadata } from "next";
import { Young_Serif, Bricolage_Grotesque, Inter } from "next/font/google";
import { cookies, draftMode } from "next/headers";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { siteUrl } from "@/lib/site";
import { CONSENT_COOKIE, parseConsent } from "@/lib/consent";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { GoogleAnalytics } from "@/components/consent/GoogleAnalytics";
import { CookieBanner } from "@/components/consent/CookieBanner";
import "./globals.css";

const youngSerif = Young_Serif({
  weight: "400",
  variable: "--font-young-serif",
  subsets: ["latin"],
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteName = "Brighton Pauper League";
const description =
  "Accessible, community-led Pauper Magic — open to everyone, run by players, for players.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: [
    "Pauper",
    "Magic: The Gathering",
    "MTG",
    "Brighton",
    "league",
    "Dice Saloon",
    "competitive Pauper",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description,
    url: siteUrl,
    locale: "en_GB",
    images: [
      {
        url: "/logo.webp",
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: ["/logo.webp"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const consentCookie = (await cookies()).get(CONSENT_COOKIE)?.value;
  const initialConsent = parseConsent(consentCookie);
  const initialAnalyticsConsent = initialConsent?.analytics ?? false;

  return (
    <html
      lang="en"
      className={`${youngSerif.variable} ${bricolageGrotesque.variable} ${inter.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ConsentProvider initialConsent={initialConsent}>
          {children}
          <SanityLive />
          {(await draftMode()).isEnabled && <VisualEditing />}
          <GoogleAnalytics initialAnalyticsConsent={initialAnalyticsConsent} />
          <CookieBanner />
        </ConsentProvider>
      </body>
    </html>
  );
}
