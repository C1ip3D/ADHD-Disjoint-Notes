<template>
  <div
    class="brain-reset-game fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/90 to-purple-600/90 backdrop-blur-sm"
  >
    <div
      class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8"
      @click.stop
    >
      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Breathing Break</h2>
        <p class="text-gray-600">Take deep breaths and reset your focus</p>
        <div class="mt-4 flex items-center justify-center gap-2">
          <div class="w-32 bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-500 h-2 rounded-full transition-all"
              :style="{ width: `${(timeElapsed / gameData.duration) * 100}%` }"
            ></div>
          </div>
          <span class="text-sm font-medium text-gray-600"
            >{{ timeRemaining }}s</span
          >
        </div>
      </div>

      <!-- Breathing Exercise -->
      <div class="space-y-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900 mb-2">
            {{ gameData.instruction }}
          </div>
          <div class="text-sm text-gray-600">
            Cycle {{ gameData.cycle }} of 3
          </div>
        </div>
        <div class="flex items-center justify-center">
          <div
            class="w-48 h-48 rounded-full bg-gradient-to-br transition-all duration-[4000ms] ease-in-out flex items-center justify-center"
            :class="gameData.circleClass"
            :style="{
              transform: `scale(${gameData.scale})`,
            }"
          >
            <div class="text-white text-4xl font-bold">
              {{ Math.ceil(gameData.breathCounter) }}
            </div>
          </div>
        </div>
        <div
          v-if="gameData.cycle >= 3"
          class="text-center text-green-600 font-semibold"
        >
          ✓ Complete!
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-6">
        <button
          @click="skip"
          class="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all font-medium"
        >
          Skip
        </button>
        <button
          v-if="isGameComplete"
          @click="complete"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all font-medium"
        >
          Done
        </button>
      </div>

      <div
        v-if="showSkipWarning"
        class="mt-4 text-center text-sm text-orange-600"
      >
        ⚠️ Skipping resets reduces your focus effectiveness
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { XPTracker } from "../services/xpTracker";

const emit = defineEmits<{
  (e: "complete"): void;
  (e: "skip"): void;
}>();

const GAMES = ["breathing"] as const;
type GameType = (typeof GAMES)[number];

const currentGame = ref<GameType>("breathing");
const timeElapsed = ref(0);
const showSkipWarning = ref(false);
let gameInterval: NodeJS.Timeout | null = null;

// Breathing Exercise Data
const gameData = reactive<any>({
  duration: 45,
  instruction: "Breathe In",
  cycle: 0,
  scale: 0.6,
  breathCounter: 4,
  circleClass: "from-blue-400 to-blue-600",
});

const timeRemaining = computed(() =>
  Math.max(0, gameData.duration - timeElapsed.value)
);

const isGameComplete = computed(() => {
  return gameData.cycle >= 3;
});

function initializeGame() {
  initBreathingGame();
}

// Breathing Exercise
function initBreathingGame() {
  gameData.cycle = 0;
  startBreathingCycle();
}

async function startBreathingCycle() {
  while (gameData.cycle < 3) {
    // Breathe in (4s)
    gameData.instruction = "Breathe In";
    gameData.scale = 1.0;
    gameData.circleClass = "from-blue-400 to-blue-600";
    await animateBreath(4);

    // Hold (4s)
    gameData.instruction = "Hold";
    gameData.circleClass = "from-purple-400 to-purple-600";
    await animateBreath(4);

    // Breathe out (6s)
    gameData.instruction = "Breathe Out";
    gameData.scale = 0.6;
    gameData.circleClass = "from-teal-400 to-teal-600";
    await animateBreath(6);

    gameData.cycle++;
  }
}

function animateBreath(duration: number): Promise<void> {
  return new Promise((resolve) => {
    gameData.breathCounter = duration;
    const interval = setInterval(() => {
      gameData.breathCounter -= 0.1;
      if (gameData.breathCounter <= 0) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

async function complete() {
  await XPTracker.awardXP("brain_reset");
  emit("complete");
}

function skip() {
  showSkipWarning.value = true;
  setTimeout(() => {
    emit("skip");
  }, 1500);
}

onMounted(() => {
  initializeGame();
  gameInterval = setInterval(() => {
    timeElapsed.value++;
    if (timeElapsed.value >= gameData.duration && !isGameComplete.value) {
      // Time's up
      complete();
    }
  }, 1000);
});

onUnmounted(() => {
  if (gameInterval) {
    clearInterval(gameInterval);
  }
});
</script>
