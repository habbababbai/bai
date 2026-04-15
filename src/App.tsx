import { AmbientBackground } from '@/components/ambient-background'
import { ContactSection } from '@/components/contact-section'
import { HeroSection } from '@/components/hero-section'
import { SkillsSection } from '@/components/skills-section'

export default function App() {
  return (
    <div className="relative min-h-svh overflow-x-hidden">
      <AmbientBackground />
      <a
        href="#skills"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:ring-2 focus:ring-violet-400/80"
      >
        Skip to skills
      </a>
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 pb-20 pt-14 md:gap-12 md:px-8 md:pt-20">
        <HeroSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </div>
  )
}
