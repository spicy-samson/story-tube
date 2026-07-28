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
  app: {
    head: {
      title: "Story Tube",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "description",
          content: "Turn a YouTube link into a polished 9:16 story card.",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        { name: "theme-color", content: "#0f1115" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
        { name: "apple-mobile-web-app-title", content: "WatchCard" },
        { property: "og:title", content: "Story Tube" },
        {
          property: "og:description",
          content: "Turn a YouTube link into a beautiful vertical story card.",
        },
        { property: "og:type", content: "website" },
      ],
      link: [
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "icon", type: "image/svg+xml", href: "/icons/icon.svg" },
        { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.svg" },
      ],
    },
  },
});
