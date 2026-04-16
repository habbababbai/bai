import { site } from '@/content/site'
import { IconGitHub, IconLinkedIn } from '@/components/brand-icons'
import { EmailCopyLine } from '@/components/email-copy-line'
import { TiltCard } from '@/components/tilt-card'
import { useInputModality } from '@/hooks/use-input-modality'
import { cn } from '@/lib/cn'
import { Mail, MessageCircle } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

const mailto = `mailto:${site.links.email}`

const items = [
  {
    href: site.links.github,
    label: 'GitHub',
    external: true,
    icon: IconGitHub,
  },
  {
    href: site.links.linkedin,
    label: 'LinkedIn',
    external: true,
    icon: IconLinkedIn,
  },
  {
    href: mailto,
    label: 'Email',
    external: false,
    icon: Mail,
  },
] as const

type ContactSectionProps = {
  disableEntrance?: boolean
  innerRevealDelay?: number
}

export function ContactSection({
  disableEntrance = false,
  innerRevealDelay,
}: ContactSectionProps) {
  const reduceMotion = useReducedMotion() ?? false
  const { isTouchLike } = useInputModality()
  const [isTouchScrollActive, setIsTouchScrollActive] = useState(false)
  const touchScrollActive = isTouchLike && !reduceMotion && isTouchScrollActive

  const heading = (
    <div className="mb-1 flex flex-row items-center justify-center gap-2.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-[#68aec9]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <MessageCircle className="h-5 w-5" aria-hidden strokeWidth={1.75} />
      </span>
      <h2
        id="contact-heading"
        className="font-display text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl"
      >
        Connect
      </h2>
    </div>
  )

  const blurb = (
    <p className="mt-3 text-sm leading-relaxed text-zinc-500">
      Links and email — best place to reach me.
    </p>
  )

  const linkNav = (
    <nav
      className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3"
      aria-label="Contact links"
    >
      {items.map(({ href, label, external, icon: Icon }) => (
        <a
          key={label}
          className="link-pill min-h-11 select-none sm:min-w-42"
          href={href}
          {...(external ? { rel: 'noreferrer', target: '_blank' } : {})}
        >
          <Icon className="h-4.5 w-4.5 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
          {label}
        </a>
      ))}
    </nav>
  )

  const inner = (
    <div className="mx-auto max-w-xl text-center select-none">
      {heading}
      {blurb}
      <EmailCopyLine variant="centered" className="mt-5" />
      {linkNav}
    </div>
  )

  const innerAnimated = (
    <div className="mx-auto max-w-xl text-center select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1.12,
          delay: innerRevealDelay ?? 0,
          ease: [0.18, 0.92, 0.22, 1] as const,
        }}
      >
        {heading}
        {blurb}
        <EmailCopyLine variant="centered" className="mt-5" />
      </motion.div>
      {linkNav}
    </div>
  )

  const innerWhileInView = (
    <div className="mx-auto max-w-xl text-center select-none">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-12% 0px' }}
        transition={{
          duration: 0.72,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
      >
        {heading}
        {blurb}
        <EmailCopyLine variant="centered" className="mt-5" />
      </motion.div>
      {linkNav}
    </div>
  )

  return (
    <motion.section
      id="contact"
      initial={disableEntrance || reduceMotion ? false : { y: 20 }}
      whileInView={disableEntrance ? undefined : { y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1] as const,
              delay: 0.05,
            }
      }
      aria-labelledby="contact-heading"
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
          showShine
          innerClassName="frost-panel px-7 py-11 md:px-10 md:py-13"
        >
          {innerRevealDelay != null && !reduceMotion
            ? innerAnimated
            : !disableEntrance && !reduceMotion
              ? innerWhileInView
              : inner}
        </TiltCard>
      </motion.div>
    </motion.section>
  )
}
