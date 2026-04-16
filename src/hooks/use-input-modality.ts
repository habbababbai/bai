import { useSyncExternalStore } from 'react'

const TOUCH_PRIMARY_QUERY = '(hover: none) and (pointer: coarse)'
const TOUCH_ANY_QUERY = '(any-hover: none) and (any-pointer: coarse)'
const HOVER_NONE_QUERY = '(hover: none)'

function getTouchLikeMatch() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  const primaryTouchLike = window.matchMedia(TOUCH_PRIMARY_QUERY).matches
  const anyTouchLike = window.matchMedia(TOUCH_ANY_QUERY).matches
  const noHover = window.matchMedia(HOVER_NONE_QUERY).matches
  const hasTouchPoints = (navigator.maxTouchPoints ?? 0) > 0

  return primaryTouchLike || (anyTouchLike && hasTouchPoints) || (hasTouchPoints && noHover)
}

function subscribeToInputModality(onStoreChange: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }

  const mediaQueries = [
    window.matchMedia(TOUCH_PRIMARY_QUERY),
    window.matchMedia(TOUCH_ANY_QUERY),
    window.matchMedia(HOVER_NONE_QUERY),
  ]
  const handleChange = () => {
    onStoreChange()
  }

  mediaQueries.forEach((mq) => mq.addEventListener('change', handleChange))
  window.addEventListener('resize', handleChange, { passive: true })
  window.addEventListener('orientationchange', handleChange, { passive: true })

  return () => {
    mediaQueries.forEach((mq) => mq.removeEventListener('change', handleChange))
    window.removeEventListener('resize', handleChange)
    window.removeEventListener('orientationchange', handleChange)
  }
}

/**
 * Touch-like means no hover with a coarse primary pointer.
 * This keeps mouse/trackpad tablets in desktop behavior.
 */
export function useInputModality() {
  const isTouchLike = useSyncExternalStore(
    subscribeToInputModality,
    getTouchLikeMatch,
    () => false,
  )

  return { isTouchLike }
}
