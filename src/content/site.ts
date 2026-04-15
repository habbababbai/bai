/**
 * Single source for public copy & links. Keep PII out of the UI beyond what’s listed here.
 */
export const site = {
  displayName: 'bai',
  tagline: 'Interfaces, performance, craft.',
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
