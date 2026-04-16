/**
 * Single source for public copy & links. Keep PII out of the UI beyond what’s listed here.
 */
export const site = {
    displayName: "bai",
    tagline: "React Native Developer — JS, Swift, Kotlin.",
    about: {
        title: "About",
        paragraphs: [
            "I work on React Native apps: shipping features, fixing what breaks, bumping versions, and refactoring when the codebase needs it. I’m fine in TypeScript/JavaScript and I write native code when the problem isn’t solvable in JS alone.",
            "Outside the JS layer I’ve done native modules, releases, hooking into APIs, analytics, push — the normal overhead around a shipped app.",
            "I’m fine owning RN work end to end and coordinating with iOS, Android, and backend.",
        ],
    },
    skills: [
        {
            label: "React Native & JS",
            items: [
                "React Native",
                "New Architecture",
                "TypeScript",
                "JavaScript",
                "Expo",
                "React",
            ],
        },
        {
            label: "State & APIs",
            items: ["Redux", "Zustand", "TanStack Query", "GraphQL", "REST"],
        },
        {
            label: "Native & languages",
            items: [
                "TurboModules",
                "Nitro modules",
                "Swift",
                "Kotlin",
                "C# (basics)",
                "iOS",
                "Android",
            ],
        },
        {
            label: "Node & backend",
            items: ["Node.js", "Fastify", "NestJS", "Docker", "Next.js"],
        },
        {
            label: "Firebase & analytics",
            items: ["Firebase", "Sentry", "Segment", "Mixpanel", ],
        },
        {
            label: "Release & quality",
            items: [
                "Google Play",
                "App Store",
                "TestFlight",
                "CI/CD",
                "CodePush",
                "Jest",
                "Detox",
                "Git",
            ],
        },
    ],
    links: {
        github: "https://github.com/habbababbai",
        linkedin: "https://www.linkedin.com/in/habbababbai/",
        email: "szymanski.j.dev@gmail.com",
    },
} as const;
