import { site } from '@/content/site'
import { cn } from '@/lib/cn'
import { getSkillInfo } from '@/lib/skill-icons'
import { TiltCard } from '@/components/tilt-card'
import { useInputModality } from '@/hooks/use-input-modality'
import { Layers } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

type SkillsSectionProps = {
  disableEntrance?: boolean
  safariPerfMode?: boolean
  innerRevealDelay?: number
}

export function SkillsSection({
  disableEntrance = false,
  safariPerfMode = false,
  innerRevealDelay,
}: SkillsSectionProps) {
  const reduceMotion = useReducedMotion() ?? false
  const { isTouchLike } = useInputModality()
  const [isTouchScrollActive, setIsTouchScrollActive] = useState(false)
  const touchScrollActive =
    isTouchLike && !reduceMotion && !safariPerfMode && isTouchScrollActive
  const skillGroups = site.skills
  const lastIsOdd = skillGroups.length % 2 === 1
  const useIntroGridReveal = innerRevealDelay != null && !reduceMotion

  const gridContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion || useIntroGridReveal ? 0 : 0.08,
        delayChildren: reduceMotion || useIntroGridReveal ? 0 : 0.06,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 16,
    },
    visible: (index = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.46,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: reduceMotion
          ? 0
          : useIntroGridReveal
            ? (innerRevealDelay ?? 0) + 0.1 + index * 0.085
            : 0,
      },
    }),
  }

  const inner = (
    <div className="mx-auto max-w-160 select-none">
      <div className="mb-4 flex flex-row items-center justify-center gap-2.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-[#68aec9]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Layers className="h-5 w-5" aria-hidden strokeWidth={1.75} />
        </span>
        <h2
          id="skills-heading"
          className="font-display text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl"
        >
          Skills
        </h2>
      </div>
      <p className="mx-auto max-w-lg text-center text-sm leading-relaxed text-zinc-500">
        Tools and technologies I reach for most often.
      </p>
      {safariPerfMode ? (
        <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
          {skillGroups.map((group, index) => {
            const isLast = index === skillGroups.length - 1
            const spanLastOdd = lastIsOdd && isLast
            return (
              <div
                key={group.label}
                className={cn(
                  'skill-card flex h-full min-h-0 min-w-0 flex-col',
                  spanLastOdd && 'md:col-span-2 md:mx-auto md:w-full md:max-w-lg',
                )}
              >
                <h3 className="shrink-0 text-sm leading-snug font-medium text-zinc-300 transition-[font-weight,color] duration-700 ease-in-out">
                  {group.label}
                </h3>
                <ul className="mt-3.5 flex min-h-0 flex-wrap content-start gap-x-2 gap-y-2">
                  {group.items.map((item) => {
                    const skillInfo = getSkillInfo(item)
                    const Icon = skillInfo?.icon
                    return (
                      <li key={item} className="max-w-full shrink-0">
                        <span className="chip group/chip leading-snug select-none">
                          {Icon && (
                            <Icon
                              className="mr-1.5 h-3.5 w-3.5 shrink-0 opacity-75 transition-opacity duration-500 group-hover/chip:opacity-100"
                              style={{
                                color: skillInfo?.color,
                              }}
                              aria-hidden
                            />
                          )}
                          {item}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      ) : (
        <motion.div
          className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-5"
          variants={gridContainerVariants}
          initial={useIntroGridReveal ? 'hidden' : 'hidden'}
          whileInView={useIntroGridReveal ? undefined : 'visible'}
          animate={useIntroGridReveal ? 'visible' : undefined}
          viewport={
            useIntroGridReveal
              ? undefined
              : {
                  once: true,
                  amount: 0.1,
                  margin: '0px 0px -10% 0px',
                }
          }
        >
          {skillGroups.map((group, index) => {
            const isLast = index === skillGroups.length - 1
            const spanLastOdd = lastIsOdd && isLast
            return (
              <motion.div
                key={group.label}
                variants={cardVariants}
                custom={index}
                className={cn(
                  'skill-card flex h-full min-h-0 min-w-0 flex-col',
                  spanLastOdd && 'md:col-span-2 md:mx-auto md:w-full md:max-w-lg',
                )}
              >
                <h3 className="shrink-0 text-sm leading-snug font-medium text-zinc-300 transition-[font-weight,color] duration-700 ease-in-out">
                  {group.label}
                </h3>
                <ul className="mt-3.5 flex min-h-0 flex-wrap content-start gap-x-2 gap-y-2">
                  {group.items.map((item) => {
                    const skillInfo = getSkillInfo(item)
                    const Icon = skillInfo?.icon
                    return (
                      <li key={item} className="max-w-full shrink-0">
                        <span className="chip group/chip leading-snug select-none">
                          {Icon && (
                            <Icon
                              className="mr-1.5 h-3.5 w-3.5 shrink-0 opacity-75 transition-opacity duration-500 group-hover/chip:opacity-100"
                              style={{
                                color: skillInfo?.color,
                              }}
                              aria-hidden
                            />
                          )}
                          {item}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )

  if (safariPerfMode) {
    return (
      <section id="skills" aria-labelledby="skills-heading">
        <div>
          <TiltCard
            maxTilt={0.8}
            scale={1.001}
            showShine={false}
            disabled
            innerClassName="frost-panel px-7 py-11 md:px-10 md:py-13"
          >
            {inner}
          </TiltCard>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      id="skills"
      aria-labelledby="skills-heading"
      initial={disableEntrance || reduceMotion ? false : { y: 20 }}
      whileInView={safariPerfMode ? undefined : disableEntrance ? undefined : { y: 0 }}
      animate={safariPerfMode && !disableEntrance ? { y: 0 } : undefined}
      viewport={safariPerfMode ? undefined : { once: true, amount: 0.08, margin: '0px 0px -12% 0px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const }
      }
    >
      <motion.div
        className={cn(touchScrollActive && 'touch-scroll-active')}
        initial={false}
        viewport={{ once: false, amount: 0.22, margin: '-8% 0px' }}
        onViewportEnter={() => setIsTouchScrollActive(true)}
        onViewportLeave={() => setIsTouchScrollActive(false)}
      >
        <TiltCard
          maxTilt={0.8}
          scale={1.001}
          showShine={!isTouchLike}
          disabled={isTouchLike}
          innerClassName="frost-panel px-7 py-11 md:px-10 md:py-13"
        >
          {/*
            During intro reveal, the grid uses its own pop/fade stagger.
            Wrapping the entire section in an opacity fade hides that pop.
          */}
          {innerRevealDelay != null && !reduceMotion && !useIntroGridReveal ? (
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
          ) : !disableEntrance && !reduceMotion ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.08, margin: '0px 0px -12% 0px' }}
              transition={{
                duration: 0.72,
                ease: [0.22, 1, 0.36, 1] as const,
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
