<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Auth Test</h1>
        <p class="mt-2 text-gray-600">Testing authentication components</p>
      </div>

      <div class="space-y-4">
        <button
          @click="
            showLogin = true;
            showSignup = false;
          "
          class="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700"
        >
          Show Login
        </button>
        <button
          @click="
            showLogin = false;
            showSignup = true;
          "
          class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Show Signup
        </button>
      </div>

      <div v-if="showLogin">
        <AuthLogin
          @switchToSignup="
            showLogin = false;
            showSignup = true;
          "
        />
      </div>

      <div v-if="showSignup">
        <AuthSignup
          @switchToLogin="
            showLogin = true;
            showSignup = false;
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AuthLogin from "../components/AuthLogin.vue";
import AuthSignup from "../components/AuthSignup.vue";

const showLogin = ref(false);
const showSignup = ref(false);
</script>
