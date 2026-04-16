import { useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useEffect } from 'react'

type MouseParallaxConfig = {
  strength?: number
  springConfig?: { stiffness: number; damping: number }
  disabled?: boolean
}

type MouseParallaxResult = {
  x: MotionValue<number>
  y: MotionValue<number>
}

const DEFAULT_SPRING = { stiffness: 50, damping: 30 }

export function useMouseParallax(config: MouseParallaxConfig = {}): MouseParallaxResult {
  const { strength = 0.02, springConfig = DEFAULT_SPRING, disabled = false } = config

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const offsetX = useTransform(mouseX, (v) => v * strength)
  const offsetY = useTransform(mouseY, (v) => v * strength)

  const x = useSpring(offsetX, springConfig)
  const y = useSpring(offsetY, springConfig)

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return

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

  return { x, y }
}
