import { useEffect, useLayoutEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { Scramble, easeOut } from './kit'

// Each letter drifts at its own speed as you scroll, so the name comes apart.
const SPEEDS = [0.35, -0.2, 0.6, 0.1, 0.75, -0.1, 0.45]
const SPIN = [-8, 6, -14, 4, 12, -6, 10]

function Letter({
  ch,
  i,
  line,
  ready,
  progress,
}: {
  ch: string
  i: number
  line: number
  ready: boolean
  progress: MotionValue<number>
}) {
  const k = (i + line * 3) % SPEEDS.length
  const y = useTransform(progress, [0, 1], ['0%', `${-SPEEDS[k] * 120 - 20}%`])
  const r = useTransform(progress, [0, 1], [0, SPIN[k]])
  return (
    <motion.span className="h-ch" style={{ y, rotate: r }}>
      <span className="h-mask">
        <motion.span
          className="h-in"
          initial={{ y: '110%', rotate: 10 }}
          animate={ready ? { y: '0%', rotate: 0 } : {}}
          transition={{ duration: 1.3, ease: easeOut, delay: 0.15 + (line * 7 + i) * 0.045 }}
          whileHover={{ y: '-12%', skewX: -12, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
        >
          {ch}
        </motion.span>
      </span>
    </motion.span>
  )
}

// A wireframe sphere built from CSS 3D rings: transforms only, no canvas.
function Gyro({ ready, progress }: { ready: boolean; progress: MotionValue<number> }) {
  const tx = useSpring(0, { stiffness: 60, damping: 14 })
  const ty = useSpring(0, { stiffness: 60, damping: 14 })
  const lift = useTransform(progress, [0, 1], ['0%', '-60%'])
  const grow = useTransform(progress, [0, 1], [1, 1.6])
  useEffect(() => {
    const move = (e: PointerEvent) => {
      ty.set((e.clientX / window.innerWidth - 0.5) * 50)
      tx.set(-(e.clientY / window.innerHeight - 0.5) * 50)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [tx, ty])

  return (
    <motion.div className="gyro" style={{ y: lift, scale: grow }} aria-hidden>
      <motion.div
        className="gyro-3d"
        style={{ rotateX: tx, rotateY: ty }}
        initial={{ scale: 0, rotateZ: -180 }}
        animate={ready ? { scale: 1, rotateZ: 0 } : {}}
        transition={{ duration: 1.8, ease: easeOut, delay: 0.3 }}
      >
        <motion.div
          className="gyro-spin"
          animate={{ rotateY: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <i key={i} className="ring" style={{ transform: `rotateY(${i * 20}deg)` }} />
          ))}
          <i className="ring ring-eq" />
          <i className="ring ring-eq2" />
        </motion.div>
        <motion.i
          className="gyro-core"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function Hero({ ready }: { ready: boolean }) {
  const wrap = useRef<HTMLElement>(null)
  const name = useRef<HTMLHeadingElement>(null)

  // Fit "GUNAGYE" edge to edge; "JAIN" shares its size.
  useLayoutEffect(() => {
    const el = name.current
    if (!el) return
    const fit = () => {
      el.style.fontSize = '100px'
      const w = el.querySelector<HTMLElement>('.h-line')!.getBoundingClientRect().width
      el.style.fontSize = `${(100 * el.clientWidth) / w}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // The hero is sticky (the next section slides over it), so progress comes from raw scroll.
  const { scrollY } = useScroll()
  const scrollYProgress = useTransform(scrollY, (v) => Math.min(1, Math.max(0, v / window.innerHeight)))
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86])
  const dim = useTransform(scrollYProgress, (v) => v * 0.75)
  const metaY = useTransform(scrollYProgress, [0, 1], ['0%', '-160%'])

  return (
    <section className="hero" id="top" ref={wrap}>
      <motion.div className="hero-stage" style={{ scale }}>
        <Gyro ready={ready} progress={scrollYProgress} />
        <motion.div className="hero-meta" style={{ y: metaY }}>
          <p>
            <Scramble text="Full-stack developer" start={ready} delay={0.9} />
            <br />
            <Scramble text="& AI engineer" start={ready} delay={1} />
          </p>
          <p className="hide-sm">
            <Scramble text="B.E. Computer Engineering" start={ready} delay={1.1} />
            <br />
            <Scramble text="Thapar Institute, ’28" start={ready} delay={1.2} />
          </p>
          <p className="avail">
            <motion.i
              className="pulse"
              animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <Scramble text="Open to internships" start={ready} delay={1.3} />
          </p>
        </motion.div>

        <h1 className="hero-name" ref={name} aria-label="Gunagye Jain">
          <span className="h-line" aria-hidden>
            {[...'GUNAGYE'].map((c, i) => (
              <Letter key={i} ch={c} i={i} line={0} ready={ready} progress={p} />
            ))}
          </span>
          <span className="h-line h-line-2" aria-hidden>
            <motion.span
              className="hero-tag"
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: easeOut, delay: 1.1 }}
            >
              Developer, designer,
              <br />
              occasional hackathon winner.
            </motion.span>
            {[...'JAIN'].map((c, i) => (
              <Letter key={i} ch={c} i={i} line={1} ready={ready} progress={p} />
            ))}
          </span>
        </h1>
        <motion.div className="hero-dim" style={{ opacity: dim }} />
      </motion.div>
    </section>
  )
}
