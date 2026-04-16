import { AboutSection } from '@/components/about-section'
import { AmbientBackground } from '@/components/ambient-background'
import { ContactSection } from '@/components/contact-section'
import { HeroSection } from '@/components/hero-section'
import { SkillsSection } from '@/components/skills-section'

export default function App() {
  return (
    <div className="relative min-h-svh overflow-x-hidden">
      <AmbientBackground />
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:ring-2 focus:ring-violet-400/80"
      >
        Skip to about
      </a>
      <main
        id="main"
        className="relative z-10 mx-auto flex w-full max-w-[42rem] flex-col gap-12 px-5 pt-16 pb-28 sm:px-6 md:max-w-[44rem] md:gap-14 md:px-8 md:pt-24 md:pb-32"
      >
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </div>
  )
}
