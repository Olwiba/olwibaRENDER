type ProjectThemeConfig = {
  id: string
  label: string
  brandAccent: {
    hex: string
    lightOklch: string
    darkOklch: string
  }
  theme: {
    initialDocsTheme: string
  }
}

export const projectConfig = {
  id: "olwibaRENDER",
  label: "olwibaRENDER",
  brandAccent: {
    hex: "#a855f7",
    lightOklch: "oklch(0.627 0.265 303.9)",
    darkOklch: "oklch(0.714 0.203 303.9)",
  },
  theme: {
    initialDocsTheme: "purple",
  },
} as const satisfies ProjectThemeConfig

export const projectThemeStyleCss = `:root {
  --project-brand-accent: ${projectConfig.brandAccent.lightOklch};
  --project-brand-accent-dark: ${projectConfig.brandAccent.darkOklch};
}`

export const projectBanner = {
  segments: [
    { text: "olwiba", colorHex: projectConfig.brandAccent.hex },
    { text: "RENDER" },
  ],
}
