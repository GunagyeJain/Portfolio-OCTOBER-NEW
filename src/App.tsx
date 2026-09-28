import { useCallback, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Cursor, useSmoothScroll } from './components/kit'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Work from './components/Work'
import More from './components/More'
import Toolbox from './components/Toolbox'
import Contact from './components/Contact'

export default function App() {
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])
  useSmoothScroll(ready)

  return (
    // reducedMotion="never": the motion is the point, so it runs regardless of OS settings.
    <MotionConfig reducedMotion="never">
      <AnimatePresence>{!ready && <Preloader onDone={done} />}</AnimatePresence>
      <Cursor />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <div className="page">
          <About />
          <Experience />
          <Work />
          <More />
          <Toolbox />
        </div>
      </main>
      <Contact />
      <div className="grain" aria-hidden />
    </MotionConfig>
  )
}
