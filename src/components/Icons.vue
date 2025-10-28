<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  name: string;
  class?: string;
}>();
</script>

<template>
  <!-- Chart/Analytics Icon -->
  <svg v-if="name === 'chart'" :class="class" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>

  <!-- Notes Icon -->
  <svg
    v-else-if="name === 'notes'"
    :class="class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>

  <!-- Clock/Time Icon -->
  <svg
    v-else-if="name === 'clock'"
    :class="class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>

  <!-- Warning/Alert Icon -->
  <svg
    v-else-if="name === 'alert'"
    :class="class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>

  <!-- Trophy Icon -->
  <svg
    v-else-if="name === 'trophy'"
    :class="class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>

  <!-- Fire/Streak Icon -->
  <svg v-else-if="name === 'fire'" :class="class" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M12 2C7.58 2 4 5.58 4 10c0 5.5 5.5 12 8 12s8-6.5 8-12c0-4.42-3.58-8-8-8zm1 14.5c-1.66 0-3-1.34-3-3 0-1.11.61-2.01 1.5-2.5-.5.83-.5 1.67-.5 2.5 0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.33-.08-.65-.23-.94.44.55.73 1.23.73 2.03 0 1.66-1.34 3-3 3z"
    />
  </svg>

  <!-- Medal/Badge Icon -->
  <svg
    v-else-if="name === 'medal'"
    :class="class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>

  <!-- Flashcard Icon -->
  <svg
    v-else-if="name === 'flashcard'"
    :class="class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>

  <!-- Timer Icon -->
  <svg
    v-else-if="name === 'timer'"
    :class="class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>

  <!-- Star Icon -->
  <svg v-else-if="name === 'star'" :class="class" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>

  <!-- Crown Icon -->
  <svg v-else-if="name === 'crown'" :class="class" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"
    />
  </svg>

  <!-- Target Icon -->
  <svg
    v-else-if="name === 'target'"
    :class="class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="10" stroke-width="2" />
    <circle cx="12" cy="12" r="6" stroke-width="2" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>

  <!-- Brain Icon -->
  <svg v-else-if="name === 'brain'" :class="class" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M21.33 12.91C21.42 14.46 20.71 15.95 19.44 16.86L20.21 18.35C20.44 18.8 20.47 19.33 20.27 19.8C20.08 20.27 19.69 20.64 19.21 20.8L18.42 21.05C18.17 21.14 17.89 21.18 17.62 21.18C17.14 21.18 16.66 21.03 16.26 20.75C15.97 20.55 15.72 20.29 15.54 20C15.21 19.44 15.17 18.77 15.43 18.19L16.19 16.69C15.82 16.47 15.5 16.19 15.24 15.86C14.58 15.08 14.23 14.08 14.23 13.06C14.23 12.04 14.58 11.05 15.24 10.27C15.5 9.94 15.82 9.66 16.19 9.44L15.43 7.94C15.17 7.36 15.21 6.69 15.54 6.13C15.72 5.84 15.97 5.58 16.26 5.38C16.66 5.1 17.14 4.95 17.62 4.95C17.89 4.95 18.17 4.99 18.42 5.08L19.21 5.33C19.69 5.49 20.08 5.86 20.27 6.33C20.47 6.8 20.44 7.33 20.21 7.78L19.44 9.27C20.71 10.18 21.42 11.67 21.33 13.22M9.29 13.06C9.29 14.08 8.94 15.08 8.28 15.86C8.02 16.19 7.7 16.47 7.33 16.69L8.09 18.19C8.35 18.77 8.31 19.44 7.98 20C7.8 20.29 7.55 20.55 7.26 20.75C6.86 21.03 6.38 21.18 5.9 21.18C5.63 21.18 5.35 21.14 5.1 21.05L4.31 20.8C3.83 20.64 3.44 20.27 3.25 19.8C3.05 19.33 3.08 18.8 3.31 18.35L4.08 16.86C2.81 15.95 2.1 14.46 2.19 12.91C2.1 11.36 2.81 9.87 4.08 8.96L3.31 7.47C3.08 7.02 3.05 6.49 3.25 6.02C3.44 5.55 3.83 5.18 4.31 5.02L5.1 4.77C5.35 4.68 5.63 4.64 5.9 4.64C6.38 4.64 6.86 4.79 7.26 5.07C7.55 5.27 7.8 5.53 7.98 5.82C8.31 6.38 8.35 7.05 8.09 7.63L7.33 9.13C7.7 9.35 8.02 9.63 8.28 9.96C8.94 10.74 9.29 11.73 9.29 12.75M11.5 12.75C11.5 13.41 11.32 14.03 11 14.58C10.68 15.13 10.23 15.58 9.68 15.9C9.13 16.22 8.51 16.4 7.85 16.4C7.19 16.4 6.57 16.22 6.02 15.9C5.47 15.58 5.02 15.13 4.7 14.58C4.38 14.03 4.2 13.41 4.2 12.75C4.2 12.09 4.38 11.47 4.7 10.92C5.02 10.37 5.47 9.92 6.02 9.6C6.57 9.28 7.19 9.1 7.85 9.1C8.51 9.1 9.13 9.28 9.68 9.6C10.23 9.92 10.68 10.37 11 10.92C11.32 11.47 11.5 12.09 11.5 12.75Z"
    />
  </svg>

  <!-- Book/Library Icon -->
  <svg
    v-else-if="name === 'book'"
    :class="class"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>

  <!-- Celebration Icon -->
  <svg v-else-if="name === 'celebration'" :class="class" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"
    />
  </svg>

  <!-- Sparkles Icon -->
  <svg v-else-if="name === 'sparkles'" :class="class" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M7 22L9.5 19.5L7 17L8.5 11.5L7 6L9.5 3.5L12 1L14.5 3.5L17 6L15.5 11.5L17 17L14.5 19.5L12 22L9.5 19.5L7 22Z"
    />
  </svg>
</template>
