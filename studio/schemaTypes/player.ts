import { defineType, defineField, defineArrayMember } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const player = defineType({
  name: 'player',
  title: 'Player',
  type: 'document',
  icon: UserIcon,
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: 'Legal/real name — used internally and as the fallback display name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      description: 'URL identifier for the player profile page — auto-generated from name. Not needed for hidden or anonymised players, who have no profile page',
      hidden: ({ document }) => document?.isAnonymised === true || document?.isPublic === false,
      validation: (rule) =>
        rule.custom((slug, context) => {
          const doc = context.document
          if (doc?.isAnonymised === true || doc?.isPublic === false) return true
          return slug?.current ? true : 'Required for players with a public profile page'
        }),
    }),
    defineField({
      name: 'nickname',
      title: 'Nickname / Preferred Name',
      type: 'string',
      description: 'If set, shown instead of full name on public pages and standings',
    }),
    defineField({
      name: 'pseudonym',
      title: 'Pseudonym',
      type: 'string',
      description: 'Anonymised name shown when "Anonymise in public displays" is enabled',
      validation: (rule) =>
        rule.custom((pseudonym, context) => {
          if (context.document?.isAnonymised === true && !pseudonym) {
            return 'Required when "Anonymise in public displays" is on — otherwise the real name would be shown'
          }
          return true
        }),
    }),
    defineField({
      name: 'isAnonymised',
      title: 'Anonymise in public displays',
      type: 'boolean',
      description: 'When on, the pseudonym is shown instead of the real name/nickname on standings and all public pages',
      initialValue: false,
    }),

    // ── Profile ───────────────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      description:
        'Shown on the player profile page. Select text and use the link button to turn it into a link. Member cards show a plain-text version.',
      of: [
        defineArrayMember({
          type: 'block',
          // Deliberately minimal: paragraphs and links only, so a bio stays
          // simple text and cannot pick up headings, lists or images.
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (rule) =>
                      rule.required().uri({ scheme: ['http', 'https'] }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),

    defineField({
      name: 'socials',
      title: 'Socials',
      type: 'array',
      description: 'Links shown on the player profile page, e.g. Website, Instagram, Twitch',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'What the link is, e.g. "Website" or "Instagram"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link',
              type: 'url',
              validation: (rule) =>
                rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        }),
      ],
    }),

    // ── Visibility ────────────────────────────────────────────────────────
    defineField({
      name: 'isPublic',
      title: 'Show on members page',
      type: 'boolean',
      description: 'When off, this player is hidden from the members page and player cards — does not affect standings. New players start hidden until you switch this on.',
      initialValue: false,
    }),

    // ── League status ─────────────────────────────────────────────────────
    defineField({
      name: 'isActive',
      title: 'Active Player',
      type: 'boolean',
      description: 'Is this player currently active in the league?',
      initialValue: true,
    }),
    defineField({
      name: 'joinDate',
      title: 'Join Date',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
      description: 'Internal only — never shown publicly',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes about the player',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      nickname: 'nickname',
      pseudonym: 'pseudonym',
      isAnonymised: 'isAnonymised',
      isPublic: 'isPublic',
      active: 'isActive',
      media: 'image',
    },
    prepare({ name, nickname, pseudonym, isAnonymised, isPublic, active, media }) {
      const displayName = isAnonymised && pseudonym ? pseudonym : (nickname ?? name)
      const flags = [
        active ? '✓ Active' : '✗ Inactive',
        !isPublic ? '👁 Hidden' : null,
        isAnonymised ? '🎭 Anon' : null,
      ].filter(Boolean).join(' · ')
      return {
        title: displayName,
        subtitle: flags,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Join Date, Newest',
      name: 'joinDateDesc',
      by: [{ field: 'joinDate', direction: 'desc' }],
    },
  ],
})