import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Lines, easeOut, lerpRange } from './kit'

const TEXT =
  'I build full-stack products and wire AI into things that didn’t know they needed it. This summer I built the frontend of an HR platform that 100+ people now use every day.'

function Word({ w, range, progress }: { w: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, (v) => lerpRange(v, range, [0.12, 1]))
  const y = useTransform(progress, range, [14, 0])
  const hot = w.startsWith('100+') || w === 'AI'
  return (
    <span className="w">
      <motion.span style={{ opacity, y }} className={hot ? 'w-hot' : undefined}>
        {w}
      </motion.span>{' '}
    </span>
  )
}

function Count({ to, dec = 0, suffix = '' }: { to: number; dec?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const v = useMotionValue(0)
  const t = useTransform(v, (n) => n.toFixed(dec) + suffix)
  useEffect(() => {
    if (!seen) return
    const c = animate(v, to, { duration: 2.2, ease: easeOut })
    return () => c.stop()
  }, [seen, v, to])
  return <motion.span ref={ref}>{t}</motion.span>
}

const STATS = [
  { to: 100, suffix: '+', label: 'people use my HRMS frontend daily' },
  { to: 8.64, dec: 2, label: 'CGPA at Thapar' },
  { to: 150, suffix: '+', label: 'DSA problems solved' },
]

const ALSO = [
  ['Winner', 'Founder Mode, Nov 2025'],
  ['Design core', 'Saturnalia ’25'],
  ['Studying', 'Computer Engineering, 2024 — 28'],
]

export default function About() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = TEXT.split(' ')

  return (
    <section className="about" id="about">
      <div className="about-head">
        <Lines className="label" lines={['About']} />
        <Lines className="label hide-sm" lines={['(01)']} />
      </div>

      <p className="about-text" ref={ref}>
        {words.map((w, i) => (
          <Word key={i} w={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </p>

      <div className="stats">
        {STATS.map((s, i) => (
          <motion.div
            className="stat"
            key={s.label}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1, ease: easeOut, delay: i * 0.12 }}
          >
            <motion.i
              className="stat-rule"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: easeOut, delay: 0.2 + i * 0.12 }}
            />
            <span className="stat-n">
              <Count to={s.to} dec={s.dec} suffix={s.suffix} />
            </span>
            <span className="stat-l">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <ul className="also">
        {ALSO.map(([k, v], i) => (
          <motion.li
            key={k}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOut, delay: i * 0.1 }}
          >
            <span>{k}</span>
            <span>{v}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
