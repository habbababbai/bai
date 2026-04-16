import { AboutSection } from '@/components/about-section'
import { AmbientBackground } from '@/components/ambient-background'
import { ContactSection } from '@/components/contact-section'
import { HeroSection, type HeroIntroPhase } from '@/components/hero-section'
import { SkillsSection } from '@/components/skills-section'
import { cn } from '@/lib/cn'
import { motion, useReducedMotion } from 'motion/react'
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

const HINT_DELAY_MS = 1050
const TOUCH_REVEAL_THRESHOLD = 64
const WHEEL_REVEAL_THRESHOLD = 24
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const
const REVEAL_COMPLETE_MS = 620
const REVEAL_INPUT_LOCK_MS = 820

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  return Boolean(
    target.closest(
      'a, button, input, textarea, select, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])',
    ),
  )
}

export default function App() {
  const reduceMotion = useReducedMotion() ?? false
  const introEnabled = !reduceMotion
  const [introPhase, setIntroPhase] = useState<HeroIntroPhase>(
    introEnabled ? 'locked' : 'revealed',
  )
  const effectiveIntroPhase = introEnabled ? introPhase : 'revealed'

  const revealLockedRef = useRef(false)
  const revealInputLockedRef = useRef(false)
  const revealCompleteTimerRef = useRef<number | null>(null)
  const revealInputUnlockTimerRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const pendingSkipRef = useRef(false)
  const [revealInputLocked, setRevealInputLocked] = useState(false)

  const clearRevealCompleteTimer = useCallback(() => {
    if (revealCompleteTimerRef.current !== null) {
      window.clearTimeout(revealCompleteTimerRef.current)
      revealCompleteTimerRef.current = null
    }
  }, [])

  const clearRevealInputUnlockTimer = useCallback(() => {
    if (revealInputUnlockTimerRef.current !== null) {
      window.clearTimeout(revealInputUnlockTimerRef.current)
      revealInputUnlockTimerRef.current = null
    }
  }, [])

  const setRevealInputLock = useCallback((locked: boolean) => {
    revealInputLockedRef.current = locked
    setRevealInputLocked(locked)
  }, [])

  const scrollToAbout = useCallback(() => {
    const aboutSection = document.getElementById('about')
    if (!aboutSection) return

    requestAnimationFrame(() => {
      aboutSection.focus({ preventScroll: true })
      aboutSection.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }, [reduceMotion])

  const finishReveal = useCallback(() => {
    clearRevealCompleteTimer()
    revealLockedRef.current = false
    setIntroPhase('revealed')

    if (pendingSkipRef.current) {
      pendingSkipRef.current = false
      scrollToAbout()
    }
  }, [clearRevealCompleteTimer, scrollToAbout])

  const triggerReveal = useCallback(
    (options?: { skipToContent?: boolean }) => {
      const skipToContent = options?.skipToContent ?? false

      if (!introEnabled) {
        if (skipToContent) scrollToAbout()
        return
      }

      if (skipToContent) pendingSkipRef.current = true

      if (
        revealLockedRef.current ||
        effectiveIntroPhase === 'revealed' ||
        effectiveIntroPhase === 'revealing'
      ) {
        if (effectiveIntroPhase === 'revealed' && skipToContent) scrollToAbout()
        return
      }

      revealLockedRef.current = true
      setRevealInputLock(true)
      setIntroPhase('revealing')
      window.scrollTo({ top: 0, behavior: 'auto' })
      clearRevealCompleteTimer()
      clearRevealInputUnlockTimer()
      revealCompleteTimerRef.current = window.setTimeout(() => {
        finishReveal()
      }, REVEAL_COMPLETE_MS)
      revealInputUnlockTimerRef.current = window.setTimeout(() => {
        setRevealInputLock(false)
      }, REVEAL_INPUT_LOCK_MS)
    },
    [
      clearRevealCompleteTimer,
      clearRevealInputUnlockTimer,
      effectiveIntroPhase,
      finishReveal,
      introEnabled,
      setRevealInputLock,
      scrollToAbout,
    ],
  )

  useEffect(() => {
    if (!introEnabled || effectiveIntroPhase !== 'locked') return

    const timer = window.setTimeout(() => {
      setIntroPhase((phase) => (phase === 'locked' ? 'hint-visible' : phase))
    }, HINT_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [effectiveIntroPhase, introEnabled])

  useEffect(
    () => () => {
      clearRevealCompleteTimer()
      clearRevealInputUnlockTimer()
    },
    [clearRevealCompleteTimer, clearRevealInputUnlockTimer],
  )

  useEffect(() => {
    if (!introEnabled || effectiveIntroPhase === 'revealed') return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [effectiveIntroPhase, introEnabled])

  useEffect(() => {
    if (!introEnabled) return

    const handleWheel = (event: WheelEvent) => {
      if (revealInputLockedRef.current) {
        event.preventDefault()
        return
      }

      if (effectiveIntroPhase === 'revealed') return

      if (event.deltaY <= WHEEL_REVEAL_THRESHOLD) {
        event.preventDefault()
        return
      }

      event.preventDefault()
      triggerReveal()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isInteractiveTarget(event.target)) return

      if (revealInputLockedRef.current) {
        if (event.key === 'ArrowDown' || event.key === 'PageDown') {
          event.preventDefault()
        }
        return
      }

      if (effectiveIntroPhase === 'revealed') return

      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault()
        triggerReveal()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [effectiveIntroPhase, introEnabled, revealInputLocked, triggerReveal])

  const handleSkipToAbout = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      if (!introEnabled) return

      event.preventDefault()
      triggerReveal({ skipToContent: true })
    },
    [introEnabled, triggerReveal],
  )

  const handleSkipKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLAnchorElement>) => {
      if (!introEnabled) return
      if (event.key !== 'Enter' && event.key !== ' ') return

      event.preventDefault()
      triggerReveal({ skipToContent: true })
    },
    [introEnabled, triggerReveal],
  )

  const handleTouchStart = useCallback((event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null
  }, [])

  const handleTouchMove = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      if (!introEnabled || effectiveIntroPhase === 'revealed') return

      const touchStartY = touchStartYRef.current
      const currentY = event.touches[0]?.clientY

      if (touchStartY === null || currentY === undefined) return

      if (touchStartY - currentY >= TOUCH_REVEAL_THRESHOLD) {
        triggerReveal()
        touchStartYRef.current = null
      }
    },
    [effectiveIntroPhase, introEnabled, triggerReveal],
  )

  const showIntroOverlay = introEnabled && effectiveIntroPhase !== 'revealed'
  const showFlowContent =
    !introEnabled ||
    effectiveIntroPhase === 'revealing' ||
    effectiveIntroPhase === 'revealed'
  const revealInProgress = effectiveIntroPhase === 'revealing'
  const introEntranceDisabled = introEnabled

  return (
    <div
        className={cn('relative min-h-svh overflow-x-hidden', showIntroOverlay && 'overflow-y-clip')}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
      >
        <AmbientBackground />
        <a
          href="#about"
          onClick={handleSkipToAbout}
          onKeyDown={handleSkipKeyDown}
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:ring-2 focus:ring-violet-400/80"
        >
          Skip to about
        </a>

        {showIntroOverlay && (
          <HeroSection
            introPhase={effectiveIntroPhase}
            mode="intro"
            onReveal={() => triggerReveal()}
          />
        )}

        <main
          id="main"
          className="relative z-10 mx-auto w-full max-w-2xl px-5 pt-16 pb-28 sm:px-6 md:max-w-176 md:px-8 md:pt-24 md:pb-32"
        >
          <motion.div
            initial={false}
            animate={showFlowContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.48, ease: REVEAL_EASE }
            }
            className={cn(
              'flex flex-col gap-12 md:gap-14',
              !showFlowContent && 'pointer-events-none',
            )}
            aria-hidden={!showFlowContent}
          >
            {showFlowContent && (
              <HeroSection
                introPhase={effectiveIntroPhase}
                mode="flow"
                revealInProgress={revealInProgress}
              />
            )}

            {showFlowContent && (
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.48,
                        delay: revealInProgress ? 0.08 : 0,
                        ease: REVEAL_EASE,
                      }
                }
                className="flex flex-col gap-12 md:gap-14"
              >
                <AboutSection disableEntrance={introEntranceDisabled} />
                <SkillsSection disableEntrance={introEntranceDisabled} />
                <ContactSection disableEntrance={introEntranceDisabled} />
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
  )
}
