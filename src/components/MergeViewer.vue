<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Analyzed Notes</h1>
      <p class="text-gray-600">AI-processed insights and structured content</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
      <p class="text-gray-600">Analyzing your notes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center">
        <svg
          class="w-6 h-6 text-red-500 mr-3"
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
          <h3 class="text-lg font-medium text-red-800">Analysis Failed</h3>
          <p class="text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="processedNote" class="space-y-6">
      <!-- Structured Content -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Structured Summary
        </h2>
        <div class="prose max-w-none" v-html="renderedStructuredContent"></div>
      </div>

      <!-- Connections -->
      <div v-if="processedNote.connections.length > 0" class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            ></path>
          </svg>
          Key Connections
        </h2>
        <div class="space-y-2">
          <div
            v-for="(connection, index) in processedNote.connections"
            :key="index"
            class="p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <p class="text-green-800">{{ connection }}</p>
          </div>
        </div>
      </div>

      <!-- Knowledge Gaps -->
      <div v-if="processedNote.gaps.length > 0" class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
          Knowledge Gaps
        </h2>
        <div class="space-y-2">
          <div
            v-for="(gap, index) in processedNote.gaps"
            :key="index"
            class="p-3 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <p class="text-amber-800">{{ gap }}</p>
          </div>
        </div>
      </div>

      <!-- Suggestions -->
      <div v-if="processedNote.suggestions.length > 0" class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-blue-600"
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
          Suggestions & Questions
        </h2>
        <div class="space-y-2">
          <div
            v-for="(suggestion, index) in processedNote.suggestions"
            :key="index"
            class="p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p class="text-blue-800">{{ suggestion }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-center space-x-4">
        <button
          @click="exportNotes"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Export Notes
        </button>
        <button
          @click="goBack"
          class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Notes
        </button>
      </div>
    </div>

    <!-- No Notes Selected -->
    <div v-else class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 text-gray-300">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No notes selected</h3>
      <p class="text-gray-500 mb-4">Select notes from your collection to analyze and merge them</p>
      <router-link
        to="/notes"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        View Your Notes
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { marked } from "marked";
import { useNotesStore } from "../stores/notes";
import { OpenAIProvider, ProcessedNote } from "../services/openaiProvider";

const router = useRouter();
const route = useRoute();
const notesStore = useNotesStore();

const loading = ref(false);
const error = ref<string | null>(null);
const processedNote = ref<ProcessedNote | null>(null);

const renderedStructuredContent = computed(() => {
  return processedNote.value ? marked(processedNote.value.structuredContent) : "";
});

async function analyzeNotes() {
  const noteIds = route.query.notes as string;
  if (!noteIds) return;

  loading.value = true;
  error.value = null;

  try {
    const selectedNotes = notesStore.notes.filter((note) => noteIds.split(",").includes(note.id));

    if (selectedNotes.length === 0) {
      error.value = "No notes found";
      return;
    }

    // For MVP, we'll use a mock AI provider since we don't have API keys set up
    const mockProvider = new MockAIProvider();
    processedNote.value = await mockProvider.analyzeNotes(selectedNotes, selectedNotes[0].subject);
  } catch (err) {
    error.value = "Failed to analyze notes";
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

// Mock AI Provider for MVP
class MockAIProvider {
  async analyzeNotes(notes: any[], subject: string): Promise<ProcessedNote> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const content = notes.map((note) => note.content).join("\n\n");

    return {
      structuredContent: `# ${subject} Notes Analysis\n\n## Overview\nThis analysis covers ${
        notes.length
      } notes on ${subject.toLowerCase()}.\n\n## Key Topics\n- Main concepts identified from your notes\n- Important relationships between ideas\n- Core principles and theories\n\n## Detailed Analysis\n${content.substring(
        0,
        500
      )}...`,
      connections: [
        "Concept A relates to Concept B through their shared characteristics",
        "Historical events connect through cause-and-effect relationships",
        "Mathematical principles build upon each other in logical sequence",
      ],
      gaps: [
        "Missing explanation of intermediate steps in problem-solving",
        "Unclear connection between theory and practical application",
        "Additional context needed for historical timeline",
      ],
      suggestions: [
        "Consider adding more examples to illustrate key concepts",
        "Research additional sources to fill knowledge gaps",
        "Create practice problems to reinforce understanding",
      ],
    };
  }
}
</script>
