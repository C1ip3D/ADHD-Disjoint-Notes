<template>
  <!-- Quiz Popup -->
  <Teleport to="body">
    <Transition name="quiz">
      <div
        v-if="show"
        class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <div
          class="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          <!-- Header -->
          <div
            class="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-6 text-white flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-2xl">Practice Quiz</h3>
                <p class="text-sm text-white/90">Test your understanding</p>
              </div>
            </div>
            <button
              @click="$emit('close')"
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

          <!-- Quiz Content -->
          <div class="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50">
            <div class="space-y-6">
              <div
                v-for="(question, qIndex) in questions"
                :key="qIndex"
                class="bg-white rounded-2xl shadow-md p-6"
              >
                <!-- Question -->
                <div class="mb-5">
                  <div class="flex items-start gap-3 mb-4">
                    <div
                      class="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    >
                      {{ qIndex + 1 }}
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 leading-relaxed pt-1">
                      {{ question.question }}
                    </h3>
                  </div>
                </div>

                <!-- Options -->
                <div class="space-y-3 ml-12">
                  <button
                    v-for="(option, oIndex) in question.options"
                    :key="oIndex"
                    @click="selectAnswer(qIndex, oIndex)"
                    :class="[
                      'w-full text-left p-4 rounded-xl border-2 transition-all',
                      userAnswers[qIndex] === undefined
                        ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
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
                    <div class="flex items-center gap-3">
                      <div
                        :class="[
                          'w-7 h-7 rounded-full border-2 flex items-center justify-center font-semibold text-sm flex-shrink-0',
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
                          class="w-6 h-6 text-green-600"
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
                          class="w-6 h-6 text-red-600"
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
                <div v-if="userAnswers[qIndex] !== undefined" class="ml-12 mt-4">
                  <div
                    v-if="userAnswers[qIndex] === question.correctAnswer"
                    class="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg"
                  >
                    <p class="text-green-800 font-semibold">Correct!</p>
                  </div>
                  <div v-else class="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p class="text-red-800 font-semibold">Incorrect</p>
                    <p class="text-red-700 mt-1 text-sm">
                      Correct answer:
                      <strong>{{ String.fromCharCode(65 + question.correctAnswer) }}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quiz Score -->
            <div v-if="quizCompleted" class="mt-8 p-6 bg-white rounded-2xl shadow-lg text-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-3">Quiz Complete!</h3>
              <div
                class="text-5xl font-bold mb-3"
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
              <p class="text-gray-600 mb-6">
                You got {{ correctAnswersCount }} out of {{ questions.length }} correct
              </p>
              <button
                @click="resetQuiz"
                class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { QuizQuestion } from "../services/aiProvider";

interface Props {
  questions: QuizQuestion[];
  show: boolean;
}

const props = defineProps<Props>();
defineEmits<{
  close: [];
}>();

const userAnswers = ref<Record<number, number>>({});

const quizCompleted = computed(() => {
  return Object.keys(userAnswers.value).length === props.questions.length;
});

const correctAnswersCount = computed(() => {
  return props.questions.filter((q, index) => userAnswers.value[index] === q.correctAnswer).length;
});

const quizScore = computed(() => {
  if (props.questions.length === 0) return 0;
  return Math.round((correctAnswersCount.value / props.questions.length) * 100);
});

function selectAnswer(questionIndex: number, optionIndex: number) {
  if (userAnswers.value[questionIndex] === undefined) {
    userAnswers.value[questionIndex] = optionIndex;
  }
}

function resetQuiz() {
  userAnswers.value = {};
}
</script>

<style scoped>
.quiz-enter-active,
.quiz-leave-active {
  transition: all 0.3s ease;
}

.quiz-enter-from,
.quiz-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
