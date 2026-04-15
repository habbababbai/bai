import { site } from '@/content/site'
import { motion, useReducedMotion } from 'motion/react'

const mailto = `mailto:${site.links.email}`

export function ContactSection() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      id="contact"
      className="frost-panel px-6 py-10 md:px-10 md:py-12"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }
      }
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2
          id="contact-heading"
          className="font-display text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl"
        >
          Connect
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Links and email — best place to reach me.
        </p>
        <nav
          className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center"
          aria-label="Contact links"
        >
          <a className="link-pill" href={site.links.github} rel="noreferrer" target="_blank">
            GitHub
          </a>
          <a className="link-pill" href={site.links.linkedin} rel="noreferrer" target="_blank">
            LinkedIn
          </a>
          <a className="link-pill" href={mailto}>
            Email
          </a>
        </nav>
      </div>
    </motion.section>
  )
}
