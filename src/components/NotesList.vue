<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-gray-200/50">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-blue-600 mb-2">Your Notes</h1>
          <p class="text-gray-600">
            {{ notesStore.notes.length }} notes • View, organize, and analyze
          </p>
        </div>
        <button
          v-if="notesStore.notes.length > 0"
          @click="clearAllNotes"
          class="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-medium shadow-lg flex items-center gap-2 hover:scale-105"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
          Clear All Notes
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 border border-gray-200/50"
    >
      <div class="flex flex-col justify-center items-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"
        ></div>
        <p class="text-gray-600 mt-4">Loading notes...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-red-200"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <p class="text-red-800 font-medium">{{ error }}</p>
      </div>
    </div>

    <!-- Notes by Subject -->
    <div v-else-if="Object.keys(notesBySubject).length > 0" class="space-y-6">
      <div
        v-for="(subjectNotes, subject) in notesBySubject"
        :key="subject"
        class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-200/50 hover:shadow-2xl transition-all"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span class="w-4 h-4 rounded-full" :class="getSubjectColor(subject)"></span>
            {{ subject }}
            <span class="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {{ subjectNotes.length }} notes
            </span>
            <span
              v-if="getSelectedCount(subject) > 0"
              class="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full"
            >
              {{ getSelectedCount(subject) }} selected
            </span>
          </h2>
          <div class="flex items-center gap-3">
            <button
              v-if="getSelectedCount(subject) > 0"
              @click="clearSelection(subject)"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
              Clear Selection
            </button>
            <button
              @click="processSelectedNotes(subject)"
              :disabled="getSelectedCount(subject) === 0"
              class="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-2xl hover:from-cyan-500 hover:to-blue-600 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
              {{
                getSelectedCount(subject) === 0
                  ? "Select Notes to Analyze"
                  : `Analyze ${getSelectedCount(subject)} Notes`
              }}
            </button>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="note in subjectNotes.slice(0, 6)"
            :key="note.id"
            @click="toggleNoteSelection(note.id)"
            :class="[
              'group bg-gradient-to-br from-white to-gray-50 border-2 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer',
              isNoteSelected(note.id)
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-blue-300',
            ]"
          >
            <!-- Selection Checkbox -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <div
                  :class="[
                    'w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all',
                    isNoteSelected(note.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 group-hover:border-blue-400',
                  ]"
                >
                  <svg
                    v-if="isNoteSelected(note.id)"
                    class="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg">
                  {{ formatDate(note.timestamp) }}
                </span>
              </div>
              <button
                @click.stop="deleteNote(note.id)"
                class="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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

            <div class="text-sm text-gray-700 line-clamp-3 leading-relaxed mb-4">
              {{ note.content.substring(0, 150) }}{{ note.content.length > 150 ? "..." : "" }}
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-200">
              <span class="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-lg">
                {{ note.format }}
              </span>
              <button
                @click.stop="viewNote(note)"
                class="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
              >
                View
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="subjectNotes.length > 6" class="mt-6 text-center">
          <button
            class="text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors"
          >
            View {{ subjectNotes.length - 6 }} more notes
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-16 border border-gray-200/50"
    >
      <div class="text-center">
        <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-3">No notes yet</h3>
        <p class="text-gray-600 mb-8 text-lg">Start capturing your ideas and they'll appear here</p>
        <router-link
          to="/editor"
          class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-2xl hover:from-cyan-500 hover:to-blue-600 transition-all font-semibold shadow-lg hover:shadow-xl gap-2 hover:scale-105"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Create Your First Note
        </router-link>
      </div>
    </div>

    <!-- Note Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedNote"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          @click.self="selectedNote = null"
        >
          <div
            class="bg-white rounded-3xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl transform transition-all"
          >
            <div class="bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-2xl font-bold">{{ selectedNote.subject }}</h3>
                  <p class="text-sm text-white/80 mt-1">{{ formatDate(selectedNote.timestamp) }}</p>
                </div>
                <button
                  @click="selectedNote = null"
                  class="p-2 hover:bg-white/20 rounded-xl transition-colors"
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
            </div>
            <div class="p-8 overflow-y-auto max-h-[60vh]">
              <div class="prose prose-lg max-w-none" v-html="renderedNoteContent"></div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { marked } from "marked";
import { useNotesStore } from "../stores/notes";
import { type Note } from "../services/aiProvider";

const router = useRouter();
const notesStore = useNotesStore();
const selectedNote = ref<Note | null>(null);
const selectedNoteIds = ref<Set<string>>(new Set());

const { notesBySubject, loading, error, notes } = notesStore;

const renderedNoteContent = computed(() => {
  return selectedNote.value ? marked(selectedNote.value.content) : "";
});

const subjectColors = {
  General: "bg-gray-400",
  Math: "bg-blue-400",
  History: "bg-green-400",
  Science: "bg-cyan-400",
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
  if (!confirm("Are you sure you want to delete this note?")) {
    return;
  }

  try {
    await notesStore.deleteNote(id);
    console.log("Note deleted successfully:", id);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

async function clearAllNotes() {
  if (
    !confirm(
      `Are you sure you want to delete ALL ${notesStore.notes.length} notes? This cannot be undone!`
    )
  ) {
    return;
  }

  if (!confirm("This will permanently delete all your notes. Are you ABSOLUTELY sure?")) {
    return;
  }

  try {
    // Delete all notes one by one
    const noteIds = [...notesStore.notes.map((n) => n.id)];
    let deletedCount = 0;

    for (const id of noteIds) {
      try {
        await notesStore.deleteNote(id);
        deletedCount++;
      } catch (error) {
        console.error("Error deleting note:", id, error);
      }
    }

    console.log(`Deleted ${deletedCount} of ${noteIds.length} notes`);
  } catch (error) {
    console.error("Error clearing all notes:", error);
  }
}

function toggleNoteSelection(noteId: string) {
  if (selectedNoteIds.value.has(noteId)) {
    selectedNoteIds.value.delete(noteId);
  } else {
    selectedNoteIds.value.add(noteId);
  }
}

function isNoteSelected(noteId: string): boolean {
  return selectedNoteIds.value.has(noteId);
}

function getSelectedCount(subject: string): number {
  const subjectNotes = notesStore.getNotesBySubject(subject);
  return subjectNotes.filter((note) => selectedNoteIds.value.has(note.id)).length;
}

function clearSelection(subject: string) {
  const subjectNotes = notesStore.getNotesBySubject(subject);
  subjectNotes.forEach((note) => selectedNoteIds.value.delete(note.id));
}

function processSelectedNotes(subject: string) {
  const subjectNotes = notesStore.getNotesBySubject(subject);
  const selectedNotes = subjectNotes.filter((note) => selectedNoteIds.value.has(note.id));

  if (selectedNotes.length === 0) {
    return;
  }

  // Navigate to merge view with selected notes
  router.push({
    name: "merge",
    query: { notes: selectedNotes.map((n) => n.id).join(",") },
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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
  opacity: 0;
}
</style>
