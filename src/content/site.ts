/**
 * Single source for public copy & links. Keep PII out of the UI beyond what’s listed here.
 */
export const site = {
  displayName: 'bai',
  tagline: 'Interfaces, performance, craft.',
  about: {
    title: 'About',
    paragraphs: [
      'I build and ship React Native apps for iOS and Android — new features, refactors, and production fixes when timelines are tight.',
      'Most of my work sits between product UI and the native layer: custom bridges and modules when JavaScript is not enough, thoughtful moves toward the New Architecture when it pays off, and performance that still feels good on older devices and heavy screens.',
      'I care about predictable delivery too: solid CI, readable releases, and staying aligned with backend contracts so shipping stays boring in the best way.',
    ],
  },
  skills: [
    {
      label: 'Mobile & UI',
      items: ['React Native', 'React', 'Expo', 'TypeScript', 'JavaScript'],
    },
    {
      label: 'State & data',
      items: ['Redux Toolkit', 'Zustand', 'TanStack Query'],
    },
    {
      label: 'Native & platform',
      items: ['New Architecture', 'Native modules', 'iOS & Android basics'],
    },
    {
      label: 'Quality & delivery',
      items: ['Jest', 'CI/CD', 'Performance profiling', 'Git'],
    },
    {
      label: 'Web & APIs',
      items: ['Next.js', 'Node.js', 'REST', 'HTML & CSS'],
    },
  ],
  links: {
    github: 'https://github.com/habbababbai',
    linkedin: 'https://www.linkedin.com/in/habbababbai/',
    email: 'szymanski.j.dev@gmail.com',
  },
} as const
