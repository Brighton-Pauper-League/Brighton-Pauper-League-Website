import { defineType, defineField } from 'sanity'

// Reusable SEO overrides, attached to every document type that has a public URL.
// Every field is optional: left blank, the site derives metadata from the
// document's own content (title, excerpt, featured image), so adding this object
// to a schema changes nothing until an editor opts in.
//
// `hideFromSearch` is honoured in two places that must stay in agreement — the
// page's robots meta tag (via buildMetadata in web/src/lib/seo.ts) and the
// sitemap (web/src/app/sitemap.ts). Telling crawlers to skip a page while still
// advertising it in the sitemap is a Search Console error.
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description:
        'Overrides the page title shown in Google and on social cards. Leave blank to use the title above. Google truncates past ~60 characters.',
      validation: (rule) => rule.max(60).warning('Longer titles get truncated in search results'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description:
        'The summary shown under the link in search results. Leave blank to use the excerpt/description. Google truncates past ~160 characters.',
      validation: (rule) =>
        rule.max(160).warning('Longer descriptions get truncated in search results'),
    }),
    defineField({
      name: 'shareImage',
      title: 'Share Image',
      type: 'image',
      options: { hotspot: true },
      description:
        'The image used when this page is shared on social media. Ideally 1200x630. Leave blank to fall back to the featured image, or an automatically generated branded card.',
    }),
    defineField({
      name: 'hideFromSearch',
      title: 'Hide from search engines',
      type: 'boolean',
      description:
        'Asks Google not to index this page and removes it from the sitemap. The page stays publicly reachable by anyone with the link.',
      initialValue: false,
    }),
  ],
})
