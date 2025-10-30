<template>
  <div class="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
    <!-- Header Section -->
    <div
      class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-200/50"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4"
      >
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-blue-600">
            Create Note
          </h1>
          <p class="text-gray-500 text-xs sm:text-sm mt-1">
            Capture your thoughts with text or images
          </p>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- View Toggle -->
          <div class="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
            <button
              @click="activeTab = 'write'"
              :class="[
                'flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-s sm:text-sm font-medium transition-all',
                activeTab === 'write'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              Write
            </button>
            <button
              @click="activeTab = 'image'"
              :class="[
                'flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-s sm:text-sm font-medium transition-all',
                activeTab === 'image'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              Image
            </button>
          </div>
        </div>
      </div>

      <!-- Subject Selector -->
      <SubjectSelector
        v-model:selectedSubject="selectedSubject"
        :noteContent="noteContent"
      />
    </div>

    <!-- Editor Area -->
    <div
      class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden"
    >
      <!-- Text Editor Tab -->
      <Transition name="bounce" mode="out-in">
        <div v-if="activeTab === 'write'" key="write" class="p-3 sm:p-6">
          <textarea
            v-model="noteContent"
            @input="autoSave"
            placeholder="Start typing your notes here... You can use markdown formatting.

# Heading 1
## Heading 2
**bold** *italic*
- List item
1. Numbered list
[Link](url)"
            class="w-full h-[400px] sm:h-[500px] p-3 sm:p-6 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm sm:text-base transition-all"
            style="outline: none"
          />
        </div>

        <!-- Image Upload Tab -->
        <div v-else-if="activeTab === 'image'" key="image" class="p-3 sm:p-6">
          <MobileImageUpload
            v-if="isNativePlatform"
            @text-extracted="handleTextExtracted"
          />
          <ImageUpload v-else @text-extracted="handleTextExtracted" />
        </div>
      </Transition>
    </div>

    <!-- Action Bar -->
    <div
      class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-200/50"
    >
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"
      >
        <!-- Status -->
        <div class="text-xs sm:text-sm text-gray-600">
          <span v-if="isSaving" class="flex items-center gap-2">
            <div
              class="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-500"
            ></div>
            Saving...
          </span>
          <span
            v-else-if="lastSaved"
            class="flex items-center gap-2 text-green-600"
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
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Saved {{ formatTime(lastSaved) }}
          </span>
          <span v-else class="flex items-center gap-2 text-gray-400">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Auto-save enabled
          </span>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            @click="clearNote"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            Clear
          </button>
          <button
            @click="saveNote"
            :disabled="!noteContent.trim() || isSaving"
            class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-[#266DD3] text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Capacitor } from "@capacitor/core";
import { useNotesStore } from "../stores/notes";
import SubjectSelector from "./SubjectSelector.vue";
import ImageUpload from "./ImageUpload.vue";
import MobileImageUpload from "./MobileImageUpload.vue";

const notesStore = useNotesStore();

const noteContent = ref("");
const selectedSubject = ref("General");
const activeTab = ref<"write" | "image">("write");
const isSaving = ref(false);
const lastSaved = ref<Date | null>(null);
const autoSaveTimeout = ref<NodeJS.Timeout | null>(null);
const isNativePlatform = Capacitor.isNativePlatform();
const hasPendingDraft = ref(false);

function autoSave() {
  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value);
  }

  autoSaveTimeout.value = setTimeout(() => {
    if (noteContent.value.trim()) {
      // Save to localStorage only (no database upload)
      localStorage.setItem("note-draft", noteContent.value);
      localStorage.setItem("note-draft-subject", selectedSubject.value);
      hasPendingDraft.value = true;
      lastSaved.value = new Date();
    }
  }, 2000); // Auto-save after 2 seconds of inactivity
}

async function saveNote() {
  const content = noteContent.value.trim();
  if (!content) return;

  // Prevent duplicate saves if already saving
  if (isSaving.value) return;

  isSaving.value = true;

  try {
    // Upload to Firebase database
    await notesStore.addNote({
      content,
      subject: selectedSubject.value,
      timestamp: new Date(),
      format: "markdown",
    });

    // Clear the note and draft after successful save
    noteContent.value = "";
    lastSaved.value = null;
    activeTab.value = "write";
    hasPendingDraft.value = false;

    // Clear localStorage draft
    localStorage.removeItem("note-draft");
    localStorage.removeItem("note-draft-subject");
  } catch (error) {
    console.error("Error saving note:", error);
  } finally {
    isSaving.value = false;
  }
}

async function savePendingDraft() {
  // Called when navigating away - saves any pending draft to database
  if (!hasPendingDraft.value || !noteContent.value.trim()) return;

  try {
    await notesStore.addNote({
      content: noteContent.value,
      subject: selectedSubject.value,
      timestamp: new Date(),
      format: "markdown",
    });

    // Clear draft after successful save
    localStorage.removeItem("note-draft");
    localStorage.removeItem("note-draft-subject");
    hasPendingDraft.value = false;
  } catch (error) {
    console.error("Error saving pending draft:", error);
  }
}

function clearNote() {
  if (confirm("Are you sure you want to clear this note?")) {
    noteContent.value = "";
    lastSaved.value = null;
    hasPendingDraft.value = false;
    localStorage.removeItem("note-draft");
    localStorage.removeItem("note-draft-subject");
  }
}

function handleTextExtracted(text: string) {
  // Append extracted text to note content
  if (noteContent.value) {
    noteContent.value += "\n\n---\n\n" + text;
  } else {
    noteContent.value = text;
  }
  activeTab.value = "write";
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
  const draftSubject = localStorage.getItem("note-draft-subject");

  if (draft) {
    noteContent.value = draft;
    hasPendingDraft.value = true;
  }

  if (draftSubject) {
    selectedSubject.value = draftSubject;
  }
});

onUnmounted(async () => {
  // Clear any pending auto-save timeout
  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value);
  }

  // Save pending draft to database when navigating away
  await savePendingDraft();
});
</script>

<style scoped>
/* Bounce transition effects */
.bounce-enter-active {
  animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.bounce-leave-active {
  animation: bounce-out 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

@keyframes bounce-in {
  0% {
    transform: scale(0.9) translateY(10px);
    opacity: 0;
  }
  50% {
    transform: scale(1.02) translateY(-5px);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  100% {
    transform: scale(0.95) translateY(-10px);
    opacity: 0;
  }
}
</style>
