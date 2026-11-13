import type { ReactNode } from "react";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";

type WithChildren = { children?: ReactNode };

const paragraphClass =
  "font-(family-name:--font-bricolage-grotesque) text-lg text-black/70 leading-relaxed";

// Bios only ever contain paragraphs and links (the Studio schema allows nothing
// else), so this stays much smaller than PortableTextBody and keeps the
// profile page's existing bio typography.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }: WithChildren) => <p className={paragraphClass}>{children}</p>,
  },
  marks: {
    link: ({ children, value }: WithChildren & { value?: { href?: string } }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-blue underline underline-offset-2 hover:text-darker-blue transition-colors"
      >
        {children}
      </a>
    ),
  },
};

export function PlayerBio({ value }: { value: unknown[] | string }) {
  // Legacy bios were plain text; render them as-is until migrated to blocks.
  if (typeof value === "string") return <p className={paragraphClass}>{value}</p>;

  return (
    <div className="flex flex-col gap-4 max-w-prose">
      <PortableText value={value as PortableTextBlock[]} components={components} />
    </div>
  );
}
