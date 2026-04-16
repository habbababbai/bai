import { site } from '@/content/site'
import { TiltCard } from '@/components/tilt-card'
import { motion, useReducedMotion } from 'motion/react'

export type HeroIntroPhase = 'locked' | 'hint-visible' | 'revealing' | 'revealed'

type HeroSectionProps = {
  mode?: 'flow' | 'intro'
  introPhase?: HeroIntroPhase
  onReveal?: () => void
  revealInProgress?: boolean
}

function HeroCard({
  isIntro,
}: {
  isIntro: boolean
}) {
  return (
    <div>
      <TiltCard
        maxTilt={isIntro ? 1.2 : 0.8}
        scale={isIntro ? 1.004 : 1.001}
        showShine
        innerClassName="frost-panel relative overflow-hidden px-8 py-13 md:px-12 md:py-[4.1rem]"
      >
        <div className="hero-top-glow" aria-hidden />
        <div className="mx-auto max-w-lg text-center select-none md:max-w-xl">
          <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.34em] text-zinc-500/90 uppercase">
            Portfolio
          </p>
          <h1 className="font-display text-balance-safe bg-linear-to-b from-white via-white to-zinc-300 bg-clip-text text-[clamp(2.9rem,8vw,4.65rem)] leading-[0.92] font-semibold tracking-[-0.03em] text-transparent">
            {site.displayName}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[0.98rem] leading-relaxed text-pretty text-zinc-400 md:mt-6 md:text-lg">
            {site.tagline}
          </p>
        </div>
      </TiltCard>
    </div>
  )
}

export function HeroSection({
  mode = 'flow',
  introPhase = 'revealed',
  onReveal,
  revealInProgress = false,
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion() ?? false
  const isIntro = mode === 'intro'
  const showRevealHint = isIntro && introPhase === 'hint-visible'

  if (isIntro) {
    const isRevealing = introPhase === 'revealing'
    
    return (
      <motion.div
        className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-5 pt-10 pb-34 sm:px-6 md:px-8"
        initial={false}
        animate={{ opacity: isRevealing ? 0 : 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }
        }
      >
        <div className="pointer-events-auto relative w-full max-w-2xl md:max-w-176">
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
            }
          >
            <HeroCard isIntro />
          </motion.section>

          {showRevealHint && (
            <motion.button
              type="button"
              onClick={onReveal}
              className="intro-reveal-zone"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }
              }
              aria-label={site.intro.revealAriaLabel}
            >
              <span className="intro-reveal-pill">
                <span className="intro-reveal-arrow" aria-hidden>
                  ↓
                </span>
                <span>{site.intro.revealLabel}</span>
              </span>
            </motion.button>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.section
      initial={reduceMotion || revealInProgress ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              duration: revealInProgress ? 0.5 : 0.75,
              ease: [0.22, 1, 0.36, 1] as const,
            }
      }
    >
      <HeroCard isIntro={false} />
    </motion.section>
  )
}
