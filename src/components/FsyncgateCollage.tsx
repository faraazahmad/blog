import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { ExternalLink, Lock, MousePointerClick } from 'lucide-react'

import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* the evidence                                                        */
/* ------------------------------------------------------------------ */

type PinColor = 'red' | 'blue' | 'amber' | 'white'

interface Exhibit {
  kind: 'article' | 'note'
  url: string
  title: string
  source: string
  date: string
  blurb: string
  tilt: string // resting rotation
  dx: string // horizontal scatter (margin-left)
  dy: string // vertical scatter (margin-top)
  pin: PinColor
  /** site sends X-Frame-Options / CSP frame-ancestors, so no iframe */
  sealed?: boolean
  quote?: string
}

/* Order matters: items 0-2 = top row, 3-5 = middle row (4 is the
   center case note), 6-8 = bottom row. */
const EXHIBITS: Exhibit[] = [
  {
    kind: 'article',
    url: 'https://lwn.net/Articles/752063/',
    title: "PostgreSQL's fsync() surprise",
    source: 'lwn.net',
    date: 'Apr 18, 2018',
    blurb: 'The LWN write-up that broke the whole saga open for the world.',
    tilt: '-2.5deg',
    dx: '0.5rem',
    dy: '0.5rem',
    pin: 'red',
    sealed: true,
    quote:
      'PostgreSQL assumes that a successful call to fsync() indicates that all data written since the last fsync() is durable...',
  },
  {
    kind: 'article',
    url: 'https://danluu.com/fsyncgate/',
    title: 'Fsyncgate: errors on fsync are unrecovarable',
    source: 'danluu.com',
    date: 'Mar 28, 2018',
    blurb: 'The post that named the scandal.',
    tilt: '1.5deg',
    dx: '-0.25rem',
    dy: '1rem',
    pin: 'blue',
  },
  {
    kind: 'article',
    url: 'https://wiki.postgresql.org/wiki/Fsync_Errors',
    title: 'Fsync Errors',
    source: 'wiki.postgresql.org',
    date: 'ed. Jul 2023',
    blurb: "The wiki's canonical timeline of the saga.",
    tilt: '-1.5deg',
    dx: '0.75rem',
    dy: '0.25rem',
    pin: 'amber',
  },
  {
    kind: 'article',
    url: 'https://www.postgresql.org/message-id/CAEepm%3D2gTANm%3De3ARnJT%3Dn0h8hf88wqmaZxk0JYkxw%2Bb21fNrw%40mail.gmail.com',
    title: "Refactoring the checkpointer's fsync request queue",
    source: 'pgsql-hackers',
    date: 'Oct 15, 2018',
    blurb: 'The thread where the PANIC policy got argued out.',
    tilt: '2.5deg',
    dx: '0.25rem',
    dy: '-0.75rem',
    pin: 'amber',
  },
  {
    kind: 'note',
    url: '#case-file',
    title: 'CASE FILE',
    source: '',
    date: 'opened 2018',
    blurb: '',
    tilt: '-1deg',
    dx: '-0.5rem',
    dy: '-0.5rem',
    pin: 'red',
  },
  {
    kind: 'article',
    url: 'https://www.postgresql.org/message-id/E1gObQY-00021d-L6%40gemulon.postgresql.org',
    title: 'PANIC on fsync() failure.',
    source: 'git.postgresql.org',
    date: 'Nov 19, 2018',
    blurb: 'The commit that made the call.',
    tilt: '-2deg',
    dx: '-0.75rem',
    dy: '-0.25rem',
    pin: 'red',
  },
  {
    kind: 'article',
    url: 'https://www.postgresql.org/message-id/CAM%2B6J95Lixr%2BzFA48wtxJvn_xhE9eU-KANkkZ%2B5r0%2BMzFGVYtw%40mail.gmail.com',
    title: 'why did fsync-gate not affect Oracle or MySQL?',
    source: 'pgsql-hackers',
    date: 'May 2, 2021',
    blurb: 'Why did other databases dodge the bullet?',
    tilt: '2deg',
    dx: '-0.5rem',
    dy: '-0.5rem',
    pin: 'blue',
  },
  {
    kind: 'article',
    url: 'https://blog.sinjakli.co.uk/2025/11/29/the-computer-wants-to-lose-your-data-bonus-bits/',
    title: 'The Computer Wants to Lose Your Data: Bonus Bits',
    source: 'blog.sinjakli.co.uk',
    date: 'Nov 29, 2025',
    blurb: 'On write() vs fsync() and the lies storage tells.',
    tilt: '-2.5deg',
    dx: '0.5rem',
    dy: '-0.75rem',
    pin: 'white',
  },
  {
    kind: 'article',
    url: 'https://thebuild.com/blog/all-your-gucs-in-a-row-datasyncretry/',
    title: 'All Your GUCs in a Row: data_sync_retry',
    source: 'thebuild.com',
    date: 'Jun 7, 2026',
    blurb: 'The GUC that lets you shoot yourself in the foot.',
    tilt: '1.5deg',
    dx: '-0.25rem',
    dy: '0.5rem',
    pin: 'blue',
    sealed: true,
    quote:
      "PostgreSQL's fsync() assumption once broke silently across every database in the world. Here's the scar tissue, and why crashing is the safe option.",
  },
]

/* ------------------------------------------------------------------ */
/* iframe rendered at a phone viewport width, then scaled down to fit  */
/* the clipping — media queries inside the frame see 390px, so sites  */
/* serve their mobile layout                                           */
/* ------------------------------------------------------------------ */

const PHONE_W = 390 // iPhone-ish viewport
const CARD_W = 240 // clipping width, w-60
const SCALE = CARD_W / PHONE_W
const BODY_H = 288 // clipping body, h-72
const PHONE_H = Math.round(BODY_H / SCALE)

/* ------------------------------------------------------------------ */
/* CSS-only textures                                                   */
/* ------------------------------------------------------------------ */

const WOOD_FRAME: React.CSSProperties = {
  backgroundImage: [
    // grain lines
    'repeating-linear-gradient(93deg, rgba(46,24,8,0.28) 0px, rgba(46,24,8,0.28) 2px, transparent 2px, transparent 9px)',
    // light streaks
    'repeating-linear-gradient(88deg, rgba(255,220,180,0.09) 0px, rgba(255,220,180,0.09) 1px, transparent 1px, transparent 13px)',
    // wide tonal bands
    'repeating-linear-gradient(90deg, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0.10) 14px, transparent 14px, transparent 37px)',
    // base wood
    'linear-gradient(180deg, #9a6a3d, #774b26 55%, #8a5a31)',
  ].join(', '),
  boxShadow:
    'inset 0 0 0 2px rgba(30,15,5,0.45), inset 0 3px 10px rgba(255,225,190,0.18), inset 0 -4px 12px rgba(20,8,0,0.5), 0 24px 60px -12px rgba(0,0,0,0.55)',
}

const GREEN_CORK: React.CSSProperties = {
  backgroundColor: '#57713f',
  backgroundImage: [
    // cork speckles — light
    'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1.6px)',
    // cork speckles — dark, offset grid
    'radial-gradient(rgba(15,30,5,0.22) 1px, transparent 1.6px)',
    // chunkier motting
    'radial-gradient(rgba(0,0,0,0.10) 1.5px, transparent 2.5px)',
    'radial-gradient(rgba(220,255,190,0.06) 1.5px, transparent 2.5px)',
    // soft uneven shading
    'radial-gradient(ellipse 120% 90% at 25% 15%, rgba(255,255,240,0.07), transparent 60%)',
    'radial-gradient(ellipse 110% 95% at 75% 85%, rgba(0,0,0,0.18), transparent 55%)',
  ].join(', '),
  backgroundSize: '7px 7px, 11px 11px, 17px 17px, 23px 23px, 100% 100%, 100% 100%',
  backgroundPosition: '0 0, 4px 5px, 9px 2px, 3px 13px, 0 0, 0 0',
  boxShadow: 'inset 0 4px 14px rgba(10,20,4,0.45), inset 0 -3px 10px rgba(10,20,4,0.35)',
}

const PIN_STYLES: Record<PinColor, React.CSSProperties> = {
  red: {
    backgroundImage: 'radial-gradient(circle at 32% 30%, #fda4a4, #dc2626 62%, #7f1d1d)',
  },
  blue: {
    backgroundImage: 'radial-gradient(circle at 32% 30%, #93c5fd, #2563eb 62%, #1e3a8a)',
  },
  amber: {
    backgroundImage: 'radial-gradient(circle at 32% 30%, #fde68a, #d97706 62%, #78350f)',
  },
  white: {
    backgroundImage: 'radial-gradient(circle at 32% 30%, #ffffff, #d4d4d8 62%, #52525b)',
  },
}

/* ------------------------------------------------------------------ */
/* torn + aged paper                                                   */
/* ------------------------------------------------------------------ */

/** tiny deterministic PRNG so each card tears the same way every render */
function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** jagged torn-paper outline as a clip-path polygon (percent units).
    top edge is only lightly nicked (it was pinned), the bottom edge is
    ripped clean off — torn from the newspaper/feed. */
function tornPolygon(seed: number): string {
  const rnd = mulberry32(seed)
  const j = (m: number) => +(rnd() * 2 * m - m).toFixed(2)
  const A: [number, number] = [j(0.7), j(0.7)]
  const B: [number, number] = [100 + j(0.7), j(0.7)]
  const C: [number, number] = [100 + j(0.7), 100 + j(0.7)]
  const D: [number, number] = [j(0.7), 100 + j(0.7)]
  const side = (p: [number, number], q: [number, number], n: number, m: number) => {
    const pts: [number, number][] = []
    for (let i = 1; i < n; i++) {
      const t = i / n
      pts.push([
        +(p[0] + (q[0] - p[0]) * t + j(m)).toFixed(2),
        +(p[1] + (q[1] - p[1]) * t + j(m)).toFixed(2),
      ])
    }
    return pts
  }
  const pts = [
    A,
    ...side(A, B, 6, 0.8), // top — lightly nicked
    B,
    ...side(B, C, 5, 1.1), // right
    C,
    ...side(C, D, 8, 1.9), // bottom — badly torn
    D,
    ...side(D, A, 5, 1.1), // left
  ]
  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(', ')})`
}

const PAPER_TONES = ['#f3ecd6', '#efe6c6', '#f6f0dd', '#eadfc0']

/** aged newsprint: yellowed tone, foxing stains, darkened edges */
function agedPaper(seed: number): React.CSSProperties {
  const rnd = mulberry32(seed * 1013 + 77)
  const stains = Array.from({ length: 3 }, () => {
    const x = (5 + rnd() * 90).toFixed(1)
    const y = (5 + rnd() * 90).toFixed(1)
    const r = (18 + rnd() * 45).toFixed(0)
    const a = (0.05 + rnd() * 0.09).toFixed(2)
    return `radial-gradient(circle ${r}px at ${x}% ${y}%, rgba(141,100,44,${a}), transparent 70%)`
  })
  return {
    backgroundColor: PAPER_TONES[seed % PAPER_TONES.length],
    backgroundImage: stains.join(', '),
    boxShadow: 'inset 0 0 26px rgba(124,90,40,0.28), inset 0 0 3px rgba(124,90,40,0.25)',
  }
}

/** yellow legal-pad paper for the detective's note: red margin line,
    blue rules, soft aging toward the bottom edge */
const YELLOW_PAD: React.CSSProperties = {
  backgroundColor: '#f5e59a',
  backgroundImage: [
    'linear-gradient(90deg, transparent 0, transparent 24px, rgba(203,80,80,0.55) 24px, rgba(203,80,80,0.55) 25.5px, transparent 25.5px)',
    'repeating-linear-gradient(transparent, transparent 25px, rgba(96,125,189,0.5) 25px, rgba(96,125,189,0.5) 26px)',
    'radial-gradient(ellipse 140% 110% at 50% -20%, rgba(255,250,220,0.55), transparent 55%)',
    'radial-gradient(ellipse 160% 130% at 50% 120%, rgba(150,110,30,0.20), transparent 60%)',
  ].join(', '),
  backgroundPosition: '0 0, 0 4px, 0 0, 0 0',
  boxShadow: 'inset 0 0 26px rgba(150,110,30,0.22)',
}

/** per-card ink fade: how washed-out the printout looks at rest.
    (index 4 is the case note — no fading there) */
const INK_FADE = [0.88, 0.72, 0.9, 0.68, 1, 0.8, 0.66, 0.9, 0.74]
const AGED_SEPIA = [0.45, 0.3, 0.5, 0.35, 0, 0.4, 0.3, 0.45, 0.35]

/* ------------------------------------------------------------------ */
/* red thread — measured, not guessed                                 */
/* ------------------------------------------------------------------ */

interface PinPoint {
  x: number
  y: number
}

interface Measurements {
  pins: (PinPoint | null)[]
  width: number
  height: number
}

/** one yarn connection: layered strokes for a twisted, textured cord */
function ThreadPath({ d }: { d: string }) {
  return (
    <g fill="none" strokeLinecap="round">
      {/* shadow the thread casts on the cork and paper below */}
      <path d={d} stroke="rgba(0,0,0,0.35)" strokeWidth="7" transform="translate(2,4)" />
      {/* yarn body */}
      <path d={d} stroke="#b91c1c" strokeWidth="5" />
      {/* twisted strands, offset across the cord for a wound look */}
      <path d={d} stroke="rgba(60,0,0,0.45)" strokeWidth="1.5" transform="translate(-1.2,1)" />
      <path d={d} stroke="rgba(255,120,100,0.7)" strokeWidth="1.5" transform="translate(1.2,-1)" />
      {/* top sheen */}
      <path d={d} stroke="rgba(255,190,175,0.55)" strokeWidth="1" transform="translate(-2,-1.6)" />
    </g>
  )
}

/** thread wound around a pushpin: tight loops drawn over the pin head */
function ThreadKnot({ p, big = false }: { p: PinPoint; big?: boolean }) {
  const loops = big ? [13, 16.5, 20] : [12.5, 15.5]
  return (
    <g fill="none" strokeLinecap="round">
      {loops.map((r, i) => (
        <ellipse
          key={r}
          cx={p.x}
          cy={p.y}
          rx={r}
          ry={r * 0.78}
          transform={`rotate(${i % 2 === 0 ? -8 : 6} ${p.x} ${p.y})`}
          stroke={i === loops.length - 1 ? 'rgba(153,27,27,0.9)' : '#b91c1c'}
          strokeWidth="2.4"
        />
      ))}
    </g>
  )
}

function RedStrings({ m }: { m: Measurements }) {
  // every thread runs from the center case-note pin (index 4) to a
  // corner/edge pin, sagging toward gravity along the way
  const center = m.pins[4]
  if (!center) return null

  const connections = m.pins
    .map((pin, i) => {
      if (i === 4 || !pin) return null
      const sag = 26 + (i % 3) * 15
      const mx = (center.x + pin.x) / 2
      const my = (center.y + pin.y) / 2 + sag
      return {
        key: i,
        d: `M ${center.x} ${center.y} Q ${mx} ${my} ${pin.x} ${pin.y}`,
      }
    })
    .filter(Boolean) as { key: number; d: string }[]

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      viewBox={`0 0 ${m.width} ${m.height}`}
      preserveAspectRatio="none"
    >
      {/* threads first, then the knots pinning them down on top */}
      {connections.map((c) => (
        <ThreadPath key={c.key} d={c.d} />
      ))}
      {m.pins.map((pin, i) =>
        pin ? <ThreadKnot key={i} p={pin} big={i === 4} /> : null
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* small pieces                                                        */
/* ------------------------------------------------------------------ */

function PushPin({ color, x, y }: { color: PinColor; x: number; y: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute block size-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        ...PIN_STYLES[color],
        boxShadow:
          '0 4px 5px rgba(0,0,0,0.45), inset -1px -2px 3px rgba(0,0,0,0.35), inset 1px 1px 2px rgba(255,255,255,0.5)',
      }}
    />
  )
}

/** pins live in their own board layer, above the thread (z-[5]) and the
    resting cards — the thread is wound under each pin head. cards that
    pop out (z-[9]) rise above their pin, like paper pulled off the board. */
function PinLayer({ m }: { m: Measurements }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[7]">
      {m.pins.map((pin, i) =>
        pin ? <PushPin key={i} color={EXHIBITS[i].pin} x={pin.x} y={pin.y} /> : null
      )}
    </div>
  )
}

function CornerScrews() {
  const style: React.CSSProperties = {
    backgroundImage:
      'radial-gradient(circle at 35% 35%, #dcc9a4, #8a7a55 55%, #3f3520)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.6), inset -1px -1px 1px rgba(0,0,0,0.4)',
  }
  return (
    <>
      {(['top-2.5 left-2.5', 'top-2.5 right-2.5', 'bottom-2.5 left-2.5', 'bottom-2.5 right-2.5'] as const).map(
        (pos) => (
          <span key={pos} aria-hidden="true" className={`absolute ${pos} z-20 size-2.5 rounded-full`} style={style} />
        )
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* the case note (center of the board)                                 */
/* ------------------------------------------------------------------ */

function CaseNote() {
  return (
    <div
      className="flex h-72 flex-col gap-0 overflow-hidden pr-4 pb-2 pl-10"
      style={{
        fontFamily: "'Schoolbell', cursive",
        color: '#33415e',
      }}
    >
      <p className="-mt-2 font-mono text-xs uppercase opacity-60">
        case file #fsync-2018
      </p>
      <p className="-rotate-10 text-center -mt-2 leading-[2px] text-lg">
        suspect: <br/><span className="leading-8 underline decoration-red-600/60">deferred writeback error</span>
      </p>
      <p className="leading-[2px] text-sm">
        still at large. blamed tx 102. <br/><span className="leading-8 text-red-700">never tx 101.</span>
      </p>
      <p className="-mt-2 leading-[2px] text-sm">
        motive: everyone assumed <br/><span className="leading-8 underline decoration-red-600/60">fsync() == durable</span>
      </p>
      <p className="-mt-2 leading-[2px] text-sm">
        postgres verdict: <br/><span className="leading-8 font-bold">PANIC on failure.</span>
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* a pinned clipping                                                   */
/* ------------------------------------------------------------------ */

function Clipping({
  exhibit,
  index,
  registerCard,
}: {
  exhibit: Exhibit
  index: number
  registerCard: (el: HTMLDivElement | null) => void
}) {
  const [loaded, setLoaded] = useState(false)
  const isNote = exhibit.kind === 'note'
  const seed = isNote ? 42 : index * 7 + 3

  return (
    <div
      className="group relative mt-8 w-60 cursor-pointer focus:outline-none"
      style={{ marginLeft: exhibit.dx, marginTop: exhibit.dy }}
      onMouseEnter={() => setLoaded(true)}
      onFocus={() => setLoaded(true)}
      onClick={() => setLoaded(true)}
    >
      {/* transform + z + drop-shadow wrapper: the shadow hugs the torn
          shape because the clip lives on the child */}
      <div
        ref={registerCard}
        tabIndex={0}
        className={cn(
          'relative transition-all duration-300 ease-out',
          '[transform:rotate(var(--tilt))]',
          'drop-shadow-[0_10px_14px_rgba(0,0,0,0.40)]',
          // the fresh notepad sits above the thread; the old printouts rest
          // beneath it (thread z-[5]) until they pop out on hover
          isNote ? 'z-[6]' : 'z-[1]',
          'hover:z-[9] focus:z-[9]',
          'hover:[transform:rotate(0deg)_scale(1.35)] focus:[transform:rotate(0deg)_scale(1.35)]',
          'hover:drop-shadow-[0_28px_50px_rgba(0,0,0,0.60)] focus:drop-shadow-[0_28px_50px_rgba(0,0,0,0.60)]'
        )}
        style={{ '--tilt': exhibit.tilt } as React.CSSProperties}
      >
        {/* pin lives on the board layer, above the thread — see PinLayer */}

        {/* the torn paper sheet */}
        <div
          className="relative"
          style={{
            clipPath: tornPolygon(seed),
            ...(isNote ? YELLOW_PAD : agedPaper(seed)),
            // ink aging vars — consumed (and cleared on hover) by the child
            '--aged': AGED_SEPIA[index] ?? 0.35,
            '--ink': INK_FADE[index] ?? 0.85,
          } as React.CSSProperties}
        >
          {/* aged ink: sepia + faded, clears up under the hover "desk lamp" */}
          <div
            className={cn(
              'h-full transition-[filter] duration-300',
              !isNote &&
                '[filter:sepia(var(--aged))_contrast(0.94)_opacity(var(--ink))]',
              !isNote && 'group-hover:[--aged:0] group-hover:[--ink:1]'
            )}
            style={{ color: '#41362a' } as React.CSSProperties}
          >
            {isNote ? (
              <>
                <div className="flex items-center justify-between px-4 pt-3 pb-1">
                  <span className="font-mono text-[10px] tracking-widest text-stone-600 uppercase">
                    detective's notes
                  </span>
                  <span className="font-mono text-[10px] text-stone-500">confidential</span>
                </div>
                <CaseNote />
              </>
            ) : (
              <>
                {/* masthead */}
                <div className="flex items-center justify-between gap-2 border-b border-stone-400/40 px-3 pt-3 pb-2">
                  <span className="truncate font-mono text-[10px] tracking-widest text-stone-600 uppercase">
                    {exhibit.source}
                  </span>
                  <span className="font-mono text-[10px] text-stone-500">{exhibit.date}</span>
                </div>

                <a
                  href={exhibit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 pt-2 pb-1 font-serif text-base leading-snug font-bold no-underline hover:underline"
                >
                  {exhibit.title}
                </a>

                {exhibit.sealed ? (
                  /* site refuses to be framed — sealed evidence bag instead */
                  <div className="relative flex h-72 flex-col items-center justify-center gap-3 border-t border-dashed border-stone-500/40 px-4 text-center">
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 left-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded border-[3px] border-red-600/60 px-3 py-1 font-mono text-xs font-bold tracking-[0.3em] text-red-600/70 uppercase select-none"
                    >
                      Sealed
                    </span>
                    {exhibit.quote && (
                      <span className="relative z-10 font-serif text-xs leading-relaxed text-stone-600 italic">
                        “{exhibit.quote}”
                      </span>
                    )}
                    <span className="relative z-10 flex items-center gap-1.5 rounded-full bg-stone-200/80 px-3 py-1 font-mono text-[10px] text-stone-600">
                      <Lock className="size-3" aria-hidden="true" />
                      refuses to be framed
                    </span>
                    <a
                      href={exhibit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 flex items-center gap-1 text-xs font-medium text-blue-700 underline underline-offset-2"
                    >
                      open the original <ExternalLink className="size-3" aria-hidden="true" />
                    </a>
                  </div>
                ) : (
                  /* the live page at a phone viewport, lazily mounted */
                  <div className="relative h-72 border-t border-stone-400/40">
                    {loaded ? (
                      <iframe
                        src={exhibit.url}
                        title={exhibit.title}
                        loading="lazy"
                        className="absolute top-0 left-0 origin-top-left border-0"
                        style={{
                          width: `${PHONE_W}px`,
                          height: `${PHONE_H}px`,
                          transform: `scale(${SCALE})`,
                        }}
                      />
                    ) : (
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-5 text-center">
                        <MousePointerClick
                          className="size-5 text-stone-500 opacity-60 transition-opacity group-hover:opacity-0"
                          aria-hidden="true"
                        />
                        <span className="font-serif text-xs leading-relaxed text-stone-600 italic transition-opacity group-hover:opacity-0">
                          {exhibit.blurb}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* the board                                                           */
/* ------------------------------------------------------------------ */

export default function FsyncgateCollage() {
  const corkRef = useRef<HTMLDivElement | null>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [m, setM] = useState<Measurements | null>(null)

  // pin center = top edge of each card, horizontally centered (that's
  // exactly where the DOM pushpin sits: -top-2.5 with size-5 → centered
  // on the card's top edge)
  const measure = useCallback(() => {
    const cork = corkRef.current
    if (!cork) return
    const corkRect = cork.getBoundingClientRect()
    const pins = cardsRef.current.map((card) => {
      if (!card) return null
      const r = card.getBoundingClientRect()
      return {
        x: r.left + r.width / 2 - corkRect.left,
        y: r.top - corkRect.top,
      }
    })
    setM({ pins, width: corkRect.width, height: corkRect.height })
  }, [])

  useLayoutEffect(() => {
    measure()
    const cork = corkRef.current
    if (!cork) return
    const ro = new ResizeObserver(() => measure())
    ro.observe(cork)
    // card heights settle once webfonts load — re-measure then too
    document.fonts?.ready.then(() => measure())
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  return (
    <div className="not-prose my-10 flex flex-col items-center">
      <div className="w-full max-w-3xl overflow-x-auto pb-4 sm:overflow-visible">
        {/* wooden frame */}
        <div className="relative min-w-[820px] rounded-2xl p-4 dark:brightness-[0.82]" style={WOOD_FRAME}>
          <CornerScrews />
          {/* green cork board */}
          <div ref={corkRef} className="relative rounded-lg p-6" style={GREEN_CORK}>
            {m && <RedStrings m={m} />}
            {m && <PinLayer m={m} />}
            {/* 3×3 grid of overlapping exhibits */}
            <div className="relative grid grid-cols-3 items-start justify-items-center">
              {EXHIBITS.map((exhibit, i) => (
                <Clipping
                  key={exhibit.url}
                  exhibit={exhibit}
                  index={i}
                  registerCard={(el) => {
                    cardsRef.current[i] = el
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center font-mono text-xs tracking-wide text-zinc-500 dark:text-zinc-400">
        the evidence board · six clippings are the live pages (mobile edition) · two refuse to
        be framed · hover to pop one out
      </p>
      <p className="mt-1 font-mono text-[10px] text-zinc-400 sm:hidden dark:text-zinc-500">
        ← drag sideways to see the whole board →
      </p>
    </div>
  )
}
