import React, {useCallback, useRef, useState} from 'react'
import {useClient} from 'sanity'
import {DownloadIcon} from '@sanity/icons'
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

// A document action, scoped to `event`, that exports a single event's results
// (with the deck archetype played) as a CSV, and separately as two shareable
// PNG images — a results card and an archetype breakdown card — each sized
// for Instagram Stories/Reels (1080px wide, portrait-oriented). Mirrors the
// CSV precedent in tools/archetypeExport.tsx (csvEscape/toCsv, Blob download)
// and the custom-dialog precedent in documentActions/importDecklist.tsx. The
// PNGs are produced by rendering a styled DOM node and capturing it with
// html-to-image — the export runs in the browser, so a DOM capture is a
// better fit than a server-side renderer.

// ── Types ─────────────────────────────────────────────────────────────────────

interface ResultRow {
  player: string | null
  archetype: string | null
  wins: number | null
  draws: number | null
  losses: number | null
  omwPercentage: number | null
  gwPercentage: number | null
  ogwPercentage: number | null
}

interface EventDoc {
  title: string | null
  slug: string | null
  eventDate: string | null
  season: string | null
  results: ResultRow[] | null
}

// Resolve references to names for both the draft and published versions; the
// draft (if present) reflects the editor's latest, unpublished changes.
const EVENT_QUERY = `*[_id in [$id, $draftId]]{
  _id,
  title,
  "slug": slug.current,
  eventDate,
  "season": season->name,
  results[]{
    "player": select(
      player->isAnonymised && defined(player->pseudonym) => player->pseudonym,
      coalesce(player->nickname, player->name)
    ),
    "archetype": deckArchetype->name,
    wins, draws, losses,
    omwPercentage, gwPercentage, ogwPercentage
  }
}`

// ── Helpers ─────────────────────────────────────────────────────────────────

function points(r: ResultRow): number {
  return (r.wins ?? 0) * 3 + (r.draws ?? 0)
}

// Order results the same way the site ranks standings: Points → OMW% → GW% → OGW%.
function rankResults(results: ResultRow[]): ResultRow[] {
  return [...results].sort((a, b) => {
    const byPoints = points(b) - points(a)
    if (byPoints) return byPoints
    const byOmw = (b.omwPercentage ?? 0) - (a.omwPercentage ?? 0)
    if (byOmw) return byOmw
    const byGw = (b.gwPercentage ?? 0) - (a.gwPercentage ?? 0)
    if (byGw) return byGw
    return (b.ogwPercentage ?? 0) - (a.ogwPercentage ?? 0)
  })
}

function EventCardHeader({event, eyebrow}: {event: EventDoc; eyebrow?: string}) {
  const date = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null
  return (
    <CardHeader
      eyebrow={eyebrow ?? event.season ?? 'Brighton Pauper League'}
      title={event.title ?? 'Event results'}
      subtitle={date}
    />
  )
}

// ── Results graphic (captured to PNG) ─────────────────────────────────────────

function ResultsGraphic({event, ranked}: {event: EventDoc; ranked: ResultRow[]}) {
  return (
    <div style={CARD_STYLE}>
      <EventCardHeader event={event} />

      <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 22}}>
        <thead>
          <tr style={{textAlign: 'left', color: 'rgba(255,255,255,0.55)'}}>
            <th style={{padding: '12px 12px', width: 56}}>#</th>
            <th style={{padding: '12px 12px'}}>Player</th>
            <th style={{padding: '12px 12px'}}>Archetype</th>
            <th style={{padding: '12px 12px', width: 120, textAlign: 'center'}}>W-L-D</th>
            <th style={{padding: '12px 12px', width: 70, textAlign: 'right'}}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((r, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
              }}
            >
              <td style={{padding: '12px 12px', color: '#f5c542', fontWeight: 700}}>{i + 1}</td>
              <td style={{padding: '12px 12px', fontWeight: 600}}>{r.player ?? '—'}</td>
              <td style={{padding: '12px 12px', color: 'rgba(255,255,255,0.75)'}}>
                {r.archetype ?? '—'}
              </td>
              <td style={{padding: '12px 12px', textAlign: 'center', color: 'rgba(255,255,255,0.85)'}}>
                {r.wins ?? 0}-{r.losses ?? 0}-{r.draws ?? 0}
              </td>
              <td style={{padding: '12px 12px', textAlign: 'right', fontWeight: 700}}>{points(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <CardFooter />
    </div>
  )
}

// ── Archetype graphic (captured to PNG) ────────────────────────────────────────

function ArchetypeGraphic({event, slices}: {event: EventDoc; slices: ArchetypeSlice[]}) {
  return (
    <div style={CARD_STYLE}>
      <EventCardHeader event={event} eyebrow="Archetypes Played" />
      <ArchetypePieChart slices={slices} />
      <CardFooter />
    </div>
  )
}

// ── Document Action ───────────────────────────────────────────────────────────

export function exportEventResultsAction(props: {id: string; type: string}) {
  const client = useClient({apiVersion: '2026-05-15'})
  const resultsRef = useRef<HTMLDivElement>(null)
  const archetypeRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [event, setEvent] = useState<EventDoc | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleOpen = useCallback(async () => {
    setIsOpen(true)
    setStatus('loading')
    setMessage('')
    setEvent(null)
    try {
      const docs: EventDoc[] = await client.fetch(EVENT_QUERY, {
        id: props.id,
        draftId: `drafts.${props.id}`,
      })
      // Prefer the draft (latest, possibly unpublished edits) when it exists.
      const doc =
        docs.find((d) => (d as EventDoc & {_id?: string})._id?.startsWith('drafts.')) ??
        docs[0] ??
        null
      if (!doc || !doc.results || doc.results.length === 0) {
        setStatus('error')
        setMessage('This event has no results to export.')
        return
      }
      setEvent(doc)
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Could not load the event.')
    }
  }, [client, props.id])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setStatus('idle')
    setEvent(null)
    setMessage('')
  }, [])

  const slugPart = event ? slugify(event.slug || event.title || 'event') : 'event'
  const datePart = event ? (event.eventDate ?? '').slice(0, 10) : ''
  const resultsBaseName = `results-${slugPart}-${datePart}`
  const archetypeBaseName = `archetypes-${slugPart}-${datePart}`

  const handleCsv = useCallback(() => {
    if (!event?.results) return
    const ranked = rankResults(event.results)
    const header = ['rank', 'player', 'archetype', 'W', 'D', 'L', 'points']
    const body = ranked.map((r, i) => [
      String(i + 1),
      r.player ?? '',
      r.archetype ?? '',
      String(r.wins ?? ''),
      String(r.draws ?? ''),
      String(r.losses ?? ''),
      String(points(r)),
    ])
    downloadCsv([header, ...body], `${resultsBaseName}.csv`)
  }, [event, resultsBaseName])

  const captureImage = useCallback(async (node: HTMLDivElement | null, filename: string) => {
    setMessage('')
    if (!(await capturePng(node, filename))) {
      setMessage('Could not generate the image. Please try again.')
    }
  }, [])

  const handleResultsImage = useCallback(
    () => captureImage(resultsRef.current, `${resultsBaseName}.png`),
    [captureImage, resultsBaseName],
  )

  const handleArchetypeImage = useCallback(
    () => captureImage(archetypeRef.current, `${archetypeBaseName}.png`),
    [captureImage, archetypeBaseName],
  )

  const ranked = event?.results ? rankResults(event.results) : []
  const slices = computeArchetypeSlices(ranked)

  return {
    label: 'Export Results',
    icon: DownloadIcon,
    onHandle: handleOpen,
    dialog: isOpen && {
      type: 'dialog' as const,
      header: 'Export Results',
      width: 'medium' as const,
      onClose: handleClose,
      content: (
        <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {status === 'loading' && (
            <p style={{margin: 0, fontSize: '0.875rem', opacity: 0.8}}>Loading results…</p>
          )}

          {status === 'error' && (
            <p style={{margin: 0, fontSize: '0.875rem', color: '#f87171'}}>{message}</p>
          )}

          {status === 'ready' && event && (
            <>
              <p style={{margin: 0, fontSize: '0.875rem', opacity: 0.8, lineHeight: 1.5}}>
                Export this event&rsquo;s results, with the archetype each player ran. The CSV has one
                row per player (rank, player, archetype, W, D, L, points); the results and archetype
                images are separate, story-sized cards you can post independently.
              </p>

              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <span style={{fontSize: '0.8rem', fontWeight: 600, opacity: 0.7}}>Results card</span>
                {/* Preview — this same node is what gets captured to PNG. The
                    wrapper is pinned to the graphic's width and height-capped
                    so a narrower/shorter dialog scrolls it rather than
                    clipping the capture. */}
                <div style={{overflow: 'auto', maxHeight: 420, borderRadius: 8}}>
                  <div ref={resultsRef} style={{width: CARD_WIDTH}}>
                    <ResultsGraphic event={event} ranked={ranked} />
                  </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <button onClick={handleResultsImage} style={PRIMARY_BUTTON_STYLE}>
                    Download results image
                  </button>
                </div>
              </div>

              {slices.length > 0 && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  <span style={{fontSize: '0.8rem', fontWeight: 600, opacity: 0.7}}>
                    Archetype card
                  </span>
                  <div style={{overflow: 'auto', maxHeight: 420, borderRadius: 8}}>
                    <div ref={archetypeRef} style={{width: CARD_WIDTH}}>
                      <ArchetypeGraphic event={event} slices={slices} />
                    </div>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button onClick={handleArchetypeImage} style={PRIMARY_BUTTON_STYLE}>
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
