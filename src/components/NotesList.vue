<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Your Notes</h1>
      <p class="text-gray-600">View and manage your saved notes</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Notes by Subject -->
    <div v-else-if="Object.keys(notesBySubject).length > 0" class="space-y-8">
      <div
        v-for="(subjectNotes, subject) in notesBySubject"
        :key="subject"
        class="bg-white rounded-lg shadow-lg p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <span class="w-3 h-3 rounded-full mr-3" :class="getSubjectColor(subject)"></span>
            {{ subject }}
            <span class="ml-2 text-sm font-normal text-gray-500"
              >({{ subjectNotes.length }} notes)</span
            >
          </h2>
          <button
            @click="processNotes(subjectNotes)"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            Analyze & Merge
          </button>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="note in subjectNotes.slice(0, 6)"
            :key="note.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-2">
              <span class="text-xs text-gray-500">{{ formatDate(note.timestamp) }}</span>
              <button
                @click="deleteNote(note.id)"
                class="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>

            <div class="text-sm text-gray-700 line-clamp-3">
              {{ note.content.substring(0, 150) }}{{ note.content.length > 150 ? "..." : "" }}
            </div>

            <div class="mt-3 flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ note.format }}</span>
              <button
                @click="viewNote(note)"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Full
              </button>
            </div>
          </div>
        </div>

        <div v-if="subjectNotes.length > 6" class="mt-4 text-center">
          <button class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View {{ subjectNotes.length - 6 }} more notes
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
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
      <h3 class="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
      <p class="text-gray-500 mb-4">Start taking notes to see them organized here</p>
      <router-link
        to="/editor"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        Take Your First Note
      </router-link>
    </div>

    <!-- Note Detail Modal -->
    <div
      v-if="selectedNote"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">{{ selectedNote.subject }}</h3>
            <button
              @click="selectedNote = null"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ formatDate(selectedNote.timestamp) }}</p>
        </div>
        <div class="p-6 overflow-y-auto max-h-64">
          <div class="prose max-w-none" v-html="renderedNoteContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { marked } from "marked";
import { useNotesStore } from "../stores/notes";
import { Note } from "../services/aiProvider";

const router = useRouter();
const notesStore = useNotesStore();
const selectedNote = ref<Note | null>(null);

const { notesBySubject, loading, error } = notesStore;

const renderedNoteContent = computed(() => {
  return selectedNote.value ? marked(selectedNote.value.content) : "";
});

const subjectColors = {
  General: "bg-gray-400",
  Math: "bg-blue-400",
  History: "bg-green-400",
  Science: "bg-purple-400",
  Literature: "bg-yellow-400",
  Language: "bg-red-400",
  Other: "bg-indigo-400",
};

function getSubjectColor(subject: string): string {
  return subjectColors[subject as keyof typeof subjectColors] || "bg-gray-400";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function viewNote(note: Note) {
  selectedNote.value = note;
}

async function deleteNote(id: string) {
  if (confirm("Are you sure you want to delete this note?")) {
    await notesStore.deleteNote(id);
  }
}

function processNotes(notes: Note[]) {
  // Navigate to merge view with selected notes
  router.push({
    name: "merge",
    query: { notes: notes.map((n) => n.id).join(",") },
  });
}

onMounted(() => {
  notesStore.fetchNotes();
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
