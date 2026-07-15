import React, {useCallback, useRef, useState} from 'react'
import {useClient} from 'sanity'
import {DownloadIcon} from '@sanity/icons'
import {toPng} from 'html-to-image'
import {toCsv} from '../tools/archetypeExport'

// A document action, scoped to `event`, that exports a single event's results
// (with the deck archetype played) as either a CSV or a shareable PNG image.
// Mirrors the CSV precedent in tools/archetypeExport.tsx (csvEscape/toCsv, Blob
// download) and the custom-dialog precedent in documentActions/importDecklist.tsx.
// The PNG is produced by rendering a styled table into a DOM node and capturing
// it with html-to-image — the export runs in the browser, so a DOM capture is a
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

// ── Results graphic (captured to PNG) ─────────────────────────────────────────

function ResultsGraphic({event, ranked}: {event: EventDoc; ranked: ResultRow[]}) {
  return (
    <div
      style={{
        width: 720,
        boxSizing: 'border-box',
        padding: '32px 40px 40px',
        background: '#241c4f',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <div style={{marginBottom: 24}}>
        <div style={{fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: '#f5c542'}}>
          {event.season ?? 'Brighton Pauper League'}
        </div>
        <div style={{fontSize: 30, fontWeight: 700, lineHeight: 1.15, marginTop: 6}}>
          {event.title ?? 'Event results'}
        </div>
        {event.eventDate && (
          <div style={{fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: 4}}>
            {new Date(event.eventDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        )}
      </div>

      <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 15}}>
        <thead>
          <tr style={{textAlign: 'left', color: 'rgba(255,255,255,0.55)'}}>
            <th style={{padding: '8px 8px', width: 40}}>#</th>
            <th style={{padding: '8px 8px'}}>Player</th>
            <th style={{padding: '8px 8px'}}>Archetype</th>
            <th style={{padding: '8px 8px', width: 80, textAlign: 'center'}}>W-D-L</th>
            <th style={{padding: '8px 8px', width: 50, textAlign: 'right'}}>Pts</th>
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
              <td style={{padding: '8px 8px', color: '#f5c542', fontWeight: 700}}>{i + 1}</td>
              <td style={{padding: '8px 8px', fontWeight: 600}}>{r.player ?? '—'}</td>
              <td style={{padding: '8px 8px', color: 'rgba(255,255,255,0.75)'}}>
                {r.archetype ?? '—'}
              </td>
              <td style={{padding: '8px 8px', textAlign: 'center', color: 'rgba(255,255,255,0.85)'}}>
                {r.wins ?? 0}-{r.draws ?? 0}-{r.losses ?? 0}
              </td>
              <td style={{padding: '8px 8px', textAlign: 'right', fontWeight: 700}}>{points(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Document Action ───────────────────────────────────────────────────────────

export function exportEventResultsAction(props: {id: string; type: string}) {
  const client = useClient({apiVersion: '2026-05-15'})
  const graphicRef = useRef<HTMLDivElement>(null)
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

  const baseName = event
    ? `results-${slugify(event.slug || event.title || 'event')}-${(event.eventDate ?? '').slice(0, 10)}`
    : 'results'

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
    triggerDownload(url, `${baseName}.csv`)
    URL.revokeObjectURL(url)
  }, [event, baseName])

  const handleImage = useCallback(async () => {
    if (!graphicRef.current) return
    setMessage('')
    try {
      const dataUrl = await toPng(graphicRef.current, {pixelRatio: 2, backgroundColor: '#241c4f'})
      triggerDownload(dataUrl, `${baseName}.png`)
    } catch {
      setMessage('Could not generate the image. Please try again.')
    }
  }, [baseName])

  const ranked = event?.results ? rankResults(event.results) : []

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
                row per player (rank, player, archetype, W, D, L, points); the image is a shareable
                results card.
              </p>

              {/* Preview — this same node is what gets captured to PNG. */}
              <div style={{overflow: 'auto', borderRadius: 8}}>
                <div ref={graphicRef}>
                  <ResultsGraphic event={event} ranked={ranked} />
                </div>
              </div>

              {message && (
                <p style={{margin: 0, fontSize: '0.875rem', color: '#f87171'}}>{message}</p>
              )}

              <div style={{display: 'flex', gap: '0.75rem', justifyContent: 'flex-end'}}>
                <button
                  onClick={handleCsv}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  Download CSV
                </button>
                <button
                  onClick={handleImage}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#2563eb',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  Download image
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  }
}
