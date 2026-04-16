import { cn } from '@/lib/cn'
import { useInputModality } from '@/hooks/use-input-modality'
import {
  motion,
  useScroll,
  useReducedMotion,
  useMotionValue,
  useTime,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, useLayoutEffect, useRef } from 'react'

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
    glowClassName: 'absolute inset-[-15%] rounded-full blur-[58px]',
    glowBackground:
      'radial-gradient(circle at 22% 26%, rgba(255,170,108,0.38), rgba(232,122,72,0.25) 16%, rgba(154,76,46,0.14) 30%, transparent 46%), radial-gradient(circle at 52% 30%, rgba(130,96,214,0.34), rgba(90,62,172,0.24) 30%, rgba(60,42,128,0.14) 48%, transparent 68%), radial-gradient(circle at 70% 42%, rgba(64,116,188,0.28), rgba(42,82,146,0.2) 32%, rgba(28,56,108,0.12) 50%, transparent 70%)',
    planetClassName: 'absolute inset-[10%] rounded-full overflow-hidden',
    // Darker sphere with compact warm crescent and cool penumbra
    planetBackground:
      'radial-gradient(circle at 20% 23%, rgba(255,206,158,0.86), rgba(247,164,112,0.66) 9%, rgba(216,114,70,0.44) 16%, rgba(122,62,46,0.38) 23%, rgba(56,40,60,0.56) 33%, rgba(34,36,72,0.58) 42%, rgba(6,8,14,0.96) 54%, rgba(0,0,0,1) 66%)',
    // Purple/blue rim to reinforce mysterious edge lighting
    rimClassName: 'absolute inset-[2%] rounded-full blur-[42px] opacity-58',
    rimBackground:
      'radial-gradient(circle at 72% 64%, rgba(104,90,194,0.38), rgba(70,66,154,0.28) 22%, transparent 42%), radial-gradient(circle at 74% 66%, rgba(72,126,202,0.34), rgba(47,88,156,0.24) 32%, rgba(32,64,126,0.14) 50%, transparent 70%)',
    // Outer mixed halo
    highlightClassName: 'absolute inset-[-20%] rounded-full blur-[76px] opacity-34',
    highlightBackground:
      'radial-gradient(circle at 24% 30%, rgba(250,162,110,0.22), rgba(222,124,80,0.14) 34%, transparent 56%), radial-gradient(circle at 56% 34%, rgba(126,92,208,0.2), rgba(84,56,162,0.12) 34%, transparent 60%), radial-gradient(circle at 68% 40%, rgba(74,120,188,0.14), rgba(45,82,142,0.09) 34%, transparent 62%)',
    animate: {
      x: [0, -26, 12, 0],
      y: [0, 14, -12, 0],
      scale: [1, 1, 1, 1],
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
    glowClassName: 'absolute inset-[-16%] rounded-full blur-[68px]',
    glowBackground:
      'radial-gradient(circle at 76% 28%, rgba(255,164,104,0.36), rgba(226,118,72,0.25) 22%, rgba(154,78,46,0.14) 38%, transparent 52%), radial-gradient(circle at 52% 52%, rgba(126,90,208,0.28), rgba(86,60,164,0.2) 30%, transparent 56%), radial-gradient(circle at 38% 66%, rgba(58,108,176,0.2), rgba(36,70,128,0.14) 36%, transparent 64%)',
    planetClassName: 'absolute inset-[12%] rounded-full overflow-hidden',
    // Darker body with short bright crescent
    planetBackground:
      'radial-gradient(circle at 78% 28%, rgba(255,202,154,0.84), rgba(246,160,108,0.62) 11%, rgba(214,114,70,0.42) 18%, rgba(120,64,46,0.36) 26%, rgba(56,42,62,0.54) 36%, rgba(34,36,72,0.56) 46%, rgba(6,8,14,0.95) 58%, rgba(0,0,0,1) 70%)',
    // Purple + blue shadow rim
    rimClassName: 'absolute inset-[1%] rounded-full blur-[50px] opacity-54',
    rimBackground:
      'radial-gradient(circle at 24% 68%, rgba(104,88,194,0.34), rgba(66,62,144,0.24) 24%, transparent 44%), radial-gradient(circle at 26% 70%, rgba(70,118,188,0.32), rgba(46,86,150,0.24) 32%, rgba(32,61,118,0.12) 52%, transparent 72%)',
    // Wide halo blending all accents
    highlightClassName: 'absolute inset-[-24%] rounded-full blur-[86px] opacity-32',
    highlightBackground:
      'radial-gradient(circle at 72% 32%, rgba(248,162,110,0.2), rgba(222,124,80,0.14) 38%, transparent 60%), radial-gradient(circle at 48% 56%, rgba(124,90,204,0.2), rgba(82,56,156,0.12) 30%, transparent 56%), radial-gradient(circle at 34% 66%, rgba(74,120,186,0.14), rgba(44,82,140,0.09) 34%, transparent 60%)',
    animate: {
      x: [0, 24, -12, 0],
      y: [0, -18, 10, 0],
      scale: [1, 1, 1, 1],
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
    glowClassName: 'absolute inset-[-20%] rounded-full blur-[44px]',
    glowBackground:
      'radial-gradient(circle at 30% 32%, rgba(255,164,106,0.32), rgba(224,120,72,0.22) 22%, rgba(150,78,46,0.12) 40%, transparent 56%), radial-gradient(circle at 54% 50%, rgba(120,86,200,0.24), rgba(80,54,154,0.16) 30%, transparent 56%), radial-gradient(circle at 70% 64%, rgba(64,108,170,0.18), rgba(40,76,134,0.12) 34%, transparent 62%)',
    planetClassName: 'absolute inset-[16%] rounded-full overflow-hidden',
    // Mostly dark with a compact lit crescent
    planetBackground:
      'radial-gradient(circle at 28% 30%, rgba(255,196,148,0.82), rgba(238,154,104,0.58) 11%, rgba(208,110,66,0.38) 18%, rgba(116,62,44,0.34) 26%, rgba(54,40,60,0.52) 36%, rgba(32,36,70,0.54) 46%, rgba(6,8,14,0.95) 58%, rgba(0,0,0,1) 70%)',
    // Purple-blue rim
    rimClassName: 'absolute inset-[4%] rounded-full blur-[34px] opacity-52',
    rimBackground:
      'radial-gradient(circle at 72% 66%, rgba(102,86,192,0.3), rgba(66,62,146,0.22) 24%, transparent 44%), radial-gradient(circle at 74% 68%, rgba(72,120,190,0.3), rgba(46,86,146,0.22) 32%, rgba(34,60,120,0.11) 52%, transparent 72%)',
    // Outer glow with all three accents
    highlightClassName: 'absolute inset-[-28%] rounded-full blur-[52px] opacity-30',
    highlightBackground:
      'radial-gradient(circle at 32% 35%, rgba(246,160,108,0.18), rgba(220,122,76,0.12) 38%, transparent 58%), radial-gradient(circle at 56% 52%, rgba(120,86,198,0.18), rgba(80,52,152,0.12) 30%, transparent 56%), radial-gradient(circle at 70% 62%, rgba(76,122,190,0.12), rgba(46,84,142,0.08) 34%, transparent 58%)',
    animate: {
      x: [0, -10, 8, 0],
      y: [0, 12, -8, 0],
      scale: [1, 1, 1, 1],
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
  mode: 'mouse' | 'scroll',
  scrollY: MotionValue<number>,
) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    if (disabled || mode !== 'mouse' || typeof window === 'undefined') return

    mouseX.set(0)
    mouseY.set(0)
    let rafId: number | null = null
    const pending = { x: 0, y: 0 }

    const flush = () => {
      rafId = null
      mouseX.set(pending.x)
      mouseY.set(pending.y)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      pending.x = e.clientX - centerX
      pending.y = e.clientY - centerY
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(flush)
    }

    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    })
    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
        rafId = null
      }
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [disabled, mode, mouseX, mouseY])

  const touchX = useTransform(scrollY, (value) => Math.sin(value * 0.0026) * 220)
  const touchY = useTransform(scrollY, (value) => Math.cos(value * 0.0022) * 180)

  const sourceX = mode === 'scroll' ? touchX : mouseX
  const sourceY = mode === 'scroll' ? touchY : mouseY

  const multiplier = invert ? -1 : 1
  const modeStrength = mode === 'scroll' ? strength * 1.9 : strength
  const offsetX = useTransform(sourceX, (v) => v * modeStrength * multiplier)
  const offsetY = useTransform(sourceY, (v) => v * modeStrength * multiplier)

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
  const rafIdRef = useRef<number | null>(null)
  const pendingRef = useRef({ x: 0, y: 0 })

  useLayoutEffect(() => {
    if (disabled || typeof window === 'undefined') return

    mouseX.set(window.innerWidth / 2)
    mouseY.set(window.innerHeight / 2)
    opacity.set(0.22)

    const flush = () => {
      rafIdRef.current = null
      mouseX.set(pendingRef.current.x)
      mouseY.set(pendingRef.current.y)
      opacity.set(0.42)
    }

    const handleMouseMove = (e: MouseEvent) => {
      pendingRef.current = { x: e.clientX, y: e.clientY }
      if (rafIdRef.current !== null) return
      rafIdRef.current = window.requestAnimationFrame(flush)
    }

    const handleMouseLeave = () => {
      opacity.set(0.07)
    }

    const handleMouseEnter = () => {
      opacity.set(0.22)
    }

    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
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

function ParallaxOrb({
  orb,
  orbIndex,
  reduceMotion,
  interactionMode,
  scrollY,
}: {
  orb: OrbConfig
  orbIndex: number
  reduceMotion: boolean
  interactionMode: 'mouse' | 'scroll'
  scrollY: MotionValue<number>
}) {
  const parallax = useInteractiveParallax(
    orb.parallaxStrength,
    orb.invert ?? false,
    orb.springConfig ?? DEFAULT_SPRING,
    reduceMotion,
    interactionMode,
    scrollY,
  )
  const time = useTime()
  const phase = orbIndex * 2.35
  const horizontalDirection = orbIndex % 2 === 0 ? 1 : -1
  const verticalDirection = orbIndex % 2 === 0 ? -1 : 1

  // Closed-loop path with a secondary harmonic keeps motion centered,
  // so orbs do not appear to "drift away" in one direction.
  const idleDriftX = useTransform(time, (t) =>
    reduceMotion
      ? 0
      : horizontalDirection *
          (Math.sin(t / 5200 + phase) * 52 + Math.sin(t / 8200 + phase * 1.7) * 22),
  )
  const idleDriftY = useTransform(time, (t) =>
    reduceMotion
      ? 0
      : verticalDirection *
          (Math.cos(t / 6800 + phase) * 40 + Math.sin(t / 9600 + phase * 1.4) * 18),
  )
  const layeredX = useTransform(() => parallax.x.get() + idleDriftX.get())
  const layeredY = useTransform(() => parallax.y.get() + idleDriftY.get())

  return (
    <motion.div
      className={cn('absolute transform-gpu', orb.position)}
      style={
        reduceMotion
          ? undefined
          : {
              x: layeredX,
              y: layeredY,
            }
      }
    >
      <motion.div
        className={cn('relative transform-gpu will-change-transform', orb.size)}
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
            <div
              className={orb.bandsClassName}
              style={{ background: orb.bandsBackground }}
            />
          )}
          {/* Surface spots - craters / storms */}
          {orb.spotsBackground && orb.spotsClassName && (
            <div
              className={orb.spotsClassName}
              style={{ background: orb.spotsBackground }}
            />
          )}
          {/* Additional texture variation */}
          {orb.textureBackground && orb.textureClassName && (
            <div
              className={orb.textureClassName}
              style={{ background: orb.textureBackground }}
            />
          )}
          {/* Colored turbulence layer 1 - primary irregular terrain */}
          {orb.turbulenceColor && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                opacity: orb.turbulenceOpacity ?? 0.3,
                mixBlendMode:
                  (orb.turbulenceBlend as React.CSSProperties['mixBlendMode']) ??
                  'multiply',
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
  const x = useTransform(cursor.x, (v) => v - 220)
  const y = useTransform(cursor.y, (v) => v - 220)

  if (disabled) return null

  return (
    <motion.div
      className="pointer-events-none absolute rounded-full blur-[52px] will-change-transform"
      style={{
        x,
        y,
        width: 440,
        height: 440,
        background:
          'radial-gradient(circle, rgba(72,122,196,0.11), rgba(106,84,182,0.075) 38%, rgba(194,114,72,0.04) 56%, transparent 74%)',
        opacity: cursor.opacity,
      }}
    />
  )
}

export function AmbientBackground({ interactive = true }: { interactive?: boolean }) {
  const reduceMotion = useReducedMotion() ?? false
  const { isTouchLike } = useInputModality()
  const allowInteractive = interactive && !reduceMotion
  const interactionMode = allowInteractive && isTouchLike ? 'scroll' : 'mouse'
  const allowMouseInteractive = allowInteractive && interactionMode === 'mouse'
  const allowScrollInteractive = allowInteractive && interactionMode === 'scroll'
  const { scrollY } = useScroll()

  const auroraMouseX = useMotionValue(0)
  const auroraMouseY = useMotionValue(0)

  useEffect(() => {
    if (!allowMouseInteractive || typeof window === 'undefined') return

    auroraMouseX.set(0)
    auroraMouseY.set(0)
    let rafId: number | null = null
    const pending = { x: 0, y: 0 }

    const flush = () => {
      rafId = null
      auroraMouseX.set(pending.x)
      auroraMouseY.set(pending.y)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      pending.x = e.clientX - centerX
      pending.y = e.clientY - centerY
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(flush)
    }

    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    })
    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
        rafId = null
      }
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [allowMouseInteractive, auroraMouseX, auroraMouseY])

  const auroraScrollX = useSpring(useTransform(scrollY, (v) => Math.sin(v * 0.0014) * 42), {
    stiffness: 20,
    damping: 14,
  })
  const auroraScrollY = useSpring(useTransform(scrollY, (v) => Math.cos(v * 0.0012) * 54), {
    stiffness: 20,
    damping: 14,
  })

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
        className="absolute -inset-[62%] transform-gpu opacity-[0.16] will-change-transform"
        style={{
          background:
            'conic-gradient(from 182deg at 50% 50%, rgba(42,84,146,0.22) 0deg, rgba(86,68,164,0.22) 78deg, rgba(188,110,68,0.12) 144deg, rgba(8,12,22,0.34) 220deg, rgba(46,88,152,0.2) 300deg, rgba(42,84,146,0.22) 360deg)',
          x: allowMouseInteractive ? auroraX : allowScrollInteractive ? auroraScrollX : undefined,
          y: allowMouseInteractive ? auroraY : allowScrollInteractive ? auroraScrollY : undefined,
        }}
        animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                rotate: {
                  duration: 220,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }
        }
      />

      {/* Center glow and framing vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_58%_at_50%_34%,rgba(70,116,186,0.045),rgba(108,82,180,0.04)_38%,rgba(190,110,68,0.022)_52%,transparent_64%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_82%_at_50%_100%,rgba(0,0,0,0.99),transparent_48%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(60,100,170,0.065),rgba(96,68,160,0.05)_26%,transparent_40%)]" />

      {/* Floating orbs with parallax */}
      {orbs.map((orb, orbIndex) => (
        <ParallaxOrb
          key={orb.id}
          orb={orb}
          orbIndex={orbIndex}
          reduceMotion={reduceMotion}
          interactionMode={interactionMode}
          scrollY={scrollY}
        />
      ))}

      {/* Cursor glow - follows mouse with soft ambient light */}
      <CursorGlow disabled={!allowMouseInteractive} />

      {/* Subtle film grain */}
      <div
        className="absolute inset-0 opacity-[0.028] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
