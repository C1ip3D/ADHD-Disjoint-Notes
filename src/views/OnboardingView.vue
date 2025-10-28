<template>
  <div
    class="onboarding-screen min-h-screen flex flex-col"
    style="padding-top: env(safe-area-inset-top)"
  >
    <!-- Skip Button -->
    <div class="p-4 sm:p-6 flex justify-end">
      <button
        @click="handleSkip"
        class="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        Skip
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center px-4 pb-20">
      <div class="max-w-2xl mx-auto text-center">
        <!-- Slide Content -->
        <Transition :name="slideDirection" mode="out-in">
          <div v-if="currentSlideData" :key="currentSlide" class="slide-content">
            <!-- Icon -->
            <div class="mb-8">
              <div
                class="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-3xl flex items-center justify-center shadow-2xl"
                :class="currentSlideData.iconBg"
              >
                <component :is="currentSlideData.icon" class="w-12 h-12 sm:w-16 sm:h-16" />
              </div>
            </div>

            <!-- Title -->
            <h2 class="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
              {{ currentSlideData.title }}
            </h2>

            <!-- Description -->
            <p class="text-lg sm:text-xl text-gray-600 leading-relaxed px-4">
              {{ currentSlideData.description }}
            </p>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="p-6 sm:p-8">
      <div class="max-w-2xl mx-auto">
        <!-- Progress Dots -->
        <div class="flex justify-center gap-2 mb-8">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            @click="goToSlide(index)"
            class="transition-all rounded-full"
            :class="
              currentSlide === index
                ? 'w-8 h-2 bg-gradient-to-r from-cyan-400 to-blue-500'
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            "
          ></button>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-4">
          <!-- Back Button (if not first slide) -->
          <button
            v-if="currentSlide > 0"
            @click="previousSlide"
            class="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all"
          >
            Back
          </button>

          <!-- Next / Get Started Button -->
          <button
            @click="nextSlide"
            class="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl hover:from-cyan-500 hover:to-blue-600 transition-all text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2"
          >
            <span>{{ isLastSlide ? "Get Started" : "Next" }}</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue";
import { useRouter } from "vue-router";
import { markOnboardingComplete } from "../utils/onboarding";

const router = useRouter();
const currentSlide = ref(0);
const slideDirection = ref("slide-left");

// Slide data
const slides = [
  {
    title: "Capture Ideas Instantly",
    description:
      "Type notes or snap photos. Auto-save keeps everything safe. Perfect for fast-moving thoughts.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    icon: () =>
      h(
        "svg",
        {
          class: "text-white",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
          }),
        ]
      ),
  },
  {
    title: "AI Finds Connections",
    description:
      "Let AI organize your notes, spot patterns, and create study materials automatically.",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    icon: () =>
      h(
        "svg",
        {
          class: "text-white",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
          }),
        ]
      ),
  },
  {
    title: "Built for ADHD Learners",
    description: "Flashcards, focus timers, and gamification keep you engaged and motivated.",
    iconBg: "bg-gradient-to-br from-cyan-400 to-blue-500",
    icon: () =>
      h(
        "svg",
        {
          class: "text-white",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
          }),
        ]
      ),
  },
];

const currentSlideData = computed(() => slides[currentSlide.value]);
const isLastSlide = computed(() => currentSlide.value === slides.length - 1);

function nextSlide() {
  if (isLastSlide.value) {
    handleComplete();
  } else {
    slideDirection.value = "slide-left";
    currentSlide.value++;
  }
}

function previousSlide() {
  if (currentSlide.value > 0) {
    slideDirection.value = "slide-right";
    currentSlide.value--;
  }
}

function goToSlide(index: number) {
  slideDirection.value = index > currentSlide.value ? "slide-left" : "slide-right";
  currentSlide.value = index;
}

function handleSkip() {
  markOnboardingComplete();
  router.push("/auth");
}

function handleComplete() {
  markOnboardingComplete();
  router.push("/auth");
}
</script>

<style scoped>
.onboarding-screen {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%);
}

.slide-content {
  width: 100%;
}

/* Slide Left Animation */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Slide Right Animation */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
