import { motion } from 'framer-motion'
import { more, links } from '../data'
import { Lines, ease, easeOut } from './kit'

export default function More() {
  return (
    <section className="more">
      <div className="more-head">
        <Lines as="h2" className="more-title" lines={['More things', 'I couldn’t stop building']} />
        <Lines className="label hide-sm" lines={['(03)']} />
      </div>
      <ul className="more-list">
        {more.map((m, i) => (
          <motion.li
            key={m.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -5% 0px' }}
            transition={{ duration: 0.8, ease: easeOut, delay: (i % 4) * 0.06 }}
          >
            <motion.a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="more-row"
              initial="rest"
              animate="rest"
              whileHover="hover"
              data-cursor="GitHub"
            >
              <motion.span className="more-fill" variants={{ rest: { scaleY: 0 }, hover: { scaleY: 1 } }} transition={{ duration: 0.5, ease }} />
              <motion.span className="more-name" variants={{ rest: { x: 0 }, hover: { x: 24 } }} transition={{ duration: 0.5, ease }}>
                {m.name}
              </motion.span>
              <span className="more-line">{m.line}</span>
              <span className="more-tag">{m.tag}</span>
            </motion.a>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
