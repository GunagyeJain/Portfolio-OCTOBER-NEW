import { motion, type Variants } from 'framer-motion'
import type { VisualKind } from '../data'

// Every visual has an idle loop plus a stronger "hover" state driven by the card.
const S = 'var(--bone)'
const A = 'var(--accent-2)'

const loop = (d = 0, dur = 3) => ({ duration: dur, repeat: Infinity, repeatType: 'mirror' as const, ease: 'easeInOut' as const, delay: d })

function Hrms() {
  const nodes = [
    [200, 60, 0],
    [110, 150, 1],
    [290, 150, 1],
    [60, 240, 2],
    [160, 240, 2],
    [240, 240, 2],
    [340, 240, 2],
  ] as const
  return (
    <g>
      <motion.path
        d="M200 60 L110 150 M200 60 L290 150 M110 150 L60 240 M110 150 L160 240 M290 150 L240 240 M290 150 L340 240"
        stroke={S}
        strokeWidth="1.5"
        fill="none"
        variants={{ rest: { pathLength: 1, opacity: 0.35 }, hover: { pathLength: [0, 1], opacity: 1, transition: { duration: 0.9 } } }}
      />
      {nodes.map(([x, y, tier], i) => (
        <motion.g
          key={i}
          variants={{
            rest: { scale: 1 },
            hover: { scale: [1, 1.5, 1], transition: { duration: 0.6, delay: tier * 0.15 } },
          }}
        >
          <motion.circle
            cx={x}
            cy={y}
            r={tier === 0 ? 20 : tier === 1 ? 15 : 11}
            fill={i === 2 ? A : S}
            animate={{ y: [0, -6] }}
            transition={loop(i * 0.2, 1.2)}
          />
        </motion.g>
      ))}
    </g>
  )
}

function Mock() {
  return (
    <g>
      <motion.circle
        cx="200"
        cy="120"
        r="62"
        fill="none"
        stroke={S}
        strokeWidth="1.5"
        strokeDasharray="4 8"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <motion.circle cx="200" cy="120" r="34" fill={A} variants={{ rest: { scale: 1 }, hover: { scale: 1.25 } }} />
      {Array.from({ length: 28 }).map((_, i) => {
        const h = 14 + Math.abs(Math.sin(i * 0.9)) * 46
        return (
          <motion.rect
            key={i}
            x={60 + i * 10.5}
            y={250 - h / 2}
            width="5"
            height={h}
            rx="2.5"
            fill={S}
            style={{ originY: '50%' }}
            animate={{ scaleY: [0.3, 1, 0.5] }}
            transition={loop(i * 0.05, 0.9)}
          />
        )
      })}
    </g>
  )
}

function Filo() {
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <motion.path
          key={i}
          d="M110 110 h60 l14 16 h106 v110 h-180 z"
          fill={i === 3 ? A : 'none'}
          stroke={S}
          strokeWidth="1.5"
          variants={{
            rest: { x: i * 10 - 15, y: -i * 10 + 15, rotate: 0 },
            hover: { x: i * 34 - 50, y: -i * 26 + 40, rotate: -6 + i * 4, transition: { type: 'spring', stiffness: 200, damping: 14 } },
          }}
        />
      ))}
    </g>
  )
}

function Margin() {
  return (
    <g>
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.line
          key={i}
          x1="80"
          x2="330"
          y1={70 + i * 30}
          y2={70 + i * 30}
          stroke={S}
          strokeWidth="1.2"
          opacity=".45"
        />
      ))}
      <line x1="120" x2="120" y1="50" y2="270" stroke={A} strokeWidth="2" />
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x="135"
          y={60 + i * 60}
          height="18"
          rx="9"
          fill={i === 1 ? A : S}
          variants={{
            rest: { width: 60 + i * 30 },
            hover: { width: [0, 180 - i * 20], transition: { duration: 0.7, delay: i * 0.1 } },
          }}
        />
      ))}
    </g>
  )
}

function Outline() {
  return (
    <g>
      <motion.circle cx="220" cy="150" r="90" fill={A} animate={{ scale: [1, 1.06, 1] }} transition={loop(0, 2.6)} />
      <motion.path
        d="M130 110 H270 L258 250 H142 Z M165 110 V92 a35 35 0 0 1 70 0 V110"
        fill="none"
        stroke={S}
        strokeWidth="3"
        strokeLinejoin="round"
        variants={{ rest: { rotate: 0, y: 0 }, hover: { rotate: [0, -8, 6, 0], y: -14, transition: { duration: 0.7 } } }}
      />
    </g>
  )
}

function Road() {
  const d = 'M-10 250 C 90 240, 80 150, 180 150 S 320 60, 420 50'
  return (
    <g>
      <path d={d} stroke={S} strokeWidth="1.5" fill="none" opacity=".35" />
      <motion.path
        d={d}
        stroke={S}
        strokeWidth="3"
        fill="none"
        strokeDasharray="10 12"
        animate={{ strokeDashoffset: [0, -44] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
      {[
        [95, 205],
        [200, 140],
        [320, 75],
      ].map(([x, y], i) => (
        <motion.g
          key={i}
          variants={{
            rest: { y: 0 },
            hover: { y: [-60, 0], transition: { type: 'spring', stiffness: 400, damping: 12, delay: i * 0.1 } },
          }}
        >
          <path d={`M${x} ${y} c-14 -18 -18 -26 -18 -34 a18 18 0 0 1 36 0 c0 8 -4 16 -18 34z`} fill={i === 1 ? A : S} />
        </motion.g>
      ))}
    </g>
  )
}

const MAP: Record<VisualKind, () => React.ReactElement> = {
  hrms: Hrms,
  mockmate: Mock,
  filo: Filo,
  margin: Margin,
  outline: Outline,
  roadreport: Road,
}

export const cardVariants: Variants = { rest: {}, hover: {} }

export function Visual({ kind }: { kind: VisualKind }) {
  const V = MAP[kind]
  return (
    <svg className="visual" viewBox="0 0 400 300" aria-hidden>
      <V />
    </svg>
  )
}
