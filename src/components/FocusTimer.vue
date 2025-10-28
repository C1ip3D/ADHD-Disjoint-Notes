<template>
  <div class="focus-timer max-w-md mx-auto p-6">
    <div class="text-center space-y-6">
      <!-- Timer Circle -->
      <div class="relative inline-block">
        <svg class="w-64 h-64 transform -rotate-90">
          <!-- Background circle -->
          <circle cx="128" cy="128" r="120" stroke="#e5e7eb" stroke-width="8" fill="none" />
          <!-- Progress circle -->
          <circle
            cx="128"
            cy="128"
            r="120"
            :stroke="timerColor"
            stroke-width="8"
            fill="none"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            class="transition-all duration-1000"
          />
        </svg>

        <!-- Timer Display -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="text-5xl font-bold" :class="timerTextColor">
            {{ formatTime(timeRemaining) }}
          </div>
          <div class="text-sm text-gray-500 mt-2">
            {{ timerType === "focus" ? "Focus Time" : "Break Time" }}
          </div>
          <div
            v-if="isActive && !isPaused"
            class="text-xs text-gray-400 mt-1 flex items-center gap-1"
          >
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Active
          </div>
          <div v-else-if="isPaused" class="text-xs text-orange-500 mt-1">Paused</div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex justify-center gap-3">
        <button
          v-if="!isActive"
          @click="start"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          Start
        </button>

        <template v-else>
          <button
            @click="pause"
            v-if="!isPaused"
            class="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Pause
          </button>

          <button
            @click="resume"
            v-else
            class="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              ></path>
            </svg>
            Resume
          </button>

          <button
            @click="reset"
            class="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            Reset
          </button>
        </template>
      </div>

      <!-- Stats -->
      <div class="bg-gray-50 rounded-xl p-4">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-blue-600">{{ todaysSessions.length }}</div>
            <div class="text-xs text-gray-600">Today</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-600">{{ totalFocusMinutes }}</div>
            <div class="text-xs text-gray-600">Total Minutes</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-orange-600">{{ currentStreak }}</div>
            <div class="text-xs text-gray-600">Day Streak</div>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <details class="text-left bg-white rounded-xl border border-gray-200 p-4">
        <summary class="cursor-pointer font-medium text-gray-700">Timer Settings</summary>
        <div class="mt-4 space-y-4">
          <div>
            <label class="text-sm text-gray-600">Focus Duration (minutes)</label>
            <input
              type="number"
              v-model.number="focusMinutes"
              min="1"
              max="60"
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :disabled="isActive"
            />
          </div>
          <div>
            <label class="text-sm text-gray-600">Break Duration (minutes)</label>
            <input
              type="number"
              v-model.number="breakMinutes"
              min="1"
              max="30"
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :disabled="isActive"
            />
          </div>
          <button
            @click="saveSettings"
            :disabled="isActive"
            class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Save Settings
          </button>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useFocusStore } from "../stores/focus";
import { useAnalyticsStore } from "../stores/analytics";
import { XPTracker } from "../services/xpTracker";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const focusStore = useFocusStore();
const analyticsStore = useAnalyticsStore();

const focusMinutes = ref(25);
const breakMinutes = ref(5);
let timerInterval: NodeJS.Timeout | null = null;

const isActive = computed(() => focusStore.isActive);
const isPaused = computed(() => focusStore.isPaused);
const timeRemaining = computed(() => focusStore.timeRemaining);
const timerType = computed(() => focusStore.timerType);
const todaysSessions = computed(() => focusStore.todaysSessions);
const totalFocusMinutes = computed(() => focusStore.totalFocusMinutes);
const currentStreak = computed(() => focusStore.currentStreak);

const timerColor = computed(() => {
  if (timerType.value === "break") return "#10b981"; // green
  if (timeRemaining.value < 60) return "#ef4444"; // red (last minute)
  if (timeRemaining.value < 300) return "#f59e0b"; // orange (last 5 min)
  return "#3b82f6"; // blue
});

const timerTextColor = computed(() => {
  if (timerType.value === "break") return "text-green-600";
  if (timeRemaining.value < 60) return "text-red-600";
  if (timeRemaining.value < 300) return "text-orange-600";
  return "text-blue-600";
});

const totalDuration = computed(() => {
  return timerType.value === "focus" ? focusStore.focusDuration : focusStore.breakDuration;
});

const circumference = 2 * Math.PI * 120;
const dashOffset = computed(() => {
  const progress = timeRemaining.value / totalDuration.value;
  return circumference * (1 - progress);
});

function formatTime(seconds: number): string {
  return focusStore.formatTime(seconds);
}

function start() {
  focusStore.startTimer("focus");
  playSound("start");
  vibrate();
}

function pause() {
  focusStore.pauseTimer();
  playSound("pause");
}

function resume() {
  focusStore.resumeTimer();
  playSound("start");
}

function reset() {
  focusStore.resetTimer();
  playSound("stop");
}

function saveSettings() {
  focusStore.updateSettings(focusMinutes.value, breakMinutes.value);
}

function playSound(type: "start" | "pause" | "stop" | "complete") {
  // Simple audio feedback
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  if (type === "start") {
    oscillator.frequency.value = 523.25; // C5
  } else if (type === "pause") {
    oscillator.frequency.value = 392.0; // G4
  } else if (type === "stop") {
    oscillator.frequency.value = 261.63; // C4
  } else if (type === "complete") {
    oscillator.frequency.value = 783.99; // G5
  }

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
  oscillator.stop(context.currentTime + 0.3);
}

async function vibrate() {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (error) {
    // Haptics not available
  }
}

async function handleTimerComplete() {
  playSound("complete");
  vibrate();

  if (timerType.value === "focus") {
    // Completed focus session
    const session = await focusStore.completeSession();

    if (session) {
      // Track analytics
      await analyticsStore.trackFocusSession({
        startTime: session.startTime,
        endTime: session.endTime!,
        duration: session.duration,
        completed: true,
        breaks: session.breaks,
        hour: session.startTime.getHours(),
      });

      // Award XP
      const result = await XPTracker.awardXP("focus_complete");
      await XPTracker.incrementStat("focusSessionsCompleted", 1);

      if (result.leveledUp) {
        XPTracker.showLevelUpNotification(result.newLevel);
      }

      // Launch brain reset game
      const event = new CustomEvent("launchBrainReset");
      window.dispatchEvent(event);
    }

    // Auto-start break
    setTimeout(() => {
      focusStore.startTimer("break");
    }, 1000);
  } else {
    // Completed break
    focusStore.completeSession();
    await XPTracker.awardXP("brain_reset");
  }
}

// Watch for timer completion
watch(timeRemaining, (newVal) => {
  if (newVal === 0 && isActive.value) {
    handleTimerComplete();
  }
});

onMounted(() => {
  focusStore.loadSettings();
  focusStore.loadSessionHistory();
  focusMinutes.value = Math.floor(focusStore.focusDuration / 60);
  breakMinutes.value = Math.floor(focusStore.breakDuration / 60);

  // Start timer interval
  timerInterval = setInterval(() => {
    focusStore.tick();
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped>
details summary {
  list-style: none;
}

details summary::-webkit-details-marker {
  display: none;
}
</style>
