import React, {useCallback, useState} from 'react'
import {useDocumentOperation} from 'sanity'
import {UploadIcon} from '@sanity/icons'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ParsedCard {
  _key: string
  cardName: string
  quantity: number
  quantityOwned: number
  isSideboard: boolean
}

function makeKey(cardName: string, index: number): string {
  const slug = cardName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 24)
  return `${slug}_${index}`
}

// ── Parser ────────────────────────────────────────────────────────────────────

function parseDecklist(raw: string): ParsedCard[] {
  const trimmed = raw.trim()

  // Archidekt MTGO export is XML
  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<Deck')) {
    return parseXml(trimmed)
  }

  return parseText(trimmed)
}

function parseXml(xml: string): ParsedCard[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  const elements = doc.querySelectorAll('Cards')

  // Aggregate by (name, isSideboard) — same card can appear as separate elements
  const map = new Map<string, ParsedCard>()

  elements.forEach((el) => {
    const name = el.getAttribute('Name')
    const qty = parseInt(el.getAttribute('Quantity') ?? '0', 10)
    const isSideboard = el.getAttribute('Sideboard')?.toLowerCase() === 'true'

    if (!name || isNaN(qty) || qty <= 0) return

    const key = `${name}::${isSideboard}`
    const existing = map.get(key)
    if (existing) {
      existing.quantity += qty
      existing.quantityOwned += qty
    } else {
      map.set(key, {_key: '', cardName: name, quantity: qty, quantityOwned: qty, isSideboard})
    }
  })

  return Array.from(map.values()).map((card, i) => ({
    ...card,
    _key: makeKey(card.cardName, i),
  }))
}

// Strips set code + collector number suffix and foil marker from a card name token.
// e.g. "Lightning Bolt (M10) 149 *F*" → "Lightning Bolt"
// e.g. "Tithing Blade // Consuming Sepulcher (lci) 128" → "Tithing Blade // Consuming Sepulcher"
function stripSuffix(raw: string): string {
  // Remove trailing *F* (foil marker)
  let s = raw.replace(/\s+\*F\*\s*$/i, '')
  // Remove trailing (setCode) collectorNumber
  s = s.replace(/\s+\([A-Za-z0-9]+\)\s+\S+\s*$/, '')
  return s.trim()
}

function parseText(text: string): ParsedCard[] {
  const lines = text.split('\n')
  const map = new Map<string, ParsedCard>()
  let inSideboard = false

  for (const raw of lines) {
    const line = raw.trim()

    // Skip blanks and comment lines (// or #)
    if (!line || line.startsWith('#')) continue

    // Section markers
    if (/^mainboard$/i.test(line)) {
      inSideboard = false
      continue
    }
    if (/^sideboard:?$/i.test(line)) {
      inSideboard = true
      continue
    }

    // Card line: leading number then card name
    const match = line.match(/^(\d+)\s+(.+)$/)
    if (!match) continue

    const qty = parseInt(match[1], 10)
    const name = stripSuffix(match[2])

    if (!name || isNaN(qty) || qty <= 0) continue

    const key = `${name}::${inSideboard}`
    const existing = map.get(key)
    if (existing) {
      existing.quantity += qty
      existing.quantityOwned += qty
    } else {
      map.set(key, {_key: '', cardName: name, quantity: qty, quantityOwned: qty, isSideboard: inSideboard})
    }
  }

  return Array.from(map.values()).map((card, i) => ({
    ...card,
    _key: makeKey(card.cardName, i),
  }))
}

// ── Document Action ───────────────────────────────────────────────────────────

export function importDecklistAction(props: {id: string; type: string}) {
  const {patch} = useDocumentOperation(props.id, props.type)
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setError(null)
    setText('')
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setError(null)
    setText('')
  }, [])

  const handleImport = useCallback(() => {
    if (!text.trim()) {
      setError('Paste a decklist before importing.')
      return
    }

    let cards: ParsedCard[]
    try {
      cards = parseDecklist(text)
    } catch {
      setError('Could not parse the decklist. Check the format and try again.')
      return
    }

    if (cards.length === 0) {
      setError('No cards were found in the pasted text.')
      return
    }

    patch.execute([{set: {cards}}])
    setIsOpen(false)
    setText('')
    setError(null)
  }, [text, patch])

  return {
    label: 'Import Decklist',
    icon: UploadIcon,
    onHandle: handleOpen,
    dialog: isOpen && {
      type: 'dialog' as const,
      header: 'Import Decklist',
      onClose: handleClose,
      content: (
        <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <p style={{margin: 0, fontSize: '0.875rem', color: 'inherit', opacity: 0.8}}>
            Paste a decklist exported from <strong>Moxfield</strong> or{' '}
            <strong>Archidekt</strong>. All supported export formats are accepted (MTGO, text,
            plain text, XML). This will <strong>replace</strong> the current cards list.
          </p>
          <p style={{margin: 0, fontSize: '0.875rem', color: 'inherit', opacity: 0.8}}>
            All imported cards will have <em>Quantity Owned</em> set equal to{' '}
            <em>Quantity Needed</em>. Adjust any missing copies individually afterward.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'4 Lightning Bolt\n4 Chain Lightning\n...\n\nSIDEBOARD:\n2 Red Elemental Blast'}
            rows={18}
            style={{
              width: '100%',
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
              padding: '0.75rem',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.05)',
              color: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{margin: 0, color: '#f87171', fontSize: '0.875rem'}}>{error}</p>
          )}
          <div style={{display: 'flex', gap: '0.75rem', justifyContent: 'flex-end'}}>
            <button
              onClick={handleClose}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
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
              Import
            </button>
          </div>
        </div>
      ),
    },
  }
}
