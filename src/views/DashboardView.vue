<template>
  <div
    class="dashboard-view min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 px-4"
  >
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Your personalized learning insights</p>
      </div>

      <!-- ML Predictions -->
      <div v-if="predictions" class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900">📊 AI Insights</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Best Note Format -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="text-3xl mb-3">📝</div>
            <h3 class="font-semibold text-gray-900 mb-2">Best Note Format</h3>
            <p class="text-gray-600 text-sm mb-3">
              Based on your quiz performance,
              <strong class="text-purple-600">{{
                predictions.noteFormat.recommendedFormat
              }}</strong>
              works best for you!
            </p>
            <div class="text-xs text-gray-500">
              {{ Math.round(predictions.noteFormat.confidence * 100) }}% confidence
            </div>
          </div>

          <!-- Optimal Study Time -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="text-3xl mb-3">⏰</div>
            <h3 class="font-semibold text-gray-900 mb-2">Best Study Times</h3>
            <p class="text-gray-600 text-sm mb-3">You're most productive at:</p>
            <div class="flex gap-2">
              <span
                v-for="hour in predictions.optimalTime.topHours.slice(0, 3)"
                :key="hour"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
              >
                {{ formatHour(hour) }}
              </span>
            </div>
          </div>

          <!-- Attention Zones -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="text-3xl mb-3">⚠️</div>
            <h3 class="font-semibold text-gray-900 mb-2">Review Focus Areas</h3>
            <p class="text-gray-600 text-sm">
              {{
                predictions.attentionZones.weakSections.length > 0
                  ? `You have ${predictions.attentionZones.weakSections.length} sections that need extra review`
                  : "Great! No weak areas detected"
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Gamification Stats -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900">🏆 Your Progress</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            class="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg p-6"
          >
            <div class="text-4xl font-bold mb-2">{{ level }}</div>
            <div class="text-sm opacity-90">Current Level</div>
            <div class="text-xs mt-2 opacity-75">{{ xp }} / {{ xpToNextLevel }} XP</div>
          </div>

          <div
            class="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-lg p-6"
          >
            <div class="text-4xl font-bold mb-2">🔥 {{ currentStreak }}</div>
            <div class="text-sm opacity-90">Day Streak</div>
            <div class="text-xs mt-2 opacity-75">Keep it up!</div>
          </div>

          <div
            class="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg p-6"
          >
            <div class="text-4xl font-bold mb-2">{{ stats.focusSessionsCompleted }}</div>
            <div class="text-sm opacity-90">Focus Sessions</div>
            <div class="text-xs mt-2 opacity-75">Total completed</div>
          </div>

          <div
            class="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl shadow-lg p-6"
          >
            <div class="text-4xl font-bold mb-2">{{ unlockedBadgesCount }}</div>
            <div class="text-sm opacity-90">Badges Earned</div>
            <div class="text-xs mt-2 opacity-75">
              {{ BADGES.length - unlockedBadgesCount }} to go
            </div>
          </div>
        </div>
      </div>

      <!-- Badges Showcase -->
      <div v-if="unlockedBadges.length > 0" class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900">🎖️ Your Badges</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="badge in BADGES"
            :key="badge.id"
            class="bg-white rounded-2xl shadow-lg p-4 text-center transition-all"
            :class="badge.unlocked ? 'hover:scale-105' : 'opacity-40 grayscale'"
          >
            <div class="text-4xl mb-2">{{ badge.icon }}</div>
            <div class="text-sm font-medium text-gray-900">{{ badge.name }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ badge.description }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/flashcards"
          class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-center group"
        >
          <div class="text-4xl mb-3">🃏</div>
          <h3
            class="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors"
          >
            Study Flashcards
          </h3>
          <p class="text-sm text-gray-600">Review and master your cards</p>
        </router-link>

        <router-link
          to="/focus"
          class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-center group"
        >
          <div class="text-4xl mb-3">⏱️</div>
          <h3 class="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            Focus Session
          </h3>
          <p class="text-sm text-gray-600">Start a Pomodoro timer</p>
        </router-link>

        <router-link
          to="/editor"
          class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-center group"
        >
          <div class="text-4xl mb-3">📝</div>
          <h3 class="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
            Take Notes
          </h3>
          <p class="text-sm text-gray-600">Create new study material</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useGamificationStore, BADGES } from "../stores/gamification";
import { useAnalyticsStore } from "../stores/analytics";
import { MLEngine } from "../services/mlEngine";

const gamificationStore = useGamificationStore();
const analyticsStore = useAnalyticsStore();

const predictions = ref<any>(null);
const loading = ref(true);

const level = computed(() => gamificationStore.level);
const xp = computed(() => gamificationStore.xp);
const xpToNextLevel = computed(() => gamificationStore.xpToNextLevel);
const currentStreak = computed(() => gamificationStore.currentStreak);
const stats = computed(() => gamificationStore.stats);
const unlockedBadges = computed(() => gamificationStore.unlockedBadges);
const unlockedBadgesCount = computed(() => unlockedBadges.value.length);

function formatHour(hour: number): string {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}${suffix}`;
}

async function loadPredictions() {
  try {
    loading.value = true;
    const analytics = await analyticsStore.getUserAnalytics();
    if (analytics) {
      predictions.value = await MLEngine.getAllPredictions("user-id", analytics);
    }
  } catch (error) {
    console.error("Error loading predictions:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await gamificationStore.loadUserData();
  await loadPredictions();
});
</script>
