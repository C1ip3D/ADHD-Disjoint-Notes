<template>
  <div ref="imageContainer" :class="containerClass" :style="containerStyle">
    <transition name="fade">
      <img
        v-if="isLoaded"
        :src="currentSrc"
        :alt="alt"
        :class="imageClass"
        :style="imageStyle"
        @error="handleError"
      />
    </transition>

    <!-- Loading placeholder -->
    <div
      v-if="!isLoaded && !hasError"
      class="lazy-image-placeholder"
      :style="placeholderStyle"
    >
      <div v-if="showLoadingIndicator" class="lazy-image-spinner">
        <svg
          class="animate-spin h-8 w-8 text-gray-400"
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
      </div>
      <slot name="placeholder"></slot>
    </div>

    <!-- Error state -->
    <div v-if="hasError" class="lazy-image-error" :style="placeholderStyle">
      <svg
        class="h-12 w-12 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
      <p class="text-gray-500 text-sm mt-2">Failed to load image</p>
      <slot name="error"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";

interface Props {
  src: string;
  alt?: string;
  placeholder?: string;
  width?: string | number;
  height?: string | number;
  containerClass?: string;
  imageClass?: string;
  lazy?: boolean;
  rootMargin?: string;
  threshold?: number;
  showLoadingIndicator?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  alt: "",
  placeholder: "",
  lazy: true,
  rootMargin: "50px",
  threshold: 0.01,
  showLoadingIndicator: true,
});

const imageContainer = ref<HTMLElement | null>(null);
const isLoaded = ref(false);
const isInView = ref(false);
const hasError = ref(false);
const currentSrc = ref("");

let observer: IntersectionObserver | null = null;

const containerStyle = computed(() => {
  const style: Record<string, string> = {
    position: "relative",
    overflow: "hidden",
  };

  if (props.width) {
    style.width =
      typeof props.width === "number" ? `${props.width}px` : props.width;
  }

  if (props.height) {
    style.height =
      typeof props.height === "number" ? `${props.height}px` : props.height;
  }

  return style;
});

const placeholderStyle = computed(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f3f4f6",
  borderRadius: "0.5rem",
}));

const imageStyle = computed(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
}));

function loadImage() {
  if (currentSrc.value || !props.src) return;

  const img = new Image();

  img.onload = () => {
    currentSrc.value = props.src;
    isLoaded.value = true;
    hasError.value = false;
  };

  img.onerror = () => {
    hasError.value = true;
    isLoaded.value = false;
  };

  // Load placeholder first if provided
  if (props.placeholder && !currentSrc.value) {
    const placeholderImg = new Image();
    placeholderImg.onload = () => {
      currentSrc.value = props.placeholder;
      isLoaded.value = true;
    };
    placeholderImg.src = props.placeholder;
  }

  // Then load actual image
  img.src = props.src;
}

function handleError() {
  hasError.value = true;
  isLoaded.value = false;
}

function setupIntersectionObserver() {
  if (!imageContainer.value || !props.lazy) {
    loadImage();
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isInView.value) {
          isInView.value = true;
          loadImage();
          if (observer && imageContainer.value) {
            observer.unobserve(imageContainer.value);
          }
        }
      });
    },
    {
      rootMargin: props.rootMargin,
      threshold: props.threshold,
    }
  );

  observer.observe(imageContainer.value);
}

// Watch src changes
watch(
  () => props.src,
  () => {
    isLoaded.value = false;
    hasError.value = false;
    currentSrc.value = "";
    if (!props.lazy || isInView.value) {
      loadImage();
    }
  }
);

onMounted(() => {
  setupIntersectionObserver();
});

onBeforeUnmount(() => {
  if (observer && imageContainer.value) {
    observer.unobserve(imageContainer.value);
  }
});
</script>

<style scoped>
.lazy-image-placeholder,
.lazy-image-error {
  flex-direction: column;
}

.lazy-image-spinner {
  display: flex;
  align-items: center;
  justify-center;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.fade-enter-active {
  transition: opacity 0.3s ease-in;
}

.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
