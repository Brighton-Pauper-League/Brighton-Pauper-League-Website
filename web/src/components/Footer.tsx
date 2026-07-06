import type { JSX } from "react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data";
import type { SocialLinks } from "@/lib/types";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";

// ── Social icons ──────────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.012.043.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function SocialLinks({ links }: { links: SocialLinks }) {
  const items = [
    { href: links.instagram, icon: <InstagramIcon />, label: "Instagram" },
    { href: links.youtube, icon: <YouTubeIcon />, label: "YouTube" },
    { href: links.discord, icon: <DiscordIcon />, label: "Discord" },
    { href: links.facebook, icon: <FacebookIcon />, label: "Facebook" },
  ].filter((item): item is { href: string; icon: JSX.Element; label: string } =>
    Boolean(item.href)
  );

  if (items.length === 0) return null;

  return (
    <div className="flex gap-3">
      {items.map(({ href, icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-[#4a2a30] text-white/60 hover:text-secondary-yellow hover:bg-[#5a3a40] transition-colors"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-[#371e22] px-6 md:px-12 lg:px-20 py-16 lg:py-20">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          {/* Left Column - Brand */}
          <div className="flex flex-col gap-4 w-full lg:w-100">
            <h3 className="font-[family-name:var(--font-young-serif)] text-[32px] text-[#e7a802]">
              Brighton Pauper League
            </h3>
            <p className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/60 leading-normal">
              An independent community of Magic: The Gathering players in Brighton, UK. Established by players, for players.
            </p>
            {settings?.socialLinks && (
              <SocialLinks links={settings.socialLinks} />
            )}
          </div>

          {/* Right Columns - Links */}
          <div className="flex flex-wrap gap-12 sm:gap-16">
            {/* League Links */}
            <div className="flex flex-col gap-4">
              <p className="font-[family-name:var(--font-bricolage-grotesque)] font-extrabold text-[#e7a802] text-sm uppercase">
                League
              </p>
              <Link href="/" className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/about" className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/standings" className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors">
                Standings
              </Link>
              <Link href="/players" className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors">
                Members
              </Link>
              <Link href="/blog" className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors">
                Blog
              </Link>
            </div>

            {/* Play Links */}
            <div className="flex flex-col gap-4">
              <p className="font-[family-name:var(--font-bricolage-grotesque)] font-extrabold text-[#e7a802] text-sm uppercase">
                Play
              </p>
              <Link href="/events" className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors">
                Events
              </Link>
              <Link href="/loaner-decks" className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors">
                Loaner Decks
              </Link>
              <Link href="/rules" className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors">
                Rules
              </Link>
            </div>

            {/* Support Links */}
            <div className="flex flex-col gap-4">
              <p className="font-[family-name:var(--font-bricolage-grotesque)] font-extrabold text-[#e7a802] text-sm uppercase">
                Support
              </p>
              <Link href="/volunteer" className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors">
                Volunteer
              </Link>
              <Link href="/contact" className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors">
                Contact
              </Link>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col gap-4">
              <p className="font-[family-name:var(--font-bricolage-grotesque)] font-extrabold text-[#e7a802] text-sm uppercase">
                Legal
              </p>
              <Link href="/privacy" className="font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors">
                GDPR
              </Link>
              <CookieSettingsLink className="text-left font-[family-name:var(--font-bricolage-grotesque)] text-base text-white/80 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white pt-8">
          <p className="font-[family-name:var(--font-bricolage-grotesque)] text-sm text-white/50">
            © 2026 Brighton Pauper League. All card art belongs to Wizards of the Coast.
          </p>
          <p className="font-[family-name:var(--font-bricolage-grotesque)] text-sm text-white/50">
            Made with love in Brighton by{" "}
            <Link href="https://romanwaters.com" className="hover:text-secondary-yellow" target="_blank">
              Roman Waters
            </Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
