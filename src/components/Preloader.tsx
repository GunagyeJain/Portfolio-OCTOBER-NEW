import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { ease } from './kit'

const WORDS = ['Design', 'Build', 'Ship', 'Repeat', 'Gunagye Jain']

const CURVE = 'M0 0 L100 0 L100 0 Q50 100 0 0 Z'
const FLAT = 'M0 0 L100 0 L100 0 Q50 0 0 0 Z'

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0)
  const n = useMotionValue(0)
  const pct = useTransform(n, (v) => String(Math.round(v)).padStart(2, '0'))

  useEffect(() => {
    const words = setInterval(() => setI((k) => Math.min(k + 1, WORDS.length - 1)), 360)
    const c = animate(n, 100, { duration: 1.9, ease: [0.65, 0, 0.35, 1] })
    Promise.all([c.then(() => {}), document.fonts?.ready]).then(() => setTimeout(onDone, 260))
    return () => {
      clearInterval(words)
      c.stop()
    }
  }, [n, onDone])

  return (
    <motion.div
      className="loader"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 1, ease } }}
    >
      <div className="loader-word">
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{ duration: 0.35, ease }}
        >
          <i className="dot" /> {WORDS[i]}
        </motion.span>
      </div>
      <motion.div className="loader-count" exit={{ y: '-40%', opacity: 0, transition: { duration: 0.6, ease } }}>
        <motion.span>{pct}</motion.span>
      </motion.div>
      <svg className="loader-curve" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <motion.path initial={{ d: CURVE }} animate={{ d: CURVE }} exit={{ d: FLAT, transition: { duration: 1, ease } }} />
      </svg>
    </motion.div>
  )
}
