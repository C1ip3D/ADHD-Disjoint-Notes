import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.congressional.focusly.app",
  appName: "Focusly",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    Camera: {
      permissions: ["camera", "photos"],
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true,
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#22D3EE",
    },
  },
};

export default config;
