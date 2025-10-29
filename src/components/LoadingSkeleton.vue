<template>
  <div class="animate-pulse" :class="containerClass">
    <!-- Note Card Skeleton -->
    <div
      v-if="type === 'note'"
      class="bg-white rounded-lg shadow-sm p-6 space-y-3"
    >
      <div class="flex items-center justify-between">
        <div class="h-6 bg-gray-200 rounded w-24"></div>
        <div class="h-5 bg-gray-200 rounded w-32"></div>
      </div>
      <div class="h-4 bg-gray-300 rounded w-full"></div>
      <div class="h-4 bg-gray-300 rounded w-5/6"></div>
      <div class="h-4 bg-gray-300 rounded w-4/6"></div>
    </div>

    <!-- Flashcard Skeleton -->
    <div
      v-else-if="type === 'flashcard'"
      class="bg-white rounded-lg shadow-sm p-6 space-y-4"
    >
      <div class="h-6 bg-gray-200 rounded w-3/4"></div>
      <div class="space-y-2">
        <div class="h-4 bg-gray-300 rounded w-full"></div>
        <div class="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>

    <!-- List Item Skeleton -->
    <div
      v-else-if="type === 'list-item'"
      class="flex items-center space-x-4 py-3"
    >
      <div class="h-12 w-12 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-300 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Text Block Skeleton -->
    <div v-else-if="type === 'text-block'" class="space-y-3">
      <div class="h-8 bg-gray-300 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded w-full"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>

    <!-- Image Skeleton -->
    <div
      v-else-if="type === 'image'"
      class="bg-gray-300 rounded-lg"
      :style="imageStyle"
    ></div>

    <!-- Avatar Skeleton -->
    <div
      v-else-if="type === 'avatar'"
      class="bg-gray-300 rounded-full"
      :style="avatarStyle"
    ></div>

    <!-- Button Skeleton -->
    <div
      v-else-if="type === 'button'"
      class="h-10 bg-gray-300 rounded-lg w-32"
    ></div>

    <!-- Custom Rectangle -->
    <div v-else :class="customClass" :style="customStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  type?:
    | "note"
    | "flashcard"
    | "list-item"
    | "text-block"
    | "image"
    | "avatar"
    | "button"
    | "custom";
  width?: string;
  height?: string;
  rounded?: boolean;
  containerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "custom",
  width: "100%",
  height: "1rem",
  rounded: true,
  containerClass: "",
});

const imageStyle = computed(() => ({
  width: props.width,
  height: props.height || "200px",
}));

const avatarStyle = computed(() => ({
  width: props.width || "48px",
  height: props.height || "48px",
}));

const customClass = computed(() => {
  const classes = ["bg-gray-300"];
  if (props.rounded) classes.push("rounded");
  return classes.join(" ");
});

const customStyle = computed(() => ({
  width: props.width,
  height: props.height,
}));
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
