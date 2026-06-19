import { defineType, defineField } from 'sanity'
import { ControlsIcon } from '@sanity/icons'

export const match = defineType({
  name: 'match',
  title: 'Match',
  type: 'document',
  icon: ControlsIcon,
  fields: [
    defineField({
      name: 'season',
      title: 'Season',
      type: 'reference',
      to: [{ type: 'season' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'matchDate',
      title: 'Match Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'player1',
      title: 'Player 1',
      type: 'reference',
      to: [{ type: 'player' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'player2',
      title: 'Player 2',
      type: 'reference',
      to: [{ type: 'player' }],
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const player1 = (context.document as any)?.player1?._ref
          const player2Ref = value?._ref || value
          if (player1 && player1 === player2Ref) {
            return 'Player 2 must be different from Player 1'
          }
          return true
        }),
    }),
    defineField({
      name: 'result',
      title: 'Match Result',
      type: 'string',
      options: {
        list: [
          { title: 'Player 1 Won', value: 'player1_win' },
          { title: 'Player 2 Won', value: 'player2_win' },
          { title: 'Draw', value: 'draw' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Match Notes',
      type: 'text',
      rows: 3,
      description: 'Optional notes about the match (deck types, highlights, etc.)',
    }),
  ],
  preview: {
    select: {
      player1Name: 'player1.name',
      player2Name: 'player2.name',
      result: 'result',
      date: 'matchDate',
      seasonName: 'season.name',
    },
    prepare({ player1Name, player2Name, result, date, seasonName }) {
      const resultDisplay =
        result === 'player1_win'
          ? `${player1Name} won`
          : result === 'player2_win'
            ? `${player2Name} won`
            : 'Draw'
      
      return {
        title: `${player1Name} vs ${player2Name}`,
        subtitle: `${resultDisplay} - ${seasonName} - ${new Date(date).toLocaleDateString()}`,
      }
    },
  },
  orderings: [
    {
      title: 'Match Date, Newest',
      name: 'matchDateDesc',
      by: [{ field: 'matchDate', direction: 'desc' }],
    },
  ],
})
