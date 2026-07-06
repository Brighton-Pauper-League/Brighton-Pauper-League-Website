import {defineType, defineField} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const archetype = defineType({
  name: 'archetype',
  title: 'Archetype',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. "Dimir Faeries", "Mono-Red Aggro", "Familiars".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'colors',
      title: 'Colours',
      type: 'string',
      description:
        'Optional colour shorthand for grouping later, e.g. "UB", "R", "WUBRG". Leave blank if unsure.',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      colors: 'colors',
    },
    prepare({name, colors}) {
      return {
        title: name ?? 'Unnamed archetype',
        subtitle: colors || undefined,
      }
    },
  },
  orderings: [
    {
      title: 'Name A–Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
