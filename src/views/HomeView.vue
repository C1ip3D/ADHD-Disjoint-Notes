<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div class="text-center">
        <!-- Animated Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-8 animate-fade-in">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span class="text-sm font-medium text-blue-700">AI-Powered Note Taking</span>
        </div>

        <h1 class="text-6xl md:text-7xl font-bold mb-6 animate-slide-up">
          <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            NoteFlow
          </span>
        </h1>
        <p class="text-2xl text-gray-600 mb-4 max-w-3xl mx-auto animate-slide-up" style="animation-delay: 0.1s">
          Transform scattered thoughts into organized knowledge
        </p>
        <p class="text-lg text-gray-500 mb-12 max-w-2xl mx-auto animate-slide-up" style="animation-delay: 0.2s">
          Perfect for ADHD students. Upload images, capture ideas, and let AI find the connections you missed.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style="animation-delay: 0.3s">
          <button
            @click="handleStartClick"
            class="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all text-lg font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-2"
          >
            <span>{{ authStore.isAuthenticated ? 'Start Taking Notes' : 'Get Started Free' }}</span>
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
          <button
            @click="handleStartClick"
            class="px-8 py-4 bg-white text-gray-700 rounded-2xl hover:bg-gray-50 transition-all text-lg font-semibold shadow-xl border-2 border-gray-200 hover:border-gray-300"
          >
            {{ authStore.isAuthenticated ? 'Go to Notes' : 'Learn More' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Why students love NoteFlow</h2>
        <p class="text-xl text-gray-600">
          Designed specifically for ADHD learners
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
            <svg
              class="w-8 h-8 text-white"
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
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Quick Capture</h3>
          <p class="text-gray-600 text-lg leading-relaxed">
            Type or snap photos of your notes. Auto-save keeps your thoughts safe. Markdown support for rich formatting.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
            <svg
              class="w-8 h-8 text-white"
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
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Image Recognition</h3>
          <p class="text-gray-600 text-lg leading-relaxed">
            Upload photos of handwritten notes. AI extracts and organizes the text automatically.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
            <svg
              class="w-8 h-8 text-white"
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
          <h3 class="text-2xl font-bold text-gray-900 mb-3">AI Analysis</h3>
          <p class="text-gray-600 text-lg leading-relaxed">
            Find connections between ideas, identify knowledge gaps, and get study suggestions.
          </p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 py-20 relative overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style="animation-delay: 2s"></div>
      </div>
      
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">Ready to transform your notes?</h2>
        <p class="text-xl text-white/90 mb-10">
          Join students who are using AI to study smarter, not harder.
        </p>
        <button
          @click="handleStartClick"
          class="inline-flex items-center px-10 py-5 bg-white text-purple-600 rounded-2xl hover:bg-gray-50 transition-all text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 gap-3"
        >
          <span>{{ authStore.isAuthenticated ? 'Start Taking Notes' : 'Get Started Free' }}</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
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
  0%, 100% {
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
