<template>
  <div class="xp-badge flex items-center gap-3">
    <div class="relative cursor-pointer group" @click="showDetails = !showDetails">
      <svg class="w-12 h-12 transform -rotate-90">
        <circle cx="24" cy="24" r="20" stroke="#e5e7eb" stroke-width="4" fill="none" />
        <circle
          cx="24"
          cy="24"
          r="20"
          :stroke="levelColor"
          stroke-width="4"
          fill="none"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          class="transition-all duration-500"
        />
      </svg>
      <div
        class="absolute inset-0 flex items-center justify-center text-sm font-bold"
        :style="{ color: levelColor }"
      >
        {{ level }}
      </div>
    </div>

    <div class="hidden sm:block">
      <div class="text-xs font-medium text-gray-500">Level {{ level }}</div>
      <div class="text-sm font-semibold text-gray-900">{{ formatXP(xp) }} XP</div>
    </div>

    <!-- Details Popup -->
    <Transition name="fade">
      <div
        v-if="showDetails"
        class="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl z-50 border border-gray-200"
        @click.stop
      >
        <div class="p-6 space-y-4">
          <div class="text-center">
            <div
              class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Level {{ level }}
            </div>
            <div class="text-sm text-gray-600 mt-1">
              {{ formatXP(xp) }} / {{ formatXP(xpToNextLevel) }} XP
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Progress to Level {{ level + 1 }}</span>
              <span class="font-medium text-purple-600">{{ Math.round(xpProgress) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                class="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                :style="{ width: `${xpProgress}%` }"
              ></div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="text-sm font-medium text-gray-700 mb-2">Stats</div>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-600">Current Streak</div>
                <div class="text-lg font-bold text-orange-600 flex items-center gap-1">
                  <Icons name="fire" class="w-5 h-5" />
                  {{ currentStreak }}
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-600">Badges</div>
                <div class="text-lg font-bold text-yellow-600 flex items-center gap-1">
                  <Icons name="trophy" class="w-5 h-5" />
                  {{ unlockedBadgesCount }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="recentBadges.length > 0" class="border-t pt-4">
            <div class="text-sm font-medium text-gray-700 mb-2">Recent Badges</div>
            <div class="flex gap-2">
              <div v-for="badge in recentBadges" :key="badge.id" :title="badge.name">
                <component :is="getBadgeIcon(badge.type)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, h } from "vue";
import { useGamificationStore, type Badge } from "../stores/gamification";
import Icons from "./Icons.vue";

const gamificationStore = useGamificationStore();
const showDetails = ref(false);

const level = computed(() => gamificationStore.level);
const xp = computed(() => gamificationStore.xp);
const xpToNextLevel = computed(() => gamificationStore.xpToNextLevel);
const xpProgress = computed(() => gamificationStore.xpProgress);
const currentStreak = computed(() => gamificationStore.currentStreak);
const unlockedBadgesCount = computed(() => gamificationStore.unlockedBadges.length);

const recentBadges = computed(() => {
  return gamificationStore.unlockedBadges.slice(-3);
});

const levelColor = computed(() => {
  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
  return colors[Math.min(level.value, colors.length - 1)];
});

const circumference = 2 * Math.PI * 20;
const dashOffset = computed(() => {
  const progress = xpProgress.value / 100;
  return circumference * (1 - progress);
});

function formatXP(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

function getBadgeIcon(type: Badge["type"]) {
  const iconMap = {
    focus: () => h(Icons, { name: "target", class: "w-8 h-8 text-blue-500" }),
    streak: () => h(Icons, { name: "fire", class: "w-8 h-8 text-orange-500" }),
    quiz: () => h(Icons, { name: "notes", class: "w-8 h-8 text-green-500" }),
    flashcard: () => h(Icons, { name: "flashcard", class: "w-8 h-8 text-pink-500" }),
    notes: () => h(Icons, { name: "book", class: "w-8 h-8 text-indigo-500" }),
  };
  return iconMap[type];
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (showDetails.value && !target.closest(".xp-badge")) {
    showDetails.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  gamificationStore.loadUserData();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
