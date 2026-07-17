import { event } from './event'
import { post } from './post'
import { season } from './season'
import { player } from './player'
import { playerSeasonStats } from './playerSeasonStats'
import { archetype } from './archetype'
import { siteSettings } from './siteSettings'
import { loanerDeck } from './loanerDeck'
import { resource } from './resource'
import { seo } from './objects/seo'

export const schemaTypes = [
  // Reusable objects
  seo,

  // Site configuration
  siteSettings,

  // Content types
  event,
  post,
  loanerDeck,
  resource,

  // League management
  season,
  player,
  playerSeasonStats,
  archetype,
]
