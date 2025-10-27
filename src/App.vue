<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <!-- Navigation -->
    <nav
      class="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-40"
    >
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex justify-between min-h-[56px] sm:h-16 items-center py-2">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center group py-1">
              <img
                src="/favicon.png"
                alt="Focusly"
                class="w-8 h-8 sm:w-12 sm:h-12 rounded-lg mr-2 sm:mr-3 group-hover:scale-105 transition-transform"
              />
              <span class="text-lg sm:text-2xl font-bold text-blue-600"> Focusly </span>
            </router-link>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-2">
            <!-- Authenticated Navigation -->
            <template v-if="authStore.isAuthenticated">
              <router-link
                to="/editor"
                class="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-100"
                active-class="text-blue-600 bg-blue-50"
              >
                Take Notes
              </router-link>
              <router-link
                to="/notes"
                class="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-100"
                active-class="text-blue-600 bg-blue-50"
              >
                My Notes
              </router-link>
              <router-link
                to="/merge"
                class="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-100"
                active-class="text-blue-600 bg-blue-50"
              >
                AI Analyze
              </router-link>

              <!-- User Menu -->
              <div class="relative" ref="userMenuContainer">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md"
                  >
                    <span class="text-sm font-bold text-white">
                      {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <svg
                    class="w-4 h-4 text-gray-500 transition-transform"
                    :class="{ 'rotate-180': showUserMenu }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <Transition name="dropdown">
                  <div
                    v-if="showUserMenu"
                    class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-200"
                  >
                    <div class="px-4 py-3 border-b border-gray-100">
                      <p class="text-sm font-medium text-gray-900">
                        {{ authStore.userDisplayName }}
                      </p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ authStore.user?.email }}</p>
                    </div>
                    <button
                      @click="handleLogout"
                      class="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                    >
                      <svg
                        class="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        ></path>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </Transition>
              </div>
            </template>

            <!-- Unauthenticated Navigation -->
            <template v-else>
              <router-link
                to="/auth"
                class="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
              >
                Sign In
              </router-link>
            </template>
          </div>

          <!-- Mobile Navigation -->
          <div class="flex md:hidden items-center">
            <template v-if="authStore.isAuthenticated">
              <button
                @click="showMobileMenu = !showMobileMenu"
                class="p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <svg
                  v-if="!showMobileMenu"
                  class="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </template>
            <template v-else>
              <router-link
                to="/auth"
                class="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-xs font-medium hover:from-cyan-500 hover:to-blue-600 transition-all shadow-lg"
              >
                Sign In
              </router-link>
            </template>
          </div>
        </div>

        <!-- Mobile Menu Dropdown -->
        <Transition name="mobile-menu">
          <div
            v-if="showMobileMenu && authStore.isAuthenticated"
            class="md:hidden py-3 border-t border-gray-200 space-y-1"
          >
            <router-link
              to="/editor"
              @click="showMobileMenu = false"
              class="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-100"
              active-class="text-blue-600 bg-blue-50"
            >
              Take Notes
            </router-link>
            <router-link
              to="/notes"
              @click="showMobileMenu = false"
              class="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-100"
              active-class="text-blue-600 bg-blue-50"
            >
              My Notes
            </router-link>
            <router-link
              to="/merge"
              @click="showMobileMenu = false"
              class="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-100"
              active-class="text-blue-600 bg-blue-50"
            >
              AI Analyze
            </router-link>
            <div class="px-3 py-2 border-t border-gray-200 mt-2">
              <p class="text-xs text-gray-500 mb-1">Signed in as</p>
              <p class="text-sm font-medium text-gray-900">
                {{ authStore.userDisplayName }}
              </p>
              <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
              <button
                @click="handleLogout"
                class="mt-3 flex items-center w-full text-left px-3 py-2 text-sm text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="transition-all duration-300">
      <RouterView />
    </main>

    <!-- AI Chat Assistant (Always Available) -->
    <AIChatAssistant v-if="authStore.isAuthenticated" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import AIChatAssistant from "./components/AIChatAssistant.vue";

const authStore = useAuthStore();
const showUserMenu = ref(false);
const showMobileMenu = ref(false);
const userMenuContainer = ref<HTMLElement | null>(null);

async function handleLogout() {
  try {
    await authStore.logout();
    showUserMenu.value = false;
    showMobileMenu.value = false;
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// Close user menu when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (userMenuContainer.value && !userMenuContainer.value.contains(target)) {
    showUserMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Safe area for iOS devices */
nav {
  padding-top: env(safe-area-inset-top);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
