<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50"
    style="padding-top: max(env(safe-area-inset-top), 1.5rem)"
  >
    <div class="max-w-4xl mx-auto p-8 space-y-12">
      <!-- Header -->
      <div class="bg-white rounded-3xl shadow-lg p-8">
        <div class="flex items-start justify-between gap-4">
          <!-- Left side: Back arrow and Regenerate button stacked -->
          <div class="flex flex-col gap-3">
            <button
              @click="goBack"
              class="p-2 hover:bg-gray-100 rounded-xl transition-all self-start"
            >
              <svg
                class="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>

            <!-- Regenerate Button -->
            <button
              v-if="generatedCards.length > 0 && !loading"
              @click="regenerateFlashcards"
              class="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg self-start"
            >
              <svg
                class="w-6 h-6"
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
            </button>
          </div>

          <!-- Right side: Title -->
          <div class="flex-1">
            <h1
              class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1"
            >
              AI Flashcard Generator
            </h1>
            <p class="text-gray-500 text-sm sm:text-base">
              Generate smart flashcards from your notes
            </p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white rounded-3xl shadow-lg p-16">
        <div class="flex flex-col items-center justify-center">
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-purple-500 mb-6"
          ></div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">
            Generating flashcards...
          </h3>
          <p class="text-gray-500">
            AI is extracting key concepts from your notes
          </p>
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="bg-red-50 rounded-3xl shadow-lg p-8 border-2 border-red-200"
      >
        <div class="flex items-start gap-4">
          <svg
            class="w-12 h-12 text-red-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 class="text-2xl font-bold text-red-800 mb-2">Error</h3>
            <p class="text-red-600 text-lg">{{ error }}</p>
            <button
              @click="goBack"
              class="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
            >
              Back to Notes
            </button>
          </div>
        </div>
      </div>

      <!-- Generated Flashcards Display -->
      <div v-else-if="generatedCards.length > 0" class="space-y-6">
        <div class="bg-white rounded-3xl shadow-lg p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">
              Generated {{ generatedCards.length }} Flashcards
            </h2>
            <span class="text-sm text-gray-500">
              Review and edit before saving
            </span>
          </div>

          <div class="grid gap-4">
            <div
              v-for="(card, index) in generatedCards"
              :key="index"
              class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6 hover:border-purple-400 transition-all hover:shadow-lg"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 space-y-4">
                  <div>
                    <label
                      class="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1 block"
                    >
                      Term / Question
                    </label>
                    <p class="text-lg font-bold text-gray-900">
                      {{ card.term }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="text-xs font-semibold text-pink-600 uppercase tracking-wider mb-1 block"
                    >
                      Definition / Answer
                    </label>
                    <p class="text-gray-700 leading-relaxed">
                      {{ card.definition }}
                    </p>
                  </div>
                  <div v-if="card.example">
                    <label
                      class="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 block"
                    >
                      Example
                    </label>
                    <p
                      class="text-sm text-gray-600 italic bg-blue-50 p-3 rounded-lg"
                    >
                      {{ card.example }}
                    </p>
                  </div>
                </div>
                <button
                  @click="removeCard(index)"
                  class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                  title="Remove this card"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Notes Selected -->
      <div
        v-else-if="!loading && selectedNotes.length === 0"
        class="bg-white rounded-3xl shadow-lg p-16 text-center"
      >
        <div class="w-20 h-20 mx-auto mb-6 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-4">No Notes Selected</h3>
        <p class="text-gray-500 mb-8 text-lg">
          Please select notes from your collection to generate flashcards
        </p>
        <router-link
          to="/notes"
          class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold shadow-lg gap-3"
        >
          View Your Notes
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNotesStore } from "../stores/notes";
import { secureAI } from "../services/secureAIProvider";
import type { Note } from "../services/aiProvider";

const router = useRouter();
const route = useRoute();
const notesStore = useNotesStore();

const loading = ref(false);
const error = ref<string | null>(null);
const selectedNotes = ref<Note[]>([]);
const generatedCards = ref<
  Array<{ term: string; definition: string; example?: string }>
>([]);

async function generateFlashcards() {
  if (selectedNotes.value.length === 0) return;

  loading.value = true;
  error.value = null;
  generatedCards.value = [];

  try {
    // Combine all note contents
    const combinedContent = selectedNotes.value
      .map((note) => `# ${note.subject}\n\n${note.content}`)
      .join("\n\n---\n\n");

    // Use secure AI provider - API key stays on backend!
    const content = await secureAI.generateFlashcards(combinedContent);
    const parsedCards = parseFlashcards(content);

    if (parsedCards.length === 0) {
      error.value = "No flashcards could be generated from this content.";
      return;
    }

    generatedCards.value = parsedCards;
  } catch (err: any) {
    error.value =
      err.message ||
      "Failed to generate flashcards. Please ensure the backend server is running.";
    console.error("Error generating flashcards:", err);
  } finally {
    loading.value = false;
  }
}

function parseFlashcards(
  content: string
): Array<{ term: string; definition: string; example?: string }> {
  const cards: Array<{ term: string; definition: string; example?: string }> =
    [];
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

function removeCard(index: number) {
  generatedCards.value.splice(index, 1);
}

function regenerateFlashcards() {
  generateFlashcards();
}

function goBack() {
  router.push("/notes");
}

onMounted(() => {
  const noteIds = route.query.notes as string;
  if (!noteIds) return;

  selectedNotes.value = notesStore.notes.filter((note) =>
    noteIds.split(",").includes(note.id)
  );

  if (selectedNotes.value.length > 0) {
    generateFlashcards();
  }
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
