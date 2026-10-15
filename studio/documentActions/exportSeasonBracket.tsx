import React, {useCallback, useMemo, useRef, useState} from 'react'
import {useClient} from 'sanity'
import {DownloadIcon} from '@sanity/icons'
import {
  CARD_STYLE,
  CARD_WIDTH,
  CardFooter,
  CardHeader,
  PRIMARY_BUTTON_STYLE,
  capturePng,
  slugify,
} from './exportShared'
import {TOP_CUT, loadSeasonExport, type SeasonExport} from './exportSeasonResults'

// A document action, scoped to `season`, that builds the top 8 finals bracket
// from the season standings and exports a results image for each round
// (quarter finals, semi finals, final).
//
// Seeding is 1v8, 2v7, 3v6, 4v5. The semi finals follow the standard bracket
// layout: the 1v8 winner plays the 4v5 winner, and the 2v7 winner plays the
// 3v6 winner, so the top seed is kept apart from the 2nd and 3rd seeds until
// the final.
//
// Results are simple win/loss picks held in the dialog only — nothing is
// written to the dataset, so closing the dialog clears them.

// ── Types and bracket model ───────────────────────────────────────────────────

type Seed = number // 1-based standings position

interface Match {
  id: string
  a: Seed | null
  b: Seed | null
  winner: Seed | null
}

type Round = 'quarter' | 'semi' | 'final'

// Winner of each match id, by seed.
type Picks = Record<string, Seed>

const QUARTER_PAIRINGS: Array<[string, Seed, Seed]> = [
  ['qf1', 1, 8],
  ['qf2', 2, 7],
  ['qf3', 3, 6],
  ['qf4', 4, 5],
]

const ROUND_LABELS: Record<Round, string> = {
  quarter: 'Quarter Finals',
  semi: 'Semi Finals',
  final: 'Final',
}

// A pick only counts while it is still one of the two players in the match, so
// changing an earlier result silently invalidates anything downstream of it
// rather than leaving a stale winner behind.
function makeMatch(id: string, a: Seed | null, b: Seed | null, picks: Picks): Match {
  const picked = picks[id]
  const winner = picked !== undefined && (picked === a || picked === b) ? picked : null
  return {id, a, b, winner}
}

function buildBracket(picks: Picks): Record<Round, Match[]> {
  const quarter = QUARTER_PAIRINGS.map(([id, a, b]) => makeMatch(id, a, b, picks))
  const [qf1, qf2, qf3, qf4] = quarter
  const semi = [
    makeMatch('sf1', qf1.winner, qf4.winner, picks),
    makeMatch('sf2', qf2.winner, qf3.winner, picks),
  ]
  const final = [makeMatch('f1', semi[0].winner, semi[1].winner, picks)]
  return {quarter, semi, final}
}

// A round can be exported once every match has both players known.
function isRoundReady(matches: Match[]): boolean {
  return matches.every((m) => m.a !== null && m.b !== null)
}

function isRoundDecided(matches: Match[]): boolean {
  return matches.every((m) => m.winner !== null)
}

// ── Graphics (captured to PNG) ──────────────────────────────────────────────

function PlayerRow({
  seed,
  name,
  outcome,
}: {
  seed: Seed
  name: string
  outcome: 'won' | 'lost' | 'pending'
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '22px 28px',
        fontSize: 34,
        fontWeight: outcome === 'won' ? 700 : 600,
        opacity: outcome === 'lost' ? 0.45 : 1,
        background: outcome === 'won' ? 'rgba(245,197,66,0.16)' : 'transparent',
      }}
    >
      <span style={{width: 56, color: '#f5c542', fontWeight: 700}}>#{seed}</span>
      <span style={{flex: 1}}>{name}</span>
      {outcome !== 'pending' && (
        <span
          style={{
            width: 56,
            textAlign: 'center',
            fontSize: 26,
            fontWeight: 700,
            color: outcome === 'won' ? '#f5c542' : 'rgba(255,255,255,0.7)',
          }}
        >
          {outcome === 'won' ? 'W' : 'L'}
        </span>
      )}
    </div>
  )
}

function RoundGraphic({
  data,
  round,
  matches,
}: {
  data: SeasonExport
  round: Round
  matches: Match[]
}) {
  const nameOf = (seed: Seed) => data.standings[seed - 1].player
  const decided = isRoundDecided(matches)
  const champion = round === 'final' && matches[0].winner !== null ? matches[0].winner : null

  return (
    <div style={CARD_STYLE}>
      <CardHeader
        eyebrow={`Finals · ${ROUND_LABELS[round]}`}
        title={data.name}
        subtitle={decided ? 'Results' : 'Matchups'}
      />

      <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
        {matches.map((match) => {
          const outcomeFor = (seed: Seed) =>
            match.winner === null ? 'pending' : match.winner === seed ? 'won' : 'lost'
          return (
            <div
              key={match.id}
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.07)',
              }}
            >
              <PlayerRow seed={match.a as Seed} name={nameOf(match.a as Seed)} outcome={outcomeFor(match.a as Seed)} />
              <div style={{height: 2, background: 'rgba(255,255,255,0.12)'}} />
              <PlayerRow seed={match.b as Seed} name={nameOf(match.b as Seed)} outcome={outcomeFor(match.b as Seed)} />
            </div>
          )
        })}
      </div>

      {champion !== null && (
        <div style={{marginTop: 40, textAlign: 'center'}}>
          <div style={{fontSize: 20, letterSpacing: 3, textTransform: 'uppercase', color: '#f5c542'}}>
            Champion
          </div>
          <div style={{fontSize: 56, fontWeight: 700, marginTop: 8}}>{nameOf(champion)}</div>
        </div>
      )}

      <CardFooter />
    </div>
  )
}

// ── Result entry ────────────────────────────────────────────────────────────

function ResultPicker({
  data,
  matches,
  onPick,
}: {
  data: SeasonExport
  matches: Match[]
  onPick: (matchId: string, seed: Seed) => void
}) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
      {matches.map((match) => (
        <div key={match.id} style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
          {[match.a, match.b].map((seed, i) => {
            if (seed === null) {
              return (
                <span key={i} style={{flex: 1, fontSize: '0.8rem', opacity: 0.5}}>
                  To be decided
                </span>
              )
            }
            const isWinner = match.winner === seed
            return (
              <button
                key={i}
                onClick={() => onPick(match.id, seed)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  borderRadius: 4,
                  border: isWinner ? '1px solid #f5c542' : '1px solid rgba(255,255,255,0.2)',
                  background: isWinner ? 'rgba(245,197,66,0.18)' : 'transparent',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: isWinner ? 700 : 500,
                  textAlign: 'left',
                }}
              >
                #{seed} {data.standings[seed - 1].player}
                {isWinner ? ' (W)' : ''}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ── Document Action ───────────────────────────────────────────────────────────

export function exportSeasonBracketAction(props: {id: string; type: string}) {
  const client = useClient({apiVersion: '2026-05-15'})
  const quarterRef = useRef<HTMLDivElement>(null)
  const semiRef = useRef<HTMLDivElement>(null)
  const finalRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<SeasonExport | null>(null)
  const [picks, setPicks] = useState<Picks>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleOpen = useCallback(async () => {
    setIsOpen(true)
    setStatus('loading')
    setMessage('')
    setData(null)
    setPicks({})
    try {
      const built = await loadSeasonExport(client, props.id)
      if (built.standings.length < TOP_CUT) {
        setStatus('error')
        setMessage(`A bracket needs at least ${TOP_CUT} players in the standings.`)
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
    setPicks({})
    setMessage('')
  }, [])

  // Selecting the current winner again clears the result.
  const handlePick = useCallback((matchId: string, seed: Seed) => {
    setPicks((prev) => {
      const next = {...prev}
      if (next[matchId] === seed) delete next[matchId]
      else next[matchId] = seed
      return next
    })
  }, [])

  const bracket = useMemo(() => buildBracket(picks), [picks])

  const downloadImage = useCallback(async (node: HTMLDivElement | null, filename: string) => {
    setMessage('')
    if (!(await capturePng(node, filename))) {
      setMessage('Could not generate the image. Please try again.')
    }
  }, [])

  const seasonSlug = data ? slugify(data.name) : 'season'
  const refs: Record<Round, React.RefObject<HTMLDivElement | null>> = {
    quarter: quarterRef,
    semi: semiRef,
    final: finalRef,
  }

  return {
    label: 'Export Bracket',
    icon: DownloadIcon,
    onHandle: handleOpen,
    dialog: isOpen && {
      type: 'dialog' as const,
      header: 'Export Bracket',
      width: 'medium' as const,
      onClose: handleClose,
      content: (
        <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
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
                  ? 'Seeded from the final standings.'
                  : 'This season is still running, so the bracket is seeded from the live standings.'}{' '}
                Seeds play 1v8, 2v7, 3v6 and 4v5; the 1v8 winner meets the 4v5 winner in the semi
                finals, and the 2v7 winner meets the 3v6 winner. Click a player to mark them as the
                winner (click again to clear). Results are not saved, so download your images before
                closing this dialog.
              </p>

              {(['quarter', 'semi', 'final'] as Round[]).map((round) => {
                const matches = bracket[round]
                const ready = isRoundReady(matches)
                return (
                  <div key={round} style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                    <span style={{fontSize: '0.8rem', fontWeight: 600, opacity: 0.7}}>
                      {ROUND_LABELS[round]}
                    </span>

                    <ResultPicker data={data} matches={matches} onPick={handlePick} />

                    {ready ? (
                      <>
                        <div style={{overflow: 'auto', maxHeight: 420, borderRadius: 8}}>
                          <div ref={refs[round]} style={{width: CARD_WIDTH}}>
                            <RoundGraphic data={data} round={round} matches={matches} />
                          </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                          <button
                            onClick={() =>
                              downloadImage(refs[round].current, `bracket-${round}-${seasonSlug}.png`)
                            }
                            style={PRIMARY_BUTTON_STYLE}
                          >
                            Download {ROUND_LABELS[round].toLowerCase()} image
                          </button>
                        </div>
                      </>
                    ) : (
                      <p style={{margin: 0, fontSize: '0.8rem', opacity: 0.6}}>
                        Pick the winners of the previous round to unlock this image.
                      </p>
                    )}
                  </div>
                )
              })}

              {message && (
                <p style={{margin: 0, fontSize: '0.875rem', color: '#f87171'}}>{message}</p>
              )}
            </>
          )}
        </div>
      ),
    },
  }
}
