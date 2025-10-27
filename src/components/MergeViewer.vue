<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-gray-200/50">
      <h1
        class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
      >
        AI Analysis
      </h1>
      <p class="text-gray-600">Intelligent insights from your notes</p>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 border border-gray-200/50"
    >
      <div class="flex flex-col items-center justify-center">
        <div class="relative">
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg
              class="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              ></path>
            </svg>
          </div>
        </div>
        <p class="text-gray-700 font-medium mt-6 text-lg">Analyzing your notes...</p>
        <p class="text-gray-500 text-sm mt-2">This may take a moment</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-red-200"
    >
      <div class="flex items-start gap-4">
        <div
          class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center"
        >
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-red-800 mb-1">Analysis Failed</h3>
          <p class="text-red-700">{{ error }}</p>
          <button
            @click="goBack"
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="processedNote" class="space-y-6">
      <!-- Structured Content -->
      <div
        class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-200/50 hover:shadow-2xl transition-all"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          Structured Summary
        </h2>
        <div class="prose prose-lg max-w-none" v-html="renderedStructuredContent"></div>
      </div>

      <!-- Connections -->
      <div
        v-if="processedNote.connections.length > 0"
        class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-200/50 hover:shadow-2xl transition-all"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              ></path>
            </svg>
          </div>
          Key Connections
        </h2>
        <div class="space-y-3">
          <div
            v-for="(connection, index) in processedNote.connections"
            :key="index"
            class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl hover:border-green-300 transition-all"
          >
            <p class="text-green-800 font-medium">{{ connection }}</p>
          </div>
        </div>
      </div>

      <!-- Knowledge Gaps -->
      <div
        v-if="processedNote.gaps.length > 0"
        class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-200/50 hover:shadow-2xl transition-all"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          Knowledge Gaps
        </h2>
        <div class="space-y-3">
          <div
            v-for="(gap, index) in processedNote.gaps"
            :key="index"
            class="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl hover:border-amber-300 transition-all"
          >
            <p class="text-amber-800 font-medium">{{ gap }}</p>
          </div>
        </div>
      </div>

      <!-- Suggestions -->
      <div
        v-if="processedNote.suggestions.length > 0"
        class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-200/50 hover:shadow-2xl transition-all"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              ></path>
            </svg>
          </div>
          Suggestions & Questions
        </h2>
        <div class="space-y-3">
          <div
            v-for="(suggestion, index) in processedNote.suggestions"
            :key="index"
            class="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl hover:border-purple-300 transition-all"
          >
            <p class="text-purple-800 font-medium">{{ suggestion }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-gray-200/50">
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button
            @click="exportNotes"
            class="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Export Analysis
          </button>
          <button
            @click="goBack"
            class="px-8 py-3.5 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            Back to Notes
          </button>
        </div>
      </div>
    </div>

    <!-- No Notes Selected -->
    <div
      v-else
      class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 border border-gray-200/50"
    >
      <div class="text-center">
        <div class="w-20 h-20 mx-auto mb-6 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">No notes selected</h3>
        <p class="text-gray-600 mb-6">Select notes from your collection to analyze them with AI</p>
        <router-link
          to="/notes"
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          View Your Notes
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { marked } from "marked";
import { useNotesStore } from "../stores/notes";
import { useSettingsStore } from "../stores/settings";
import { OpenAIProvider, type ProcessedNote } from "../services/openaiProvider";

const router = useRouter();
const route = useRoute();
const notesStore = useNotesStore();
const settingsStore = useSettingsStore();

const loading = ref(false);
const error = ref<string | null>(null);
const processedNote = ref<ProcessedNote | null>(null);

const renderedStructuredContent = computed(() => {
  return processedNote.value ? marked(processedNote.value.structuredContent) : "";
});

async function analyzeNotes() {
  const noteIds = route.query.notes as string;
  if (!noteIds) return;

  // Check if API key is configured
  if (!settingsStore.isApiKeySet) {
    error.value = "Please configure your OpenAI API key in Settings first.";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const selectedNotes = notesStore.notes.filter((note) => noteIds.split(",").includes(note.id));

    if (selectedNotes.length === 0) {
      error.value = "No notes found";
      return;
    }

    // Use real OpenAI provider with user's API key
    const aiProvider = new OpenAIProvider(settingsStore.apiKey);
    processedNote.value = await aiProvider.analyzeNotes(
      selectedNotes,
      selectedNotes[0]?.subject || "General"
    );
  } catch (err: any) {
    error.value = err.message || "Failed to analyze notes. Please check your API key.";
    console.error("Error analyzing notes:", err);
  } finally {
    loading.value = false;
  }
}

function exportNotes() {
  if (!processedNote.value) return;

  const content = `
# Analyzed Notes

## Structured Summary
${processedNote.value.structuredContent}

## Key Connections
${processedNote.value.connections.map((c) => `- ${c}`).join("\n")}

## Knowledge Gaps
${processedNote.value.gaps.map((g) => `- ${g}`).join("\n")}

## Suggestions
${processedNote.value.suggestions.map((s) => `- ${s}`).join("\n")}
  `.trim();

  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analyzed-notes-${new Date().toISOString().split("T")[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function goBack() {
  router.push("/notes");
}

onMounted(() => {
  analyzeNotes();
});
</script>
