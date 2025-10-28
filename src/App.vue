<template>
  <!-- Initial Loading Screen -->
  <LoadingSpinner v-if="isInitializing" fullscreen text="Loading Focusly..." />

  <div v-else class="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <!-- Route Loading Bar -->
    <Transition name="loading-bar">
      <div v-if="isRouteLoading" class="fixed top-0 left-0 right-0 z-[60]">
        <div class="h-1 bg-gradient-to-r from-cyan-400 to-blue-500 animate-progress"></div>
      </div>
    </Transition>

    <!-- Main Content -->
    <main class="h-full overflow-y-auto transition-all duration-300 pb-16 md:pb-0">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav
      v-if="authStore.isAuthenticated"
      class="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50"
      style="padding-bottom: env(safe-area-inset-bottom)"
    >
      <div class="flex justify-around items-center h-16">
        <!-- Notes Menu -->
        <button
          @click="toggleNotesMenu"
          class="flex flex-col items-center justify-center flex-1 py-2 transition-colors relative"
          :class="isNotesActive ? 'text-white' : 'text-gray-400 hover:text-white'"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span class="text-xs mt-1">Notes</span>
        </button>

        <!-- Home -->
        <router-link
          to="/dashboard"
          class="flex flex-col items-center justify-center flex-1 py-2 transition-colors"
          :class="$route.path === '/dashboard' ? 'text-white' : 'text-gray-400 hover:text-white'"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span class="text-xs mt-1">Home</span>
        </router-link>

        <!-- Study Menu -->
        <button
          @click="toggleStudyMenu"
          class="flex flex-col items-center justify-center flex-1 py-2 transition-colors relative"
          :class="isStudyActive ? 'text-white' : 'text-gray-400 hover:text-white'"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span class="text-xs mt-1">Study</span>
          <span
            v-if="dueFlashcardsCount > 0"
            class="absolute top-1 right-3 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1"
          >
            {{ dueFlashcardsCount > 99 ? "99+" : dueFlashcardsCount }}
          </span>
        </button>
      </div>
    </nav>

    <!-- Notes Menu Popup -->
    <Transition name="slide-up">
      <div
        v-if="showNotesMenu"
        @click="showNotesMenu = false"
        class="md:hidden fixed inset-0 bg-black/50 z-40"
      >
        <div
          @click.stop
          class="absolute bottom-16 left-0 right-0 bg-gray-800 rounded-t-3xl shadow-2xl p-4"
          style="padding-bottom: env(safe-area-inset-bottom)"
        >
          <div class="space-y-2">
            <router-link
              to="/editor"
              @click="showNotesMenu = false"
              class="flex items-center gap-4 px-4 py-4 text-white hover:bg-gray-700 rounded-xl transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <div>
                <div class="font-semibold">Take Notes</div>
                <div class="text-xs text-gray-400">Create new notes</div>
              </div>
            </router-link>

            <router-link
              to="/notes"
              @click="showNotesMenu = false"
              class="flex items-center gap-4 px-4 py-4 text-white hover:bg-gray-700 rounded-xl transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <div class="font-semibold">Your Notes</div>
                <div class="text-xs text-gray-400">View all notes</div>
              </div>
            </router-link>

            <router-link
              to="/merge"
              @click="showNotesMenu = false"
              class="flex items-center gap-4 px-4 py-4 text-white hover:bg-gray-700 rounded-xl transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <div>
                <div class="font-semibold">AI Analyze</div>
                <div class="text-xs text-gray-400">Get AI insights</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Study Menu Popup -->
    <Transition name="slide-up">
      <div
        v-if="showStudyMenu"
        @click="showStudyMenu = false"
        class="md:hidden fixed inset-0 bg-black/50 z-40"
      >
        <div
          @click.stop
          class="absolute bottom-16 left-0 right-0 bg-gray-800 rounded-t-3xl shadow-2xl p-4"
          style="padding-bottom: env(safe-area-inset-bottom)"
        >
          <div class="space-y-2">
            <router-link
              to="/flashcards"
              @click="showStudyMenu = false"
              class="flex items-center gap-4 px-4 py-4 text-white hover:bg-gray-700 rounded-xl transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <div class="flex-1">
                <div class="font-semibold">Flashcards</div>
                <div class="text-xs text-gray-400">Study with flashcards</div>
              </div>
              <span
                v-if="dueFlashcardsCount > 0"
                class="bg-red-500 text-white text-xs font-bold rounded-full h-6 min-w-[24px] flex items-center justify-center px-2"
              >
                {{ dueFlashcardsCount }}
              </span>
            </router-link>

            <router-link
              to="/focus"
              @click="showStudyMenu = false"
              class="flex items-center gap-4 px-4 py-4 text-white hover:bg-gray-700 rounded-xl transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <div class="font-semibold">Focus Timer</div>
                <div class="text-xs text-gray-400">Pomodoro sessions</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mobile User Menu Modal -->
    <Transition name="fade">
      <div
        v-if="showMobileUserMenu"
        @click="showMobileUserMenu = false"
        class="md:hidden fixed inset-0 bg-black/50 z-40"
      >
        <div
          @click.stop
          class="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6"
          style="padding-bottom: env(safe-area-inset-bottom)"
        >
          <div class="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
            <div
              class="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <span class="text-2xl font-bold text-white">
                {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div>
              <p class="text-lg font-semibold text-gray-900">{{ authStore.userDisplayName }}</p>
              <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
            </div>
          </div>

          <div class="space-y-2">
            <router-link
              to="/editor"
              @click="showMobileUserMenu = false"
              class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span class="font-medium">Take Notes</span>
            </router-link>

            <router-link
              to="/merge"
              @click="showMobileUserMenu = false"
              class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span class="font-medium">AI Analyze</span>
            </router-link>

            <button
              @click="handleLogout"
              class="flex items-center gap-3 w-full px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span class="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- AI Chat Assistant (Desktop Only) -->
    <AIChatAssistant v-if="authStore.isAuthenticated" class="hidden md:block" />

    <!-- Level Up Modal -->
    <LevelUpModal />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useFlashcardsStore } from "./stores/flashcards";
import AIChatAssistant from "./components/AIChatAssistant.vue";
import XPBadge from "./components/XPBadge.vue";
import LevelUpModal from "./components/LevelUpModal.vue";
import LoadingSpinner from "./components/LoadingSpinner.vue";

const authStore = useAuthStore();
const flashcardsStore = useFlashcardsStore();
const router = useRouter();
const showMobileUserMenu = ref(false);
const showNotesMenu = ref(false);
const showStudyMenu = ref(false);
const isInitializing = ref(true);
const isRouteLoading = ref(false);

const dueFlashcardsCount = computed(() => flashcardsStore.dueFlashcards.length);

// Check if current route is in Notes section
const isNotesActive = computed(() => {
  const path = router.currentRoute.value.path;
  return path === "/editor" || path === "/notes" || path === "/merge";
});

// Check if current route is in Study section
const isStudyActive = computed(() => {
  const path = router.currentRoute.value.path;
  return path === "/flashcards" || path === "/focus";
});

function toggleNotesMenu() {
  showNotesMenu.value = !showNotesMenu.value;
  if (showNotesMenu.value) {
    showStudyMenu.value = false;
  }
}

function toggleStudyMenu() {
  showStudyMenu.value = !showStudyMenu.value;
  if (showStudyMenu.value) {
    showNotesMenu.value = false;
  }
}

async function handleLogout() {
  try {
    await authStore.logout();
    showMobileUserMenu.value = false;
  } catch (error) {
    console.error("Logout error:", error);
  }
}

onMounted(async () => {
  // Setup route loading indicator
  router.beforeEach((to, from, next) => {
    isRouteLoading.value = true;
    next();
  });

  router.afterEach(() => {
    setTimeout(() => {
      isRouteLoading.value = false;
    }, 300);
  });

  // Wait for auth state to initialize
  await new Promise((resolve) => {
    const unsubscribe = authStore.$subscribe(() => {
      unsubscribe();
      resolve(true);
    });
    // Timeout after 2 seconds max
    setTimeout(resolve, 2000);
  });

  // Load flashcards for badge count
  if (authStore.isAuthenticated) {
    flashcardsStore.fetchFlashcards();
  }

  // Hide loading screen with a slight delay for smooth transition
  setTimeout(() => {
    isInitializing.value = false;
  }, 300);
});
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.2s ease-in;
}

.fade-leave-active {
  transition: opacity 0.15s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-bar-enter-active,
.loading-bar-leave-active {
  transition: opacity 0.3s ease;
}

.loading-bar-enter-from,
.loading-bar-leave-to {
  opacity: 0;
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
}

.animate-progress {
  animation: progress 0.5s ease-out;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-up-leave-to {
  opacity: 0;
}
</style>
