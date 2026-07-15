import { defineType, defineField } from 'sanity'
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
      type: 'text',
      rows: 4,
      description: 'Shown on the player profile page',
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