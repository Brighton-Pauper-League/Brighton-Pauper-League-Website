import { defineType, defineField, defineArrayMember } from 'sanity'
import { LinkIcon } from '@sanity/icons'

// A single external link on the /resources page.
//
// No slug and no ordering field by design: resources have no detail page of
// their own, and the reader chooses the sort order on the page itself
// (alphabetical, newest, oldest), so an editor-controlled order would have
// nothing to attach to. "Newest" reads Sanity's built-in _createdAt.
export const resource = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Where the link points. Must start with http:// or https://',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'A sentence or two explaining what this is and why it is useful.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      description:
        'Not shown on the site yet — recorded now so resources can be grouped or filtered later.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      url: 'url',
    },
    prepare({ title, url }) {
      let subtitle = url
      try {
        subtitle = new URL(url).hostname.replace(/^www\./, '')
      } catch {
        // Leave the raw value as the subtitle; validation surfaces the error.
      }
      return { title, subtitle }
    },
  },
  orderings: [
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Recently added',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
})
