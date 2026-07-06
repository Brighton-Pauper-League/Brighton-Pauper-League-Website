import { event } from './event'
import { post } from './post'
import { season } from './season'
import { player } from './player'
import { playerSeasonStats } from './playerSeasonStats'
import { archetype } from './archetype'
import { siteSettings } from './siteSettings'
import { loanerDeck } from './loanerDeck'

export const schemaTypes = [
  // Site configuration
  siteSettings,

  // Content types
  event,
  post,
  loanerDeck,

  // League management
  season,
  player,
  playerSeasonStats,
  archetype,
]
