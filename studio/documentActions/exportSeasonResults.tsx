import React, {useCallback, useRef, useState} from 'react'
import {useClient} from 'sanity'
import {DownloadIcon} from '@sanity/icons'
import {aggregateSeason, type SeasonStageInput} from '../../web/src/lib/seasonScoring'
import {
  ArchetypePieChart,
  CARD_STYLE,
  CARD_WIDTH,
  CardFooter,
  CardHeader,
  PRIMARY_BUTTON_STYLE,
  SECONDARY_BUTTON_STYLE,
  capturePng,
  computeArchetypeSlices,
  downloadCsv,
  slugify,
  type ArchetypeSlice,
} from './exportShared'

// A document action, scoped to `season`, that exports the season as a standings
// CSV and as two shareable story-sized PNG cards — a standings card and an
// archetype breakdown card. The season counterpart of exportEventResults.tsx,
// sharing its card chrome via exportShared.tsx.
//
// The standings are computed with the same aggregateSeason() the public site
// uses (imported from the web package so the two cannot drift), and follow the
// same live/final switch as getStandings in web/src/lib/data.ts: once today is
// past the season's End Date the "drop worst two results" rule is applied.
// Only published events are used, matching what the site shows.

// ── Types ─────────────────────────────────────────────────────────────────────

interface PlayerNames {
  name: string | null
  nickname: string | null
  pseudonym: string | null
  isAnonymised: boolean | null
}

interface SeasonDoc {
  _id: string
  name: string | null
  endDate: string | null
}

interface EventResultDoc {
  playerRef: string | null
  player: PlayerNames | null
  archetype: string | null
  wins: number | null
  draws: number | null
  losses: number | null
  omwPercentage: number | null
  gwPercentage: number | null
  ogwPercentage: number | null
}

interface SeasonEventDoc {
  _id: string
  eventDate: string
  results: EventResultDoc[] | null
}

interface StandingRow {
  rank: number
  player: string
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  points: number
  omwPercentage: number | null
  gwPercentage: number | null
  ogwPercentage: number | null
}

interface SeasonExport {
  name: string
  isComplete: boolean
  stageCount: number
  standings: StandingRow[]
  slices: ArchetypeSlice[]
  entryCount: number
}

const SEASON_QUERY = `*[_id in [$id, $draftId]]{_id, name, endDate}`

const EVENTS_QUERY = `*[_type == "event" && season._ref == $id && isCancelled != true
  && defined(results) && !(_id in path("drafts.**"))] | order(eventDate asc){
  _id,
  eventDate,
  results[]{
    "playerRef": player._ref,
    "player": player->{name, nickname, pseudonym, isAnonymised},
    "archetype": deckArchetype->name,
    wins, draws, losses,
    omwPercentage, gwPercentage, ogwPercentage
  }
}`

// The top 8 advance to the finals once a season is complete.
const TOP_CUT = 8

// ── Helpers ─────────────────────────────────────────────────────────────────

// Same name the public site shows: the pseudonym when anonymised, otherwise the
// nickname, otherwise the real name. These cards are posted publicly, so they
// must not leak the real name of an anonymised player.
function displayName(player: PlayerNames | null): string {
  if (!player) return 'Unknown player'
  if (player.isAnonymised && player.pseudonym) return player.pseudonym
  return player.nickname ?? player.name ?? 'Unknown player'
}

// Same "today" as the site (UTC date) so the export and the website agree on
// whether a season is complete.
function todayString(): string {
  return new Date().toISOString().split('T')[0]
}

// Mirrors sortStandings in web/src/lib/standings.ts: Points → OMW% → GW% → OGW%,
// null tiebreakers last, then alphabetical.
function compareStandings(
  a: Omit<StandingRow, 'rank'>,
  b: Omit<StandingRow, 'rank'>,
): number {
  if (b.points !== a.points) return b.points - a.points
  const omw = (b.omwPercentage ?? -1) - (a.omwPercentage ?? -1)
  if (omw) return omw
  const gw = (b.gwPercentage ?? -1) - (a.gwPercentage ?? -1)
  if (gw) return gw
  const ogw = (b.ogwPercentage ?? -1) - (a.ogwPercentage ?? -1)
  if (ogw) return ogw
  return a.player.localeCompare(b.player)
}

function buildSeasonExport(season: SeasonDoc, events: SeasonEventDoc[]): SeasonExport {
  const isComplete = Boolean(season.endDate) && todayString() > (season.endDate as string)

  const namesByRef = new Map<string, string>()
  const stages: SeasonStageInput[] = events.map((event) => ({
    eventId: event._id,
    eventDate: event.eventDate,
    results: (event.results ?? []).flatMap((r) => {
      if (!r.playerRef) return []
      namesByRef.set(r.playerRef, displayName(r.player))
      return [
        {
          playerRef: r.playerRef,
          wins: r.wins ?? 0,
          draws: r.draws ?? 0,
          losses: r.losses ?? 0,
          omwPercentage: r.omwPercentage,
          gwPercentage: r.gwPercentage,
          ogwPercentage: r.ogwPercentage,
        },
      ]
    }),
  }))

  const standings = aggregateSeason(stages, {dropWorstTwo: isComplete})
    .map((t) => ({
      player: namesByRef.get(t.playerRef) ?? 'Unknown player',
      matchesPlayed: t.matchesPlayed,
      wins: t.wins,
      draws: t.draws,
      losses: t.losses,
      points: t.points,
      omwPercentage: t.omwPercentage,
      gwPercentage: t.gwPercentage,
      ogwPercentage: t.ogwPercentage,
    }))
    .sort(compareStandings)
    .map((row, i) => ({rank: i + 1, ...row}))

  const entries = events.flatMap((e) => e.results ?? [])

  return {
    name: season.name ?? 'Season',
    isComplete,
    stageCount: events.length,
    standings,
    slices: computeArchetypeSlices(entries),
    entryCount: entries.length,
  }
}

function formatPercent(value: number | null): string {
  return value == null ? '' : String(value)
}

// ── Graphics (captured to PNG) ──────────────────────────────────────────────

function StandingsGraphic({data}: {data: SeasonExport}) {
  const subtitle = data.isComplete
    ? `Final standings · best ${Math.max(1, data.stageCount - 2)} of ${data.stageCount} stages`
    : `Standings after ${data.stageCount} ${data.stageCount === 1 ? 'stage' : 'stages'}`

  return (
    <div style={CARD_STYLE}>
      <CardHeader eyebrow="League Standings" title={data.name} subtitle={subtitle} />

      <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 22}}>
        <thead>
          <tr style={{textAlign: 'left', color: 'rgba(255,255,255,0.55)'}}>
            <th style={{padding: '12px 12px', width: 56}}>#</th>
            <th style={{padding: '12px 12px'}}>Player</th>
            <th style={{padding: '12px 12px', width: 120, textAlign: 'center'}}>W-L-D</th>
            <th style={{padding: '12px 12px', width: 70, textAlign: 'right'}}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {data.standings.map((row, i) => {
            const inTopCut = data.isComplete && row.rank <= TOP_CUT
            return (
              <tr
                key={row.rank}
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
                  // Line marking the cut to the finals.
                  borderBottom:
                    data.isComplete && row.rank === TOP_CUT
                      ? '3px solid #f5c542'
                      : '3px solid transparent',
                }}
              >
                <td style={{padding: '12px 12px', color: '#f5c542', fontWeight: 700}}>{row.rank}</td>
                <td style={{padding: '12px 12px', fontWeight: inTopCut ? 700 : 600}}>{row.player}</td>
                <td style={{padding: '12px 12px', textAlign: 'center', color: 'rgba(255,255,255,0.85)'}}>
                  {row.wins}-{row.losses}-{row.draws}
                </td>
                <td style={{padding: '12px 12px', textAlign: 'right', fontWeight: 700}}>{row.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <CardFooter />
    </div>
  )
}

function ArchetypeGraphic({data}: {data: SeasonExport}) {
  return (
    <div style={CARD_STYLE}>
      <CardHeader
        eyebrow="Archetypes Played"
        title={data.name}
        subtitle={`${data.entryCount} entries across ${data.stageCount} ${data.stageCount === 1 ? 'stage' : 'stages'}`}
      />
      <ArchetypePieChart slices={data.slices} />
      <CardFooter />
    </div>
  )
}

// ── Document Action ───────────────────────────────────────────────────────────

export function exportSeasonResultsAction(props: {id: string; type: string}) {
  const client = useClient({apiVersion: '2026-05-15'})
  const standingsRef = useRef<HTMLDivElement>(null)
  const archetypeRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<SeasonExport | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleOpen = useCallback(async () => {
    setIsOpen(true)
    setStatus('loading')
    setMessage('')
    setData(null)
    try {
      const [seasons, events]: [SeasonDoc[], SeasonEventDoc[]] = await Promise.all([
        client.fetch(SEASON_QUERY, {id: props.id, draftId: `drafts.${props.id}`}),
        client.fetch(EVENTS_QUERY, {id: props.id}),
      ])
      // Prefer the draft (latest, possibly unpublished edits) when it exists.
      const season = seasons.find((s) => s._id.startsWith('drafts.')) ?? seasons[0] ?? null
      if (!season) {
        setStatus('error')
        setMessage('Could not find this season.')
        return
      }
      const built = buildSeasonExport(season, events)
      if (built.standings.length === 0) {
        setStatus('error')
        setMessage('This season has no published event results to export.')
        return
      }
      setData(built)
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Could not load the season.')
    }
  }, [client, props.id])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setStatus('idle')
    setData(null)
    setMessage('')
  }, [])

  const seasonSlug = data ? slugify(data.name) : 'season'
  const stateSlug = data?.isComplete ? 'final' : 'live'
  const standingsBaseName = `standings-${seasonSlug}-${stateSlug}`
  const archetypeBaseName = `archetypes-${seasonSlug}`

  const handleCsv = useCallback(() => {
    if (!data) return
    const header = ['rank', 'player', 'played', 'W', 'D', 'L', 'points', 'OMW%', 'GW%', 'OGW%']
    const body = data.standings.map((r) => [
      String(r.rank),
      r.player,
      String(r.matchesPlayed),
      String(r.wins),
      String(r.draws),
      String(r.losses),
      String(r.points),
      formatPercent(r.omwPercentage),
      formatPercent(r.gwPercentage),
      formatPercent(r.ogwPercentage),
    ])
    downloadCsv([header, ...body], `${standingsBaseName}.csv`)
  }, [data, standingsBaseName])

  const downloadImage = useCallback(async (node: HTMLDivElement | null, filename: string) => {
    setMessage('')
    if (!(await capturePng(node, filename))) {
      setMessage('Could not generate the image. Please try again.')
    }
  }, [])

  return {
    label: 'Export Season',
    icon: DownloadIcon,
    onHandle: handleOpen,
    dialog: isOpen && {
      type: 'dialog' as const,
      header: 'Export Season',
      width: 'medium' as const,
      onClose: handleClose,
      content: (
        <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {status === 'loading' && (
            <p style={{margin: 0, fontSize: '0.875rem', opacity: 0.8}}>Loading season…</p>
          )}

          {status === 'error' && (
            <p style={{margin: 0, fontSize: '0.875rem', color: '#f87171'}}>{message}</p>
          )}

          {status === 'ready' && data && (
            <>
              <p style={{margin: 0, fontSize: '0.875rem', opacity: 0.8, lineHeight: 1.5}}>
                {data.isComplete
                  ? 'This season has ended, so the standings are the final table with each player’s worst two results dropped.'
                  : 'This season is still running, so the standings are the live running total with nothing dropped.'}{' '}
                The CSV has one row per player (rank, player, played, W, D, L, points and the
                tiebreakers); the standings and archetype images are separate, story-sized cards you
                can post independently. Only published events are included.
              </p>

              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <span style={{fontSize: '0.8rem', fontWeight: 600, opacity: 0.7}}>Standings card</span>
                {/* Preview — this same node is what gets captured to PNG. The
                    wrapper is pinned to the graphic's width and height-capped
                    so a narrower/shorter dialog scrolls it rather than
                    clipping the capture. */}
                <div style={{overflow: 'auto', maxHeight: 420, borderRadius: 8}}>
                  <div ref={standingsRef} style={{width: CARD_WIDTH}}>
                    <StandingsGraphic data={data} />
                  </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <button
                    onClick={() => downloadImage(standingsRef.current, `${standingsBaseName}.png`)}
                    style={PRIMARY_BUTTON_STYLE}
                  >
                    Download standings image
                  </button>
                </div>
              </div>

              {data.slices.length > 0 && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  <span style={{fontSize: '0.8rem', fontWeight: 600, opacity: 0.7}}>
                    Archetype card
                  </span>
                  <div style={{overflow: 'auto', maxHeight: 420, borderRadius: 8}}>
                    <div ref={archetypeRef} style={{width: CARD_WIDTH}}>
                      <ArchetypeGraphic data={data} />
                    </div>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button
                      onClick={() => downloadImage(archetypeRef.current, `${archetypeBaseName}.png`)}
                      style={PRIMARY_BUTTON_STYLE}
                    >
                      Download archetype image
                    </button>
                  </div>
                </div>
              )}

              {message && (
                <p style={{margin: 0, fontSize: '0.875rem', color: '#f87171'}}>{message}</p>
              )}

              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <button onClick={handleCsv} style={SECONDARY_BUTTON_STYLE}>
                  Download CSV
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  }
}
