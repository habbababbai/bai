import { cn } from '@/lib/cn'
import { motion, useReducedMotion } from 'motion/react'

type OrbConfig = {
  id: string
  position: string
  size: string
  gradient: string
  blur: string
  animate: { x: number[]; y: number[]; scale: number[] }
  duration: number
  delay?: number
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
  },
]

export function AmbientBackground() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Slow aurora wash — GPU-friendly rotation only */}
      <motion.div
        className="absolute -inset-[40%] opacity-[0.38] will-change-transform transform-gpu"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.22) 0deg, rgba(168,85,247,0.12) 120deg, rgba(59,130,246,0.15) 240deg, rgba(99,102,241,0.18) 360deg)',
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

      {/* Floating orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
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
        />
      ))}

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
