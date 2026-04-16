import { cn } from '@/lib/cn'
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'motion/react'
import { useEffect, useLayoutEffect } from 'react'

type OrbConfig = {
  id: string
  position: string
  size: string
  glowClassName: string
  glowBackground: string
  planetClassName: string
  planetBackground: string
  rimClassName?: string
  rimBackground?: string
  highlightClassName?: string
  highlightBackground?: string
  animate: { x: number[]; y: number[]; scale: number[] }
  duration: number
  delay?: number
  parallaxStrength: number
  invert?: boolean
  springConfig?: { stiffness: number; damping: number }
}

const orbs: OrbConfig[] = [
  {
    id: 'a',
    position: 'right-[-16%] top-[-8%]',
    size: 'h-[min(68vw,520px)] w-[min(68vw,520px)]',
    glowClassName: 'absolute inset-[-8%] rounded-full blur-[34px]',
    glowBackground:
      'radial-gradient(circle at 36% 42%, rgba(121,137,255,0.32), rgba(100,76,219,0.18) 28%, rgba(20,20,34,0.04) 56%, transparent 72%)',
    planetClassName:
      'absolute inset-[10%] rounded-full border border-white/[0.035] shadow-[inset_-26px_-40px_80px_rgba(0,0,0,0.45),inset_22px_24px_60px_rgba(131,152,255,0.08)]',
    planetBackground:
      'radial-gradient(circle at 34% 32%, rgba(82,102,214,0.22), rgba(19,22,40,0.95) 42%, rgba(5,7,14,0.99) 76%)',
    rimClassName: 'absolute inset-[4%] rounded-full blur-[28px] opacity-70',
    rimBackground:
      'radial-gradient(circle at 42% 48%, transparent 50%, rgba(123,145,255,0.18) 68%, transparent 78%)',
    highlightClassName: 'absolute inset-[22%] rounded-full blur-[56px] opacity-72',
    highlightBackground:
      'radial-gradient(circle at 35% 28%, rgba(255,255,255,0.1), rgba(147,171,255,0.07) 22%, transparent 56%)',
    animate: {
      x: [0, -26, 12, 0],
      y: [0, 14, -12, 0],
      scale: [1, 1.04, 1.02, 1],
    },
    duration: 42,
    delay: 0,
    parallaxStrength: 0.14,
    invert: true,
    springConfig: { stiffness: 30, damping: 16 },
  },
  {
    id: 'b',
    position: 'left-[-18%] bottom-[-16%]',
    size: 'h-[min(72vw,560px)] w-[min(72vw,560px)]',
    glowClassName: 'absolute inset-[-10%] rounded-full blur-[46px]',
    glowBackground:
      'radial-gradient(circle at 62% 38%, rgba(97,122,255,0.24), rgba(68,74,170,0.15) 28%, rgba(11,12,24,0.06) 58%, transparent 78%)',
    planetClassName:
      'absolute inset-[12%] rounded-full border border-white/[0.03] shadow-[inset_-22px_-36px_80px_rgba(0,0,0,0.54),inset_18px_20px_42px_rgba(120,136,255,0.06)]',
    planetBackground:
      'radial-gradient(circle at 56% 34%, rgba(72,93,205,0.14), rgba(13,16,30,0.97) 44%, rgba(3,5,10,1) 78%)',
    rimClassName: 'absolute inset-[2%] rounded-full blur-[34px] opacity-65',
    rimBackground:
      'radial-gradient(circle at 58% 48%, transparent 52%, rgba(108,128,255,0.12) 68%, transparent 80%)',
    animate: {
      x: [0, 24, -12, 0],
      y: [0, -18, 10, 0],
      scale: [1, 1.03, 1.05, 1],
    },
    duration: 46,
    delay: 0,
    parallaxStrength: 0.16,
    invert: false,
    springConfig: { stiffness: 28, damping: 15 },
  },
  {
    id: 'c',
    position: 'right-[10%] top-[50%]',
    size: 'h-[min(28vw,230px)] w-[min(28vw,230px)]',
    glowClassName: 'absolute inset-[-18%] rounded-full blur-[30px]',
    glowBackground:
      'radial-gradient(circle at 48% 44%, rgba(94,111,255,0.22), rgba(73,55,171,0.12) 34%, transparent 72%)',
    planetClassName:
      'absolute inset-[16%] rounded-full border border-white/[0.03] shadow-[inset_-16px_-22px_40px_rgba(0,0,0,0.48),inset_10px_12px_26px_rgba(111,126,255,0.06)]',
    planetBackground:
      'radial-gradient(circle at 42% 34%, rgba(74,96,214,0.16), rgba(12,15,26,0.95) 40%, rgba(4,6,12,1) 82%)',
    highlightClassName: 'absolute inset-[28%] rounded-full blur-[34px] opacity-68',
    highlightBackground:
      'radial-gradient(circle at 40% 30%, rgba(255,255,255,0.08), transparent 56%)',
    animate: {
      x: [0, -10, 8, 0],
      y: [0, 12, -8, 0],
      scale: [1, 1.05, 1.02, 1],
    },
    duration: 34,
    delay: 0,
    parallaxStrength: 0.11,
    invert: true,
    springConfig: { stiffness: 38, damping: 20 },
  },
]

const DEFAULT_SPRING = { stiffness: 40, damping: 25 }

function useInteractiveParallax(
  strength: number,
  invert: boolean,
  springConfig: { stiffness: number; damping: number },
  disabled: boolean,
) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return

    mouseX.set(0)
    mouseY.set(0)

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }

    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [disabled, mouseX, mouseY])

  const multiplier = invert ? -1 : 1
  const offsetX = useTransform(mouseX, (v) => v * strength * multiplier)
  const offsetY = useTransform(mouseY, (v) => v * strength * multiplier)

  const x = useSpring(offsetX, springConfig)
  const y = useSpring(offsetY, springConfig)

  return { x, y }
}

function useCursorGlow(disabled: boolean) {
  const mouseX = useMotionValue(typeof window === 'undefined' ? 0 : window.innerWidth / 2)
  const mouseY = useMotionValue(
    typeof window === 'undefined' ? 0 : window.innerHeight / 2,
  )
  const opacity = useMotionValue(0.45)

  useLayoutEffect(() => {
    if (disabled || typeof window === 'undefined') return

    mouseX.set(window.innerWidth / 2)
    mouseY.set(window.innerHeight / 2)
    opacity.set(0.45)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      opacity.set(1)
    }

    const handleMouseLeave = () => {
      opacity.set(0.18)
    }

    const handleMouseEnter = () => {
      opacity.set(0.45)
    }

    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [disabled, mouseX, mouseY, opacity])

  const smoothX = useSpring(mouseX, { stiffness: 220, damping: 24 })
  const smoothY = useSpring(mouseY, { stiffness: 220, damping: 24 })
  const smoothOpacity = useSpring(opacity, { stiffness: 260, damping: 26 })

  return { x: smoothX, y: smoothY, opacity: smoothOpacity }
}

function ParallaxOrb({ orb, reduceMotion }: { orb: OrbConfig; reduceMotion: boolean }) {
  const parallax = useInteractiveParallax(
    orb.parallaxStrength,
    orb.invert ?? false,
    orb.springConfig ?? DEFAULT_SPRING,
    reduceMotion,
  )

  return (
    <motion.div
      className={cn('absolute', orb.position)}
      style={
        reduceMotion
          ? undefined
          : {
              x: parallax.x,
              y: parallax.y,
            }
      }
    >
      <motion.div
        className={cn('relative', orb.size)}
        initial={false}
        animate={reduceMotion ? { x: 0, y: 0, scale: 1 } : orb.animate}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: orb.duration,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: orb.delay ?? 0,
              }
        }
      >
        <div
          className={cn('pointer-events-none absolute rounded-full', orb.glowClassName)}
          style={{ background: orb.glowBackground }}
        />
        {orb.rimBackground && orb.rimClassName && (
          <div className={orb.rimClassName} style={{ background: orb.rimBackground }} />
        )}
        <div className={orb.planetClassName} style={{ background: orb.planetBackground }} />
        {orb.highlightBackground && orb.highlightClassName && (
          <div
            className={orb.highlightClassName}
            style={{ background: orb.highlightBackground }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

function CursorGlow({ disabled }: { disabled: boolean }) {
  const cursor = useCursorGlow(disabled)

  const background = useMotionTemplate`radial-gradient(1200px circle at ${cursor.x}px ${cursor.y}px, rgba(139,92,246,0.16), rgba(99,102,241,0.08) 34%, transparent 66%)`

  if (disabled) return null

  return (
    <motion.div
      className="absolute inset-0 transition-opacity duration-700"
      style={{
        background,
        opacity: cursor.opacity,
      }}
    />
  )
}

export function AmbientBackground() {
  const reduceMotion = useReducedMotion() ?? false

  const auroraMouseX = useMotionValue(0)
  const auroraMouseY = useMotionValue(0)

  useEffect(() => {
    if (reduceMotion || typeof window === 'undefined') return

    auroraMouseX.set(0)
    auroraMouseY.set(0)

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      auroraMouseX.set(e.clientX - centerX)
      auroraMouseY.set(e.clientY - centerY)
    }

    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [reduceMotion, auroraMouseX, auroraMouseY])

  const auroraX = useSpring(
    useTransform(auroraMouseX, (v) => v * 0.07),
    { stiffness: 24, damping: 14 },
  )
  const auroraY = useSpring(
    useTransform(auroraMouseY, (v) => v * 0.07),
    { stiffness: 24, damping: 14 },
  )

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Solid base - ensures no gaps ever show */}
      <div className="absolute inset-0 bg-[#06060a]" />

      {/* Slow atmospheric wash - kept subtle so the planet forms lead the scene */}
      <motion.div
        className="absolute -inset-[62%] transform-gpu opacity-[0.24] will-change-transform"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.15) 0deg, rgba(93,85,199,0.12) 72deg, rgba(122,92,240,0.08) 144deg, rgba(52,69,148,0.12) 220deg, rgba(79,116,244,0.11) 300deg, rgba(99,102,241,0.15) 360deg)',
          x: reduceMotion ? undefined : auroraX,
          y: reduceMotion ? undefined : auroraY,
        }}
        animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                rotate: {
                  duration: 140,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }
        }
      />

      {/* Center glow and framing vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_58%_at_50%_34%,rgba(255,255,255,0.055),transparent_56%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_82%_at_50%_100%,rgba(7,10,20,0.92),transparent_48%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(93,110,212,0.07),transparent_34%)]" />

      {/* Floating orbs with parallax */}
      {orbs.map((orb) => (
        <ParallaxOrb key={orb.id} orb={orb} reduceMotion={reduceMotion} />
      ))}

      {/* Cursor glow - follows mouse with soft ambient light */}
      <CursorGlow disabled={reduceMotion} />

      {/* Subtle film grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
