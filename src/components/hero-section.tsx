import { site } from '@/content/site'
import { TiltCard } from '@/components/tilt-card'
import { cn } from '@/lib/cn'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

export type HeroIntroPhase = 'locked' | 'hint-visible' | 'revealing' | 'revealed'

type HeroSectionProps = {
  mode?: 'flow' | 'intro'
  introPhase?: HeroIntroPhase
  onReveal?: () => void
}

function HeroCard({
  isIntro,
  disableTilt = false,
}: {
  isIntro: boolean
  disableTilt?: boolean
}) {
  return (
    <div>
      <TiltCard
        maxTilt={isIntro ? 1.2 : 0.8}
        scale={isIntro ? 1.004 : 1.001}
        showShine
        disabled={disableTilt}
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
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion() ?? false
  const [isRevealHintIdle, setIsRevealHintIdle] = useState(false)
  const idleTimerRef = useRef<number | null>(null)
  const isIntro = mode === 'intro'
  const showRevealHint = isIntro && introPhase === 'hint-visible'

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current)
      idleTimerRef.current = null
    }
  }, [])

  const scheduleIdleJump = useCallback(() => {
    clearIdleTimer()
    idleTimerRef.current = window.setTimeout(() => {
      setIsRevealHintIdle(true)
    }, 3200)
  }, [clearIdleTimer])

  const markRevealHintActive = useCallback(() => {
    setIsRevealHintIdle(false)
    scheduleIdleJump()
  }, [scheduleIdleJump])

  useEffect(() => {
    if (!showRevealHint || reduceMotion) return

    scheduleIdleJump()

    const markGlobalInteraction = () => {
      markRevealHintActive()
    }

    window.addEventListener('wheel', markGlobalInteraction, { passive: true })
    window.addEventListener('keydown', markGlobalInteraction)
    window.addEventListener('touchstart', markGlobalInteraction, { passive: true })

    return () => {
      clearIdleTimer()
      window.removeEventListener('wheel', markGlobalInteraction)
      window.removeEventListener('keydown', markGlobalInteraction)
      window.removeEventListener('touchstart', markGlobalInteraction)
    }
  }, [showRevealHint, reduceMotion, scheduleIdleJump, clearIdleTimer, markRevealHintActive])

  if (isIntro) {
    const isRevealing = introPhase === 'revealing'
    
    return (
      <div className="pointer-events-none fixed inset-0 z-20 flex items-start justify-center px-5 pt-16 sm:px-6 md:px-8 md:pt-24">
        <motion.div 
          className="intro-hero-group pointer-events-auto relative w-full max-w-2xl transform-gpu will-change-transform md:max-w-176"
          onPointerEnter={showRevealHint ? markRevealHintActive : undefined}
          onPointerLeave={showRevealHint ? scheduleIdleJump : undefined}
          initial={false}
          animate={{ 
            y: isRevealing ? 0 : 'calc(50vh - 50% - 4rem)',
          }}
          style={{ backfaceVisibility: 'hidden' }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1] as const,
                }
          }
        >
          <section>
            <HeroCard isIntro disableTilt={isRevealing} />
          </section>

          {showRevealHint && (
            <motion.button
              type="button"
              onClick={onReveal}
              className="intro-reveal-zone"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }
              }
              aria-label={site.intro.revealAriaLabel}
            >
              <motion.span
                className={cn(
                  'inline-flex transform-gpu',
                  isRevealHintIdle && 'will-change-transform',
                )}
                animate={
                  isRevealHintIdle
                    ? { y: [0, 10, 0, 8, 0] }
                    : { y: 0 }
                }
                initial={false}
                transition={
                  isRevealHintIdle
                    ? {
                        duration: 0.58,
                        times: [0, 0.2, 0.45, 0.68, 1],
                        ease: 'easeOut',
                        repeat: Infinity,
                        repeatDelay: 2.1,
                      }
                    : { duration: 0.22, ease: 'easeOut' }
                }
              >
                <span className="intro-reveal-pill">
                  <span className="intro-reveal-arrow" aria-hidden>
                    ↓
                  </span>
                  <span>{site.intro.revealLabel}</span>
                </span>
              </motion.span>
            </motion.button>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <section className="w-full">
      <HeroCard isIntro={false} />
    </section>
  )
}
