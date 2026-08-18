import React, {useCallback, useRef, useState} from 'react'
import {useClient} from 'sanity'
import {DownloadIcon} from '@sanity/icons'
import {toPng} from 'html-to-image'
import {toCsv} from '../tools/archetypeExport'
import {LOGO_DATA_URI} from './logoDataUri'

// A document action, scoped to `event`, that exports a single event's results
// (with the deck archetype played) as a CSV, and separately as two shareable
// PNG images — a results card and an archetype breakdown card — each sized
// for Instagram Stories/Reels (1080px wide, portrait-oriented). Mirrors the
// CSV precedent in tools/archetypeExport.tsx (csvEscape/toCsv, Blob download)
// and the custom-dialog precedent in documentActions/importDecklist.tsx. The
// PNGs are produced by rendering a styled DOM node and capturing it with
// html-to-image — the export runs in the browser, so a DOM capture is a
// better fit than a server-side renderer.

// Instagram recommends 1080px-wide story/reel assets; height is left to grow
// with content (result count varies per event) rather than forced to the
// full 1920 story height, so a small event doesn't get padded with empty
// space and a large one doesn't get clipped.
const CARD_WIDTH = 1080

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
    "player": player->name,
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

// Same golden-angle hue rotation used on the public site's archetype charts
// (web/src/lib/archetypeColors.ts) — duplicated here since Studio and the web
// app are separate packages. Keep the two in sync if this is retuned.
const GOLDEN_ANGLE = 137.50776
const BASE_HUE = 205
const LIGHTNESS_CYCLE = [46, 60, 36]
const SATURATION_CYCLE = [65, 55, 75]
const UNASSIGNED_COLOR = '#8a8a94'

function colorForIndex(index: number): string {
  const hue = (BASE_HUE + index * GOLDEN_ANGLE) % 360
  const lightness = LIGHTNESS_CYCLE[index % LIGHTNESS_CYCLE.length]
  const saturation = SATURATION_CYCLE[index % SATURATION_CYCLE.length]
  return `hsl(${hue.toFixed(1)}, ${saturation}%, ${lightness}%)`
}

interface ArchetypeSlice {
  name: string
  count: number
  percentage: number
  color: string
}

function computeArchetypeSlices(results: ResultRow[]): ArchetypeSlice[] {
  const counts = new Map<string, number>()
  for (const r of results) {
    const name = r.archetype ?? 'No archetype recorded'
    counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  const total = results.length
  const sorted = Array.from(counts.entries())
    .map(([name, count]) => ({name, count, percentage: total > 0 ? (count / total) * 100 : 0}))
    .sort((a, b) => b.count - a.count)

  let colorIndex = 0
  return sorted.map((slice) => ({
    ...slice,
    color:
      slice.name === 'No archetype recorded' ? UNASSIGNED_COLOR : colorForIndex(colorIndex++),
  }))
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad)}
}

function describeSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  // A full-circle single-slice pie has no valid arc sweep; draw a circle instead.
  if (endAngle - startAngle >= 359.999) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx - 0.01} ${cy - r} Z`
  }
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`
}

// Hero-sized, stacked (chart above legend) rather than side-by-side, so it
// reads clearly on a phone screen at story width.
function ArchetypePieChart({slices}: {slices: ArchetypeSlice[]}) {
  const size = 520
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 12
  let cumulativeAngle = 0

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink: 0}}>
        {slices.map((slice) => {
          const startAngle = cumulativeAngle
          const endAngle = cumulativeAngle + (slice.percentage / 100) * 360
          cumulativeAngle = endAngle
          return (
            <path
              key={slice.name}
              d={describeSlice(cx, cy, r, startAngle, endAngle)}
              fill={slice.color}
              stroke="#241c4f"
              strokeWidth={4}
            />
          )
        })}
      </svg>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14, width: '100%'}}>
        {slices.map((slice) => (
          <div key={slice.name} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 24}}>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: slice.color,
                flexShrink: 0,
              }}
            />
            <span style={{flex: 1, color: 'rgba(255,255,255,0.85)', fontWeight: 600}}>{slice.name}</span>
            <span style={{color: 'rgba(255,255,255,0.55)'}}>
              {slice.count} · {slice.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function triggerDownload(href: string, filename: string): void {
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

// ── Shared card chrome ──────────────────────────────────────────────────────

function CardHeader({event, eyebrow}: {event: EventDoc; eyebrow?: string}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 32,
        marginBottom: 40,
      }}
    >
      <div>
        <div style={{fontSize: 20, letterSpacing: 3, textTransform: 'uppercase', color: '#f5c542'}}>
          {eyebrow ?? event.season ?? 'Brighton Pauper League'}
        </div>
        <div style={{fontSize: 46, fontWeight: 700, lineHeight: 1.15, marginTop: 10}}>
          {event.title ?? 'Event results'}
        </div>
        {event.eventDate && (
          <div style={{fontSize: 22, color: 'rgba(255,255,255,0.6)', marginTop: 8}}>
            {new Date(event.eventDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        )}
      </div>
      <img
        src={LOGO_DATA_URI}
        alt="Brighton Pauper League"
        width={110}
        height={110}
        style={{width: 110, height: 110, borderRadius: 18, flexShrink: 0}}
      />
    </div>
  )
}

function CardFooter() {
  return (
    <div
      style={{
        marginTop: 40,
        paddingTop: 24,
        borderTop: '1px solid rgba(255,255,255,0.15)',
        textAlign: 'center',
        fontSize: 20,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: '#f5c542',
      }}
    >
      Brighton Pauper League
    </div>
  )
}

const CARD_STYLE: React.CSSProperties = {
  width: CARD_WIDTH,
  boxSizing: 'border-box',
  padding: '56px 64px 48px',
  background: '#241c4f',
  color: '#ffffff',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
}

// ── Results graphic (captured to PNG) ─────────────────────────────────────────

function ResultsGraphic({event, ranked}: {event: EventDoc; ranked: ResultRow[]}) {
  return (
    <div style={CARD_STYLE}>
      <CardHeader event={event} />

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
      <CardHeader event={event} eyebrow="Archetypes Played" />
      <ArchetypePieChart slices={slices} />
      <CardFooter />
    </div>
  )
}

const PRIMARY_BUTTON_STYLE: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  border: 'none',
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600,
}

const SECONDARY_BUTTON_STYLE: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600,
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
    const csv = toCsv([header, ...body])
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    triggerDownload(url, `${resultsBaseName}.csv`)
    URL.revokeObjectURL(url)
  }, [event, resultsBaseName])

  const captureImage = useCallback(
    async (node: HTMLDivElement | null, filename: string) => {
      if (!node) return
      setMessage('')
      try {
        // Capture the graphic's full content box (scrollWidth/Height), so a
        // narrower, scrolled preview still renders the whole card.
        const dataUrl = await toPng(node, {
          pixelRatio: 2,
          backgroundColor: '#241c4f',
          width: node.scrollWidth,
          height: node.scrollHeight,
        })
        triggerDownload(dataUrl, filename)
      } catch {
        setMessage('Could not generate the image. Please try again.')
      }
    },
    [],
  )

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
