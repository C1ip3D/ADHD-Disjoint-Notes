<template>
  <div
    class="flashcards-view min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4"
    style="
      padding-top: max(env(safe-area-inset-top), 1.5rem);
      padding-bottom: 1.5rem;
    "
  >
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1
          class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
        >
          Flashcards
        </h1>
        <p class="text-gray-600">Master your notes with spaced repetition</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="text-3xl font-bold text-purple-600">{{ totalCards }}</div>
          <div class="text-sm text-gray-600 mt-1">Total Cards</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="text-3xl font-bold text-orange-600">
            {{ dueCards.length }}
          </div>
          <div class="text-sm text-gray-600 mt-1">Due Today</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="text-3xl font-bold text-green-600">
            {{ avgSuccessRate }}%
          </div>
          <div class="text-sm text-gray-600 mt-1">Success Rate</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="text-3xl font-bold text-blue-600">
            {{ Object.keys(flashcardsByNote).length }}
          </div>
          <div class="text-sm text-gray-600 mt-1">Decks</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div
        v-if="dueCards.length > 0"
        class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white text-center"
      >
        <h2 class="text-2xl font-bold mb-2">Ready to Review?</h2>
        <p class="mb-6">
          You have {{ dueCards.length }} cards waiting for you!
        </p>
        <button
          @click="startReview"
          class="px-8 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-all font-medium shadow-lg"
        >
          Start Review Session
        </button>
      </div>

      <!-- Decks -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900">Your Decks</h2>

        <div v-if="loading" class="text-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"
          ></div>
          <p class="text-gray-600 mt-4">Loading flashcards...</p>
        </div>

        <div
          v-else-if="totalCards === 0"
          class="bg-white rounded-xl shadow-lg p-12 text-center"
        >
          <Icons name="book" class="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            No Flashcards Yet
          </h3>
          <p class="text-gray-600 mb-6">
            Create flashcards from your notes to get started!
          </p>
          <router-link
            to="/notes"
            class="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
          >
            Go to Notes
          </router-link>
        </div>

        <div v-else class="grid gap-4">
          <div
            v-for="(cards, noteId) in flashcardsByNote"
            :key="noteId"
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Deck from Note {{ String(noteId).substring(0, 8) }}
                </h3>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span>{{ cards.length }} cards</span>
                  <span>•</span>
                  <span>{{ getDueCount(cards) }} due</span>
                  <span>•</span>
                  <span>{{ getSuccessRate(cards) }}% mastered</span>
                </div>
              </div>
              <button
                @click="reviewDeck(cards)"
                :disabled="getDueCount(cards) === 0"
                class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <Teleport to="body">
      <FlashcardReview
        v-if="reviewingCards"
        :cards="reviewingCards"
        @close="reviewingCards = null"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useFlashcardsStore, type Flashcard } from "../stores/flashcards";
import FlashcardReview from "../components/FlashcardReview.vue";
import Icons from "../components/Icons.vue";

const flashcardsStore = useFlashcardsStore();
const reviewingCards = ref<Flashcard[] | null>(null);

const loading = computed(() => flashcardsStore.loading);
const totalCards = computed(() => flashcardsStore.flashcards.length);
const dueCards = computed(() => flashcardsStore.dueFlashcards);
const avgSuccessRate = computed(() => flashcardsStore.averageSuccessRate);
const flashcardsByNote = computed(() => flashcardsStore.flashcardsByNote);

function getDueCount(cards: Flashcard[]): number {
  const now = new Date();
  return cards.filter((card) => new Date(card.nextReview) <= now).length;
}

function getSuccessRate(cards: Flashcard[]): number {
  if (cards.length === 0) return 0;
  const sum = cards.reduce((acc, card) => acc + card.successRate, 0);
  return Math.round((sum / cards.length) * 100);
}

function startReview() {
  reviewingCards.value = dueCards.value;
}

function reviewDeck(cards: Flashcard[]) {
  const now = new Date();
  const due = cards.filter((card) => new Date(card.nextReview) <= now);
  if (due.length > 0) {
    reviewingCards.value = due;
  }
}

onMounted(() => {
  flashcardsStore.fetchFlashcards();
});
</script>
