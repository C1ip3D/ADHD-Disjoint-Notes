<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="close"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center transform"
          @click.stop
        >
          <div class="mb-6">
            <div class="text-8xl mb-4 animate-bounce">🎉</div>
            <h2
              class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
            >
              LEVEL UP!
            </h2>
            <p class="text-gray-600">You've reached a new level!</p>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
            <div class="text-6xl font-black text-purple-600 mb-2">{{ newLevel }}</div>
            <div class="text-lg font-medium text-gray-700">You are now Level {{ newLevel }}</div>
            <div class="text-sm text-gray-600 mt-2">{{ totalXP }} XP earned</div>
          </div>

          <div v-if="newBadges.length > 0" class="mb-6">
            <div class="text-sm font-medium text-gray-700 mb-3">New Badges Unlocked!</div>
            <div class="flex justify-center gap-3">
              <div
                v-for="badge in newBadges"
                :key="badge.id"
                class="bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform"
              >
                <div class="text-4xl mb-2">{{ badge.icon }}</div>
                <div class="text-xs font-medium text-gray-700">{{ badge.name }}</div>
              </div>
            </div>
          </div>

          <button
            @click="close"
            class="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-lg hover:shadow-xl"
          >
            Awesome!
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import confetti from "canvas-confetti";
import { useGamificationStore } from "../stores/gamification";

const gamificationStore = useGamificationStore();

const show = ref(false);
const newLevel = ref(0);
const totalXP = ref(0);
const newBadges = ref<any[]>([]);

function handleLevelUp(event: CustomEvent) {
  newLevel.value = event.detail.level;
  totalXP.value = gamificationStore.xp;
  newBadges.value = [];
  show.value = true;
  launchConfetti();
}

function handleBadgeUnlocked(event: CustomEvent) {
  newBadges.value.push(event.detail.badge);
}

function launchConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

function close() {
  show.value = false;
  newBadges.value = [];
}

onMounted(() => {
  window.addEventListener("levelUp", handleLevelUp as EventListener);
  window.addEventListener("badgeUnlocked", handleBadgeUnlocked as EventListener);
});

onUnmounted(() => {
  window.removeEventListener("levelUp", handleLevelUp as EventListener);
  window.removeEventListener("badgeUnlocked", handleBadgeUnlocked as EventListener);
});

// Watch for level changes
watch(
  () => gamificationStore.level,
  (newVal, oldVal) => {
    if (oldVal !== undefined && newVal > oldVal) {
      const event = new CustomEvent("levelUp", { detail: { level: newVal } });
      window.dispatchEvent(event);
    }
  }
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white {
  transform: scale(0.9) translateY(20px);
}

.modal-leave-to .bg-white {
  transform: scale(0.9) translateY(20px);
}
</style>
