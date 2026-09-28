import { useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion'
import { work, type Work as W } from '../data'
import { Visual } from './Visuals'
import { easeOut } from './kit'

function Card({ w, i, skew }: { w: W; i: number; skew: MotionValue<number> }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const rx = useSpring(0, { stiffness: 200, damping: 18 })
  const ry = useSpring(0, { stiffness: 200, damping: 18 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glow = useTransform([gx, gy], ([x, y]) => `radial-gradient(420px circle at ${x}% ${y}%, rgba(255,255,255,.13), transparent 60%)`)

  const Tag = w.href ? motion.a : motion.div
  return (
    <Tag
      ref={ref as never}
      className="card"
      {...(w.href ? { href: w.href, target: '_blank', rel: 'noreferrer' } : {})}
      data-cursor={w.href ? 'View' : 'Private'}
      style={{ background: w.color, rotateX: rx, rotateY: ry, skewX: skew, transformPerspective: 1000 }}
      initial="rest"
      animate="rest"
      whileHover="hover"
      onPointerMove={(e: React.PointerEvent) => {
        if (e.pointerType !== 'mouse') return
        const r = ref.current!.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        ry.set((px - 0.5) * 12)
        rx.set((0.5 - py) * 10)
        gx.set(px * 100)
        gy.set(py * 100)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      <motion.div className="card-glow" style={{ backgroundImage: glow }} />
      <div className="card-top">
        <span>{String(i + 1).padStart(2, '0')}</span>
        <span>{w.year}</span>
      </div>
      <motion.div className="card-visual" variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }} transition={{ duration: 0.8, ease: easeOut }}>
        <Visual kind={w.id} />
      </motion.div>
      <div className="card-body">
        <h3 className="card-name">
          <motion.span
            className="card-name-in"
            variants={{ rest: { x: 0 }, hover: { x: 14 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {w.name}
          </motion.span>
          <motion.span
            className="card-arrow"
            variants={{ rest: { rotate: 0, scale: 0.8, opacity: 0.5 }, hover: { rotate: -45, scale: 1, opacity: 1 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 16 }}
          >
            →
          </motion.span>
        </h3>
        <p className="card-line">{w.line}</p>
        <div className="card-stack">
          {w.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
    </Tag>
  )
}

export default function Work() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)

  // Section height = horizontal distance + one viewport, so vertical scroll maps 1:1 to sideways travel.
  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current!)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const { scrollY } = useScroll()
  const vel = useVelocity(scrollY)
  const skew = useSpring(useTransform(vel, [-3000, 0, 3000], [7, 0, -7], { clamp: true }), { stiffness: 300, damping: 40 })
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])
  const counter = useTransform(scrollYProgress, (v) => String(Math.min(work.length, Math.floor(v * work.length) + 1)).padStart(2, '0'))

  return (
    <section className="work" id="work" ref={section} style={{ height: `calc(${dist}px + 100svh)` }}>
      <div className="work-sticky">
        <motion.div className="work-track" ref={track} style={{ x }}>
          <div className="work-intro">
            <motion.h2
              initial={{ y: 120, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: easeOut }}
            >
              Selected
              <br />
              work<sup>(06)</sup>
            </motion.h2>
            <p>Things I’ve designed, built and shipped.</p>
          </div>
          {work.map((w, i) => (
            <Card key={w.id} w={w} i={i} skew={skew} />
          ))}
        </motion.div>
        <div className="work-progress">
          <motion.span>{counter}</motion.span>
          <div className="work-bar">
            <motion.i style={{ scaleX: bar }} />
          </div>
          <span>{String(work.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  )
}
