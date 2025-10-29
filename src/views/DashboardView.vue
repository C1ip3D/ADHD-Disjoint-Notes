<template>
  <div
    class="dashboard-view min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4"
    style="
      padding-top: max(env(safe-area-inset-top), 1.5rem);
      padding-bottom: 1.5rem;
    "
  >
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
              <p class="text-sm text-gray-600">{{ authStore.user?.email }}</p>
            </div>
            <button
              v-if="!hasCanvasCourses"
              @click="showCanvasSetup = true"
              class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
            >
              <svg
                class="w-4 h-4"
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
              Setup Canvas
            </button>
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
              <div class="text-xl font-bold text-blue-600">{{ xp }}</div>
              <div class="text-xs text-gray-600">Total XP</div>
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

      <!-- My Classes (Canvas Integration) -->
      <div v-if="hasCanvasCourses">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-900">My Classes</h2>
          <div class="flex items-center gap-2">
            <button
              @click="showCanvasSetup = true"
              class="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Re-sync
            </button>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-5">
          <div class="flex flex-wrap gap-2">
            <router-link
              v-for="course in canvasCourses"
              :key="course.id"
              :to="{ name: 'editor', query: { subject: course.name } }"
              class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all text-sm font-medium shadow-md hover:shadow-lg"
            >
              {{ course.name }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Canvas Setup Prompt (if not set up) -->
      <div v-else-if="!canvasSetupCompleted">
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

      <!-- Due Soon Widget (Canvas Assignments) -->
      <DueSoonWidget v-if="hasCanvasCourses" />

      <!-- Quick Actions -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <router-link
            to="/editor"
            class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-5 hover:shadow-xl hover:scale-105 transition-all group"
          >
            <Icons name="notes" class="w-10 h-10 mb-2" />
            <h3 class="font-bold mb-1">Take Notes</h3>
            <p class="text-xs opacity-90">Start capturing ideas</p>
          </router-link>

          <router-link
            to="/flashcards"
            class="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-5 hover:shadow-xl hover:scale-105 transition-all group"
          >
            <Icons name="flashcard" class="w-10 h-10 mb-2" />
            <h3 class="font-bold mb-1">Flashcards</h3>
            <p class="text-xs opacity-90">Review your cards</p>
          </router-link>

          <router-link
            to="/focus"
            class="bg-gradient-to-br from-cyan-500 to-teal-500 text-white rounded-xl shadow-lg p-5 hover:shadow-xl hover:scale-105 transition-all group"
          >
            <Icons name="timer" class="w-10 h-10 mb-2" />
            <h3 class="font-bold mb-1">Focus Timer</h3>
            <p class="text-xs opacity-90">Start a session</p>
          </router-link>

          <router-link
            v-if="hasCanvasCourses"
            to="/canvas"
            class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-5 hover:shadow-xl hover:scale-105 transition-all group"
          >
            <svg
              class="w-10 h-10 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              ></path>
            </svg>
            <h3 class="font-bold mb-1">Canvas</h3>
            <p class="text-xs opacity-90">Grades & assignments</p>
          </router-link>

          <router-link
            to="/learning-center"
            class="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl shadow-lg p-5 hover:shadow-xl hover:scale-105 transition-all group"
          >
            <svg
              class="w-10 h-10 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 class="font-bold mb-1">Learning Center</h3>
            <p class="text-xs opacity-90">Watch study tips</p>
          </router-link>
        </div>
      </div>
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

function handleCanvasSkip() {
  showCanvasSetup.value = false;
  // Don't mark as completed if skipped - user might want to set it up later
}

function handleCanvasSuccess() {
  showCanvasSetup.value = false;
}

onMounted(async () => {
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
