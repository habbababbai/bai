import { cn } from '@/lib/cn'
import { useTilt, type TiltConfig } from '@/hooks/use-tilt'
import { motion, useReducedMotion, useMotionTemplate } from 'motion/react'
import { type ReactNode } from 'react'

type TiltCardProps = {
  children: ReactNode
  className?: string
  innerClassName?: string
  perspective?: number
  showShine?: boolean
} & TiltConfig

export function TiltCard({
  children,
  className,
  innerClassName,
  perspective = 800,
  maxTilt = 6,
  scale = 1.02,
  springConfig,
  showShine = false,
  disabled: disabledProp,
}: TiltCardProps) {
  const reduceMotion = useReducedMotion()
  const disabled = disabledProp ?? reduceMotion ?? false

  const { ref, tilt, handlers } = useTilt<HTMLDivElement>({
    maxTilt,
    scale,
    springConfig,
    disabled,
  })

  const shineBackground = useMotionTemplate`radial-gradient(600px circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255,255,255,0.07), rgba(255,255,255,0.03) 40%, transparent 70%)`

  return (
    <div
      className={cn('group', className)}
      style={{ perspective: disabled ? undefined : perspective }}
    >
      <motion.div
        ref={ref}
        className={cn(
          'relative h-full w-full',
          !disabled && 'transform-gpu',
          innerClassName
        )}
        style={
          disabled
            ? undefined
            : {
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                scale: tilt.scale,
                transformStyle: 'preserve-3d',
              }
        }
        onMouseMove={handlers.onMouseMove}
        onMouseLeave={handlers.onMouseLeave}
        onMouseEnter={handlers.onMouseEnter}
      >
        {children}

        {showShine && !disabled && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ background: shineBackground }}
            aria-hidden
          />
        )}
      </motion.div>
    </div>
  )
}
