<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all"
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 text-white">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">Settings</h2>
              <button
                @click="closeModal"
                class="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            <!-- API Key Section -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key
              </label>
              <div class="relative">
                <input
                  v-model="localApiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  placeholder="sk-..."
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  @click="showApiKey = !showApiKey"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg v-if="!showApiKey" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                </button>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                Your API key is stored locally and never sent to our servers.
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-700 underline"
                >
                  Get your key here
                </a>
              </p>
            </div>

            <!-- Status -->
            <div
              v-if="settingsStore.isApiKeySet"
              class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl"
            >
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span class="text-sm text-green-700 font-medium">API Key configured</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 flex gap-3">
            <button
              v-if="settingsStore.isApiKeySet"
              @click="clearKey"
              class="flex-1 px-4 py-2.5 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors font-medium"
            >
              Clear Key
            </button>
            <button
              @click="saveKey"
              :disabled="!localApiKey.trim()"
              class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useSettingsStore } from "../stores/settings";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const settingsStore = useSettingsStore();
const localApiKey = ref(settingsStore.apiKey);
const showApiKey = ref(false);

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      localApiKey.value = settingsStore.apiKey;
    }
  }
);

function closeModal() {
  emit("update:modelValue", false);
}

function saveKey() {
  settingsStore.setApiKey(localApiKey.value);
  closeModal();
}

function clearKey() {
  settingsStore.clearApiKey();
  localApiKey.value = "";
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
  opacity: 0;
}
</style>

