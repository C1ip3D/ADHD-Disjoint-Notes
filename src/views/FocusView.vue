<template>
  <div
    class="focus-view min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4"
    style="
      padding-top: max(env(safe-area-inset-top), 1.5rem);
      padding-bottom: 1.5rem;
    "
  >
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-secondary mb-2">Pomodoro Timer</h1>
        <p class="text-gray-600">Stay focused and boost your productivity</p>
      </div>

      <FocusTimer />

      <!-- Brain Reset Prompt -->
      <BrainResetGame
        v-if="showBrainReset"
        @complete="handleResetComplete"
        @skip="handleResetSkip"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import FocusTimer from "../components/FocusTimer.vue";
import BrainResetGame from "../components/BrainResetGame.vue";

const showBrainReset = ref(false);

function handleLaunchBrainReset() {
  showBrainReset.value = true;
}

function handleResetComplete() {
  showBrainReset.value = false;
}

function handleResetSkip() {
  showBrainReset.value = false;
}

onMounted(() => {
  window.addEventListener("launchBrainReset", handleLaunchBrainReset);
});

onUnmounted(() => {
  window.removeEventListener("launchBrainReset", handleLaunchBrainReset);
});
</script>
