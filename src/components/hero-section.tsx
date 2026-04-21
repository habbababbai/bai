import { site } from '@/content/site'
import { EmailCopyLine } from '@/components/email-copy-line'
import { TiltCard } from '@/components/tilt-card'
import { useInputModality } from '@/hooks/use-input-modality'
import { cn } from '@/lib/cn'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'

export type HeroIntroPhase = 'locked' | 'hint-visible' | 'revealing' | 'revealed'

/** First line only; tagline + email are separate in the intro header */
const INTRO_TYPING_GREETING = "hi, i'm bai"
/** Typing beats: “hi” → pause → “, i'm bai” (join must equal `INTRO_TYPING_GREETING`) */
const INTRO_TYPING_SEGMENTS = ['hi', ", i'm bai"] as const
/** Ms between each character (slow) */
const TYPING_CHAR_MS = 155
/** Ms pause after “hi” before the rest */
const TYPING_SEGMENT_PAUSE_MS = 720

/** Keeps typing ↔ static stable without oversized empty space */
const INTRO_COPY_SHELL_CLASS =
  'flex w-full min-h-[clamp(5.75rem,15vw,7.75rem)] flex-col items-center'
const INTRO_FIRST_LINE_CLASS =
  'order-1 min-h-[clamp(2.5rem,7vw,3.75rem)] font-display text-balance-safe text-[clamp(1.35rem,4.2vw,2rem)] leading-snug font-medium tracking-tight text-zinc-100'
const INTRO_CARET_CLASS = 'ml-0.5 inline-block h-[1em] w-px shrink-0 align-[-0.1em]'

function IntroTagline() {
  return (
    <p className="order-2 mx-auto mt-3 w-full max-w-md text-[0.98rem] leading-relaxed text-pretty text-zinc-400 md:mt-4 md:text-lg">
      {site.tagline}
    </p>
  )
}

function IntroGreetingStatic() {
  return (
    <div className={INTRO_COPY_SHELL_CLASS}>
      <p className={INTRO_FIRST_LINE_CLASS}>
        {INTRO_TYPING_GREETING}
        {/* Reserve caret width so height matches the typing state */}
        <span className={`${INTRO_CARET_CLASS} invisible`} aria-hidden />
      </p>
      <IntroTagline />
    </div>
  )
}

function IntroTypingGreeting({ onComplete }: { onComplete: () => void }) {
  const [typed, setTyped] = useState('')
  const completedRef = useRef(false)

  useEffect(() => {
    completedRef.current = false
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const finish = () => {
      if (completedRef.current || cancelled) return
      completedRef.current = true
      onComplete()
    }

    const schedule = (fn: () => void, delay: number) => {
      timeoutId = window.setTimeout(() => {
        if (!cancelled) fn()
      }, delay)
    }

    const runSegment = (segIdx: number, charIdx: number) => {
      if (cancelled) return
      const seg = INTRO_TYPING_SEGMENTS[segIdx]
      if (seg === undefined) {
        finish()
        return
      }
      if (charIdx < seg.length) {
        setTyped((prev) => prev + seg[charIdx])
        schedule(() => runSegment(segIdx, charIdx + 1), TYPING_CHAR_MS)
      } else if (segIdx + 1 < INTRO_TYPING_SEGMENTS.length) {
        schedule(() => runSegment(segIdx + 1, 0), TYPING_SEGMENT_PAUSE_MS)
      } else {
        finish()
      }
    }

    schedule(() => {
      setTyped('')
      runSegment(0, 0)
    }, 0)

    return () => {
      cancelled = true
      if (timeoutId !== null) window.clearTimeout(timeoutId)
    }
  }, [onComplete])

  return (
    <div className={INTRO_COPY_SHELL_CLASS}>
      <p className={INTRO_FIRST_LINE_CLASS} aria-live="polite">
        {typed}
        <span
          className={`${INTRO_CARET_CLASS} animate-pulse bg-zinc-400/80`}
          aria-hidden
        />
      </p>
      <IntroTagline />
    </div>
  )
}

function IntroReducedMotionReady({ onReady }: { onReady: () => void }) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    onReady()
  }, [onReady])
  return <IntroGreetingStatic />
}

type HeroSectionProps = {
  mode?: 'flow' | 'intro'
  introPhase?: HeroIntroPhase
  onReveal?: () => void
  /** Fires once when the intro line is ready for the scroll hint (typing done, or reduced-motion static). */
  onIntroTypingComplete?: () => void
}

function HeroCard({
  isIntro,
  isTouchLike,
  disableTilt = false,
  introPhase,
  onPressCard,
  reduceMotion = false,
  onIntroTypingComplete,
}: {
  isIntro: boolean
  isTouchLike: boolean
  disableTilt?: boolean
  introPhase?: HeroIntroPhase
  onPressCard?: () => void
  reduceMotion?: boolean
  onIntroTypingComplete?: () => void
}) {
  const typingLocked = isIntro && introPhase === 'locked' && !reduceMotion
  const reducedLocked = isIntro && introPhase === 'locked' && reduceMotion
  const showIntroStaticGreeting =
    isIntro &&
    (introPhase === 'hint-visible' || introPhase === 'revealing' || reducedLocked)

  /** Visible for the whole intro (including while the line is typing). */
  const showEmailInIntro = isIntro

  const canPressToReveal =
    Boolean(onPressCard) && isIntro && introPhase === 'hint-visible'

  const handleCardKeyDown = (e: KeyboardEvent) => {
    if (!canPressToReveal || !onPressCard) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onPressCard()
    }
  }

  const cardInner = (
    <>
      <div className="hero-top-glow" aria-hidden />
      <div className="mx-auto max-w-lg text-center select-none md:max-w-xl">
        <p className="mb-3 text-[0.6875rem] font-semibold tracking-[0.34em] text-zinc-500/90 uppercase">
          Portfolio
        </p>

        {isIntro ? (
          <>
            {typingLocked ? (
              <IntroTypingGreeting onComplete={onIntroTypingComplete ?? (() => {})} />
            ) : showIntroStaticGreeting ? (
              reducedLocked ? (
                <IntroReducedMotionReady onReady={onIntroTypingComplete ?? (() => {})} />
              ) : (
                <IntroGreetingStatic />
              )
            ) : null}
            {showEmailInIntro ? (
              <EmailCopyLine
                variant="centered"
                className="mt-5 md:mt-6"
                enabled={introPhase === 'hint-visible'}
              />
            ) : null}
          </>
        ) : (
          <>
            <IntroGreetingStatic />
            <EmailCopyLine variant="centered" className="mt-5 md:mt-6" />
          </>
        )}
      </div>
    </>
  )

  return (
    <div
      className={cn(canPressToReveal && 'rounded-[28px] focus-within:outline-none')}
      onClick={canPressToReveal ? onPressCard : undefined}
      onKeyDown={handleCardKeyDown}
      role={canPressToReveal ? 'button' : undefined}
      tabIndex={canPressToReveal ? 0 : undefined}
      aria-label={canPressToReveal ? site.intro.revealAriaLabel : undefined}
    >
      <TiltCard
        maxTilt={isIntro ? 1.2 : 0.8}
        scale={isIntro ? 1.004 : 1.001}
        showShine={!isTouchLike}
        disabled={disableTilt || isTouchLike}
        innerClassName="frost-panel relative overflow-hidden px-6 py-8 sm:px-8 sm:py-9 md:px-10 md:py-10"
      >
        {canPressToReveal ? (
          <div className={cn('cursor-pointer', typingLocked && 'select-none')}>
            {cardInner}
          </div>
        ) : (
          cardInner
        )}
      </TiltCard>
    </div>
  )
}

export function HeroSection({
  mode = 'flow',
  introPhase = 'revealed',
  onReveal,
  onIntroTypingComplete,
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion() ?? false
  const { isTouchLike } = useInputModality()
  const [isRevealHintIdle, setIsRevealHintIdle] = useState(false)
  const idleTimerRef = useRef<number | null>(null)
  const isIntro = mode === 'intro'
  const showRevealHint = isIntro && introPhase === 'hint-visible'
  const introTouchHintHighlight =
    isTouchLike &&
    !reduceMotion &&
    (introPhase === 'hint-visible' || introPhase === 'revealing')
  const flowTouchHighlight = isTouchLike && !reduceMotion

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
  }, [
    showRevealHint,
    reduceMotion,
    scheduleIdleJump,
    clearIdleTimer,
    markRevealHintActive,
  ])

  if (isIntro) {
    const isRevealing = introPhase === 'revealing'

    return (
      <div className="pointer-events-none fixed inset-0 z-20 flex items-start justify-center px-5 pt-16 sm:px-6 md:px-8 md:pt-24">
        <motion.div
          className={cn(
            'intro-hero-group pointer-events-auto relative w-full max-w-2xl transform-gpu will-change-transform md:max-w-176',
            introTouchHintHighlight && 'touch-scroll-active',
          )}
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
            <HeroCard
              isIntro
              isTouchLike={isTouchLike}
              disableTilt={isRevealing}
              introPhase={introPhase}
              onPressCard={onReveal}
              reduceMotion={reduceMotion}
              onIntroTypingComplete={onIntroTypingComplete}
            />
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
                animate={isRevealHintIdle ? { y: [0, 10, 0, 8, 0] } : { y: 0 }}
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
    <motion.section className={cn('w-full', flowTouchHighlight && 'touch-scroll-active')}>
      <HeroCard isIntro={false} isTouchLike={isTouchLike} reduceMotion={reduceMotion} />
    </motion.section>
  )
}
