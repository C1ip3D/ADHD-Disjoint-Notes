<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        @click.self="skipSetup"
      >
        <div
          class="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <!-- Header -->
          <div
            class="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6 text-white"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-2xl">Connect Canvas LMS</h3>
                <p class="text-sm text-white/90">
                  Sync your classes automatically
                </p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8">
            <p class="text-gray-600 mb-6">
              Connect your Canvas account to automatically sync your classes.
              You'll be able to organize notes by your actual courses!
            </p>

            <!-- Canvas URL Input -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Canvas Institution URL
              </label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                >
                  https://
                </span>
                <input
                  v-model="canvasUrl"
                  type="text"
                  placeholder="dublinusd.instructure.com"
                  class="w-full pl-16 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  :disabled="isLoading"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Your school's Canvas domain (e.g., school.instructure.com)
              </p>
            </div>

            <!-- Access Token Input -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Personal Access Token
              </label>
              <input
                v-model="accessToken"
                type="password"
                placeholder="Paste your Canvas access token here"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                :disabled="isLoading"
              />
              <details class="mt-2">
                <summary
                  class="text-xs text-blue-600 cursor-pointer hover:text-blue-700"
                >
                  How do I get my access token?
                </summary>
                <div
                  class="mt-2 p-3 bg-blue-50 rounded-lg text-xs text-gray-700 space-y-1"
                >
                  <p>1. Log into Canvas</p>
                  <p>2. Click "Account" → "Settings"</p>
                  <p>3. Scroll to "Approved Integrations"</p>
                  <p>4. Click "+ New Access Token"</p>
                  <p>5. Give it a name (e.g., "Focusly App") and generate</p>
                  <p>6. Copy the token and paste it here</p>
                </div>
              </details>
            </div>

            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-start">
                <svg
                  class="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p class="text-sm text-red-800">{{ errorMessage }}</p>
              </div>
            </div>

            <!-- Success Message -->
            <div
              v-if="successMessage"
              class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div class="flex items-start">
                <svg
                  class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p class="text-sm text-green-800">{{ successMessage }}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                @click="skipSetup"
                :disabled="isLoading"
                class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
              >
                Skip for Now
              </button>
              <button
                @click="connectCanvas"
                :disabled="
                  !canvasUrl.trim() || !accessToken.trim() || isLoading
                "
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ isLoading ? "Connecting..." : "Connect Canvas" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSettingsStore } from "../stores/settings";

interface Props {
  show: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  skip: [];
  success: [];
}>();

const settingsStore = useSettingsStore();
const canvasUrl = ref("");
const accessToken = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

async function connectCanvas() {
  if (!canvasUrl.value.trim() || !accessToken.value.trim()) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Lazy load Canvas service
    const { createCanvasService } = await import("../services/canvasLMS");

    // Create Canvas service
    const canvasService = createCanvasService(
      canvasUrl.value,
      accessToken.value
    );

    // Validate credentials first
    const isValid = await canvasService.validateCredentials();
    if (!isValid) {
      errorMessage.value =
        "Invalid Canvas credentials. Please check your URL and access token.";
      isLoading.value = false;
      return;
    }

    // Fetch courses
    const courses = await canvasService.fetchCourses();

    if (courses.length === 0) {
      errorMessage.value =
        "No active courses found. Make sure you're enrolled in at least one course.";
      isLoading.value = false;
      return;
    }

    // Save to settings store
    await settingsStore.updateCanvasSettings(
      canvasUrl.value,
      accessToken.value,
      courses.map((c) => ({
        id: c.id,
        name: c.name,
        course_code: c.course_code,
      }))
    );

    successMessage.value = `Successfully connected! Found ${
      courses.length
    } course${courses.length !== 1 ? "s" : ""}.`;

    // Close modal after brief delay
    setTimeout(() => {
      emit("success");
      emit("close");
    }, 1500);
  } catch (error: any) {
    console.error("Canvas setup error:", error);
    errorMessage.value =
      error.message || "Failed to connect to Canvas. Please try again.";
  } finally {
    isLoading.value = false;
  }
}

function skipSetup() {
  if (isLoading.value) return;
  emit("skip");
  emit("close");
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
