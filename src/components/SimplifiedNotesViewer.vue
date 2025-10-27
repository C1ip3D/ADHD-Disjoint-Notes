<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <!-- Header -->
    <div class="bg-white rounded-3xl shadow-lg p-8">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Your Notes Summary</h1>
          <p class="text-gray-500 text-lg">Clear and easy to understand</p>
        </div>

        <!-- Buttons -->
        <div v-if="processedNote" class="flex items-center gap-3">
          <button
            v-if="processedNote.quizQuestions && processedNote.quizQuestions.length > 0"
            @click="showQuiz = true"
            class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-purple-600 hover:to-blue-700 transition-all font-medium shadow-lg flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              ></path>
            </svg>
            Take Quiz
          </button>
          <button
            @click="exportAsPDF"
            :disabled="isExporting"
            class="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-medium shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            {{ isExporting ? "Generating..." : "Download Notes" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-3xl shadow-lg p-16">
      <div class="flex flex-col items-center justify-center">
        <div
          class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mb-6"
        ></div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Analyzing your notes...</h3>
        <p class="text-gray-500">Creating a clean, readable summary</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 rounded-3xl shadow-lg p-8 border-2 border-red-200">
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

    <!-- SUPER CLEAN Content - Much More Spacing -->
    <div v-else-if="processedNote" id="analysis-content">
      <div class="bg-white rounded-3xl shadow-lg p-16">
        <div class="content-display" v-html="renderedStructuredContent"></div>
      </div>

      <!-- Back Button -->
      <div class="text-center pt-8">
        <button
          @click="goBack"
          class="px-8 py-4 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-all font-semibold text-lg shadow-lg"
        >
          ← Back to Notes
        </button>
      </div>
    </div>

    <!-- No Notes -->
    <div v-else class="bg-white rounded-3xl shadow-lg p-16 text-center">
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
      <h3 class="text-3xl font-bold text-gray-900 mb-4">No Notes Selected</h3>
      <p class="text-gray-500 mb-8 text-lg">Please select notes from your collection to analyze</p>
      <router-link
        to="/notes"
        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-lg gap-3"
      >
        View Your Notes
      </router-link>
    </div>

    <!-- Quiz Popup -->
    <QuizPopup
      v-if="processedNote?.quizQuestions"
      :questions="processedNote.quizQuestions"
      :show="showQuiz"
      @close="showQuiz = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { marked } from "marked";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNotesStore } from "../stores/notes";
import { OpenAIProvider, type ProcessedNote } from "../services/openaiProvider";
import QuizPopup from "./QuizPopup.vue";

const router = useRouter();
const route = useRoute();
const notesStore = useNotesStore();

const loading = ref(false);
const error = ref<string | null>(null);
const processedNote = ref<ProcessedNote | null>(null);
const isExporting = ref(false);
const showQuiz = ref(false);

const renderedStructuredContent = computed(() => {
  return processedNote.value ? marked(processedNote.value.structuredContent) : "";
});

async function analyzeNotes() {
  const noteIds = route.query.notes as string;
  if (!noteIds) return;

  if (!import.meta.env.VITE_OPENAI_API_KEY) {
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

    const aiProvider = new OpenAIProvider(import.meta.env.VITE_OPENAI_API_KEY || "");
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

async function exportAsPDF() {
  if (!processedNote.value) {
    return;
  }

  isExporting.value = true;

  try {
    const element = document.getElementById("analysis-content");
    if (!element) {
      console.error("Could not find analysis-content element");
      return;
    }

    console.log("Starting PDF export...");

    // Use html2canvas to capture the content
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    console.log("Canvas created, generating PDF...");

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const filename = `Focusly-Notes-${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(filename);

    console.log("PDF saved successfully:", filename);
  } catch (error: any) {
    console.error("Error exporting PDF:", error);
  } finally {
    isExporting.value = false;
  }
}

function goBack() {
  router.push("/notes");
}

onMounted(() => {
  analyzeNotes();
});
</script>

<style scoped>
/* ULTRA CLEAN READABLE FORMATTING WITH STRUCTURE */
.content-display {
  color: #1f2937;
  font-size: 1.25rem;
  line-height: 2.25;
  letter-spacing: 0.01em;
}

/* Paragraphs - Good spacing */
.content-display :deep(p) {
  margin-bottom: 2rem;
  font-size: 1.25rem;
  line-height: 2.25;
  color: #374151;
}

/* Headings - Clear and prominent */
.content-display :deep(h2) {
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: #1e40af;
  border-bottom: 3px solid #3b82f6;
  padding-bottom: 0.75rem;
  padding-top: 0.5rem;
  background: linear-gradient(to right, #eff6ff, transparent);
  padding-left: 1rem;
  border-radius: 0.5rem;
}

.content-display :deep(h3) {
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

/* Lists - Clear bullets with spacing */
.content-display :deep(ul) {
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  padding-left: 2rem;
  list-style-type: disc;
}

.content-display :deep(ol) {
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  padding-left: 2rem;
  list-style-type: decimal;
}

.content-display :deep(li) {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  line-height: 2;
  color: #374151;
  padding-left: 0.5rem;
}

.content-display :deep(li::marker) {
  color: #3b82f6;
  font-weight: bold;
}

/* Nested lists */
.content-display :deep(li ul),
.content-display :deep(li ol) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

/* Strong/Bold - Highlight key terms prominently */
.content-display :deep(strong) {
  color: #1e40af;
  font-weight: 700;
  background: linear-gradient(120deg, #fef3c7 0%, #fde68a 100%);
  padding: 0.15rem 0.5rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Code blocks */
.content-display :deep(code) {
  background-color: #f3f4f6;
  padding: 0.25rem 0.6rem;
  border-radius: 0.375rem;
  font-size: 1.125rem;
  color: #dc2626;
  font-family: "Courier New", monospace;
  border: 1px solid #e5e7eb;
}

/* Blockquotes - Important definitions/info */
.content-display :deep(blockquote) {
  border-left: 5px solid #3b82f6;
  background: linear-gradient(to right, #eff6ff, transparent);
  padding: 1.5rem 2rem;
  margin: 2.5rem 0;
  color: #1e40af;
  font-size: 1.25rem;
  line-height: 2;
  border-radius: 0.5rem;
  font-weight: 500;
}

.content-display :deep(blockquote p) {
  margin-bottom: 0;
}

/* Links */
.content-display :deep(a) {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

.content-display :deep(a:hover) {
  color: #1d4ed8;
}

/* First paragraph - slightly larger for introduction */
.content-display :deep(h2:first-of-type) {
  margin-top: 0;
}

/* Add subtle background to alternate sections for visual rhythm */
.content-display :deep(h2:nth-of-type(even)) {
  background: linear-gradient(to right, #fef3c7, transparent);
  border-bottom-color: #f59e0b;
  color: #92400e;
}
</style>
