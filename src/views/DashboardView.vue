<template>
  <div
    class="dashboard-view min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4"
    style="padding-top: max(env(safe-area-inset-top), 1.5rem); padding-bottom: 1.5rem"
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
              <h3 class="text-xl font-bold text-gray-900">{{ authStore.userDisplayName }}</h3>
              <p class="text-sm text-gray-600">{{ authStore.user?.email }}</p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-semibold text-gray-700">Level {{ level }}</span>
              <span class="text-xs text-gray-500">{{ xp }} XP / {{ xpToNextLevel }} XP</span>
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
              <div class="text-xl font-bold text-green-600">{{ unlockedBadgesCount }}</div>
              <div class="text-xs text-gray-600">Badges Earned</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useGamificationStore } from "../stores/gamification";
import { useAuthStore } from "../stores/auth";
import Icons from "../components/Icons.vue";

const gamificationStore = useGamificationStore();
const authStore = useAuthStore();

const level = computed(() => gamificationStore.level);
const currentStreak = computed(() => gamificationStore.currentStreak);
const stats = computed(() => gamificationStore.stats);
const unlockedBadgesCount = computed(() => gamificationStore.unlockedBadges.length);
const xp = computed(() => gamificationStore.xp);
const xpToNextLevel = computed(() => gamificationStore.xpToNextLevel);
const progressPercentage = computed(() => {
  const currentLevelXP = level.value * 100;
  const xpInCurrentLevel = xp.value - currentLevelXP;
  return Math.min((xpInCurrentLevel / 100) * 100, 100);
});

onMounted(async () => {
  // Load user data in background - no blocking
  gamificationStore.loadUserData();
});
</script>
