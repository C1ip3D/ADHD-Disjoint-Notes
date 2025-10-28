<template>
  <div class="flashcard-generator">
    <div v-if="!generating && !generated" class="text-center py-8">
      <button
        @click="generateFlashcards"
        :disabled="!noteContent || generating"
        class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
        Generate Flashcards
      </button>
      <p class="text-sm text-gray-500 mt-2">AI will extract key concepts from your notes</p>
    </div>

    <div v-if="generating" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
      <p class="text-gray-600 mt-4">Generating flashcards...</p>
      <p class="text-sm text-gray-500">This may take a moment</p>
    </div>

    <div v-if="generated && generatedCards.length > 0" class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Generated {{ generatedCards.length }} Flashcards
        </h3>
        <button
          @click="saveAllCards"
          :disabled="saving"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          {{ saving ? "Saving..." : "Save All Cards" }}
        </button>
      </div>

      <div class="grid gap-3">
        <div
          v-for="(card, index) in generatedCards"
          :key="index"
          class="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-purple-300 transition-all"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 space-y-2">
              <div>
                <label class="text-xs font-medium text-gray-500">Term</label>
                <p class="font-semibold text-gray-900">{{ card.term }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500">Definition</label>
                <p class="text-gray-700">{{ card.definition }}</p>
              </div>
              <div v-if="card.example">
                <label class="text-xs font-medium text-gray-500">Example</label>
                <p class="text-sm text-gray-600 italic">{{ card.example }}</p>
              </div>
            </div>
            <button
              @click="removeCard(index)"
              class="text-red-500 hover:text-red-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      {{ error }}
    </div>

    <div
      v-if="saved"
      class="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
      Flashcards saved successfully!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { OpenAIProvider } from "../services/openaiProvider";
import { useFlashcardsStore } from "../stores/flashcards";
import { useAuthStore } from "../stores/auth";
import { XPTracker } from "../services/xpTracker";

const props = defineProps<{
  noteContent: string;
  noteId: string;
  apiKey: string;
}>();

const flashcardsStore = useFlashcardsStore();
const authStore = useAuthStore();

const generating = ref(false);
const generated = ref(false);
const saving = ref(false);
const saved = ref(false);
const error = ref<string | null>(null);
const generatedCards = ref<Array<{ term: string; definition: string; example?: string }>>([]);

async function generateFlashcards() {
  generating.value = true;
  generated.value = false;
  error.value = null;

  try {
    const provider = new OpenAIProvider(props.apiKey);

    // @ts-ignore - accessing private openai property for flashcard generation
    const response = await provider.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a flashcard generator. Extract 10-15 key concepts from the provided notes and create flashcard pairs.

Format each flashcard EXACTLY as:
Q: [question or term]
A: [answer or definition]
EXAMPLE: [optional example]

---

Ensure each flashcard is clear, concise, and tests one concept.`,
        },
        {
          role: "user",
          content: `Create flashcards from these notes:\n\n${props.noteContent}`,
        },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || "";
    generatedCards.value = parseFlashcards(content);

    if (generatedCards.value.length === 0) {
      error.value = "No flashcards could be generated from this content.";
    } else {
      generated.value = true;
    }
  } catch (err) {
    console.error("Error generating flashcards:", err);
    error.value = "Failed to generate flashcards. Please try again.";
  } finally {
    generating.value = false;
  }
}

function parseFlashcards(
  content: string
): Array<{ term: string; definition: string; example?: string }> {
  const cards: Array<{ term: string; definition: string; example?: string }> = [];
  const sections = content.split("---").filter((s) => s.trim());

  sections.forEach((section) => {
    const lines = section.split("\n").filter((l) => l.trim());
    let term = "";
    let definition = "";
    let example = "";

    lines.forEach((line) => {
      if (line.startsWith("Q:") || line.startsWith("TERM:")) {
        term = line.replace(/^(Q:|TERM:)\s*/, "").trim();
      } else if (line.startsWith("A:") || line.startsWith("DEFINITION:")) {
        definition = line.replace(/^(A:|DEFINITION:)\s*/, "").trim();
      } else if (line.startsWith("EXAMPLE:")) {
        example = line.replace(/^EXAMPLE:\s*/, "").trim();
      }
    });

    if (term && definition) {
      cards.push({ term, definition, example: example || undefined });
    }
  });

  return cards;
}

async function saveAllCards() {
  if (!authStore.user) return;

  saving.value = true;
  error.value = null;

  try {
    for (const card of generatedCards.value) {
      await flashcardsStore.createFlashcard({
        noteId: props.noteId,
        term: card.term,
        definition: card.definition,
        example: card.example,
        difficulty: 3,
        lastReviewed: null,
        nextReview: new Date(), // Available immediately
        successRate: 0,
        reviewCount: 0,
        consecutiveCorrect: 0,
      });
    }

    // Award XP for creating flashcards
    await XPTracker.awardXP("note_created");

    saved.value = true;
    setTimeout(() => {
      saved.value = false;
      generated.value = false;
      generatedCards.value = [];
    }, 2000);
  } catch (err) {
    console.error("Error saving flashcards:", err);
    error.value = "Failed to save flashcards. Please try again.";
  } finally {
    saving.value = false;
  }
}

function removeCard(index: number) {
  generatedCards.value.splice(index, 1);
}
</script>

<style scoped>
.flashcard-generator {
  @apply space-y-4;
}
</style>
