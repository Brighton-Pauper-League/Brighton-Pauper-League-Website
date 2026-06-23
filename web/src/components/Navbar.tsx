"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/events", label: "Events" },
  { href: "/standings", label: "Standings" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#004aad] text-white">
      <div className="h-[72px] px-6 md:px-12 lg:px-20 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 sm:gap-4 hover:opacity-90 transition-opacity min-w-0"
        >
          <Image
            src="/logo.webp"
            alt="Brighton Pauper League Logo"
            width={48}
            height={48}
            className="object-contain w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
          />
          <span className="font-[family-name:var(--font-young-serif)] text-lg sm:text-2xl text-[#e7a802] truncate">
            Brighton Pauper League
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-[family-name:var(--font-inter)] text-[15px] text-white/85 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/events"
            className="h-10 px-6 flex items-center justify-center bg-[#e7a802] text-[#371e22] font-[family-name:var(--font-inter)] font-semibold text-sm rounded-md hover:bg-[#d09602] transition-colors"
          >
            Join the League
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="lg:hidden flex items-center justify-center w-10 h-10 -mr-2 text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-white/15 px-6 md:px-12 py-4 flex flex-col gap-1"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-[family-name:var(--font-inter)] text-base text-white/90 hover:text-white py-3 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/events"
            onClick={() => setOpen(false)}
            className="mt-2 h-11 px-6 flex items-center justify-center bg-[#e7a802] text-[#371e22] font-[family-name:var(--font-inter)] font-semibold text-sm rounded-md hover:bg-[#d09602] transition-colors"
          >
            Join the League
          </Link>
        </div>
      )}
    </nav>
  );
}
