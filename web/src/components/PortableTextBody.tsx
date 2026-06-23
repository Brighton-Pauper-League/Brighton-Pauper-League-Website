import type { ReactNode } from "react";
import Image from "next/image";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/lib/types";

type WithChildren = { children?: ReactNode };
type LinkValue = { href?: string };
type ImageValue = SanityImage & { caption?: string };

// Renders Sanity Portable Text (blog post bodies) with styles matching the
// site's typography. Block images use the same alt/caption fields defined on
// the `post.body` image members in the Studio schema.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }: WithChildren) => (
      <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-dark-brown leading-relaxed mb-6">
        {children}
      </p>
    ),
    h1: ({ children }: WithChildren) => (
      <h1 className="font-(family-name:--font-young-serif) text-4xl text-dark-brown mt-12 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }: WithChildren) => (
      <h2 className="font-(family-name:--font-young-serif) text-3xl text-dark-brown mt-10 mb-5">
        {children}
      </h2>
    ),
    h3: ({ children }: WithChildren) => (
      <h3 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown mt-8 mb-4">
        {children}
      </h3>
    ),
    blockquote: ({ children }: WithChildren) => (
      <blockquote className="border-l-4 border-secondary-yellow pl-6 my-8 italic font-(family-name:--font-bricolage-grotesque) text-xl text-dark-brown/80">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: WithChildren) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: WithChildren) => <em className="italic">{children}</em>,
    code: ({ children }: WithChildren) => (
      <code className="bg-primary-blue/10 text-primary-blue px-1.5 py-0.5 rounded text-base font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }: WithChildren & { value?: LinkValue }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-blue underline underline-offset-2 hover:text-darker-blue"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).width(1200).fit("max").url();
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
            <Image
              src={url}
              alt={value.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3 text-center text-sm text-dark-brown/60 font-(family-name:--font-bricolage-grotesque)">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function PortableTextBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="max-w-200">
      <PortableText value={value} components={components} />
    </div>
  );
}
