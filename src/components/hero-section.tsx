import { site } from '@/content/site'
import { TiltCard } from '@/components/tilt-card'
import { motion, useReducedMotion } from 'motion/react'

export function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const }
      }
    >
      <TiltCard
        maxTilt={1.5}
        scale={1.002}
        showShine
        innerClassName="frost-panel relative px-8 py-14 md:px-12 md:py-[4.25rem]"
      >
        <div className="mx-auto max-w-lg text-center md:max-w-xl">
          <p className="mb-5 text-[0.6875rem] font-semibold uppercase tracking-[0.38em] text-zinc-500">
            Portfolio
          </p>
          <h1 className="font-display text-balance-safe bg-linear-to-b from-white via-white to-zinc-300 bg-clip-text text-[clamp(2.75rem,8vw,4.5rem)] font-semibold leading-[0.95] tracking-tight text-transparent">
            {site.displayName}
          </h1>
          <p className="mx-auto mt-6 max-w-md text-pretty text-base leading-relaxed text-zinc-400 md:mt-7 md:text-lg">
            {site.tagline}
          </p>
        </div>
      </TiltCard>
    </motion.section>
  )
}
