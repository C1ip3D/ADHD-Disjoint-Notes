import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.congressional.focusly.app",
  appName: "Focusly",
  webDir: "dist",
  server: {
    androidScheme: "https",
    cleartext: false,
  },
  ios: {
    contentInset: "never",
    preferredContentMode: "mobile",
    limitsNavigationsToAppBoundDomains: false,
    scrollEnabled: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
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
      backgroundColor: "#ffffff",
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#266dd3",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
