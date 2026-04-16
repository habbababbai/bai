import { cn } from '@/lib/cn'
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'motion/react'
import { useEffect } from 'react'

type OrbConfig = {
  id: string
  position: string
  size: string
  gradient: string
  blur: string
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
    position: 'left-[-18%] top-[-14%]',
    size: 'h-[min(72vw,520px)] w-[min(72vw,520px)]',
    gradient: 'bg-gradient-to-br from-indigo-600/45 via-violet-600/28 to-transparent',
    blur: 'blur-[100px]',
    animate: { x: [0, 44, -28, 0], y: [0, -36, 28, 0], scale: [1, 1.09, 1.05, 1] },
    duration: 36,
    delay: 0,
    parallaxStrength: 0.12,
    invert: false,
    springConfig: { stiffness: 35, damping: 20 },
  },
  {
    id: 'b',
    position: 'right-[-22%] top-[14%]',
    size: 'h-[min(65vw,480px)] w-[min(65vw,480px)]',
    gradient: 'bg-gradient-to-bl from-sky-500/30 via-blue-600/15 to-transparent',
    blur: 'blur-[110px]',
    animate: { x: [0, -52, 32, 0], y: [0, 40, -24, 0], scale: [1, 1.06, 1.08, 1] },
    duration: 42,
    delay: 1.2,
    parallaxStrength: 0.08,
    invert: true,
    springConfig: { stiffness: 45, damping: 25 },
  },
  {
    id: 'c',
    position: 'bottom-[-22%] left-[8%]',
    size: 'h-[min(70vw,500px)] w-[min(70vw,500px)]',
    gradient: 'bg-gradient-to-tr from-fuchsia-700/25 via-indigo-800/20 to-transparent',
    blur: 'blur-[120px]',
    animate: { x: [0, 36, -20, 0], y: [0, 32, -18, 0], scale: [1, 1.05, 1.07, 1] },
    duration: 40,
    delay: 2.4,
    parallaxStrength: 0.1,
    invert: false,
    springConfig: { stiffness: 30, damping: 18 },
  },
  {
    id: 'd',
    position: 'left-[18%] top-[42%]',
    size: 'h-[min(55vw,380px)] w-[min(55vw,380px)]',
    gradient: 'bg-gradient-to-r from-violet-600/20 via-transparent to-cyan-500/15',
    blur: 'blur-[90px]',
    animate: { x: [0, -30, 24, 0], y: [0, 24, -20, 0], scale: [1, 1.12, 1.04, 1] },
    duration: 48,
    delay: 0.8,
    parallaxStrength: 0.06,
    invert: true,
    springConfig: { stiffness: 50, damping: 28 },
  },
]

const DEFAULT_SPRING = { stiffness: 40, damping: 25 }

function useInteractiveParallax(
  strength: number,
  invert: boolean,
  springConfig: { stiffness: number; damping: number },
  disabled: boolean
) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
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
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const opacity = useMotionValue(0)

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return

    let timeout: ReturnType<typeof setTimeout>

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      opacity.set(1)

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        opacity.set(0)
      }, 3000)
    }

    const handleMouseLeave = () => {
      opacity.set(0)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timeout)
    }
  }, [disabled, mouseX, mouseY, opacity])

  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 30 })
  const smoothOpacity = useSpring(opacity, { stiffness: 80, damping: 20 })

  return { x: smoothX, y: smoothY, opacity: smoothOpacity }
}

function ParallaxOrb({ orb, reduceMotion }: { orb: OrbConfig; reduceMotion: boolean }) {
  const parallax = useInteractiveParallax(
    orb.parallaxStrength,
    orb.invert ?? false,
    orb.springConfig ?? DEFAULT_SPRING,
    reduceMotion
  )

  return (
    <motion.div
      className={cn(
        'absolute rounded-full',
        orb.position,
        orb.size,
        orb.gradient,
        orb.blur,
      )}
      initial={false}
      animate={
        reduceMotion
          ? { x: 0, y: 0, scale: 1 }
          : orb.animate
      }
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
      style={
        reduceMotion
          ? undefined
          : {
              x: parallax.x,
              y: parallax.y,
            }
      }
    />
  )
}

function CursorGlow({ disabled }: { disabled: boolean }) {
  const cursor = useCursorGlow(disabled)

  const background = useMotionTemplate`radial-gradient(800px circle at ${cursor.x}px ${cursor.y}px, rgba(139,92,246,0.08), rgba(99,102,241,0.04) 40%, transparent 70%)`

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

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      auroraMouseX.set(e.clientX - centerX)
      auroraMouseY.set(e.clientY - centerY)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [reduceMotion, auroraMouseX, auroraMouseY])

  const auroraX = useSpring(
    useTransform(auroraMouseX, (v) => v * 0.03),
    { stiffness: 20, damping: 15 }
  )
  const auroraY = useSpring(
    useTransform(auroraMouseY, (v) => v * 0.03),
    { stiffness: 20, damping: 15 }
  )

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Solid base - ensures no gaps ever show */}
      <div className="absolute inset-0 bg-[#06060a]" />

      {/* Slow aurora wash — GPU-friendly rotation + mouse parallax */}
      <motion.div
        className="absolute -inset-[60%] opacity-[0.38] will-change-transform transform-gpu"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.22) 0deg, rgba(134,94,194,0.17) 60deg, rgba(168,85,247,0.12) 120deg, rgba(114,108,197,0.13) 180deg, rgba(59,130,246,0.15) 240deg, rgba(79,116,244,0.16) 300deg, rgba(99,102,241,0.22) 360deg)',
          x: reduceMotion ? undefined : auroraX,
          y: reduceMotion ? undefined : auroraY,
        }}
        animate={
          reduceMotion
            ? { rotate: 0 }
            : { rotate: 360 }
        }
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

      {/* Soft vignette + center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_35%,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_100%,rgba(15,23,42,0.85),transparent_50%)]" />

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
