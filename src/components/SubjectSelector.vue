<template>
  <div class="space-y-3">
    <!-- Subject Detection Results -->
    <div v-if="detectionResult" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start">
        <svg
          class="w-5 h-5 text-blue-500 mt-0.5 mr-3"
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
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-medium text-blue-800">Subject Detected</h4>
            <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
              {{ detectionResult.confidence }}% confidence
            </span>
          </div>

          <div class="flex items-center space-x-2 mb-2">
            <button
              @click="acceptSuggestion"
              class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Use "{{ detectionResult.detectedSubject }}"
            </button>
            <button
              @click="showAlternatives = !showAlternatives"
              class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
            >
              {{ showAlternatives ? "Hide" : "Show" }} Alternatives
            </button>
          </div>

          <p class="text-xs text-blue-700">{{ detectionResult.reasoning }}</p>

          <!-- Alternative Subjects -->
          <div
            v-if="showAlternatives && detectionResult.alternativeSubjects.length > 0"
            class="mt-3"
          >
            <p class="text-xs text-blue-600 mb-2">Other possibilities:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="alt in detectionResult.alternativeSubjects"
                :key="alt"
                @click="selectSubject(alt)"
                class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
              >
                {{ alt }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Manual Subject Selection -->
    <div class="flex items-center space-x-3">
      <label class="text-sm font-medium text-gray-700">Subject:</label>
      <div class="flex-1">
        <select
          :value="selectedSubject"
          @change="$emit('update:selectedSubject', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white text-gray-900"
        >
          <option value="General" class="text-gray-900">General</option>
          <option value="Math" class="text-gray-900">Math</option>
          <option value="Science" class="text-gray-900">Science</option>
          <option value="History" class="text-gray-900">History</option>
          <option value="Literature" class="text-gray-900">Literature</option>
          <option value="Language" class="text-gray-900">Language</option>
          <option value="Other" class="text-gray-900">Other</option>
        </select>
      </div>
      <button
        @click="detectSubject"
        :disabled="isDetecting || !noteContent.trim()"
        class="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center"
      >
        <svg
          v-if="isDetecting"
          class="animate-spin -ml-1 mr-2 h-4 w-4"
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
        <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          ></path>
        </svg>
        {{ isDetecting ? "Detecting..." : "Auto-Detect" }}
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
      <div class="flex">
        <svg
          class="w-4 h-4 text-red-400 mr-2 mt-0.5"
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
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SubjectDetector, type SubjectDetectionResult } from "../services/subjectDetector";

const props = defineProps<{
  selectedSubject: string;
  noteContent: string;
}>();

const emit = defineEmits<{
  "update:selectedSubject": [value: string];
}>();

const detector = new SubjectDetector(import.meta.env.VITE_OPENAI_API_KEY);
const detectionResult = ref<SubjectDetectionResult | null>(null);
const isDetecting = ref(false);
const error = ref<string | null>(null);
const showAlternatives = ref(false);

async function detectSubject() {
  if (!props.noteContent.trim()) {
    error.value = "Please enter some content to detect the subject";
    return;
  }

  isDetecting.value = true;
  error.value = null;
  detectionResult.value = null;

  try {
    const result = await detector.detectSubject(props.noteContent);
    detectionResult.value = result;

    // Auto-accept if confidence is very high
    if (result.confidence >= 80) {
      acceptSuggestion();
    }
  } catch (err) {
    error.value = "Failed to detect subject. Please select manually.";
    console.error("Subject detection error:", err);
  } finally {
    isDetecting.value = false;
  }
}

function acceptSuggestion() {
  if (detectionResult.value) {
    emit("update:selectedSubject", detectionResult.value.detectedSubject);
    detectionResult.value = null;
    showAlternatives.value = false;
  }
}

function selectSubject(subject: string) {
  emit("update:selectedSubject", subject);
  detectionResult.value = null;
  showAlternatives.value = false;
}
</script>
