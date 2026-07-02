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
      },
      validation: (rule) => rule.required(),
      readOnly: true,
      hidden: true,
      description:
        'Generated automatically from the title and event date. Do not edit manually.',
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
      name: 'status',
      title: 'Event Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (rule) => rule.required(),
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
              name: 'points',
              title: 'Points',
              type: 'number',
              description: '3 per win, 1 per draw — enter from Companion',
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
              wins: 'wins',
              draws: 'draws',
              losses: 'losses',
              points: 'points',
            },
            prepare({ playerName, wins, draws, losses, points }) {
              return {
                title: playerName ?? 'Unknown player',
                subtitle: `${wins}W / ${draws}D / ${losses}L — ${points} pts`,
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
      status: 'status',
    },
    prepare({ title, date, media, status }) {
      return {
        title,
        subtitle: `${new Date(date).toLocaleDateString()} - ${status}`,
        media,
      }
    },
  },
})
