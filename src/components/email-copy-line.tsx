import { site } from '@/content/site'
import { cn } from '@/lib/cn'
import { Check, Link2 } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useCallback, useRef, useState } from 'react'

type EmailCopyLineProps = {
  className?: string
  variant?: 'inline' | 'centered'
  /** When false, the button ignores clicks and is visually muted. Defaults to true. */
  enabled?: boolean
}

export function EmailCopyLine({
  className,
  variant = 'inline',
  enabled = true,
}: EmailCopyLineProps) {
  const email = site.links.email
  const [copied, setCopied] = useState(false)
  const resetTimerRef = useRef<number | null>(null)
  const reduceMotion = useReducedMotion() ?? false

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = email
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      } catch {
        return
      }
    }
    setCopied(true)
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current)
    resetTimerRef.current = window.setTimeout(() => {
      setCopied(false)
      resetTimerRef.current = null
    }, 2000)
  }, [email])

  const widthEase = 'cubic-bezier(0.22, 1, 0.36, 1)'

  return (
    <div className={cn(variant === 'centered' && 'flex justify-center', className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (!enabled) return
          void copy()
        }}
        disabled={!enabled}
        tabIndex={enabled ? 0 : -1}
        aria-disabled={!enabled}
        className={cn(
          'group inline-flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-[0.8125rem] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color,background-color,box-shadow,color,opacity] duration-200',
          enabled
            ? 'hover:border-white/16 hover:bg-white/[0.06] hover:text-zinc-100'
            : 'pointer-events-none cursor-default opacity-60',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f85c5]/80',
          copied &&
            'border-emerald-500/25 bg-emerald-500/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(52,211,153,0.12)]',
        )}
        aria-label={`Copy email ${email}`}
      >
        <span
          className="flex h-3.5 w-3.5 shrink-0 items-center justify-center"
          aria-hidden
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400/95" strokeWidth={2.5} />
          ) : (
            <Link2
              className="h-3.5 w-3.5 text-zinc-500 transition-colors group-hover:text-[#8ea0d3]"
              strokeWidth={2}
            />
          )}
        </span>
        <span className="min-w-0 truncate font-mono text-[0.78rem] tracking-tight text-zinc-200/95">
          {email}
        </span>
        <span
          className={cn(
            'grid min-w-0 shrink-0 overflow-hidden',
            reduceMotion
              ? 'transition-none'
              : 'transition-[grid-template-columns] duration-[420ms]',
          )}
          style={
            reduceMotion
              ? { gridTemplateColumns: copied ? '1fr' : '0fr' }
              : {
                  gridTemplateColumns: copied ? '1fr' : '0fr',
                  transitionTimingFunction: widthEase,
                }
          }
          aria-hidden={!copied}
        >
          <span className="min-w-0">
            <span
              className="inline-block pl-1.5 text-[0.65rem] font-medium tracking-wide whitespace-nowrap text-emerald-400/90"
              aria-live={copied ? 'polite' : undefined}
            >
              Copied
            </span>
          </span>
        </span>
      </button>
    </div>
  )
}
