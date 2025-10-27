<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <!-- Header Section -->
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-gray-200/50">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-blue-600">Create Note</h1>
          <p class="text-gray-500 text-sm mt-1">Capture your thoughts with text or images</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- View Toggle -->
          <div class="flex bg-gray-100 rounded-xl p-1">
            <button
              @click="activeTab = 'write'"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
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
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === 'image'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              Image
            </button>
            <button
              @click="activeTab = 'preview'"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === 'preview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <!-- Subject Selector -->
      <SubjectSelector v-model:selectedSubject="selectedSubject" :noteContent="noteContent" />
    </div>

    <!-- Editor Area -->
    <div
      class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden"
    >
      <!-- Text Editor Tab -->
      <div v-show="activeTab === 'write'" class="p-6">
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
          class="w-full h-[500px] p-6 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-base transition-all"
          style="outline: none"
        />
      </div>

      <!-- Image Upload Tab -->
      <div v-show="activeTab === 'image'" class="p-6">
        <MobileImageUpload v-if="isNativePlatform" @text-extracted="handleTextExtracted" />
        <ImageUpload v-else @text-extracted="handleTextExtracted" />
      </div>

      <!-- Preview Tab -->
      <div v-show="activeTab === 'preview'" class="p-6">
        <div
          v-if="noteContent.trim()"
          v-html="renderedMarkdown"
          class="prose prose-lg max-w-none p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl min-h-[500px] border-2 border-gray-200"
        ></div>
        <div v-else class="flex items-center justify-center h-[500px] text-gray-400">
          <div class="text-center">
            <svg
              class="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <p class="text-lg font-medium">Nothing to preview yet</p>
            <p class="text-sm mt-1">Start writing to see a preview</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-4 border border-gray-200/50">
      <div class="flex items-center justify-between">
        <!-- Status -->
        <div class="text-sm text-gray-600">
          <span v-if="isSaving" class="flex items-center gap-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            Saving...
          </span>
          <span v-else-if="lastSaved" class="flex items-center gap-2 text-green-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div class="flex items-center gap-3">
          <button
            @click="clearNote"
            class="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            Clear
          </button>
          <button
            @click="() => saveNote(false)"
            :disabled="!noteContent.trim()"
            class="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl hover:from-cyan-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
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
import { Capacitor } from "@capacitor/core";
import { useNotesStore } from "../stores/notes";
import SubjectSelector from "./SubjectSelector.vue";
import ImageUpload from "./ImageUpload.vue";
import MobileImageUpload from "./MobileImageUpload.vue";

const notesStore = useNotesStore();

const noteContent = ref("");
const selectedSubject = ref("General");
const activeTab = ref<"write" | "image" | "preview">("write");
const isSaving = ref(false);
const lastSaved = ref<Date | null>(null);
const autoSaveTimeout = ref<NodeJS.Timeout | null>(null);
const isNativePlatform = Capacitor.isNativePlatform();

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
      activeTab.value = "write";
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
  if (confirm("Are you sure you want to clear this note?")) {
    noteContent.value = "";
    lastSaved.value = null;
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
