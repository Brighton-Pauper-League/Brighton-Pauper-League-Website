import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'featuredVideo',
      title: 'Featured Video',
      description: 'The video shown in the "Follow the League" section on the home page.',
      type: 'object',
      fields: [
        defineField({
          name: 'url',
          title: 'YouTube URL',
          type: 'url',
          initialValue: 'https://youtu.be/3LrSl0kk2JE?si=Kj5mliuV4bn_TdZv',
          validation: (rule) =>
            rule
              .required()
              .uri({ scheme: ['http', 'https'] })
              .custom((value) =>
                value && /(?:youtube\.com|youtu\.be)\//.test(value)
                  ? true
                  : 'Must be a YouTube URL',
              ),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Grixis Affinity Vs Naya Gates - MTG Pauper Gameplay',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
        }),
        defineField({
          name: 'discord',
          title: 'Discord URL',
          type: 'url',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
      description:
        'Site-wide fallbacks. Used on the home page and anywhere a page has no SEO of its own.',
    }),
  ],
  preview: {
    select: {},
    prepare: () => ({ title: 'Site Settings' }),
  },
})
