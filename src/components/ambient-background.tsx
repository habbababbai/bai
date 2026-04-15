import { cn } from '@/lib/cn'

const orbs = [
  {
    id: 'a',
    className:
      'left-[-18%] top-[-14%] h-[min(72vw,520px)] w-[min(72vw,520px)] bg-gradient-to-br from-indigo-600/35 via-violet-600/20 to-transparent blur-[100px] animate-orb-a',
  },
  {
    id: 'b',
    className:
      'right-[-22%] top-[18%] h-[min(65vw,480px)] w-[min(65vw,480px)] bg-gradient-to-bl from-blue-500/25 via-slate-900/10 to-transparent blur-[110px] animate-orb-b',
  },
  {
    id: 'c',
    className:
      'bottom-[-20%] left-[12%] h-[min(70vw,460px)] w-[min(70vw,460px)] bg-gradient-to-tr from-fuchsia-900/25 via-indigo-900/15 to-transparent blur-[120px] animate-orb-c',
  },
] as const

export function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_58%)] opacity-70" />
      {orbs.map((orb) => (
        <div key={orb.id} className={cn('absolute rounded-full', orb.className)} />
      ))}
    </div>
  )
}
