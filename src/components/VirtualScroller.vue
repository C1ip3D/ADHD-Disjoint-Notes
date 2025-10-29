<template>
  <div
    ref="scrollContainer"
    class="virtual-scroller"
    @scroll="handleScroll"
    :style="containerStyle"
  >
    <div
      class="virtual-scroller-spacer"
      :style="{ height: `${totalHeight}px` }"
    >
      <div
        class="virtual-scroller-content"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <slot
          v-for="item in visibleItems"
          :key="getItemKey(item)"
          :item="item"
          :index="item.index"
        ></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

interface Props {
  items: T[];
  itemHeight: number;
  bufferSize?: number;
  keyField?: string;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  bufferSize: 5,
  keyField: "id",
  height: "100%",
});

const scrollContainer = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const containerHeight = ref(0);

// Total height of all items
const totalHeight = computed(() => props.items.length * props.itemHeight);

// Calculate visible range with buffer
const visibleRange = computed(() => {
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop.value / props.itemHeight) - props.bufferSize
  );
  const endIndex = Math.min(
    props.items.length - 1,
    Math.ceil((scrollTop.value + containerHeight.value) / props.itemHeight) +
      props.bufferSize
  );
  return { startIndex, endIndex };
});

// Visible items with their indices
const visibleItems = computed(() => {
  const { startIndex, endIndex } = visibleRange.value;
  return props.items.slice(startIndex, endIndex + 1).map((item, idx) => ({
    ...item,
    index: startIndex + idx,
  }));
});

// Offset for positioning visible items
const offsetY = computed(
  () => visibleRange.value.startIndex * props.itemHeight
);

// Container style
const containerStyle = computed(() => ({
  height: props.height,
  overflow: "auto",
  position: "relative" as const,
}));

// Get unique key for each item
function getItemKey(item: any): string | number {
  return item[props.keyField] ?? item.index;
}

// Handle scroll event
function handleScroll() {
  if (scrollContainer.value) {
    scrollTop.value = scrollContainer.value.scrollTop;
  }
}

// Update container height
function updateContainerHeight() {
  if (scrollContainer.value) {
    containerHeight.value = scrollContainer.value.clientHeight;
  }
}

// Handle window resize
const resizeObserver = ref<ResizeObserver | null>(null);

onMounted(() => {
  updateContainerHeight();

  // Observe container size changes
  if (scrollContainer.value && typeof ResizeObserver !== "undefined") {
    resizeObserver.value = new ResizeObserver(updateContainerHeight);
    resizeObserver.value.observe(scrollContainer.value);
  }

  // Fallback for older browsers
  window.addEventListener("resize", updateContainerHeight);
});

onBeforeUnmount(() => {
  if (resizeObserver.value && scrollContainer.value) {
    resizeObserver.value.unobserve(scrollContainer.value);
  }
  window.removeEventListener("resize", updateContainerHeight);
});

// Watch for items changes and reset scroll if needed
watch(
  () => props.items.length,
  () => {
    if (scrollContainer.value && scrollTop.value > totalHeight.value) {
      scrollContainer.value.scrollTop = 0;
    }
  }
);

// Expose scroll methods
defineExpose({
  scrollToIndex: (index: number) => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = index * props.itemHeight;
    }
  },
  scrollToTop: () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0;
    }
  },
  scrollToBottom: () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = totalHeight.value;
    }
  },
});
</script>

<style scoped>
.virtual-scroller {
  width: 100%;
}

.virtual-scroller-spacer {
  position: relative;
  width: 100%;
}

.virtual-scroller-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  will-change: transform;
}
</style>
