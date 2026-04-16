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
        maxTilt={0.8}
        scale={1.001}
        showShine
        innerClassName="frost-panel relative overflow-hidden px-8 py-13 md:px-12 md:py-[4.1rem]"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.1),transparent_70%)]"
          aria-hidden
        />
        <div className="mx-auto max-w-lg select-none text-center md:max-w-xl">
          <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.34em] text-zinc-500/90">
            Portfolio
          </p>
          <h1 className="font-display text-balance-safe bg-linear-to-b from-white via-white to-zinc-300 bg-clip-text text-[clamp(2.9rem,8vw,4.65rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-transparent">
            {site.displayName}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-pretty text-[0.98rem] leading-relaxed text-zinc-400 md:mt-6 md:text-lg">
            {site.tagline}
          </p>
        </div>
      </TiltCard>
    </motion.section>
  )
}
