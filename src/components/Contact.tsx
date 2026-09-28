import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { links } from '../data'
import { Magnetic, RollLink, easeOut, scrollTo } from './kit'

function useIST() {
  const [t, setT] = useState('')
  useEffect(() => {
    const f = () =>
      setT(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }))
    f()
    const id = setInterval(f, 20000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-35%', '0%'])
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1])
  const time = useIST()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard?.writeText(links.email).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    // The footer sits "under" the page and is uncovered as the page scrolls away.
    <div className="contact-clip" ref={ref} id="contact">
      <footer className="contact">
        <motion.div className="contact-inner" style={{ y, scale }}>
          <p className="label">Internships, freelance, hackathons</p>
          <h2 className="contact-title">
            <span>Let’s build</span>
            <span>
              something
              <Magnetic strength={0.5} className="contact-btn-wrap">
                <a className="contact-btn" href={`mailto:${links.email}`} data-cursor="Write">
                  <motion.span whileHover={{ scale: 1.1 }}>Say hi</motion.span>
                </a>
              </Magnetic>
            </span>
          </h2>

          <div className="contact-row">
            <button className="contact-mail" onClick={copy} data-cursor={copied ? 'Copied' : 'Copy'}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? 'c' : 'm'}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                >
                  {copied ? 'Copied to clipboard' : links.email}
                </motion.span>
              </AnimatePresence>
            </button>
            <div className="contact-links">
              <Magnetic>
                <a className="chip-link" href={links.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </Magnetic>
              <Magnetic>
                <a className="chip-link" href={links.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </Magnetic>
              <Magnetic>
                <a className="chip-link" href={links.resume} target="_blank" rel="noreferrer">
                  Resume
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="contact-foot">
            <span>© 2026 Gunagye Jain</span>
            <span className="hide-sm">Patiala / New Delhi · {time} IST</span>
            <RollLink
              text="Back to top"
              href="#top"
              onClick={(e) => {
                e.preventDefault()
                scrollTo(0)
              }}
            />
          </div>
        </motion.div>
      </footer>
    </div>
  )
}
