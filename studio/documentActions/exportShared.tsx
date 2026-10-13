import React from 'react'
import {toPng} from 'html-to-image'
import {toCsv} from '../tools/archetypeExport'
import {LOGO_DATA_URI} from './logoDataUri'

// Pieces shared by the event and season export actions: the story-sized card
// chrome, the archetype pie chart, and the browser download helpers. Kept in
// one place so the two exports always look and behave the same.

// Instagram recommends 1080px-wide story/reel assets; height is left to grow
// with content (result count varies) rather than forced to the full 1920 story
// height, so a small export isn't padded with empty space and a large one isn't
// clipped.
export const CARD_WIDTH = 1080

const CARD_BACKGROUND = '#241c4f'

// ── Archetype colours and slices ───────────────────────────────────────────────

// Same golden-angle hue rotation used on the public site's archetype charts
// (web/src/lib/archetypeColors.ts) — duplicated here since Studio and the web
// app are separate packages. Keep the two in sync if this is retuned.
const GOLDEN_ANGLE = 137.50776
const BASE_HUE = 205
const LIGHTNESS_CYCLE = [46, 60, 36]
const SATURATION_CYCLE = [65, 55, 75]
const UNASSIGNED_COLOR = '#8a8a94'
const UNASSIGNED_NAME = 'No archetype recorded'

function colorForIndex(index: number): string {
  const hue = (BASE_HUE + index * GOLDEN_ANGLE) % 360
  const lightness = LIGHTNESS_CYCLE[index % LIGHTNESS_CYCLE.length]
  const saturation = SATURATION_CYCLE[index % SATURATION_CYCLE.length]
  return `hsl(${hue.toFixed(1)}, ${saturation}%, ${lightness}%)`
}

export interface ArchetypeSlice {
  name: string
  count: number
  percentage: number
  color: string
}

// One slice per archetype, counting one entry per result row.
export function computeArchetypeSlices(results: Array<{archetype: string | null}>): ArchetypeSlice[] {
  const counts = new Map<string, number>()
  for (const r of results) {
    const name = r.archetype ?? UNASSIGNED_NAME
    counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  const total = results.length
  const sorted = Array.from(counts.entries())
    .map(([name, count]) => ({name, count, percentage: total > 0 ? (count / total) * 100 : 0}))
    .sort((a, b) => b.count - a.count)

  let colorIndex = 0
  return sorted.map((slice) => ({
    ...slice,
    color: slice.name === UNASSIGNED_NAME ? UNASSIGNED_COLOR : colorForIndex(colorIndex++),
  }))
}

// ── Pie chart ───────────────────────────────────────────────────────────────

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
export function ArchetypePieChart({slices}: {slices: ArchetypeSlice[]}) {
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
              stroke={CARD_BACKGROUND}
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

// ── Card chrome ─────────────────────────────────────────────────────────────

export const CARD_STYLE: React.CSSProperties = {
  width: CARD_WIDTH,
  boxSizing: 'border-box',
  padding: '56px 64px 48px',
  background: CARD_BACKGROUND,
  color: '#ffffff',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
}

export function CardHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string | null
}) {
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
          {eyebrow}
        </div>
        <div style={{fontSize: 46, fontWeight: 700, lineHeight: 1.15, marginTop: 10}}>{title}</div>
        {subtitle && (
          <div style={{fontSize: 22, color: 'rgba(255,255,255,0.6)', marginTop: 8}}>{subtitle}</div>
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

export function CardFooter() {
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

// ── Dialog buttons ──────────────────────────────────────────────────────────

export const PRIMARY_BUTTON_STYLE: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  border: 'none',
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600,
}

export const SECONDARY_BUTTON_STYLE: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600,
}

// ── Download helpers ────────────────────────────────────────────────────────

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function triggerDownload(href: string, filename: string): void {
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

export function downloadCsv(rows: string[][], filename: string): void {
  const blob = new Blob([toCsv(rows)], {type: 'text/csv;charset=utf-8;'})
  const url = URL.createObjectURL(blob)
  triggerDownload(url, filename)
  URL.revokeObjectURL(url)
}

// Captures the node's full content box (scrollWidth/Height), so a narrower,
// scrolled preview still renders the whole card. Returns false on failure so
// the caller can show its own message.
export async function capturePng(node: HTMLDivElement | null, filename: string): Promise<boolean> {
  if (!node) return true
  try {
    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      backgroundColor: CARD_BACKGROUND,
      width: node.scrollWidth,
      height: node.scrollHeight,
    })
    triggerDownload(dataUrl, filename)
    return true
  } catch {
    return false
  }
}
