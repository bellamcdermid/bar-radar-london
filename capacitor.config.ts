import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "uk.hotornotpubs",
  appName: "Hot Or Not Pubs",
  // The SPA build (vite.config.spa.ts) emits here. Capacitor's iOS router
  // resolves any extensionless path to <webDir>/index.html, which is what
  // makes deep links like /map and /pubs/<placeId> survive a cold start.
  webDir: "dist/client",
  ios: {
    contentInset: "always",
  },
};

export default config;
