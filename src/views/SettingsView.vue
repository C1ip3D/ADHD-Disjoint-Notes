<template>
  <div
    class="settings-view min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-6"
  >
    <!-- Header -->
    <div class="max-w-3xl mx-auto mb-6">
      <div class="flex items-center gap-4 mb-2">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <svg
            class="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
      </div>
    </div>

    <!-- Settings Content -->
    <div class="max-w-3xl mx-auto space-y-4">
      <!-- Account Section -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Account</h2>
              <p class="text-sm text-gray-500">Manage your account settings</p>
            </div>
          </div>

          <!-- User Info -->
          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-500 mb-1">Signed in as</p>
            <p class="text-sm font-medium text-gray-900">
              {{ authStore.user?.email }}
            </p>
            <p class="text-xs text-gray-500 mt-2">Display Name</p>
            <p class="text-sm font-medium text-gray-900">
              {{ authStore.userDisplayName }}
            </p>
          </div>

          <!-- Sign Out Button -->
          <button
            @click="handleSignOut"
            :disabled="isSigningOut"
            class="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isSigningOut">Sign Out</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg
                class="animate-spin h-5 w-5 text-white"
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
              Signing out...
            </span>
          </button>
        </div>
      </div>
      <!-- Canvas Settings Section -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Canvas Settings</h2>
              <p class="text-sm text-gray-500">
                Manage your Canvas LMS integration
              </p>
            </div>
          </div>

          <!-- Canvas Status -->
          <div class="mb-4">
            <div
              v-if="isCanvasConnected"
              class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <svg
                class="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium text-green-800">
                Canvas Connected
              </span>
            </div>
            <div
              v-else
              class="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <svg
                class="w-5 h-5 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium text-yellow-800">
                Canvas Not Connected
              </span>
            </div>
          </div>

          <!-- Canvas Info (if connected) -->
          <div v-if="isCanvasConnected" class="mb-4 space-y-2">
            <div
              class="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">Canvas URL</p>
                <p class="text-sm font-medium text-gray-900 break-all">
                  {{ settingsStore.settings.canvasUrl }}
                </p>
              </div>
            </div>
            <div
              class="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">Connected Courses</p>
                <p class="text-sm font-medium text-gray-900">
                  {{ settingsStore.settings.canvasCourses.length }} courses
                </p>
              </div>
            </div>
            <div
              v-if="settingsStore.settings.canvasLastSync"
              class="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">Last Synced</p>
                <p class="text-sm font-medium text-gray-900">
                  {{ formatDate(settingsStore.settings.canvasLastSync) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Canvas Actions -->
          <div class="flex flex-col gap-3">
            <button
              v-if="!isCanvasConnected"
              @click="showCanvasSetup = true"
              class="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              Connect Canvas
            </button>
            <button
              v-else
              @click="showCanvasSetup = true"
              class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Update Canvas Settings
            </button>
            <button
              v-if="isCanvasConnected"
              @click="handleDisconnectCanvas"
              class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Disconnect Canvas
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Canvas Setup Modal -->
    <CanvasSetupModal
      :show="showCanvasSetup"
      @close="showCanvasSetup = false"
      @success="handleCanvasSuccess"
    />

    <!-- Confirmation Dialog for Disconnect -->
    <div
      v-if="showDisconnectConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showDisconnectConfirm = false"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-3">Disconnect Canvas?</h3>
        <p class="text-gray-600 mb-6">
          This will remove your Canvas URL, token, and course information. You
          can reconnect at any time.
        </p>
        <div class="flex gap-3">
          <button
            @click="showDisconnectConfirm = false"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            @click="confirmDisconnectCanvas"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useSettingsStore } from "../stores/settings";
import { useCanvasStore } from "../stores/canvas";

const CanvasSetupModal = defineAsyncComponent(
  () => import("../components/CanvasSetupModal.vue")
);

const router = useRouter();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const canvasStore = useCanvasStore();

const isSigningOut = ref(false);
const showCanvasSetup = ref(false);
const showDisconnectConfirm = ref(false);

const isCanvasConnected = computed(() => {
  return (
    settingsStore.settings.canvasSetupCompleted &&
    settingsStore.settings.canvasUrl.length > 0
  );
});

async function handleSignOut() {
  if (isSigningOut.value) return;

  try {
    isSigningOut.value = true;
    await authStore.logout();
    router.push({ name: "home" });
  } catch (error) {
    console.error("Error signing out:", error);
    alert("Failed to sign out. Please try again.");
  } finally {
    isSigningOut.value = false;
  }
}

function handleDisconnectCanvas() {
  showDisconnectConfirm.value = true;
}

function confirmDisconnectCanvas() {
  settingsStore.clearCanvasSettings();
  canvasStore.clearData();
  showDisconnectConfirm.value = false;
}

function handleCanvasSuccess() {
  showCanvasSetup.value = false;
}

function formatDate(date: Date | null): string {
  if (!date) return "Never";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return d.toLocaleDateString();
}
</script>

<style scoped>
.settings-view {
  min-height: 100vh;
}
</style>
