<template>
  <div
    class="brain-reset-game fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/90 to-purple-600/90 backdrop-blur-sm"
  >
    <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8" @click.stop>
      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Brain Reset!</h2>
        <p class="text-gray-600">Take a quick break and reset your focus</p>
        <div class="mt-4 flex items-center justify-center gap-2">
          <div class="w-32 bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-500 h-2 rounded-full transition-all"
              :style="{ width: `${(timeElapsed / gameData.duration) * 100}%` }"
            ></div>
          </div>
          <span class="text-sm font-medium text-gray-600">{{ timeRemaining }}s</span>
        </div>
      </div>

      <!-- Game: Memory Match -->
      <div v-if="currentGame === 'memory'" class="space-y-4">
        <div class="text-center text-sm text-gray-600 mb-4">
          Match {{ gameData.pairsNeeded }} pairs!
        </div>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="(card, index) in gameData.cards"
            :key="index"
            @click="flipMemoryCard(index)"
            :disabled="card.matched || card.flipped"
            class="aspect-square rounded-xl text-4xl flex items-center justify-center transition-all transform hover:scale-105"
            :class="{
              'bg-blue-500 text-white': card.flipped || card.matched,
              'bg-gray-200 hover:bg-gray-300': !card.flipped && !card.matched,
              'opacity-50': card.matched,
            }"
          >
            {{ card.flipped || card.matched ? card.icon : "?" }}
          </button>
        </div>
        <div
          v-if="gameData.pairsMatched >= gameData.pairsNeeded"
          class="text-center text-green-600 font-semibold"
        >
          ✓ Complete!
        </div>
      </div>

      <!-- Game: Pattern Recall -->
      <div v-else-if="currentGame === 'pattern'" class="space-y-6">
        <div class="text-center text-sm text-gray-600 mb-4">
          {{ gameData.showingPattern ? "Watch the pattern..." : "Repeat the pattern!" }}
        </div>
        <div class="grid grid-cols-2 gap-4">
          <button
            v-for="color in gameData.colors"
            :key="color.name"
            @click="selectColor(color.name)"
            :disabled="gameData.showingPattern"
            class="aspect-square rounded-2xl text-white font-bold text-xl transition-all transform hover:scale-105 active:scale-95"
            :class="[
              color.bg,
              {
                'ring-4 ring-white': gameData.activeColor === color.name,
                'opacity-50': gameData.showingPattern,
              },
            ]"
          >
            {{ color.name }}
          </button>
        </div>
        <div class="text-center">
          <div class="text-sm text-gray-600">Round {{ gameData.round }}</div>
          <div v-if="gameData.round >= 3" class="text-green-600 font-semibold">✓ Complete!</div>
        </div>
      </div>

      <!-- Game: Breathing Exercise -->
      <div v-else-if="currentGame === 'breathing'" class="space-y-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900 mb-2">{{ gameData.instruction }}</div>
          <div class="text-sm text-gray-600">Cycle {{ gameData.cycle }} of 3</div>
        </div>
        <div class="flex items-center justify-center">
          <div
            class="w-48 h-48 rounded-full bg-gradient-to-br transition-all duration-[4000ms] ease-in-out flex items-center justify-center"
            :class="gameData.circleClass"
            :style="{
              transform: `scale(${gameData.scale})`,
            }"
          >
            <div class="text-white text-4xl font-bold">{{ Math.ceil(gameData.breathCounter) }}</div>
          </div>
        </div>
        <div v-if="gameData.cycle >= 3" class="text-center text-green-600 font-semibold">
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

      <div v-if="showSkipWarning" class="mt-4 text-center text-sm text-orange-600">
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

const GAMES = ["memory", "pattern", "breathing"] as const;
type GameType = (typeof GAMES)[number];

const currentGame = ref<GameType>(GAMES[Math.floor(Math.random() * GAMES.length)] as GameType);
const timeElapsed = ref(0);
const showSkipWarning = ref(false);
let gameInterval: NodeJS.Timeout | null = null;

// Memory Match Game Data
const ICONS = ["🍎", "🌟", "📚", "🎨", "🌿", "💡", "🎵", "⚡"];

const gameData = reactive<any>({
  duration: 45,
  // Memory game
  cards: [] as Array<{ icon: string; flipped: boolean; matched: boolean }>,
  flippedIndices: [] as number[],
  pairsMatched: 0,
  pairsNeeded: 3,
  // Pattern game
  colors: [
    { name: "Red", bg: "bg-red-500" },
    { name: "Blue", bg: "bg-blue-500" },
    { name: "Green", bg: "bg-green-500" },
    { name: "Yellow", bg: "bg-yellow-500" },
  ],
  pattern: [] as string[],
  userPattern: [] as string[],
  showingPattern: false,
  round: 1,
  activeColor: null as string | null,
  // Breathing game
  instruction: "Breathe In",
  cycle: 0,
  scale: 0.6,
  breathCounter: 4,
  circleClass: "from-blue-400 to-blue-600",
});

const timeRemaining = computed(() => Math.max(0, gameData.duration - timeElapsed.value));

const isGameComplete = computed(() => {
  if (currentGame.value === "memory") {
    return gameData.pairsMatched >= gameData.pairsNeeded;
  } else if (currentGame.value === "pattern") {
    return gameData.round >= 3;
  } else if (currentGame.value === "breathing") {
    return gameData.cycle >= 3;
  }
  return false;
});

function initializeGame() {
  if (currentGame.value === "memory") {
    initMemoryGame();
  } else if (currentGame.value === "pattern") {
    initPatternGame();
  } else if (currentGame.value === "breathing") {
    initBreathingGame();
  }
}

// Memory Match Game
function initMemoryGame() {
  const selectedIcons = ICONS.slice(0, gameData.pairsNeeded * 2);
  const shuffled = [...selectedIcons, ...selectedIcons].sort(() => Math.random() - 0.5);
  gameData.cards = shuffled.map((icon) => ({
    icon,
    flipped: false,
    matched: false,
  }));
}

function flipMemoryCard(index: number) {
  if (gameData.flippedIndices.length >= 2) return;

  gameData.cards[index].flipped = true;
  gameData.flippedIndices.push(index);

  if (gameData.flippedIndices.length === 2) {
    const [first, second] = gameData.flippedIndices;
    if (gameData.cards[first].icon === gameData.cards[second].icon) {
      // Match!
      gameData.cards[first].matched = true;
      gameData.cards[second].matched = true;
      gameData.pairsMatched++;
      gameData.flippedIndices = [];
    } else {
      // No match
      setTimeout(() => {
        gameData.cards[first].flipped = false;
        gameData.cards[second].flipped = false;
        gameData.flippedIndices = [];
      }, 1000);
    }
  }
}

// Pattern Recall Game
function initPatternGame() {
  gameData.pattern = [gameData.colors[Math.floor(Math.random() * 4)].name];
  gameData.userPattern = [];
  showPattern();
}

async function showPattern() {
  gameData.showingPattern = true;
  for (let i = 0; i < gameData.pattern.length; i++) {
    gameData.activeColor = gameData.pattern[i];
    await new Promise((resolve) => setTimeout(resolve, 600));
    gameData.activeColor = null;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  gameData.showingPattern = false;
}

function selectColor(color: string) {
  gameData.userPattern.push(color);

  if (gameData.userPattern.length === gameData.pattern.length) {
    // Check if correct
    const correct = gameData.userPattern.every((c: string, i: number) => c === gameData.pattern[i]);
    if (correct) {
      gameData.round++;
      if (gameData.round <= 3) {
        // Add another color to pattern
        gameData.pattern.push(gameData.colors[Math.floor(Math.random() * 4)].name);
        gameData.userPattern = [];
        setTimeout(() => showPattern(), 500);
      }
    } else {
      // Wrong, try again
      gameData.userPattern = [];
    }
  }
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
