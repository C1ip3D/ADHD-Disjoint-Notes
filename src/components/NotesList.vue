<template>
  <div class="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
    <div
      class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-200/50"
    >
      <div
        class="flex flex-row sm:flex-row sm:items-center justify-between gap-3 sm:gap-0"
      >
        <div>
          <h1 class="text-2xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">
            Your Notes
          </h1>
          <p class="text-sm sm:text-base text-gray-600">
            {{ notesStore.notes.length }} notes • View, organize, and analyze
          </p>
        </div>
        <button
          v-if="notesStore.notes.length > 0"
          @click="clearAllNotes"
          class="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-xl sm:rounded-2xl hover:bg-red-600 transition-all font-medium shadow-lg flex items-center justify-center gap-2 hover:scale-105 text-sm sm:text-base"
        >
          <svg
            class="w-7 h-7 sm:w-5 sm:h-5"
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

    <!-- Loading State -->
    <div
      v-if="loading"
      class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-200/50"
    >
      <div class="flex flex-col justify-center items-center">
        <div
          class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-200 border-t-blue-500"
        ></div>
        <p class="text-sm sm:text-base text-gray-600 mt-4">Loading notes...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-red-200"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center"
        >
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5 text-red-600"
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
        </div>
        <p class="text-sm sm:text-base text-red-800 font-medium">{{ error }}</p>
      </div>
    </div>

    <!-- Notes by Subject -->
    <div
      v-else-if="Object.keys(notesBySubject).length > 0"
      class="space-y-4 sm:space-y-6"
    >
      <div
        v-for="(subjectNotes, subject) in notesBySubject"
        :key="subject"
        class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all overflow-hidden"
      >
        <!-- Subject Header (Clickable) -->
        <div
          @click="toggleSubjectCollapse(subject)"
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-4 sm:p-6 cursor-pointer hover:bg-gray-50/50 transition-all"
        >
          <h2
            class="text-lg sm:text-2xl font-bold text-gray-800 flex flex-wrap items-center gap-2 sm:gap-3"
          >
            <!-- Collapse Icon -->
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-transform duration-300"
              :class="{ 'rotate-180': !collapsedSubjects.has(subject) }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
            <span
              class="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
              :class="getSubjectColor(subject)"
            ></span>
            {{ subject }}
            <span
              class="text-xs sm:text-sm font-normal text-gray-500 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
            >
              {{ subjectNotes.length }} notes
            </span>
          </h2>
        </div>

        <!-- Collapsible Content -->
        <Transition name="collapse">
          <div
            v-if="!collapsedSubjects.has(subject)"
            class="px-4 sm:px-6 pb-4 sm:pb-6"
          >
            <div
              class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              <div
                v-for="note in subjectNotes.slice(0, 6)"
                :key="note.id"
                class="group bg-gradient-to-br from-white to-gray-50 border-2 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:shadow-lg transition-all border-gray-200 hover:border-blue-300"
              >
                <!-- Note Header -->
                <div class="flex items-start justify-between mb-2 sm:mb-3">
                  <span
                    class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg"
                  >
                    {{ formatDate(note.timestamp) }}
                  </span>
                  <button
                    @click.stop="deleteNote(note.id)"
                    class="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 sm:p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md sm:rounded-lg transition-all"
                  >
                    <svg
                      class="w-3.5 h-3.5 sm:w-4 sm:h-4"
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

                <div
                  class="text-xs sm:text-sm text-gray-700 line-clamp-3 leading-relaxed mb-3 sm:mb-4"
                >
                  {{ note.content.substring(0, 150)
                  }}{{ note.content.length > 150 ? "..." : "" }}
                </div>

                <div
                  class="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200 gap-2"
                >
                  <span
                    class="text-xs text-gray-500 font-medium px-2 py-0.5 sm:py-1 bg-gray-100 rounded-md sm:rounded-lg"
                  >
                    {{ note.format }}
                  </span>
                  <div class="flex items-center gap-2">
                    <button
                      @click.stop="analyzeNote(note)"
                      class="text-purple-600 hover:text-purple-700 text-xs sm:text-sm font-semibold flex items-center gap-1"
                    >
                      <svg
                        class="w-3 h-3 sm:w-4 sm:h-4"
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
                      Analyze
                    </button>
                    <button
                      @click.stop="createFlashcards(note)"
                      class="text-green-600 hover:text-green-700 text-xs sm:text-sm font-semibold flex items-center gap-1"
                    >
                      <svg
                        class="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        ></path>
                      </svg>
                      Flashcards
                    </button>
                    <button
                      @click.stop="viewNote(note)"
                      class="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold flex items-center gap-1"
                    >
                      View
                      <svg
                        class="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
            </div>

            <div
              v-if="subjectNotes.length > 6"
              class="mt-4 sm:mt-6 text-center"
            >
              <button
                class="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-semibold px-3 sm:px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors"
              >
                View {{ subjectNotes.length - 6 }} more notes
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-16 border border-gray-200/50"
    >
      <div class="text-center">
        <div
          class="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 text-gray-300"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          No notes yet
        </h3>
        <p class="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8">
          Start capturing your ideas and they'll appear here
        </p>
        <router-link
          to="/editor"
          class="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-secondary rounded-xl sm:rounded-2xl hover:opacity-90 transition-all font-semibold shadow-lg hover:shadow-xl gap-2 hover:scale-105 text-sm sm:text-base bg-primary"
        >
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
          @click.self="selectedNote = null"
        >
          <div
            class="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden shadow-2xl transform transition-all"
          >
            <div
              class="bg-gradient-to-r from-cyan-400 to-blue-500 px-4 sm:px-8 py-4 sm:py-6 text-white"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg sm:text-2xl font-bold">
                    {{ selectedNote.subject }}
                  </h3>
                  <p class="text-xs sm:text-sm text-white/80 mt-1">
                    {{ formatDate(selectedNote.timestamp) }}
                  </p>
                </div>
                <button
                  @click="selectedNote = null"
                  class="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors"
                >
                  <svg
                    class="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
            <div
              class="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-100px)] sm:max-h-[60vh]"
            >
              <div
                class="prose prose-sm sm:prose-lg max-w-none"
                v-html="renderedNoteContent"
              ></div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Custom Confirmation Modals -->
    <ConfirmModal
      :show="showClearConfirm"
      title="Delete All Notes?"
      :message="`Are you sure you want to delete ALL ${notesStore.notes.length} notes? This cannot be undone!`"
      confirm-text="Yes, delete all"
      cancel-text="Cancel"
      variant="danger"
      @confirm="confirmClearAllNotes"
      @cancel="showClearConfirm = false"
    />

    <ConfirmModal
      :show="showDeleteConfirm"
      title="Delete Note?"
      message="Are you sure you want to delete this note? This cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="warning"
      @confirm="confirmDeleteNote"
      @cancel="cancelDeleteNote"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { marked } from "marked";
import { useNotesStore } from "../stores/notes";
import { useAuthStore } from "../stores/auth";
import { type Note } from "../services/aiProvider";
import ConfirmModal from "./ConfirmModal.vue";

const router = useRouter();
const notesStore = useNotesStore();
const authStore = useAuthStore();
const selectedNote = ref<Note | null>(null);
const selectedNoteIds = ref<Set<string>>(new Set());
const showClearConfirm = ref(false);
const showDeleteConfirm = ref(false);
const noteToDelete = ref<string | null>(null);
const collapsedSubjects = ref<Set<string>>(new Set());

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

function analyzeNote(note: Note) {
  // Navigate to merge view with this single note
  router.push({
    name: "merge",
    query: { notes: note.id },
  });
}

function createFlashcards(note: Note) {
  // Navigate to flashcard generator view with this single note
  router.push({
    name: "generate-flashcards",
    query: { notes: note.id },
  });
}

function deleteNote(id: string) {
  noteToDelete.value = id;
  showDeleteConfirm.value = true;
}

async function confirmDeleteNote() {
  if (!noteToDelete.value) return;

  try {
    await notesStore.deleteNote(noteToDelete.value);
    console.log("Note deleted successfully:", noteToDelete.value);

    // Refresh the notes list from the database to ensure UI is in sync
    await notesStore.fetchNotes();
  } catch (error) {
    console.error("Error deleting note:", error);
  } finally {
    showDeleteConfirm.value = false;
    noteToDelete.value = null;
  }
}

function cancelDeleteNote() {
  showDeleteConfirm.value = false;
  noteToDelete.value = null;
}

function clearAllNotes() {
  showClearConfirm.value = true;
}

async function confirmClearAllNotes() {
  showClearConfirm.value = false;

  try {
    // Delete all notes one by one from the database
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

    // Refresh the notes list from the database to ensure UI is in sync
    await notesStore.fetchNotes();
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
  return subjectNotes.filter((note) => selectedNoteIds.value.has(note.id))
    .length;
}

function clearSelection(subject: string) {
  const subjectNotes = notesStore.getNotesBySubject(subject);
  subjectNotes.forEach((note) => selectedNoteIds.value.delete(note.id));
}

function processSelectedNotes(subject: string) {
  const subjectNotes = notesStore.getNotesBySubject(subject);
  const selectedNotes = subjectNotes.filter((note) =>
    selectedNoteIds.value.has(note.id)
  );

  if (selectedNotes.length === 0) {
    return;
  }

  // Navigate to merge view with selected notes
  router.push({
    name: "merge",
    query: { notes: selectedNotes.map((n) => n.id).join(",") },
  });
}

function toggleSubjectCollapse(subject: string) {
  if (collapsedSubjects.value.has(subject)) {
    collapsedSubjects.value.delete(subject);
  } else {
    collapsedSubjects.value.add(subject);
  }
}

// Watch for authentication state and fetch notes when authenticated
// immediate: true ensures this runs right away and catches late auth initialization
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      // Always fetch to ensure fresh data
      notesStore.fetchNotes();
    }
  },
  { immediate: true }
);

onMounted(() => {
  // Backup fetch in case watcher doesn't catch it
  if (authStore.isAuthenticated) {
    notesStore.fetchNotes();
  }
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

/* Collapse transition */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
