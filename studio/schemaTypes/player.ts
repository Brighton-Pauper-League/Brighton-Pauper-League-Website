import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const player = defineType({
  name: 'player',
  title: 'Player',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Player Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
    }),
    defineField({
      name: 'joinDate',
      title: 'Join Date',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'isActive',
      title: 'Active Player',
      type: 'boolean',
      description: 'Is this player currently active in the league?',
      initialValue: true,
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
      active: 'isActive',
      joinDate: 'joinDate',
    },
    prepare({ name, active, joinDate }) {
      return {
        title: name,
        subtitle: `${active ? '✓ Active' : '✗ Inactive'} - Joined ${new Date(joinDate).toLocaleDateString()}`,
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
