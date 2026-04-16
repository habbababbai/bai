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
  useMemo,
  useRef,
  useState,
} from 'react'

const TOUCH_REVEAL_THRESHOLD = 64
const WHEEL_REVEAL_THRESHOLD = 24
/** After hero tween finishes; avoids swap before motion completes */
const REVEAL_COMPLETE_MS = 750
const REVEAL_INPUT_LOCK_MS = 820

/** Bottom sections: must match `revealSectionsContainerVariants` stagger math for inner content fade */
const INTRO_BOTTOM_STAGGER = 0.08
const INTRO_BOTTOM_DELAY_CHILD = 0.07

function introInnerFadeDelay(index: number) {
  return INTRO_BOTTOM_DELAY_CHILD + index * INTRO_BOTTOM_STAGGER
}

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

  const handleIntroTypingComplete = useCallback(() => {
    setIntroPhase((p) => (p === 'locked' ? 'hint-visible' : p))
  }, [])

  const triggerReveal = useCallback(
    (options?: { skipToContent?: boolean }) => {
      const skipToContent = options?.skipToContent ?? false

      if (!introEnabled) {
        if (skipToContent) scrollToAbout()
        return
      }

      if (skipToContent) pendingSkipRef.current = true

      if (effectiveIntroPhase === 'locked') {
        return
      }

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

      if (effectiveIntroPhase === 'locked') {
        event.preventDefault()
        return
      }

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

      if (effectiveIntroPhase === 'locked') {
        if (event.key === 'ArrowDown' || event.key === 'PageDown') {
          event.preventDefault()
        }
        return
      }

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
  }, [effectiveIntroPhase, introEnabled, triggerReveal])

  const handleSkipToAbout = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      if (!introEnabled) return
      event.preventDefault()
      if (effectiveIntroPhase === 'locked') return

      triggerReveal({ skipToContent: true })
    },
    [effectiveIntroPhase, introEnabled, triggerReveal],
  )

  const handleSkipKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLAnchorElement>) => {
      if (!introEnabled) return
      if (event.key !== 'Enter' && event.key !== ' ') return

      event.preventDefault()
      if (effectiveIntroPhase === 'locked') return

      triggerReveal({ skipToContent: true })
    },
    [effectiveIntroPhase, introEnabled, triggerReveal],
  )

  const handleTouchStart = useCallback((event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null
  }, [])

  const handleTouchMove = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      if (!introEnabled || effectiveIntroPhase === 'revealed') return
      if (effectiveIntroPhase === 'locked') return

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

  const showIntroHero = introEnabled && effectiveIntroPhase !== 'revealed'
  const showFlowHero = !introEnabled || effectiveIntroPhase === 'revealed'
  const showSections = !introEnabled || effectiveIntroPhase === 'revealed'
  const introEntranceDisabled = introEnabled
  const keepRevealWillChange = introEnabled && effectiveIntroPhase !== 'revealed'

  const revealSectionsContainerVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : INTRO_BOTTOM_STAGGER,
          delayChildren: reduceMotion ? 0 : INTRO_BOTTOM_DELAY_CHILD,
        },
      },
    }),
    [reduceMotion],
  )

  const revealSectionsItemVariants = useMemo(
    () => ({
      hidden: { y: reduceMotion ? 0 : 24 },
      visible: {
        y: 0,
        transition: reduceMotion
          ? { duration: 0 }
          : {
              duration: 0.48,
              ease: [0.22, 1, 0.36, 1] as const,
            },
      },
    }),
    [reduceMotion],
  )

  const showInnerContentFade = introEntranceDisabled && !reduceMotion

  return (
    <div
        className={cn('relative min-h-svh overflow-x-hidden', showIntroHero && 'overflow-y-clip')}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
      >
        <AmbientBackground />
        <a
          href="#about"
          onClick={handleSkipToAbout}
          onKeyDown={handleSkipKeyDown}
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:ring-2 focus:ring-[#68aec9]/80"
        >
          Skip to about
        </a>

        {showIntroHero && (
          <HeroSection
            introPhase={effectiveIntroPhase}
            mode="intro"
            onReveal={() => triggerReveal()}
            onIntroTypingComplete={handleIntroTypingComplete}
          />
        )}

        <main
          id="main"
          className="relative z-10 w-full px-5 pt-16 pb-28 sm:px-6 md:px-8 md:pt-24 md:pb-32"
        >
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-12 md:max-w-176 md:gap-14">
            {showFlowHero && (
              <HeroSection
                introPhase={effectiveIntroPhase}
                mode="flow"
              />
            )}

            {showSections && (
              <motion.div
                variants={revealSectionsContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-12 md:gap-14"
              >
                <motion.div
                  variants={revealSectionsItemVariants}
                  className={cn(
                    'w-full transform-gpu [contain-intrinsic-size:auto_520px] [content-visibility:auto]',
                    keepRevealWillChange && 'will-change-transform',
                  )}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <AboutSection
                    disableEntrance={introEntranceDisabled}
                    innerRevealDelay={
                      showInnerContentFade ? introInnerFadeDelay(0) : undefined
                    }
                  />
                </motion.div>
                <motion.div
                  variants={revealSectionsItemVariants}
                  className={cn(
                    'w-full transform-gpu [contain-intrinsic-size:auto_560px] [content-visibility:auto]',
                    keepRevealWillChange && 'will-change-transform',
                  )}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <SkillsSection
                    disableEntrance={false}
                  />
                </motion.div>
                <motion.div
                  variants={revealSectionsItemVariants}
                  className={cn(
                    'w-full transform-gpu [contain-intrinsic-size:auto_420px] [content-visibility:auto]',
                    keepRevealWillChange && 'will-change-transform',
                  )}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <ContactSection
                    disableEntrance={false}
                    innerRevealDelay={
                      showInnerContentFade ? introInnerFadeDelay(2) : undefined
                    }
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
  )
}
