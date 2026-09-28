import { useEffect, useRef, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion'

/* ---------------- Smooth scroll ---------------- */

let lenis: Lenis | null = null

export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 })
    let id = 0
    const raf = (t: number) => {
      lenis?.raf(t)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis?.destroy()
      lenis = null
    }
  }, [])
  useEffect(() => {
    if (enabled) lenis?.start()
    else lenis?.stop()
  }, [enabled])
}

export function scrollTo(target: string | number) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (lenis && el !== null) lenis.scrollTo(el as HTMLElement | number, { duration: 1.6 })
  else if (el instanceof HTMLElement) el.scrollIntoView({ behavior: 'smooth' })
}

export const ease = [0.76, 0, 0.24, 1] as const
export const easeOut = [0.16, 1, 0.3, 1] as const

/* ---------------- Magnetic wrapper ---------------- */

export function Magnetic({ children, strength = 0.4, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 180, damping: 14, mass: 0.4 })
  const y = useSpring(0, { stiffness: 180, damping: 14, mass: 0.4 })
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: 'inline-block' }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- Rolling letters on hover ---------------- */

const top: Variants = {
  rest: { y: '0%' },
  hover: (i: number) => ({ y: '-100%', transition: { duration: 0.45, ease, delay: i * 0.018 } }),
}
const bottom: Variants = {
  rest: { y: '100%' },
  hover: (i: number) => ({ y: '0%', transition: { duration: 0.45, ease, delay: i * 0.018 } }),
}

export function Roll({ text }: { text: string }) {
  return (
    <span className="roll" aria-label={text}>
      {[...text].map((c, i) => (
        <span className="roll-ch" key={i} aria-hidden>
          <motion.span custom={i} variants={top} transition={{ duration: 0.45, ease }}>
            {c === ' ' ? ' ' : c}
          </motion.span>
          <motion.span className="roll-b" custom={i} variants={bottom} transition={{ duration: 0.45, ease }}>
            {c === ' ' ? ' ' : c}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function RollLink({
  text,
  href,
  onClick,
  className,
  external,
}: {
  text: string
  href: string
  onClick?: (e: React.MouseEvent) => void
  className?: string
  external?: boolean
}) {
  return (
    <motion.a
      href={href}
      className={`roll-link ${className ?? ''}`}
      initial="rest"
      animate="rest"
      whileHover="hover"
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      <Roll text={text} />
    </motion.a>
  )
}

/* ---------------- Masked line reveal ---------------- */

export function Lines({
  lines,
  className,
  delay = 0,
  stagger = 0.08,
  once = true,
  as: Tag = 'div',
}: {
  lines: ReactNode[]
  className?: string
  delay?: number
  stagger?: number
  once?: boolean
  as?: 'div' | 'h2' | 'h3' | 'p'
}) {
  const M = motion[Tag]
  return (
    <M className={className} initial="hide" whileInView="show" viewport={{ once, margin: '0px 0px -12% 0px' }}>
      {lines.map((l, i) => (
        <span className="line-mask" key={i}>
          <motion.span
            className="line-in"
            variants={{
              hide: { y: '115%', rotate: 4 },
              show: { y: '0%', rotate: 0, transition: { duration: 1, ease: easeOut, delay: delay + i * stagger } },
            }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </M>
  )
}

/* ---------------- Text scramble ---------------- */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*+'

export function Scramble({ text, start = true, delay = 0 }: { text: string; start?: boolean; delay?: number }) {
  const [out, setOut] = useState(() => text.replace(/\S/g, ' '))
  useEffect(() => {
    if (!start) return
    let frame = 0
    let id = 0
    const total = 22
    const t = setTimeout(function tick() {
      frame++
      const p = frame / total
      setOut(
        [...text]
          .map((c, i) => (c === ' ' ? ' ' : i / text.length < p ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(''),
      )
      if (frame < total) id = window.setTimeout(tick, 32)
    }, delay * 1000)
    return () => {
      clearTimeout(t)
      clearTimeout(id)
    }
  }, [start, text, delay])
  return <span aria-label={text}>{out}</span>
}

/* ---------------- Cursor ---------------- */

export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })
  const [label, setLabel] = useState<string | null>(null)
  const [hover, setHover] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setShow(true)
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      const tagged = t.closest<HTMLElement>('[data-cursor]')
      const link = t.closest('a, button')
      setLabel(tagged ? tagged.dataset.cursor || null : null)
      setHover(!!link && !tagged)
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [x, y])

  if (!show) return null
  return (
    <motion.div className={`cursor ${label ? 'has-label' : ''}`} style={{ x: sx, y: sy }} aria-hidden>
      <motion.div
        className="cursor-dot"
        animate={{ scale: label ? 1 : hover ? 0.55 : 0.14 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        <motion.span animate={{ opacity: label ? 1 : 0, scale: label ? 1 : 0.4 }} transition={{ duration: 0.25 }}>
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

/* ---------------- Clamped scroll mapping ----------------
   Function-form transforms skip the accelerated scroll-timeline path,
   which in this framer-motion version doesn't clamp opacity outside its range. */

export function lerpRange(v: number, [a, b]: readonly [number, number], [c, d]: readonly [number, number]) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return c + (d - c) * t
}
