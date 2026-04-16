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
  bandsClassName?: string
  bandsBackground?: string
  spotsClassName?: string
  spotsBackground?: string
  textureClassName?: string
  textureBackground?: string
  noiseClassName?: string
  noiseOpacity?: number
  // Colored turbulence for irregular terrain
  turbulenceColor?: string
  turbulenceOpacity?: number
  turbulenceFrequency?: number
  turbulenceBlend?: string
  // Second turbulence layer for more complexity
  turbulence2Color?: string
  turbulence2Opacity?: number
  turbulence2Frequency?: number
  animate: { x: number[]; y: number[]; scale: number[] }
  duration: number
  delay?: number
  parallaxStrength: number
  invert?: boolean
  springConfig?: { stiffness: number; damping: number }
}

const orbs: OrbConfig[] = [
  // Planet A (top-right): darker core with orange + purple + blue accents
  {
    id: 'a',
    position: 'right-[-16%] top-[-8%]',
    size: 'h-[min(68vw,520px)] w-[min(68vw,520px)]',
    // Triple-accent atmosphere: orange, purple, blue
    glowClassName: 'absolute inset-[-15%] rounded-full blur-[70px]',
    glowBackground:
      'radial-gradient(circle at 22% 26%, rgba(255,176,112,0.5), rgba(238,126,74,0.34) 18%, rgba(168,82,48,0.18) 34%, transparent 52%), radial-gradient(circle at 52% 30%, rgba(123,92,210,0.3), rgba(88,60,170,0.2) 30%, rgba(62,42,132,0.12) 48%, transparent 68%), radial-gradient(circle at 70% 42%, rgba(68,122,198,0.34), rgba(44,86,152,0.24) 32%, rgba(28,58,112,0.14) 50%, transparent 70%)',
    planetClassName:
      'absolute inset-[10%] rounded-full overflow-hidden',
    // Darker sphere with compact warm crescent and cool penumbra
    planetBackground:
      'radial-gradient(circle at 20% 23%, rgba(255,214,168,0.94), rgba(255,176,120,0.82) 10%, rgba(235,128,78,0.58) 18%, rgba(150,76,52,0.42) 26%, rgba(65,44,60,0.52) 38%, rgba(40,40,78,0.55) 48%, rgba(8,10,16,0.94) 60%, rgba(0,0,0,1) 72%)',
    // Purple/blue rim to reinforce mysterious edge lighting
    rimClassName: 'absolute inset-[2%] rounded-full blur-[50px] opacity-55',
    rimBackground:
      'radial-gradient(circle at 72% 64%, rgba(96,86,188,0.34), rgba(66,66,150,0.24) 22%, transparent 42%), radial-gradient(circle at 74% 66%, rgba(74,132,210,0.4), rgba(49,92,164,0.28) 32%, rgba(34,66,130,0.16) 50%, transparent 70%)',
    // Outer mixed halo
    highlightClassName: 'absolute inset-[-20%] rounded-full blur-[90px] opacity-45',
    highlightBackground:
      'radial-gradient(circle at 24% 30%, rgba(255,170,116,0.34), rgba(230,130,82,0.2) 34%, transparent 58%), radial-gradient(circle at 56% 34%, rgba(124,90,206,0.2), rgba(84,56,162,0.12) 34%, transparent 60%), radial-gradient(circle at 68% 40%, rgba(78,126,196,0.2), rgba(47,84,146,0.12) 34%, transparent 62%)',
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
  // Planet B (bottom-left, largest): dark massive sphere with tri-color atmosphere
  {
    id: 'b',
    position: 'left-[-18%] bottom-[-16%]',
    size: 'h-[min(72vw,560px)] w-[min(72vw,560px)]',
    // Triple-accent halo: orange highlight + purple/blue aura
    glowClassName: 'absolute inset-[-16%] rounded-full blur-[80px]',
    glowBackground:
      'radial-gradient(circle at 76% 28%, rgba(255,170,108,0.48), rgba(232,124,74,0.34) 22%, rgba(162,84,48,0.2) 38%, transparent 56%), radial-gradient(circle at 52% 52%, rgba(120,88,204,0.24), rgba(84,58,160,0.16) 30%, transparent 56%), radial-gradient(circle at 38% 66%, rgba(62,112,182,0.24), rgba(39,74,133,0.16) 36%, transparent 64%)',
    planetClassName:
      'absolute inset-[12%] rounded-full overflow-hidden',
    // Darker body with short bright crescent
    planetBackground:
      'radial-gradient(circle at 78% 28%, rgba(255,210,162,0.92), rgba(255,170,114,0.8) 12%, rgba(233,125,74,0.56) 20%, rgba(148,76,52,0.42) 30%, rgba(66,46,62,0.5) 42%, rgba(40,40,78,0.52) 52%, rgba(8,10,16,0.92) 64%, rgba(0,0,0,1) 76%)',
    // Purple + blue shadow rim
    rimClassName: 'absolute inset-[1%] rounded-full blur-[60px] opacity-50',
    rimBackground:
      'radial-gradient(circle at 24% 68%, rgba(96,84,186,0.28), rgba(64,62,142,0.2) 24%, transparent 44%), radial-gradient(circle at 26% 70%, rgba(74,122,194,0.38), rgba(48,90,154,0.28) 32%, rgba(34,63,121,0.14) 52%, transparent 72%)',
    // Wide halo blending all accents
    highlightClassName: 'absolute inset-[-24%] rounded-full blur-[100px] opacity-40',
    highlightBackground:
      'radial-gradient(circle at 72% 32%, rgba(255,170,116,0.34), rgba(228,130,82,0.2) 38%, transparent 60%), radial-gradient(circle at 48% 56%, rgba(122,88,202,0.18), rgba(82,56,156,0.1) 30%, transparent 56%), radial-gradient(circle at 34% 66%, rgba(78,126,192,0.2), rgba(46,84,144,0.12) 34%, transparent 60%)',
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
  // Planet C (small, right-middle): darker mini-orb with tri-color accents
  {
    id: 'c',
    position: 'right-[10%] top-[50%]',
    size: 'h-[min(28vw,230px)] w-[min(28vw,230px)]',
    // Compact tri-color glow
    glowClassName: 'absolute inset-[-20%] rounded-full blur-[50px]',
    glowBackground:
      'radial-gradient(circle at 30% 32%, rgba(255,170,112,0.44), rgba(228,124,74,0.32) 22%, rgba(158,82,48,0.18) 40%, transparent 58%), radial-gradient(circle at 54% 50%, rgba(116,84,196,0.2), rgba(78,52,152,0.12) 30%, transparent 56%), radial-gradient(circle at 70% 64%, rgba(68,114,175,0.22), rgba(43,80,138,0.14) 34%, transparent 62%)',
    planetClassName:
      'absolute inset-[16%] rounded-full overflow-hidden',
    // Mostly dark with a compact lit crescent
    planetBackground:
      'radial-gradient(circle at 28% 30%, rgba(255,206,160,0.9), rgba(246,164,112,0.76) 12%, rgba(226,120,72,0.52) 20%, rgba(142,72,50,0.4) 30%, rgba(62,44,62,0.48) 42%, rgba(38,40,74,0.5) 52%, rgba(8,10,16,0.92) 64%, rgba(0,0,0,1) 76%)',
    // Purple-blue rim
    rimClassName: 'absolute inset-[4%] rounded-full blur-[38px] opacity-48',
    rimBackground:
      'radial-gradient(circle at 72% 66%, rgba(94,82,184,0.26), rgba(62,60,140,0.18) 24%, transparent 44%), radial-gradient(circle at 74% 68%, rgba(76,124,196,0.34), rgba(48,89,150,0.24) 32%, rgba(35,62,122,0.12) 52%, transparent 72%)',
    // Outer glow with all three accents
    highlightClassName: 'absolute inset-[-28%] rounded-full blur-[60px] opacity-42',
    highlightBackground:
      'radial-gradient(circle at 32% 35%, rgba(255,166,112,0.34), rgba(226,126,78,0.2) 38%, transparent 58%), radial-gradient(circle at 56% 52%, rgba(118,84,196,0.16), rgba(80,52,152,0.1) 30%, transparent 56%), radial-gradient(circle at 70% 62%, rgba(80,126,195,0.18), rgba(48,86,145,0.1) 34%, transparent 58%)',
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
        {/* Outer glow / atmosphere */}
        <div
          className={cn('pointer-events-none absolute rounded-full', orb.glowClassName)}
          style={{ background: orb.glowBackground }}
        />
        {/* Blue rim light */}
        {orb.rimBackground && orb.rimClassName && (
          <div className={orb.rimClassName} style={{ background: orb.rimBackground }} />
        )}
        {/* Planet base with lighting */}
        <div className={orb.planetClassName} style={{ background: orb.planetBackground }}>
          {/* Surface bands - like gas giant stripes */}
          {orb.bandsBackground && orb.bandsClassName && (
            <div className={orb.bandsClassName} style={{ background: orb.bandsBackground }} />
          )}
          {/* Surface spots - craters / storms */}
          {orb.spotsBackground && orb.spotsClassName && (
            <div className={orb.spotsClassName} style={{ background: orb.spotsBackground }} />
          )}
          {/* Additional texture variation */}
          {orb.textureBackground && orb.textureClassName && (
            <div className={orb.textureClassName} style={{ background: orb.textureBackground }} />
          )}
          {/* Colored turbulence layer 1 - primary irregular terrain */}
          {orb.turbulenceColor && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                opacity: orb.turbulenceOpacity ?? 0.3,
                mixBlendMode: (orb.turbulenceBlend as React.CSSProperties['mixBlendMode']) ?? 'multiply',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='t'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${orb.turbulenceFrequency ?? 0.4}' numOctaves='5' seed='42' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 2.5 -0.8' result='contrast'/%3E%3CfeFlood flood-color='rgb(${orb.turbulenceColor})' result='color'/%3E%3CfeBlend in='color' in2='contrast' mode='multiply'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23t)'/%3E%3C/svg%3E")`,
              }}
            />
          )}
          {/* Colored turbulence layer 2 - secondary detail */}
          {orb.turbulence2Color && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                opacity: orb.turbulence2Opacity ?? 0.2,
                mixBlendMode: 'screen',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='t2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${orb.turbulence2Frequency ?? 0.3}' numOctaves='4' seed='123' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 2 -0.5' result='contrast'/%3E%3CfeFlood flood-color='rgb(${orb.turbulence2Color})' result='color'/%3E%3CfeBlend in='color' in2='contrast' mode='multiply'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23t2)'/%3E%3C/svg%3E")`,
              }}
            />
          )}
          {/* Fine grain noise for surface texture */}
          {orb.noiseClassName && (
            <div
              className={orb.noiseClassName}
              style={{
                opacity: orb.noiseOpacity ?? 0.15,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />
          )}
        </div>
        {/* Top highlight / atmospheric glow */}
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
            'conic-gradient(from 182deg at 50% 50%, rgba(48,94,160,0.3) 0deg, rgba(92,72,176,0.26) 78deg, rgba(208,122,76,0.2) 144deg, rgba(10,14,24,0.3) 220deg, rgba(52,96,164,0.28) 300deg, rgba(48,94,160,0.3) 360deg)',
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_58%_at_50%_34%,rgba(76,124,196,0.06),rgba(112,84,186,0.045)_38%,rgba(204,118,72,0.03)_52%,transparent_64%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_82%_at_50%_100%,rgba(0,0,0,0.99),transparent_48%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(66,108,178,0.09),rgba(100,70,168,0.06)_26%,transparent_40%)]" />

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
