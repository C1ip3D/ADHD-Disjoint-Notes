<template>
  <div
    class="welcome-screen h-full flex items-center justify-center px-4"
    style="padding-top: max(env(safe-area-inset-top), 1.5rem)"
  >
    <div class="text-center max-w-2xl mx-auto">
      <!-- App Logo -->
      <div class="mb-8 animate-fade-in">
        <img
          src="/favicon.png"
          alt="Focusly Logo"
          class="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-3xl shadow-2xl"
        />
      </div>

      <!-- App Name -->
      <h1
        class="text-5xl sm:text-7xl font-bold mb-6 animate-slide-up"
        style="animation-delay: 0.1s"
      >
        <span class="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          Focusly
        </span>
      </h1>

      <!-- Tagline -->
      <p
        class="text-xl sm:text-2xl text-gray-700 font-medium mb-4 animate-slide-up"
        style="animation-delay: 0.2s"
      >
        Transform scattered thoughts into organized knowledge
      </p>

      <!-- Mission Line -->
      <p
        class="text-base sm:text-lg text-gray-500 mb-12 animate-slide-up"
        style="animation-delay: 0.3s"
      >
        Perfect for ADHD students
      </p>

      <!-- Get Started Button -->
      <button
        @click="handleGetStarted"
        class="group px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-2xl hover:from-cyan-500 hover:to-blue-600 transition-all text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-3 animate-slide-up"
        style="animation-delay: 0.4s"
      >
        <span>Get Started</span>
        <svg
          class="w-6 h-6 group-hover:translate-x-1 transition-transform"
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

      <!-- Existing User Link -->
      <p class="mt-6 text-sm text-gray-500 animate-slide-up" style="animation-delay: 0.5s">
        Existing user?
        <button
          @click="handleLogin"
          class="text-gray-600 underline hover:text-blue-600 transition-colors font-medium"
        >
          Login
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { hasSeenOnboarding } from "../utils/onboarding";

const router = useRouter();

function handleGetStarted() {
  // Check if user has already seen onboarding
  if (hasSeenOnboarding()) {
    // Skip onboarding, go directly to auth
    router.push("/auth");
  } else {
    // Show onboarding first
    router.push("/onboarding");
  }
}

function handleLogin() {
  // Existing users go directly to login
  router.push("/auth");
}
</script>

<style scoped>
.welcome-screen {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
  animation-fill-mode: both;
}
</style>
