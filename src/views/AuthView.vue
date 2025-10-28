<template>
  <div
    class="auth-view min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
    style="padding-top: max(env(safe-area-inset-top), 2rem); padding-bottom: 2rem"
  >
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <img
          src="/favicon.png"
          alt="Focusly"
          class="mx-auto h-20 w-20 sm:h-24 sm:h-24 rounded-2xl shadow-xl mb-4"
        />
        <h1 class="text-3xl sm:text-4xl font-bold">
          <span class="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Focusly
          </span>
        </h1>
      </div>

      <!-- Card Container -->
      <div class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <!-- Tabs -->
        <div class="flex gap-2 mb-8 bg-gray-100 rounded-xl p-1">
          <button
            @click="activeTab = 'login'"
            class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all"
            :class="
              activeTab === 'login'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            "
          >
            Login
          </button>
          <button
            @click="activeTab = 'signup'"
            class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all"
            :class="
              activeTab === 'signup'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            "
          >
            Sign Up
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="login-email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="login-email"
              v-model="loginForm.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="login-password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="loginForm.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700"> Remember me </label>
            </div>
            <button
              type="button"
              @click="handleForgotPassword"
              class="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0"
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

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-4 px-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Signup Form -->
        <form v-else @submit.prevent="handleSignup" class="space-y-5">
          <div>
            <label for="signup-name" class="block text-sm font-medium text-gray-700 mb-2">
              Display Name <span class="text-gray-400">(optional)</span>
            </label>
            <input
              id="signup-name"
              v-model="signupForm.displayName"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label for="signup-email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="signup-email"
              v-model="signupForm.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="signup-password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="signup-password"
              v-model="signupForm.password"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label for="signup-confirm" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="signup-confirm"
              v-model="signupForm.confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Re-enter password"
            />
          </div>

          <div class="flex items-start">
            <input
              id="terms"
              v-model="signupForm.agreeTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I agree to the
              <a href="#" class="text-blue-600 hover:text-blue-500 font-medium">Terms of Service</a>
              and
              <a href="#" class="text-blue-600 hover:text-blue-500 font-medium">Privacy Policy</a>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0"
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

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-4 px-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const activeTab = ref<"login" | "signup">("login");

const loginForm = ref({
  email: "",
  password: "",
  rememberMe: false,
});

const signupForm = ref({
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
});

async function handleLogin() {
  try {
    await authStore.signIn(loginForm.value.email, loginForm.value.password);
    router.push("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
  }
}

async function handleSignup() {
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    authStore.error = "Passwords do not match";
    return;
  }

  if (signupForm.value.password.length < 6) {
    authStore.error = "Password must be at least 6 characters";
    return;
  }

  if (!signupForm.value.agreeTerms) {
    authStore.error = "Please agree to the Terms of Service and Privacy Policy";
    return;
  }

  try {
    await authStore.signUp(
      signupForm.value.email,
      signupForm.value.password,
      signupForm.value.displayName
    );
    router.push("/dashboard");
  } catch (error) {
    console.error("Signup error:", error);
  }
}

async function handleForgotPassword() {
  if (!loginForm.value.email) {
    authStore.error = "Please enter your email address first";
    return;
  }

  try {
    await authStore.resetPassword(loginForm.value.email);
    authStore.error = "";
    alert("Password reset email sent! Please check your inbox.");
  } catch (error: any) {
    console.error("Password reset error:", error);
    authStore.error = error.message || "Failed to send reset email";
  }
}
</script>

<style scoped>
.auth-view {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%);
}
</style>
