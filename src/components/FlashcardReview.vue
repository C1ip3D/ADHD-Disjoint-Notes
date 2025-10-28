<template>
  <div class="flashcard-review max-w-2xl mx-auto p-4">
    <div v-if="!reviewStarted" class="text-center space-y-6">
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Ready to Review?</h2>
        <p class="text-gray-600 mb-6">{{ dueCards.length }} cards are due for review</p>

        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-white rounded-lg p-4">
            <div class="text-2xl font-bold text-purple-600">{{ dueCards.length }}</div>
            <div class="text-sm text-gray-600">Due Today</div>
          </div>
          <div class="bg-white rounded-lg p-4">
            <div class="text-2xl font-bold text-blue-600">{{ totalCards }}</div>
            <div class="text-sm text-gray-600">Total Cards</div>
          </div>
          <div class="bg-white rounded-lg p-4">
            <div class="text-2xl font-bold text-green-600">{{ Math.round(avgSuccessRate) }}%</div>
            <div class="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        <button
          @click="startReview"
          :disabled="dueCards.length === 0"
          class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
        >
          Start Review
        </button>
      </div>
    </div>

    <div v-else-if="currentCard" class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Card {{ currentIndex + 1 }} of {{ dueCards.length }}
        </div>
        <div class="flex items-center gap-2">
          <div class="w-48 bg-gray-200 rounded-full h-2">
            <div
              class="bg-purple-500 h-2 rounded-full transition-all"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div class="card-container" :class="{ flipped: isFlipped }" @click="flipCard">
        <div class="card-inner">
          <!-- Front -->
          <div class="card-face card-front">
            <div class="text-center space-y-4">
              <div class="text-sm font-medium text-purple-600">Question</div>
              <div class="text-2xl font-bold text-gray-900">{{ currentCard.term }}</div>
              <div class="text-sm text-gray-500 mt-8">Click to reveal answer</div>
            </div>
          </div>

          <!-- Back -->
          <div class="card-face card-back">
            <div class="space-y-4">
              <div class="text-sm font-medium text-pink-600">Answer</div>
              <div class="text-xl font-semibold text-gray-900">{{ currentCard.definition }}</div>
              <div
                v-if="currentCard.example"
                class="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg"
              >
                <strong>Example:</strong> {{ currentCard.example }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isFlipped" class="flex gap-3 justify-center">
        <button
          @click.stop="markCard(false)"
          class="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-medium flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          Again
        </button>
        <button
          @click.stop="markCard(true)"
          class="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-medium flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          Easy
        </button>
      </div>

      <div class="text-center text-sm text-gray-500">
        <div>Difficulty: {{ difficultyLabel }}</div>
        <div v-if="currentCard.reviewCount > 0">
          Success Rate: {{ Math.round(currentCard.successRate * 100) }}%
        </div>
      </div>
    </div>

    <div v-else-if="reviewCompleted" class="text-center space-y-6">
      <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
        <Icons name="celebration" class="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Review Complete!</h2>
        <p class="text-gray-600 mb-6">Great job reviewing {{ reviewedCount }} cards</p>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-white rounded-lg p-4">
            <div class="text-3xl font-bold text-green-600">{{ correctCount }}</div>
            <div class="text-sm text-gray-600">Correct</div>
          </div>
          <div class="bg-white rounded-lg p-4">
            <div class="text-3xl font-bold text-red-600">{{ incorrectCount }}</div>
            <div class="text-sm text-gray-600">To Review</div>
          </div>
        </div>

        <div class="bg-purple-100 rounded-lg p-4 mb-6">
          <div class="text-2xl font-bold text-purple-600">+{{ xpEarned }} XP</div>
          <div class="text-sm text-purple-700">Keep up the great work!</div>
        </div>

        <button
          @click="$emit('close')"
          class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-lg hover:shadow-xl"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFlashcardsStore, type Flashcard } from "../stores/flashcards";
import { useAnalyticsStore } from "../stores/analytics";
import { SpacedRepetitionService } from "../services/spacedRepetition";
import { XPTracker } from "../services/xpTracker";
import Icons from "./Icons.vue";

const props = defineProps<{
  cards?: Flashcard[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const flashcardsStore = useFlashcardsStore();
const analyticsStore = useAnalyticsStore();

const reviewStarted = ref(false);
const isFlipped = ref(false);
const currentIndex = ref(0);
const reviewCompleted = ref(false);
const correctCount = ref(0);
const incorrectCount = ref(0);
const xpEarned = ref(0);

const dueCards = computed(() => {
  return props.cards || flashcardsStore.dueFlashcards;
});

const totalCards = computed(() => {
  return flashcardsStore.flashcards.length;
});

const avgSuccessRate = computed(() => {
  return flashcardsStore.averageSuccessRate;
});

const currentCard = computed(() => {
  return dueCards.value[currentIndex.value] || null;
});

const progress = computed(() => {
  return ((currentIndex.value + 1) / dueCards.value.length) * 100;
});

const reviewedCount = computed(() => {
  return correctCount.value + incorrectCount.value;
});

const difficultyLabel = computed(() => {
  if (!currentCard.value) return "";
  return SpacedRepetitionService.getDifficultyLabel(currentCard.value.difficulty);
});

function startReview() {
  reviewStarted.value = true;
  currentIndex.value = 0;
  isFlipped.value = false;
  correctCount.value = 0;
  incorrectCount.value = 0;
  xpEarned.value = 0;
}

function flipCard() {
  isFlipped.value = !isFlipped.value;
}

async function markCard(correct: boolean) {
  if (!currentCard.value) return;

  const card = currentCard.value;

  // Calculate next review time
  const { nextReviewDate, intervalMs } = await SpacedRepetitionService.calculateNextReview(
    card.id,
    card.difficulty,
    card.successRate,
    card.consecutiveCorrect
  );

  // Update card in store
  await flashcardsStore.updateFlashcardReview(card.id, correct, intervalMs);

  // Track analytics
  await analyticsStore.trackFlashcardReview({
    cardId: card.id,
    correct,
    responseTime: 0,
    difficulty: card.difficulty,
    timestamp: new Date(),
  });

  // Award XP
  const result = await XPTracker.awardXP(correct ? "flashcard_correct" : "flashcard_wrong");
  xpEarned.value += result.xpAwarded;

  // Increment stat
  await XPTracker.incrementStat("flashcardsReviewed", 1);

  // Update counts
  if (correct) {
    correctCount.value++;
  } else {
    incorrectCount.value++;
  }

  // Move to next card
  if (currentIndex.value < dueCards.value.length - 1) {
    currentIndex.value++;
    isFlipped.value = false;
  } else {
    reviewCompleted.value = true;
  }
}
</script>

<style scoped>
.card-container {
  perspective: 1000px;
  min-height: 300px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  min-height: 300px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-container.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  min-height: 300px;
  backface-visibility: hidden;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-front {
  border: 2px solid #e9d5ff;
}

.card-back {
  border: 2px solid #fbcfe8;
  transform: rotateY(180deg);
}
</style>
