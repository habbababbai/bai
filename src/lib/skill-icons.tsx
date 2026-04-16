import { type IconType } from 'react-icons'
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiExpo,
  SiRedux,
  SiGraphql,
  SiSwift,
  SiKotlin,
  SiDotnet,
  SiApple,
  SiAndroid,
  SiNodedotjs,
  SiFastify,
  SiNestjs,
  SiDocker,
  SiNextdotjs,
  SiFirebase,
  SiSentry,
  SiMixpanel,
  SiGoogleplay,
  SiAppstore,
  SiGithubactions,
  SiJest,
  SiGit,
  SiPosthog,
} from 'react-icons/si'
import { TbBrandReactNative, TbApi, TbAtom2 } from 'react-icons/tb'
import { VscJson } from 'react-icons/vsc'
import { BsLightningCharge, BsCodeSquare, BsBarChart, BsRocket } from 'react-icons/bs'

type SkillInfo = {
  icon: IconType
  color: string
}

const skillMap: Record<string, SkillInfo> = {
  'React Native': { icon: TbBrandReactNative, color: '#61DAFB' },
  'New Architecture': { icon: TbAtom2, color: '#61DAFB' },
  'TypeScript': { icon: SiTypescript, color: '#3178C6' },
  'JavaScript': { icon: SiJavascript, color: '#F7DF1E' },
  'Expo': { icon: SiExpo, color: '#FFFFFF' },
  'React': { icon: SiReact, color: '#61DAFB' },
  'Redux': { icon: SiRedux, color: '#764ABC' },
  'Zustand': { icon: BsLightningCharge, color: '#F59E0B' },
  'TanStack Query': { icon: VscJson, color: '#FF4154' },
  'GraphQL': { icon: SiGraphql, color: '#E10098' },
  'REST': { icon: TbApi, color: '#10B981' },
  'TurboModules': { icon: BsCodeSquare, color: '#61DAFB' },
  'Nitro modules': { icon: BsLightningCharge, color: '#8B5CF6' },
  'Swift': { icon: SiSwift, color: '#F05138' },
  'Kotlin': { icon: SiKotlin, color: '#7F52FF' },
  'C# (basics)': { icon: SiDotnet, color: '#512BD4' },
  'iOS': { icon: SiApple, color: '#FFFFFF' },
  'Android': { icon: SiAndroid, color: '#3DDC84' },
  'Node.js': { icon: SiNodedotjs, color: '#5FA04E' },
  'Fastify': { icon: SiFastify, color: '#FFFFFF' },
  'NestJS': { icon: SiNestjs, color: '#E0234E' },
  'Docker': { icon: SiDocker, color: '#2496ED' },
  'Next.js': { icon: SiNextdotjs, color: '#FFFFFF' },
  'Firebase': { icon: SiFirebase, color: '#DD2C00' },
  'Sentry': { icon: SiSentry, color: '#FB4226' },
  'Segment': { icon: BsBarChart, color: '#52BD94' },
  'Mixpanel': { icon: SiMixpanel, color: '#7856FF' },
  'PostHog': { icon: SiPosthog, color: '#F9BD2B' },
  'Google Play': { icon: SiGoogleplay, color: '#34A853' },
  'App Store': { icon: SiAppstore, color: '#0D96F6' },
  'TestFlight': { icon: BsRocket, color: '#0D96F6' },
  'CI/CD': { icon: SiGithubactions, color: '#2088FF' },
  'CodePush': { icon: BsLightningCharge, color: '#F05138' },
  'Jest': { icon: SiJest, color: '#C21325' },
  'Detox': { icon: BsCodeSquare, color: '#7B68EE' },
  'Git': { icon: SiGit, color: '#F05032' },
}

export function getSkillInfo(skill: string): SkillInfo | null {
  return skillMap[skill] ?? null
}
