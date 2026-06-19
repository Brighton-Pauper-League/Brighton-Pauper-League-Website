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
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Active', value: 'active' },
          { title: 'Completed', value: 'completed' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (rule) => rule.required(),
      description:
        'Active season is auto-detected by current date falling between start/end dates',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      number: 'seasonNumber',
      status: 'status',
      startDate: 'startDate',
    },
    prepare({ name, number, status, startDate }) {
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
