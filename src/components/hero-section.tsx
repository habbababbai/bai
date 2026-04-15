import { site } from '@/content/site'
import { motion, useReducedMotion } from 'motion/react'

export function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className="frost-panel relative px-8 py-12 md:px-12 md:py-16"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
          Portfolio
        </p>
        <h1 className="font-display text-balance-safe bg-gradient-to-b from-white via-white to-zinc-300 bg-clip-text text-6xl font-semibold leading-[0.95] tracking-tight text-transparent md:text-7xl">
          {site.displayName}
        </h1>
        <p className="mt-5 text-pretty text-base leading-relaxed text-zinc-400 md:text-lg">
          {site.tagline}
        </p>
      </div>
    </motion.section>
  )
}
