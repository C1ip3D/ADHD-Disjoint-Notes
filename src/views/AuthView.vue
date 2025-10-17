<template>
  <div>
    <AuthLogin v-if="isLogin" @switch-to-signup="isLogin = false" />
    <AuthSignup v-else @switch-to-login="isLogin = true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AuthLogin from "../components/AuthLogin.vue";
import AuthSignup from "../components/AuthSignup.vue";

const isLogin = ref(true);
</script>
