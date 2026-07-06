import { defineType, defineField } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        // The slug is machine-managed: readOnly, hidden, and regenerated on
        // publish by syncEventOnPublish (computeUniqueSlug appends -2, -3, ...
        // against any clash). Sanity's default slug uniqueness check would
        // otherwise reject a duplicated event whose copied slug matches the
        // original, before the webhook ever runs — so uniqueness is delegated
        // entirely to publish.
        isUnique: () => true,
      },
      readOnly: true,
      hidden: true,
      description:
        'Generated automatically from the title and event date shortly after publish. Do not edit manually.',
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'isCancelled',
      title: 'Cancelled',
      type: 'boolean',
      description:
        'Mark this event as cancelled. Upcoming/in progress/completed are otherwise detected automatically from the event date.',
      initialValue: false,
    }),
    defineField({
      name: 'season',
      title: 'Season',
      type: 'reference',
      to: [{ type: 'season' }],
      description: 'Link this event to a season (optional)',
    }),
    defineField({
      name: 'registrationLink',
      title: 'Registration/Info Link',
      type: 'url',
    }),
    defineField({
      name: 'results',
      title: 'Event Results',
      type: 'array',
      description: 'Enter each attendee\'s results for this event night',
      of: [
        {
          type: 'object',
          title: 'Player Result',
          fields: [
            defineField({
              name: 'player',
              title: 'Player',
              type: 'reference',
              to: [{ type: 'player' }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'deckArchetype',
              title: 'Deck Archetype',
              type: 'reference',
              to: [{ type: 'archetype' }],
              description:
                'The archetype this player ran tonight. Pick an existing one or create a new archetype inline. Optional.',
            }),
            defineField({
              name: 'wins',
              title: 'Wins',
              type: 'number',
              validation: (rule) => rule.required().integer().min(0),
              initialValue: 0,
            }),
            defineField({
              name: 'draws',
              title: 'Draws',
              type: 'number',
              validation: (rule) => rule.required().integer().min(0),
              initialValue: 0,
            }),
            defineField({
              name: 'losses',
              title: 'Losses',
              type: 'number',
              validation: (rule) => rule.required().integer().min(0),
              initialValue: 0,
            }),
            defineField({
              name: 'omwPercentage',
              title: 'OMW% (Opponent Match Win %)',
              type: 'number',
              description: 'Enter from MTG Companion app - used for tiebreakers',
              validation: (rule) => rule.min(0).max(100).precision(2),
            }),
            defineField({
              name: 'gwPercentage',
              title: 'GW% (Game Win %)',
              type: 'number',
              description: 'Enter from MTG Companion app - used for tiebreakers',
              validation: (rule) => rule.min(0).max(100).precision(2),
            }),
            defineField({
              name: 'ogwPercentage',
              title: 'OGW% (Opponent Game Win %)',
              type: 'number',
              description: 'Enter from MTG Companion app - used for tiebreakers',
              validation: (rule) => rule.min(0).max(100).precision(2),
            }),
          ],
          preview: {
            select: {
              playerName: 'player.name',
              archetype: 'deckArchetype.name',
              wins: 'wins',
              draws: 'draws',
              losses: 'losses',
            },
            prepare({ playerName, archetype, wins, draws, losses }) {
              const points = (wins ?? 0) * 3 + (draws ?? 0)
              const record = `${wins}W / ${draws}D / ${losses}L — ${points} pts`
              return {
                title: playerName ?? 'Unknown player',
                subtitle: archetype ? `${archetype} · ${record}` : record,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'eventDate',
      media: 'featuredImage',
      isCancelled: 'isCancelled',
    },
    prepare({ title, date, media, isCancelled }) {
      const status = isCancelled ? 'cancelled' : new Date(date).getTime() < Date.now() ? 'completed' : 'upcoming'
      return {
        title,
        subtitle: `${new Date(date).toLocaleDateString()} - ${status}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Event Date, Newest',
      name: 'eventDateDesc',
      by: [{ field: 'eventDate', direction: 'desc' }],
    },
    {
      title: 'Event Date, Oldest',
      name: 'eventDateAsc',
      by: [{ field: 'eventDate', direction: 'asc' }],
    },
  ],
})
