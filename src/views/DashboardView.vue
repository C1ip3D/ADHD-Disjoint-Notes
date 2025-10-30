<template>
  <div
    class="dashboard-view min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4"
    @click="dismissKeyboard"
    style="
      padding-top: max(env(safe-area-inset-top), 1.5rem);
      padding-bottom: 1.5rem;
    "
  >
    <div>
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <router-link
          to="/editor"
          class="bg-white text-secondary rounded-xl shadow-lg p-3 hover:shadow-xl hover:scale-105 transition-all group"
        >
          <h3 class="font-bold mb-1">Take Notes</h3>
          <p class="text-xs opacity-90">Start capturing ideas</p>
        </router-link>

        <router-link
          v-if="hasCanvasCourses"
          to="/canvas"
          class="bg-white text-secondary rounded-xl shadow-lg p-3 hover:shadow-xl hover:scale-105 transition-all group"
        >
          <h3 class="font-bold mb-1">Canvas</h3>
          <p class="text-xs opacity-90">Grades & assignments</p>
        </router-link>

        <router-link
          to="/learning-center"
          class="bg-white text-secondary rounded-xl shadow-lg p-3 hover:shadow-xl hover:scale-105 transition-all group"
        >
          <h3 class="font-bold mb-1">Learning Center</h3>
          <p class="text-xs opacity-90">Watch study tips</p>
        </router-link>

        <router-link
          to="/ai-chat"
          class="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-3 hover:shadow-xl hover:scale-105 transition-all group text-left relative overflow-hidden animate-shimmer block"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-effect pointer-events-none"
          ></div>

          <h3 class="font-bold">AI Chat</h3>
          <p class="text-xs opacity-90 relative">Ask anything</p>
        </router-link>
      </div>
    </div>
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Profile Section -->
      <div>
        <div class="bg-white rounded-xl shadow-lg p-6">
          <!-- User Avatar and Name -->
          <div class="flex items-center gap-4 mb-6">
            <div
              class="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <span class="text-2xl font-bold text-white">
                {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900">
                {{ authStore.userDisplayName }}
              </h3>
            </div>
            <router-link
              to="/settings"
              class="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg transition-all text-sm font-medium"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </router-link>
          </div>

          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-semibold text-gray-700"
                >Level {{ level }}</span
              >
              <span class="text-xs text-gray-500"
                >{{ xp }} XP / {{ xpToNextLevel }} XP</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                class="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-center gap-1">
                <svg
                  class="w-5 h-5 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clip-rule="evenodd"
                  />
                </svg>
                <div class="text-xl font-bold text-orange-600">
                  {{ currentStreak }}
                </div>
              </div>
              <div class="text-xs text-gray-600">Day Streak</div>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="text-xl font-bold text-green-600">
                {{ unlockedBadgesCount }}
              </div>
              <div class="text-xs text-gray-600">Badges Earned</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Canvas Setup Prompt (if not set up) -->
      <div v-if="!canvasSetupCompleted">
        <div
          class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"
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
            <div class="flex-1">
              <h3 class="font-bold text-xl mb-2">Connect Your Classes</h3>
              <p class="text-sm text-white/90 mb-4">
                Sync with Canvas LMS to automatically organize your notes by
                class and see your courses here.
              </p>
              <button
                @click="showCanvasSetup = true"
                class="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium shadow-lg"
              >
                Connect Canvas
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->

      <!-- Due Soon Widget (Canvas Assignments) -->
      <DueSoonWidget v-if="hasCanvasCourses" />
    </div>

    <!-- Canvas Setup Modal -->
    <CanvasSetupModal
      :show="showCanvasSetup"
      @close="showCanvasSetup = false"
      @skip="handleCanvasSkip"
      @success="handleCanvasSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, defineAsyncComponent } from "vue";
import { useGamificationStore } from "../stores/gamification";
import { useAuthStore } from "../stores/auth";
import { useSettingsStore } from "../stores/settings";
import Icons from "../components/Icons.vue";
import DueSoonWidget from "../components/DueSoonWidget.vue";
import { Keyboard } from "@capacitor/keyboard";

// Lazy load Canvas modal only when needed
const CanvasSetupModal = defineAsyncComponent(
  () => import("../components/CanvasSetupModal.vue")
);

const gamificationStore = useGamificationStore();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const showCanvasSetup = ref(false);

const level = computed(() => gamificationStore.level);
const currentStreak = computed(() => gamificationStore.currentStreak);
const stats = computed(() => gamificationStore.stats);
const unlockedBadgesCount = computed(
  () => gamificationStore.unlockedBadges.length
);
const xp = computed(() => gamificationStore.xp);
const xpToNextLevel = computed(() => gamificationStore.xpToNextLevel);
const progressPercentage = computed(() => {
  const currentLevelXP = level.value * 100;
  const xpInCurrentLevel = xp.value - currentLevelXP;
  return Math.min((xpInCurrentLevel / 100) * 100, 100);
});

// Canvas integration
const hasCanvasCourses = computed(
  () => settingsStore.settings.canvasCourses.length > 0
);
const canvasCourses = computed(() =>
  settingsStore.settings.canvasCourses.slice(0, 6)
); // Show max 6
const canvasSetupCompleted = computed(
  () => settingsStore.settings.canvasSetupCompleted
);

function dismissKeyboard(event?: Event) {
  const target = event?.target as HTMLElement | undefined;
  // If tapping on inputs or interactive controls, do nothing
  if (
    target &&
    target.closest(
      'input, textarea, [contenteditable="true"], select, .ql-editor'
    )
  ) {
    return;
  }
  const active = document.activeElement as HTMLElement | null;
  if (
    active &&
    (active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.isContentEditable ||
      active.tagName === "SELECT")
  ) {
    active.blur();
  }
  // Try Capacitor keyboard hide when available
  try {
    // @ts-ignore - gracefully ignore if not on a device
    Keyboard.hide && Keyboard.hide();
  } catch (_) {
    // no-op
  }
}

function handleCanvasSkip() {
  showCanvasSetup.value = false;
  // Don't mark as completed if skipped - user might want to set it up later
}

function handleCanvasSuccess() {
  showCanvasSetup.value = false;
}

onMounted(async () => {
  try {
    // @ts-ignore optional API; safe to call if available in host
    Keyboard.setScroll({ isDisabled: true }); // prevent viewport jump; improves blur reliability
  } catch (_) {}

  // Load user data in background - no blocking
  gamificationStore.loadUserData();
  settingsStore.loadSettings();

  // Show Canvas setup on first visit if not completed
  // Only auto-show if user has never seen it before (no canvas URL set at all)
  setTimeout(() => {
    const hasNeverSetup =
      !settingsStore.settings.canvasSetupCompleted &&
      !settingsStore.settings.canvasUrl;
    if (hasNeverSetup) {
      showCanvasSetup.value = true;
    }
  }, 1000);
});
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.shimmer-effect {
  animation: shimmer 3s infinite;
}
</style>
