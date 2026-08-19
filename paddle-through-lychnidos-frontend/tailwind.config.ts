import type { Config } from "tailwindcss";

// Tailwind CSS v4 reads design tokens (colors, fonts) from the `@theme`
// block in src/index.css — that is the source of truth for this project's
// palette. This file exists for editor tooling / IntelliSense and for any
// future config (plugins, safelist) that isn't expressible via `@theme`.
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
} satisfies Config;
