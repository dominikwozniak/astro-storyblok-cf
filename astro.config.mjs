import { defineConfig } from "astro/config";
import { storyblok } from "@storyblok/astro";
import { loadEnv } from "vite";
import mkcert from "vite-plugin-mkcert";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

const env = loadEnv("", process.cwd(), "STORYBLOK");

export default defineConfig({
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_ACCESS_TOKEN,
      livePreview: process.env.PUBLIC_ENV !== "production",
      // bridge: true, // for preview
      bridge: process.env.PUBLIC_ENV !== "production",
      // bridge: false,
      components: {
        page: "storyblok/Page",
        feature: "storyblok/Feature",
        grid: "storyblok/Grid",
        teaser: "storyblok/Teaser",
      },
      apiOptions: {
        rateLimit: 100,
      },
    }),
    react(),
  ],

  vite: {
    plugins: [tailwindcss(), mkcert()],
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },
  },

  output: "server",
  adapter: cloudflare(),
  // in ideal case serve only server output for preview to have hot reload
  // output: process.env.PUBLIC_ENV === 'preview' ? 'server' : 'static',
  // adapter: process.env.PUBLIC_ENV === 'preview' ? cloudflare() : undefined,
});
