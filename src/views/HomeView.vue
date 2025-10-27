<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-24 pb-12 sm:pb-20">
      <div class="text-center">
        <!-- Animated Badge -->
        <div
          class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 border border-blue-200 rounded-full mb-6 sm:mb-8 animate-fade-in"
        >
          <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span class="text-xs sm:text-sm font-medium text-blue-700">AI-Powered Note Taking</span>
        </div>

        <h1 class="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 animate-slide-up">
          <span class="text-blue-600"> Focusly </span>
        </h1>
        <p
          class="text-lg sm:text-2xl text-gray-600 mb-3 sm:mb-4 max-w-3xl mx-auto animate-slide-up px-4"
          style="animation-delay: 0.1s"
        >
          Transform scattered thoughts into organized knowledge
        </p>
        <p
          class="text-sm sm:text-lg text-gray-500 mb-8 sm:mb-12 max-w-2xl mx-auto animate-slide-up px-4"
          style="animation-delay: 0.2s"
        >
          Perfect for ADHD students. Upload images, capture ideas, and let AI find the connections
          you missed.
        </p>

        <div
          class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-slide-up px-4"
          style="animation-delay: 0.3s"
        >
          <button
            @click="handleStartClick"
            class="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl sm:rounded-2xl hover:from-cyan-500 hover:to-blue-600 transition-all text-base sm:text-lg font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center justify-center gap-2"
          >
            <span>{{ authStore.isAuthenticated ? "Start Taking Notes" : "Get Started Free" }}</span>
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              ></path>
            </svg>
          </button>
          <button
            @click="handleStartClick"
            class="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all text-base sm:text-lg font-semibold shadow-xl border-2 border-gray-200 hover:border-gray-300"
          >
            {{ authStore.isAuthenticated ? "Go to Notes" : "Learn More" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div class="text-center mb-10 sm:mb-16">
        <h2 class="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
          Why students love Focusly
        </h2>
        <p class="text-base sm:text-xl text-gray-600">Designed specifically for ADHD learners</p>
      </div>

      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        <!-- Feature 1 -->
        <div
          class="group bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          <div
            class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg"
          >
            <svg
              class="w-6 h-6 sm:w-8 sm:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Quick Capture</h3>
          <p class="text-sm sm:text-base text-gray-600 sm:text-lg leading-relaxed">
            Type or snap photos of your notes. Auto-save keeps your thoughts safe. Markdown support
            for rich formatting.
          </p>
        </div>

        <!-- Feature 2 -->
        <div
          class="group bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          <div
            class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg"
          >
            <svg
              class="w-6 h-6 sm:w-8 sm:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            Image Recognition
          </h3>
          <p class="text-sm sm:text-base text-gray-600 sm:text-lg leading-relaxed">
            Upload photos of handwritten notes. AI extracts and organizes the text automatically.
          </p>
        </div>

        <!-- Feature 3 -->
        <div
          class="group bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          <div
            class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg"
          >
            <svg
              class="w-6 h-6 sm:w-8 sm:h-8 text-white"
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
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">AI Analysis</h3>
          <p class="text-sm sm:text-base text-gray-600 sm:text-lg leading-relaxed">
            Find connections between ideas, identify knowledge gaps, and get study suggestions.
          </p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gradient-to-r from-cyan-400 to-blue-500 py-12 sm:py-20 relative overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-white rounded-full blur-3xl animate-float"
        ></div>
        <div
          class="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full blur-3xl animate-float"
          style="animation-delay: 2s"
        ></div>
      </div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 class="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
          Ready to transform your notes?
        </h2>
        <p class="text-base sm:text-xl text-white/90 mb-8 sm:mb-10">
          Join students who are using AI to study smarter, not harder.
        </p>
        <button
          @click="handleStartClick"
          class="inline-flex items-center px-6 sm:px-10 py-3 sm:py-5 bg-white text-blue-600 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all text-base sm:text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 gap-2 sm:gap-3"
        >
          <span>{{ authStore.isAuthenticated ? "Start Taking Notes" : "Get Started Free" }}</span>
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

function handleStartClick() {
  // If already signed in, go to editor. Otherwise go to auth page
  if (authStore.isAuthenticated) {
    router.push("/editor");
  } else {
    router.push("/auth");
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
  animation-fill-mode: both;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
