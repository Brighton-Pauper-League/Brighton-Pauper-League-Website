import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

// The default share card for the whole site. Because it lives at the app root,
// Next applies it to every route that doesn't supply its own image — including
// routes added later — which is what replaces the old undersized /logo.webp.
//
// Deliberately typographic: next/og's Satori renderer cannot decode the WebP
// logo, and pulling the Google-hosted brand fonts at render time would make the
// build depend on the network. The bundled default font plus the brand palette
// keeps the card self-contained and on-brand.

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const { colors, name, tagline } = siteConfig;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "100px",
          backgroundColor: colors.primaryBlue,
          color: colors.offWhite,
        }}
      >
        <div
          style={{
            width: "120px",
            height: "12px",
            backgroundColor: colors.secondaryYellow,
            marginBottom: "48px",
          }}
        />
        <div
          style={{
            fontSize: "88px",
            fontWeight: 700,
            lineHeight: 1.05,
            color: colors.secondaryYellow,
            letterSpacing: "-0.02em",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: "40px",
            marginTop: "32px",
            maxWidth: "900px",
            color: colors.offWhite,
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
