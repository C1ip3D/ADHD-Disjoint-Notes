<template>
  <div class="max-w-5xl mx-auto p-6 space-y-10">
    <!-- Header -->
    <div class="bg-white rounded-3xl shadow-lg p-8">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
          >
            Your Notes - AI Enhanced
          </h1>
          <p class="text-gray-500 text-lg">Clean summary with practice quiz</p>
        </div>

        <!-- Export Buttons -->
        <div v-if="processedNote" class="flex items-center gap-3">
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              ></path>
            </svg>
            {{ isExporting ? "Generating..." : "PDF" }}
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
        <p class="text-gray-500">Creating summary and practice quiz</p>
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

    <!-- Results - Clean & Simple -->
    <div v-else-if="processedNote" class="space-y-10" id="analysis-content">
      <!-- Clean Content Section -->
      <div class="bg-white rounded-3xl shadow-lg p-12">
        <div
          class="prose prose-lg max-w-none text-gray-800"
          style="line-height: 2.2; font-size: 1.125rem"
          v-html="renderedStructuredContent"
        ></div>
      </div>

      <!-- Practice Quiz Section -->
      <div
        v-if="processedNote.quizQuestions && processedNote.quizQuestions.length > 0"
        class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-lg p-12 border-2 border-blue-200"
      >
        <div class="mb-10">
          <h2 class="text-3xl font-bold text-gray-900 mb-3">Practice Quiz</h2>
          <p class="text-gray-600 text-lg">Test your understanding with these questions:</p>
        </div>

        <div class="space-y-8">
          <div
            v-for="(question, qIndex) in processedNote.quizQuestions"
            :key="qIndex"
            class="bg-white rounded-2xl shadow-md p-8"
          >
            <!-- Question -->
            <div class="mb-6">
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
                >
                  {{ qIndex + 1 }}
                </div>
                <h3 class="text-xl font-semibold text-gray-900 leading-relaxed pt-1">
                  {{ question.question }}
                </h3>
              </div>
            </div>

            <!-- Options -->
            <div class="space-y-3 mb-6 ml-14">
              <button
                v-for="(option, oIndex) in question.options"
                :key="oIndex"
                @click="selectAnswer(qIndex, oIndex)"
                :class="[
                  'w-full text-left p-5 rounded-xl border-2 transition-all text-lg',
                  userAnswers[qIndex] === undefined
                    ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    : userAnswers[qIndex] === oIndex
                    ? oIndex === question.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-red-500 bg-red-50 text-red-900'
                    : oIndex === question.correctAnswer && userAnswers[qIndex] !== undefined
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : 'border-gray-200 bg-gray-50 text-gray-600',
                ]"
                :disabled="userAnswers[qIndex] !== undefined"
              >
                <div class="flex items-center gap-4">
                  <div
                    :class="[
                      'w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold flex-shrink-0',
                      userAnswers[qIndex] === undefined
                        ? 'border-gray-300'
                        : userAnswers[qIndex] === oIndex
                        ? oIndex === question.correctAnswer
                          ? 'border-green-600 bg-green-600 text-white'
                          : 'border-red-600 bg-red-600 text-white'
                        : oIndex === question.correctAnswer
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300',
                    ]"
                  >
                    {{ String.fromCharCode(65 + oIndex) }}
                  </div>
                  <span class="flex-1">{{ option }}</span>

                  <!-- Checkmark or X -->
                  <div v-if="userAnswers[qIndex] !== undefined" class="flex-shrink-0">
                    <svg
                      v-if="oIndex === question.correctAnswer"
                      class="w-7 h-7 text-green-600"
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
                    <svg
                      v-else-if="userAnswers[qIndex] === oIndex"
                      class="w-7 h-7 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            <!-- Feedback -->
            <div v-if="userAnswers[qIndex] !== undefined" class="ml-14">
              <div
                v-if="userAnswers[qIndex] === question.correctAnswer"
                class="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg"
              >
                <p class="text-green-800 font-semibold text-lg">Correct!</p>
              </div>
              <div v-else class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p class="text-red-800 font-semibold text-lg">Incorrect</p>
                <p class="text-red-700 mt-2">
                  The correct answer is:
                  <strong>{{ String.fromCharCode(65 + question.correctAnswer) }}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quiz Score -->
        <div v-if="quizCompleted" class="mt-10 p-8 bg-white rounded-2xl shadow-md text-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Quiz Complete!</h3>
          <div
            class="text-5xl font-bold mb-4"
            :class="
              quizScore >= 80
                ? 'text-green-600'
                : quizScore >= 60
                ? 'text-yellow-600'
                : 'text-red-600'
            "
          >
            {{ quizScore }}%
          </div>
          <p class="text-gray-600 text-lg mb-6">
            You got {{ correctAnswersCount }} out of
            {{ processedNote.quizQuestions.length }} correct
          </p>
          <button
            @click="resetQuiz"
            class="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Back Button -->
      <div class="text-center">
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

const router = useRouter();
const route = useRoute();
const notesStore = useNotesStore();

const loading = ref(false);
const error = ref<string | null>(null);
const processedNote = ref<ProcessedNote | null>(null);
const isExporting = ref(false);
const userAnswers = ref<Record<number, number>>({});

const renderedStructuredContent = computed(() => {
  return processedNote.value ? marked(processedNote.value.structuredContent) : "";
});

const quizCompleted = computed(() => {
  if (!processedNote.value?.quizQuestions) return false;
  return Object.keys(userAnswers.value).length === processedNote.value.quizQuestions.length;
});

const correctAnswersCount = computed(() => {
  if (!processedNote.value?.quizQuestions) return 0;
  return processedNote.value.quizQuestions.filter(
    (q, index) => userAnswers.value[index] === q.correctAnswer
  ).length;
});

const quizScore = computed(() => {
  if (!processedNote.value?.quizQuestions || processedNote.value.quizQuestions.length === 0)
    return 0;
  return Math.round((correctAnswersCount.value / processedNote.value.quizQuestions.length) * 100);
});

function selectAnswer(questionIndex: number, optionIndex: number) {
  if (userAnswers.value[questionIndex] === undefined) {
    userAnswers.value[questionIndex] = optionIndex;
  }
}

function resetQuiz() {
  userAnswers.value = {};
}

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
  if (!processedNote.value) return;

  isExporting.value = true;

  try {
    const element = document.getElementById("analysis-content");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Focusly-Analysis-${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (error) {
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
.prose {
  line-height: 2.2;
}

.prose p {
  margin-bottom: 1.75em;
  font-size: 1.125rem;
  color: #374151;
}

.prose h2 {
  margin-top: 2.5em;
  margin-bottom: 1.25em;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.prose h3 {
  margin-top: 2em;
  margin-bottom: 1em;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.prose ul,
.prose ol {
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  padding-left: 1.75em;
}

.prose li {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  font-size: 1.125rem;
  line-height: 2;
}

.prose strong {
  color: #2563eb;
  font-weight: 600;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-size: 0.9em;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1.5em;
  margin: 2em 0;
  color: #4b5563;
  font-style: italic;
}
</style>
