<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="onCancel"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all"
          :class="variantClasses"
        >
          <!-- Icon -->
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4"
            :class="iconBgClass"
          >
            <svg
              v-if="variant === 'danger'"
              class="h-6 w-6"
              :class="iconColorClass"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              v-else-if="variant === 'warning'"
              class="h-6 w-6"
              :class="iconColorClass"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              :class="iconColorClass"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Title -->
          <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
            {{ title }}
          </h3>

          <!-- Message -->
          <p class="text-sm text-gray-600 text-center mb-6">
            {{ message }}
          </p>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="onCancel"
              class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
            >
              {{ cancelText }}
            </button>
            <button
              @click="onConfirm"
              class="flex-1 px-4 py-2.5 rounded-xl transition-all font-medium"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "info" | "warning" | "danger";
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "info",
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const variantClasses = computed(() => {
  switch (props.variant) {
    case "danger":
      return "border-2 border-red-200";
    case "warning":
      return "border-2 border-yellow-200";
    default:
      return "border-2 border-blue-200";
  }
});

const iconBgClass = computed(() => {
  switch (props.variant) {
    case "danger":
      return "bg-red-100";
    case "warning":
      return "bg-yellow-100";
    default:
      return "bg-blue-100";
  }
});

const iconColorClass = computed(() => {
  switch (props.variant) {
    case "danger":
      return "text-red-600";
    case "warning":
      return "text-yellow-600";
    default:
      return "text-blue-600";
  }
});

const confirmButtonClass = computed(() => {
  switch (props.variant) {
    case "danger":
      return "bg-red-500 text-white hover:bg-red-600";
    case "warning":
      return "bg-yellow-500 text-white hover:bg-yellow-600";
    default:
      return "bg-blue-500 text-white hover:bg-blue-600";
  }
});

function onConfirm() {
  emit("confirm");
}

function onCancel() {
  emit("cancel");
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.9) translateY(20px);
}

.modal-leave-to .relative {
  transform: scale(0.9) translateY(20px);
}
</style>
