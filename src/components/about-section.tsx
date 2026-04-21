import { site } from '@/content/site'
import { TiltCard } from '@/components/tilt-card'
import { useInputModality } from '@/hooks/use-input-modality'
import { cn } from '@/lib/cn'
import { Smartphone } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

type AboutSectionProps = {
  disableEntrance?: boolean
  safariPerfMode?: boolean
  /** Opacity fade for inner copy only (inside glass). Sync delay with App intro stagger. */
  innerRevealDelay?: number
}

export function AboutSection({
  disableEntrance = false,
  safariPerfMode = false,
  innerRevealDelay,
}: AboutSectionProps) {
  const reduceMotion = useReducedMotion() ?? false
  const { isTouchLike } = useInputModality()
  const [isTouchScrollActive, setIsTouchScrollActive] = useState(false)
  const touchScrollActive = isTouchLike && !reduceMotion && isTouchScrollActive

  const inner = (
    <div className="mx-auto max-w-160">
      <div className="about-heading-row mb-6 flex flex-row items-center justify-center gap-2.5 select-none transition-colors duration-500 ease-out">
        <span
          className={cn(
            'about-heading-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-[#68aec9]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[border-color,background-color,box-shadow,color] duration-500 ease-out',
            touchScrollActive &&
              'border-white/18 bg-white/10 text-[#9ec8ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_0_1px_rgba(112,94,178,0.09),0_10px_20px_-14px_rgba(0,0,0,0.45)]',
          )}
        >
          <Smartphone className="h-5 w-5" aria-hidden strokeWidth={1.75} />
        </span>
        <h2
          id="about-heading"
          className={cn(
            'about-heading-title font-display text-2xl font-semibold tracking-tight text-zinc-100 transition-colors duration-500 ease-out md:text-3xl',
            touchScrollActive && 'text-white',
          )}
        >
          {site.about.title}
        </h2>
      </div>
      <div
        className={cn(
          'about-copy space-y-4 text-left text-[0.95rem] leading-[1.78] text-pretty text-zinc-400 transition-colors duration-500 ease-out sm:text-justify sm:hyphens-auto md:text-base',
          touchScrollActive && 'text-zinc-100',
        )}
      >
        {site.about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  )

  if (safariPerfMode) {
    return (
      <section id="about" tabIndex={-1} aria-labelledby="about-heading">
        <div>
          <TiltCard
            maxTilt={0.8}
            scale={1.001}
            showShine={false}
            disabled
            innerClassName="frost-panel px-7 py-10 md:px-10 md:py-12"
          >
            {inner}
          </TiltCard>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      id="about"
      tabIndex={-1}
      initial={disableEntrance || reduceMotion ? false : { opacity: 0, y: 28, scale: 0.988 }}
      whileInView={safariPerfMode ? undefined : disableEntrance ? undefined : { opacity: 1, y: 0, scale: 1 }}
      animate={safariPerfMode && !disableEntrance ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={safariPerfMode ? undefined : { once: true, margin: '-10% 0px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 118,
              damping: 20,
              mass: 0.8,
            }
      }
      aria-labelledby="about-heading"
    >
      <motion.div
        className={cn(touchScrollActive && 'touch-scroll-active')}
        initial={reduceMotion ? false : { opacity: 0.93, y: 12, scale: 0.996 }}
        whileInView={
          safariPerfMode ? undefined : reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
        }
        animate={safariPerfMode && !reduceMotion ? { opacity: 1, y: 0, scale: 1 } : undefined}
        viewport={safariPerfMode ? undefined : { once: false, amount: 0.22, margin: '-8% 0px -10% 0px' }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                type: 'spring',
                stiffness: 128,
                damping: 22,
                mass: 0.78,
              }
        }
        onViewportEnter={() => setIsTouchScrollActive(true)}
        onViewportLeave={() => setIsTouchScrollActive(false)}
      >
        <TiltCard
          maxTilt={0.8}
          scale={1.001}
          showShine={!isTouchLike}
          disabled={isTouchLike}
          innerClassName="frost-panel px-7 py-10 md:px-10 md:py-12"
        >
          {innerRevealDelay != null && !reduceMotion ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.12,
                delay: innerRevealDelay,
                ease: [0.18, 0.92, 0.22, 1] as const,
              }}
            >
              {inner}
            </motion.div>
          ) : (
            inner
          )}
        </TiltCard>
      </motion.div>
    </motion.section>
  )
}
