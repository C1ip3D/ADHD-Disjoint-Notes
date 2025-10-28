import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuthStore } from "./auth";

export interface UserSettings {
  // Visual settings
  font: "inter" | "dyslexic" | "atkinson";
  fontSize: number; // 14, 16, 18, 20
  highContrast: boolean;
  reducedMotion: boolean;
  darkMode: boolean;
  lineSpacing: number; // 1.5, 1.75, 2.0

  // Study preferences
  defaultNoteFormat: "text" | "outline" | "mindmap";
  showWeakZones: boolean;
  autoGenerateFlashcards: boolean;

  // Focus timer
  focusDuration: number; // minutes
  breakDuration: number; // minutes
  autoStartBreaks: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  font: "inter",
  fontSize: 16,
  highContrast: false,
  reducedMotion: false,
  darkMode: false,
  lineSpacing: 1.5,
  defaultNoteFormat: "text",
  showWeakZones: true,
  autoGenerateFlashcards: false,
  focusDuration: 25,
  breakDuration: 5,
  autoStartBreaks: false,
  soundEnabled: true,
  hapticEnabled: true,
};

export const useSettingsStore = defineStore("settings", () => {
  const authStore = useAuthStore();
  const settings = ref<UserSettings>({ ...DEFAULT_SETTINGS });
  const loading = ref(false);

  // Load settings
  async function loadSettings() {
    if (!authStore.user) {
      // Load from localStorage if not logged in
      const saved = localStorage.getItem("userSettings");
      if (saved) {
        settings.value = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
      applySettings();
      return;
    }

    loading.value = true;

    try {
      const userId = authStore.user.uid;
      const settingsRef = doc(db, `users/${userId}/profile/settings`);
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        settings.value = {
          ...DEFAULT_SETTINGS,
          ...settingsDoc.data(),
        } as UserSettings;
      } else {
        // Initialize with defaults
        await saveSettings();
      }

      applySettings();
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      loading.value = false;
    }
  }

  // Save settings
  async function saveSettings() {
    // Always save to localStorage
    localStorage.setItem("userSettings", JSON.stringify(settings.value));

    if (!authStore.user) return;

    try {
      const userId = authStore.user.uid;
      const settingsRef = doc(db, `users/${userId}/profile/settings`);
      await setDoc(settingsRef, settings.value);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }

  // Update setting
  async function updateSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    settings.value[key] = value;
    await saveSettings();
    applySettings();
  }

  // Apply settings to DOM
  function applySettings() {
    const root = document.documentElement;
    const body = document.body;

    // Font
    body.className = body.className.replace(/font-\w+/g, "");
    body.classList.add(`font-${settings.value.font}`);

    // Font size
    root.style.setProperty("--font-size", `${settings.value.fontSize}px`);

    // Line spacing
    root.style.setProperty("--line-spacing", settings.value.lineSpacing.toString());

    // High contrast
    if (settings.value.highContrast) {
      body.classList.add("high-contrast");
    } else {
      body.classList.remove("high-contrast");
    }

    // Reduced motion
    if (settings.value.reducedMotion) {
      body.classList.add("reduce-motion");
    } else {
      body.classList.remove("reduce-motion");
    }

    // Dark mode
    if (settings.value.darkMode) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }

  // Reset to defaults
  async function resetToDefaults() {
    settings.value = { ...DEFAULT_SETTINGS };
    await saveSettings();
    applySettings();
  }

  // Watch for changes
  watch(
    settings,
    () => {
      applySettings();
    },
    { deep: true }
  );

  return {
    settings,
    loading,
    loadSettings,
    saveSettings,
    updateSetting,
    resetToDefaults,
    applySettings,
  };
});
