import { site } from '@/content/site'
import { cn } from '@/lib/cn'
import { Layers } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

export function SkillsSection() {
  const reduceMotion = useReducedMotion()
  const skillGroups = site.skills
  const lastIsOdd = skillGroups.length % 2 === 1

  const gridContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.06,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.42,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }

  return (
    <section
      id="skills"
      className="frost-panel px-7 py-11 md:px-10 md:py-13"
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto max-w-[40rem]">
        <div className="mb-4 flex flex-row items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-violet-300/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
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
        <motion.div
          className="mt-6 grid grid-cols-1 items-start gap-4 sm:gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-5"
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25, margin: '-8% 0px' }}
        >
          {skillGroups.map((group, index) => {
            const isLast = index === skillGroups.length - 1
            const spanLastOdd = lastIsOdd && isLast

            return (
              <motion.div
                key={group.label}
                variants={cardVariants}
                className={cn(
                  'skill-card flex flex-col',
                  spanLastOdd &&
                    'md:col-span-2 md:mx-auto md:w-full md:max-w-lg',
                )}
              >
                <h3 className="text-sm font-medium leading-snug text-zinc-300">
                  {group.label}
                </h3>
                <ul className="mt-3.5 flex flex-wrap gap-x-2 gap-y-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="chip leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
