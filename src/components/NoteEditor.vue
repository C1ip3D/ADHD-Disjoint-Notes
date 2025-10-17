<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Take Notes</h1>

        <!-- Subject Detection -->
        <SubjectSelector v-model:selectedSubject="selectedSubject" :noteContent="noteContent" />

        <div class="flex items-center justify-between mt-4">
          <div></div>
          <button
            @click="togglePreview"
            class="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            {{ showPreview ? "Edit" : "Preview" }}
          </button>
        </div>
      </div>

      <!-- Editor/Preview -->
      <div class="mb-4">
        <div v-if="!showPreview" class="space-y-4">
          <textarea
            v-model="noteContent"
            @input="autoSave"
            placeholder="Start typing your notes here... You can use markdown formatting."
            class="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm"
          />
        </div>
        <div v-else class="prose max-w-none">
          <div
            v-html="renderedMarkdown"
            class="p-4 border border-gray-300 rounded-lg min-h-96 bg-gray-50"
          ></div>
        </div>
      </div>

      <!-- Status and Actions -->
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500">
          <span v-if="isSaving" class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Saving...
          </span>
          <span v-else-if="lastSaved" class="text-green-600">
            Saved {{ formatTime(lastSaved) }}
          </span>
        </div>

        <div class="flex space-x-2">
          <button
            @click="clearNote"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear
          </button>
          <button
            @click="saveNote"
            :disabled="!noteContent.trim()"
            class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { marked } from "marked";
import { useNotesStore } from "../stores/notes";
import SubjectSelector from "./SubjectSelector.vue";

const notesStore = useNotesStore();

const noteContent = ref("");
const selectedSubject = ref("General");
const showPreview = ref(false);
const isSaving = ref(false);
const lastSaved = ref<Date | null>(null);
const autoSaveTimeout = ref<NodeJS.Timeout | null>(null);

const renderedMarkdown = computed(() => {
  return marked(noteContent.value);
});

function autoSave() {
  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value);
  }

  autoSaveTimeout.value = setTimeout(async () => {
    if (noteContent.value.trim()) {
      await saveNote(true);
    }
  }, 2000); // Auto-save after 2 seconds of inactivity
}

async function saveNote(isAutoSave = false) {
  if (!noteContent.value.trim()) return;

  isSaving.value = true;

  try {
    await notesStore.addNote({
      content: noteContent.value,
      subject: selectedSubject.value,
      timestamp: new Date(),
      format: "markdown",
    });

    if (!isAutoSave) {
      noteContent.value = "";
      lastSaved.value = null;
    } else {
      lastSaved.value = new Date();
    }
  } catch (error) {
    console.error("Error saving note:", error);
  } finally {
    isSaving.value = false;
  }
}

function clearNote() {
  noteContent.value = "";
  lastSaved.value = null;
}

function togglePreview() {
  showPreview.value = !showPreview.value;
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 minute ago";
  return `${minutes} minutes ago`;
}

onMounted(() => {
  // Load any existing draft from localStorage
  const draft = localStorage.getItem("note-draft");
  if (draft) {
    noteContent.value = draft;
  }
});

onUnmounted(() => {
  // Save draft to localStorage
  if (noteContent.value.trim()) {
    localStorage.setItem("note-draft", noteContent.value);
  }

  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value);
  }
});
</script>
