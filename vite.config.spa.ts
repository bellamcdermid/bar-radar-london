import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    spa: { enabled: true, prerender: { outputPath: "/index" } },
  },
  nitro: false,
  vite: { preview: { host: "127.0.0.1" } },
});
