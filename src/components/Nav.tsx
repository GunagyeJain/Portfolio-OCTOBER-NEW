import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Magnetic, RollLink, ease, scrollTo } from './kit'
import { links } from '../data'

const NAV = [
  { id: '#top', label: 'Home' },
  { id: '#work', label: 'Work' },
  { id: '#about', label: 'About' },
  { id: '#experience', label: 'Experience' },
  { id: '#contact', label: 'Contact' },
]

const CURVE_IN = 'M100 0 L100 100 Q-100 50 100 0'
const CURVE_MID = 'M100 0 L100 100 Q100 50 100 0'

export default function Nav({ ready }: { ready: boolean }) {
  const { scrollY } = useScroll()
  const [past, setPast] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const p = y > window.innerHeight * 0.6
    if (p !== past) setPast(p)
  })

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(id)
  }

  return (
    <>
      <motion.header
        className="nav"
        initial={{ y: -40, opacity: 0 }}
        animate={ready ? (past ? { y: -90, opacity: 0 } : { y: 0, opacity: 1 }) : {}}
        transition={{ duration: past ? 0.6 : 1, ease, delay: ready && !past ? 0.2 : 0 }}
      >
        <RollLink text="Gunagye Jain" href="#top" onClick={go('#top')} className="nav-brand" />
        <nav className="nav-links" aria-label="Primary">
          <RollLink text="Work" href="#work" onClick={go('#work')} />
          <RollLink text="About" href="#about" onClick={go('#about')} />
          <RollLink text="Contact" href="#contact" onClick={go('#contact')} />
          <RollLink text="Resume" href={links.resume} external />
        </nav>
      </motion.header>

      <motion.div
        className="burger-wrap"
        initial={false}
        animate={{ scale: past || open ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Magnetic strength={0.35}>
          <button
            className={`burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </Magnetic>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="menu-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="menu"
              initial={{ x: 'calc(100% + 120px)' }}
              animate={{ x: 0 }}
              exit={{ x: 'calc(100% + 120px)' }}
              transition={{ duration: 0.8, ease }}
            >
              <svg className="menu-curve" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                <motion.path
                  initial={{ d: CURVE_IN }}
                  animate={{ d: CURVE_MID }}
                  exit={{ d: CURVE_IN }}
                  transition={{ duration: 0.9, ease }}
                />
              </svg>
              <p className="menu-label">Navigation</p>
              <nav className="menu-links">
                {NAV.map((n, i) => (
                  <motion.a
                    key={n.id}
                    href={n.id}
                    onClick={go(n.id)}
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 80, opacity: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.08 + i * 0.05 }}
                    whileHover={{ x: -14 }}
                  >
                    {n.label}
                  </motion.a>
                ))}
              </nav>
              <div className="menu-foot">
                <RollLink text="GitHub" href={links.github} external />
                <RollLink text="LinkedIn" href={links.linkedin} external />
                <RollLink text="Resume" href={links.resume} external />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
