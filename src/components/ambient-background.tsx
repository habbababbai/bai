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
    glowClassName: 'absolute inset-[-8%] rounded-full blur-[38px]',
    glowBackground:
      'radial-gradient(circle at 36% 42%, rgba(53,118,174,0.72), rgba(80,144,200,0.55) 30%, rgba(104,174,201,0.28) 48%, rgba(6,8,16,0.1) 64%, transparent 78%)',
    planetClassName:
      'absolute inset-[10%] rounded-full border border-white/[0.02] shadow-[inset_-46px_-58px_130px_rgba(0,0,0,0.92),inset_22px_22px_54px_rgba(245,160,80,0.22)]',
    planetBackground:
      'radial-gradient(circle at 32% 30%, rgba(245,160,80,0.95), rgba(224,120,56,0.9) 28%, rgba(200,96,48,0.8) 42%, rgba(48,16,8,0.98) 58%, rgba(8,4,4,1) 78%)',
    rimClassName: 'absolute inset-[4%] rounded-full blur-[32px] opacity-75',
    rimBackground:
      'radial-gradient(circle at 42% 48%, transparent 46%, rgba(53,118,174,0.52) 64%, rgba(80,144,200,0.3) 74%, transparent 82%)',
    highlightClassName: 'absolute inset-[22%] rounded-full blur-[48px] opacity-55',
    highlightBackground:
      'radial-gradient(circle at 35% 26%, rgba(104,174,201,0.22), rgba(80,144,200,0.15) 28%, transparent 58%)',
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
    glowClassName: 'absolute inset-[-10%] rounded-full blur-[50px]',
    glowBackground:
      'radial-gradient(circle at 62% 38%, rgba(53,118,174,0.68), rgba(80,144,200,0.5) 32%, rgba(104,174,201,0.26) 50%, rgba(6,8,16,0.1) 62%, transparent 80%)',
    planetClassName:
      'absolute inset-[12%] rounded-full border border-white/[0.018] shadow-[inset_-42px_-54px_126px_rgba(0,0,0,0.94),inset_22px_20px_50px_rgba(245,160,80,0.2)]',
    planetBackground:
      'radial-gradient(circle at 58% 33%, rgba(245,160,80,0.92), rgba(224,120,56,0.88) 30%, rgba(200,96,48,0.78) 44%, rgba(138,64,32,0.6) 54%, rgba(24,8,8,0.98) 72%, rgba(8,4,4,1) 86%)',
    rimClassName: 'absolute inset-[2%] rounded-full blur-[38px] opacity-70',
    rimBackground:
      'radial-gradient(circle at 58% 48%, transparent 48%, rgba(53,118,174,0.5) 66%, rgba(80,144,200,0.28) 76%, transparent 84%)',
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
    glowClassName: 'absolute inset-[-18%] rounded-full blur-[34px]',
    glowBackground:
      'radial-gradient(circle at 48% 44%, rgba(53,118,174,0.68), rgba(80,144,200,0.52) 36%, rgba(104,174,201,0.26) 52%, transparent 76%)',
    planetClassName:
      'absolute inset-[16%] rounded-full border border-white/[0.016] shadow-[inset_-26px_-34px_64px_rgba(0,0,0,0.92),inset_12px_14px_28px_rgba(245,160,80,0.18)]',
    planetBackground:
      'radial-gradient(circle at 42% 34%, rgba(245,160,80,0.9), rgba(224,120,56,0.85) 28%, rgba(200,96,48,0.72) 42%, rgba(48,16,8,0.98) 56%, rgba(8,4,4,1) 80%)',
    highlightClassName: 'absolute inset-[28%] rounded-full blur-[30px] opacity-50',
    highlightBackground:
      'radial-gradient(circle at 40% 30%, rgba(104,174,201,0.2), rgba(80,144,200,0.12) 30%, transparent 58%)',
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
  const opacity = useMotionValue(0.35)

  useLayoutEffect(() => {
    if (disabled || typeof window === 'undefined') return

    mouseX.set(window.innerWidth / 2)
    mouseY.set(window.innerHeight / 2)
    opacity.set(0.35)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      opacity.set(0.7)
    }

    const handleMouseLeave = () => {
      opacity.set(0.12)
    }

    const handleMouseEnter = () => {
      opacity.set(0.35)
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

  const background = useMotionTemplate`radial-gradient(900px circle at ${cursor.x}px ${cursor.y}px, rgba(53,118,174,0.28), rgba(80,144,200,0.18) 40%, rgba(104,174,201,0.08) 56%, transparent 72%)`

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
      <div className="absolute inset-0 bg-[#000000]" />

      {/* Slow atmospheric wash - kept subtle so the planet forms lead the scene */}
      <motion.div
        className="absolute -inset-[62%] transform-gpu opacity-[0.3] will-change-transform"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, rgba(53,118,174,0.34) 0deg, rgba(104,174,201,0.3) 70deg, rgba(169,216,222,0.24) 130deg, rgba(14,22,34,0.24) 216deg, rgba(53,118,174,0.32) 304deg, rgba(53,118,174,0.34) 360deg)',
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_58%_at_50%_34%,rgba(104,174,201,0.06),transparent_56%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_82%_at_50%_100%,rgba(0,0,0,0.99),transparent_48%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(53,118,174,0.1),transparent_36%)]" />

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
