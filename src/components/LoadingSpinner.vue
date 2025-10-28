<template>
  <div class="loading-spinner-container" :class="{ fullscreen }">
    <div class="loading-content">
      <!-- Animated Spinner -->
      <div class="spinner-wrapper">
        <div class="spinner">
          <div class="spinner-ring"></div>
        </div>
      </div>

      <!-- Loading Text -->
      <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
  fullscreen?: boolean;
}

withDefaults(defineProps<Props>(), {
  text: "",
  fullscreen: false,
});
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner-container.fullscreen {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%);
  z-index: 9999;
  padding: 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.spinner-wrapper {
  position: relative;
  width: 64px;
  height: 64px;
}

.spinner {
  position: relative;
  width: 100%;
  height: 100%;
}

.spinner-ring {
  width: 100%;
  height: 100%;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-top-color: #06b6d4;
  border-right-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1rem;
  font-weight: 600;
  color: #3b82f6;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
