<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <img src="/favicon.png" alt="Focusly" class="mx-auto h-32 w-32 rounded-3xl" />
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">Create your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <button
            @click="$emit('switchToLogin')"
            class="font-medium text-blue-600 hover:text-cyan-600"
          >
            sign in to your existing account
          </button>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="displayName" class="sr-only">Display Name</label>
            <input
              id="displayName"
              v-model="form.displayName"
              type="text"
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all"
              placeholder="Display Name (optional)"
            />
          </div>
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all"
              placeholder="Password (min 6 characters)"
            />
          </div>
          <div>
            <label for="confirmPassword" class="sr-only">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all"
              placeholder="Confirm Password"
            />
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="agree-terms"
            v-model="form.agreeTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
            I agree to the
            <a href="#" class="text-blue-600 hover:text-cyan-600">Terms of Service</a>
            and
            <a href="#" class="text-blue-600 hover:text-cyan-600">Privacy Policy</a>
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-xl p-4">
          <div class="flex">
            <svg
              class="w-5 h-5 text-red-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p class="text-sm text-red-800">{{ authStore.error }}</p>
          </div>
        </div>

        <!-- Password Mismatch Error -->
        <div v-if="passwordMismatch" class="bg-red-50 border border-red-200 rounded-xl p-4">
          <div class="flex">
            <svg
              class="w-5 h-5 text-red-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p class="text-sm text-red-800">Passwords do not match</p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="!!(authStore.loading || passwordMismatch)"
            class="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            <span v-if="authStore.loading" class="flex items-center text-white">
              <svg
                class="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span class="text-white">Creating account...</span>
            </span>
            <span v-else class="text-white font-semibold">Create account</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

defineEmits<{
  switchToLogin: [];
}>();

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
});

const passwordMismatch = computed(() => {
  return form.password && form.confirmPassword && form.password !== form.confirmPassword;
});

async function handleSubmit() {
  if (passwordMismatch.value) return;

  try {
    console.log("Attempting to create account...");
    await authStore.signUp(form.email, form.password, form.displayName || undefined);
    console.log("Account created successfully!");
    // Redirect to editor page after successful signup
    router.push("/editor");
  } catch (error: any) {
    console.error("Sign up error:", error);
    // Error is handled by the store, but also show alert for debugging
    if (!authStore.error) {
      authStore.error = error.message || "Failed to create account. Check console for details.";
    }
  }
}
</script>
