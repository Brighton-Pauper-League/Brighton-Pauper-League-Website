import { defineType, defineField } from 'sanity'
import { ChartUpwardIcon } from '@sanity/icons'

export const playerSeasonStats = defineType({
  name: 'playerSeasonStats',
  title: 'Player Season Stats',
  type: 'document',
  icon: ChartUpwardIcon,
  fields: [
    defineField({
      name: 'season',
      title: 'Season',
      type: 'reference',
      to: [{ type: 'season' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'player',
      title: 'Player',
      type: 'reference',
      to: [{ type: 'player' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'matchesPlayed',
      title: 'Matches Played',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
      initialValue: 0,
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
      title: 'Total Points',
      type: 'number',
      description: '3 points for win, 1 for draw, 0 for loss',
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
      seasonName: 'season.name',
      points: 'points',
      matches: 'matchesPlayed',
    },
    prepare({ playerName, seasonName, points, matches }) {
      return {
        title: `${playerName} - ${seasonName}`,
        subtitle: `${points} points in ${matches} matches`,
      }
    },
  },
})
