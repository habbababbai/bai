import { useMotionValue, useSpring, type MotionValue } from 'motion/react'
import { useCallback, useRef, useState } from 'react'

export type TiltConfig = {
  maxTilt?: number
  scale?: number
  springConfig?: { stiffness: number; damping: number }
  disabled?: boolean
}

export type TiltValues = {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  scale: MotionValue<number>
  x: MotionValue<number>
  y: MotionValue<number>
  shineX: MotionValue<number>
  shineY: MotionValue<number>
  isHovering: boolean
}

const DEFAULT_SPRING = { stiffness: 300, damping: 30 }

export function useTilt<T extends HTMLElement = HTMLElement>(
  config: TiltConfig = {},
): {
  ref: React.RefObject<T | null>
  tilt: TiltValues
  handlers: {
    onMouseMove: (e: React.MouseEvent<T>) => void
    onMouseLeave: () => void
    onMouseEnter: () => void
    onPointerDown: (e: React.PointerEvent<T>) => void
    onPointerUp: () => void
    onPointerCancel: () => void
  }
} {
  const {
    maxTilt = 8,
    scale: scaleAmount = 1.02,
    springConfig = DEFAULT_SPRING,
    disabled = false,
  } = config

  const ref = useRef<T>(null)
  const [isHovering, setIsHovering] = useState(false)

  const rawRotateX = useMotionValue(0)
  const rawRotateY = useMotionValue(0)
  const rawScale = useMotionValue(1)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawShineX = useMotionValue(50)
  const rawShineY = useMotionValue(50)

  const rotateX = useSpring(rawRotateX, springConfig)
  const rotateY = useSpring(rawRotateY, springConfig)
  const scale = useSpring(rawScale, springConfig)
  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)
  const shineX = useSpring(rawShineX, { stiffness: 400, damping: 35 })
  const shineY = useSpring(rawShineY, { stiffness: 400, damping: 35 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (disabled || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      const percentX = mouseX / (rect.width / 2)
      const percentY = mouseY / (rect.height / 2)

      rawRotateX.set(-percentY * maxTilt)
      rawRotateY.set(percentX * maxTilt)
      rawX.set(percentX * 2)
      rawY.set(percentY * 2)

      const shinePercentX = ((e.clientX - rect.left) / rect.width) * 100
      const shinePercentY = ((e.clientY - rect.top) / rect.height) * 100
      rawShineX.set(shinePercentX)
      rawShineY.set(shinePercentY)
    },
    [disabled, maxTilt, rawRotateX, rawRotateY, rawX, rawY, rawShineX, rawShineY],
  )

  const handleMouseEnter = useCallback(() => {
    if (disabled) return
    setIsHovering(true)
    rawScale.set(scaleAmount)
  }, [disabled, scaleAmount, rawScale])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    rawRotateX.set(0)
    rawRotateY.set(0)
    rawScale.set(1)
    rawX.set(0)
    rawY.set(0)
    rawShineX.set(50)
    rawShineY.set(50)
  }, [rawRotateX, rawRotateY, rawScale, rawX, rawY, rawShineX, rawShineY])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<T>) => {
      if (disabled || !ref.current || e.pointerType === 'mouse') return

      const rect = ref.current.getBoundingClientRect()
      const shinePercentX = ((e.clientX - rect.left) / rect.width) * 100
      const shinePercentY = ((e.clientY - rect.top) / rect.height) * 100

      setIsHovering(true)
      rawRotateX.set(0)
      rawRotateY.set(0)
      rawScale.set(Math.min(scaleAmount, 1.008))
      rawShineX.set(shinePercentX)
      rawShineY.set(shinePercentY)
    },
    [disabled, rawRotateX, rawRotateY, rawScale, rawShineX, rawShineY, scaleAmount],
  )

  const handlePointerUp = useCallback(() => {
    handleMouseLeave()
  }, [handleMouseLeave])

  return {
    ref,
    tilt: { rotateX, rotateY, scale, x, y, shineX, shineY, isHovering },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onMouseEnter: handleMouseEnter,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
  }
}
