import { defineType, defineField } from 'sanity'
import { CaseIcon } from '@sanity/icons'

export const season = defineType({
  name: 'season',
  title: 'Season',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Season Name',
      type: 'string',
      description: 'e.g., "Spring 2026" or "Season 1"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seasonNumber',
      title: 'Season Number',
      type: 'number',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      validation: (rule) =>
        rule.required().min(rule.valueOfField('startDate')),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'winner',
      title: 'Season Winner',
      type: 'reference',
      to: [{ type: 'player' }],
      description:
        'Overall season winner, decided by the top-8 finals. Leave empty until the finals have been played.',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      number: 'seasonNumber',
      startDate: 'startDate',
      endDate: 'endDate',
    },
    prepare({ name, number, startDate, endDate }) {
      const today = new Date().toISOString().slice(0, 10)
      const status = today < startDate ? 'upcoming' : today > endDate ? 'completed' : 'active'
      return {
        title: `${name} (Season ${number})`,
        subtitle: `${status} - Starts ${new Date(startDate).toLocaleDateString()}`,
      }
    },
  },
  orderings: [
    {
      title: 'Season Number, Newest',
      name: 'seasonNumberDesc',
      by: [{ field: 'seasonNumber', direction: 'desc' }],
    },
    {
      title: 'Start Date, Newest',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
})
