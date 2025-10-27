import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const apiKey = ref<string>("");
  const isApiKeySet = computed(() => apiKey.value.length > 0);

  // Load API key from localStorage on init
  const storedKey = localStorage.getItem("openai_api_key");
  if (storedKey) {
    apiKey.value = storedKey;
  }

  function setApiKey(key: string) {
    apiKey.value = key;
    if (key) {
      localStorage.setItem("openai_api_key", key);
    } else {
      localStorage.removeItem("openai_api_key");
    }
  }

  function clearApiKey() {
    apiKey.value = "";
    localStorage.removeItem("openai_api_key");
  }

  return {
    apiKey,
    isApiKeySet,
    setApiKey,
    clearApiKey,
  };
});

