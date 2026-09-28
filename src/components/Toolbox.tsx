import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { toolbox } from '../data'
import { Lines } from './kit'

const wrap = (min: number, max: number, v: number) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

// Marquee whose speed and direction follow your scroll.
function Row({ items, base }: { items: string[]; base: number }) {
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(vel, [0, 1000], [0, 5], { clamp: false })
  const dir = useRef(1)
  const xp = useTransform(x, (v) => `${wrap(-25, 0, v)}%`)
  const skew = useTransform(vel, [-2500, 2500], [12, -12], { clamp: true })

  useAnimationFrame((_, delta) => {
    let move = dir.current * base * (delta / 1000)
    const b = boost.get()
    if (b < 0) dir.current = -1
    else if (b > 0) dir.current = 1
    move += dir.current * move * b
    x.set(x.get() + move)
  })

  // Four copies so a -25% wrap is seamless.
  const set = [...items, ...items, ...items, ...items]
  return (
    <div className="mq">
      <motion.div className="mq-track" style={{ x: xp, skewX: skew }}>
        {set.map((s, i) => (
          <span key={i} className={i % 2 ? 'mq-item is-outline' : 'mq-item'}>
            {s}
            <i className="mq-star">✳</i>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function Toolbox() {
  return (
    <section className="toolbox">
      <div className="toolbox-head">
        <Lines className="label" lines={['Toolbox']} />
        <Lines className="label" lines={['(04)']} />
      </div>
      <Row items={toolbox[0]} base={-2.2} />
      <Row items={toolbox[1]} base={1.8} />
      <Row items={toolbox[2]} base={-1.5} />
    </section>
  )
}
