/**
 * Single source for public copy & links. Keep PII out of the UI beyond what’s listed here.
 */
export const site = {
    displayName: "bai",
    tagline: "Javascript Developer: React Native",
    about: {
        title: "About",
        paragraphs: [
            "I work on React Native apps: shipping features, fixing what breaks, bumping versions, and refactoring when the codebase needs it. I’m fine in TypeScript/JavaScript and I write native code when the problem isn’t solvable in JS alone.",
            "Outside the JS layer I’ve done native modules, releases, hooking into APIs, analytics, push — the normal overhead around a shipped app.",
            "I’m fine owning RN work end to end and coordinating with iOS, Android, and backend.",
            "While React Native is my main focus, in free time I work on hobby projects with mostly Javascript. I'm familiar with implementing Web in React, as well Node.js backend side and handling monorepos with multiple applications.",
        ],
    },
    skills: [
        {
            label: "Mobile & frontend",
            items: [
                "React Native",
                "React",
                "Expo",
                "Expo EAS",
                "TypeScript",
                "JavaScript",
                "New Architecture",
            ],
        },
        {
            label: "State, APIs & realtime",
            items: [
                "Redux Toolkit",
                "RTK Query",
                "Zustand",
                "TanStack Query",
                "GraphQL",
                "REST",
                "WebSockets",
                "Postman",
            ],
        },
        {
            label: "Native modules & platform",
            items: [
                "TurboModules",
                "Nitro modules",
                "iOS",
                "Android",
                "Xcode",
                "Android Studio",
            ],
        },
        {
            label: "Native languages",
            items: ["Swift", "Kotlin", "C# (basics)"],
        },
        {
            label: "Backend & web",
            items: [
                "Node.js",
                "Fastify",
                "NestJS",
                "Next.js",
                "PostgreSQL",
                "SQLite",
                "MSSQL",
                "Discord.js",
                "Docker",
            ],
        },
        {
            label: "Analytics & product",
            items: ["Firebase", "Sentry", "Segment", "Mixpanel"],
        },
        {
            label: "Testing & quality",
            items: [
                "Jest",
                "React Testing Library",
                "React Native Testing Library",
                "Detox",
                "Git",
            ],
        },
        {
            label: "Release & delivery",
            items: [
                "CI/CD",
                "GitHub Actions",
                "CodePush",
                "TestFlight",
                "App Store",
                "Google Play",
            ],
        },
        {
            label: "Tooling, design & AI",
            items: ["Tailwind CSS", "Figma", "Cursor", "Claude"],
        },
    ],
    links: {
        github: "https://github.com/habbababbai",
        linkedin: "https://www.linkedin.com/in/habbababbai/",
        email: "szymanski.j.dev@gmail.com",
    },
} as const;
