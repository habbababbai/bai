import { site } from '@/content/site'
import { motion, useReducedMotion } from 'motion/react'

export function SkillsSection() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      id="skills"
      className="frost-panel px-6 py-10 md:px-10 md:py-12"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
      }
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="skills-heading"
          className="font-display text-center text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl"
        >
          Skills
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-zinc-500">
          Tools and technologies I reach for most often.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {site.skills.map((group) => (
            <div
              key={group.label}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <h3 className="text-sm font-medium text-zinc-300">{group.label}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <span className="chip">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
