import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.congressional.focusly.app",
  appName: "Focusly",
  webDir: "dist",
  server: {
    androidScheme: "https",
    // Disable cleartext for security
    cleartext: false,
  },
  ios: {
    // Use WKWebView optimizations for faster loading
    contentInset: "automatic",
    preferredContentMode: "mobile",
    // Disable limitsNavigationsToAppBoundDomains for faster navigation
    limitsNavigationsToAppBoundDomains: false,
    // Enable automatic scrolling
    scrollEnabled: true,
  },
  android: {
    // Enable hardware acceleration
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
      backgroundColor: "#22D3EE",
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#22D3EE",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
