import type { Metadata } from "next";
import { Young_Serif, Bricolage_Grotesque, Inter } from "next/font/google";
import { cookies, draftMode } from "next/headers";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { siteUrl } from "@/lib/site";
import { buildMetadata, siteConfig } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/jsonLd";
import { getSiteSettings } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";
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

// The root's own metadata: the shared Open Graph/Twitter/canonical block from
// buildMetadata, plus the fields only a root layout can set (metadataBase and
// the title template that every child page's title flows through).
export const metadata: Metadata = {
  ...buildMetadata({ path: "/" }),
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const consentCookie = (await cookies()).get(CONSENT_COOKIE)?.value;
  const initialConsent = parseConsent(consentCookie);
  const initialAnalyticsConsent = initialConsent?.analytics ?? false;

  const siteSettings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${youngSerif.variable} ${bricolageGrotesque.variable} ${inter.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <JsonLd data={organizationJsonLd(siteSettings?.socialLinks)} />
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
