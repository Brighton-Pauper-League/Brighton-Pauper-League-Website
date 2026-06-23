import { event } from './event'
import { post } from './post'
import { season } from './season'
import { player } from './player'
import { playerSeasonStats } from './playerSeasonStats'
import { siteSettings } from './siteSettings'

export const schemaTypes = [
  // Site configuration
  siteSettings,

  // Content types
  event,
  post,

  // League management
  season,
  player,
  playerSeasonStats,
]
