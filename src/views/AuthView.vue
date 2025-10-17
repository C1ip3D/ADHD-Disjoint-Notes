<template>
  <div>
    <AuthLogin v-if="isLogin" @switchToSignup="isLogin = false" />
    <AuthSignup v-else @switchToLogin="isLogin = true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AuthLogin from "../components/AuthLogin.vue";
import AuthSignup from "../components/AuthSignup.vue";

const isLogin = ref(true);
</script>
