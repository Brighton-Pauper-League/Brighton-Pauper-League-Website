import React, {useCallback, useState} from 'react'
import {useClient} from 'sanity'
import {DownloadIcon} from '@sanity/icons'

// A Studio tool that downloads every event result, with the deck archetype
// played, as a CSV — one row per player per event. Not shown on the public
// site; this is purely an admin export. Plain React + inline styles, matching
// the custom-UI precedent in documentActions/importDecklist.tsx (no extra deps).

interface EventRow {
  event: string | null
  date: string | null
  season: string | null
  results: Array<{
    player: string | null
    archetype: string | null
    wins: number | null
    draws: number | null
    losses: number | null
  }> | null
}

const QUERY = `*[_type == "event" && defined(results)] | order(eventDate asc){
  "event": title,
  "date": eventDate,
  "season": season->name,
  results[]{
    "player": player->name,
    "archetype": deckArchetype->name,
    wins, draws, losses
  }
}`

// Wrap in quotes (and double any internal quotes) when a value contains a
// comma, quote, or newline — otherwise it would break the CSV row.
export function csvEscape(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

export function toCsv(rows: string[][]): string {
  return rows.map((row) => row.map(csvEscape).join(',')).join('\r\n')
}

export function ArchetypeExportTool() {
  const client = useClient({apiVersion: '2026-05-15'})
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleExport = useCallback(async () => {
    setStatus('loading')
    setMessage('')
    try {
      const events: EventRow[] = await client.fetch(QUERY)
      const header = ['season', 'event', 'date', 'player', 'archetype', 'W', 'D', 'L']
      const body: string[][] = []
      for (const e of events) {
        for (const r of e.results ?? []) {
          body.push([
            e.season ?? '',
            e.event ?? '',
            (e.date ?? '').slice(0, 10),
            r.player ?? '',
            r.archetype ?? '',
            String(r.wins ?? ''),
            String(r.draws ?? ''),
            String(r.losses ?? ''),
          ])
        }
      }

      if (body.length === 0) {
        setStatus('error')
        setMessage('No event results found to export.')
        return
      }

      const csv = toCsv([header, ...body])
      const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `archetype-export-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(url)

      setStatus('done')
      setMessage(`Exported ${body.length} result rows across ${events.length} events.`)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Export failed.')
    }
  }, [client])

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: 640,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h1 style={{margin: 0, fontSize: '1.25rem'}}>Archetype Export</h1>
      <p style={{margin: 0, fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.5}}>
        Download a CSV of every event result with the deck archetype played. One row per player per
        event, with columns: <code>season, event, date, player, archetype, W, D, L</code>. Results
        without an archetype set are included with a blank archetype cell.
      </p>
      <div>
        <button
          onClick={handleExport}
          disabled={status === 'loading'}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            background: status === 'loading' ? '#1e3a8a' : '#2563eb',
            color: '#fff',
            cursor: status === 'loading' ? 'default' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          {status === 'loading' ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>
      {message && (
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: status === 'error' ? '#f87171' : '#4ade80',
          }}
        >
          {message}
        </p>
      )}
    </div>
  )
}

export const archetypeExportTool = {
  name: 'archetype-export',
  title: 'Archetype Export',
  icon: DownloadIcon,
  component: ArchetypeExportTool,
}
