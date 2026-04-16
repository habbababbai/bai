import { site } from '@/content/site'
import { TiltCard } from '@/components/tilt-card'
import { Smartphone } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

type AboutSectionProps = {
  disableEntrance?: boolean
}

export function AboutSection({ disableEntrance = false }: AboutSectionProps) {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <motion.section
      id="about"
      tabIndex={-1}
      initial={
        disableEntrance || reduceMotion ? false : { opacity: 0, y: 20 }
      }
      whileInView={disableEntrance ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
      }
      aria-labelledby="about-heading"
    >
      <TiltCard
        maxTilt={0.8}
        scale={1.001}
        showShine
        innerClassName="frost-panel px-7 py-10 md:px-10 md:py-12"
      >
        <div className="mx-auto max-w-160">
          <div className="mb-6 flex flex-row items-center justify-center gap-2.5 select-none">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-violet-300/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Smartphone className="h-5 w-5" aria-hidden strokeWidth={1.75} />
            </span>
            <h2
              id="about-heading"
              className="font-display text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl"
            >
              {site.about.title}
            </h2>
          </div>
          <div className="space-y-4 text-left text-[0.95rem] leading-[1.78] text-pretty text-zinc-400 sm:text-justify sm:hyphens-auto md:text-base">
            {site.about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.section>
  )
}
