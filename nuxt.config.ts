const themeScript = `(() => {
  let stored = null

  try {
    stored = localStorage.getItem('posterize-theme')
  } catch {}

  const prefersDark = typeof matchMedia === 'function'
    && matchMedia('(prefers-color-scheme: dark)').matches
  const theme = stored === 'light' || stored === 'dark'
    ? stored
    : prefersDark ? 'dark' : 'light'

  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
})()`

export default defineNuxtConfig({
  compatibilityDate: "2026-07-28",
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    cssPath: "~/assets/css/main.css",
  },
  devtools: { enabled: false },
  nitro: {
    preset: "cloudflare_pages",
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  routeRules: {
    "/**": {
      headers: {
        "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    },
  },
  app: {
    head: {
      title: "Posterize",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "description",
          content: "Turn any public YouTube video into a polished, Instagram-ready story.",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        {
          id: "theme-color",
          name: "theme-color",
          content: "#f6f7f8",
        },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
        { name: "apple-mobile-web-app-title", content: "Posterize" },
        { property: "og:title", content: "Posterize" },
        {
          property: "og:description",
          content: "Make YouTube links worth sharing. Paste a video, pick a poster, and share it in HD.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://posterize.pages.dev" },
        { property: "og:image", content: "https://posterize.pages.dev/og-posterize.png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Posterize" },
        { name: "twitter:description", content: "Make YouTube links worth sharing. Paste a video, pick a poster, and share it in HD." },
        { name: "twitter:image", content: "https://posterize.pages.dev/og-posterize.png" },
      ],
      link: [
        { rel: "canonical", href: "https://posterize.pages.dev" },
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "icon", type: "image/svg+xml", href: "/icons/icon.svg" },
        { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.svg" },
      ],
      script: [
        {
          innerHTML: themeScript,
          tagPosition: "head",
        },
      ],
    },
  },
});
