import { site } from '@/content/site'
import { Smartphone } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

export function AboutSection() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      id="about"
      className="frost-panel px-7 py-11 md:px-10 md:py-13"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
      }
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-[40rem]">
        <div className="mb-7 flex flex-row items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-violet-300/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <Smartphone className="h-5 w-5" aria-hidden strokeWidth={1.75} />
          </span>
          <h2
            id="about-heading"
            className="font-display text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl"
          >
            {site.about.title}
          </h2>
        </div>
        <div className="space-y-4 text-left text-pretty text-[0.9375rem] leading-relaxed text-zinc-400 sm:hyphens-auto sm:text-justify md:text-base md:leading-[1.7]">
          {site.about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
