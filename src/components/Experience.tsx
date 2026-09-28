import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { lerpRange } from './kit'

const POINTS = [
  'Built the entire frontend of their internal HRMS, with one backend engineer.',
  'Auth, role-based access, onboarding, and a five-type leave system.',
  'Shipped through PRs and code review. 100+ employees use it today.',
]

const STACK = ['React', 'TypeScript', 'Redux Toolkit', 'RTK Query', 'Tailwind', 'MSW']

function Reveal({ p, at, children, className }: { p: MotionValue<number>; at: number; children: React.ReactNode; className?: string }) {
  const y = useTransform(p, [at, at + 0.12], ['110%', '0%'])
  const r = useTransform(p, [at, at + 0.12], [5, 0])
  return (
    <span className={`line-mask ${className ?? ''}`}>
      <motion.span className="line-in" style={{ y, rotate: r }}>
        {children}
      </motion.span>
    </span>
  )
}

export default function Experience() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end end'] })

  // Panel grows from a small card to the full viewport.
  const sx = useTransform(p, [0.1, 0.5], [0.42, 1])
  const sy = useTransform(p, [0.1, 0.5], [0.3, 1])
  const radius = useTransform(p, [0.1, 0.5], [48, 0])
  const peekOpacity = useTransform(p, (v) => lerpRange(v, [0.3, 0.45], [1, 0]))
  const peekScale = useTransform(p, [0.1, 0.45], [1, 2.4])
  const bigX = useTransform(p, [0.45, 1], ['6vw', '-22vw'])

  return (
    <section className="exp" id="experience" ref={ref}>
      <div className="exp-stage">
        <motion.div className="exp-panel" style={{ scaleX: sx, scaleY: sy, borderRadius: radius }} />
        <motion.p className="exp-peek" style={{ opacity: peekOpacity, scale: peekScale }}>
          Experience
        </motion.p>

        <div className="exp-content">
          <div className="exp-top">
            <Reveal p={p} at={0.5} className="label">
              Experience (02)
            </Reveal>
            <Reveal p={p} at={0.52} className="label">
              Jun — Jul 2026 · Noida
            </Reveal>
          </div>

          <motion.h2 className="exp-company" style={{ x: bigX }}>
            <Reveal p={p} at={0.5}>
              Codeblox Systems
            </Reveal>
          </motion.h2>

          <div className="exp-grid">
            <div>
              <Reveal p={p} at={0.58} className="exp-role">
                Software Developer Intern
              </Reveal>
              <Reveal p={p} at={0.6} className="exp-sub">
                at Swiftex
              </Reveal>
            </div>
            <ol className="exp-points">
              {POINTS.map((t, i) => (
                <li key={i}>
                  <Reveal p={p} at={0.62 + i * 0.06}>
                    <span className="exp-no">0{i + 1}</span> {t}
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          <div className="exp-stack">
            {STACK.map((s, i) => (
              <Reveal key={s} p={p} at={0.78 + i * 0.02}>
                <span className="pill">{s}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
