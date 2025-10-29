<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold text-gray-900">Due Soon</h2>
      <router-link
        to="/canvas"
        class="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
      >
        View All
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </router-link>
    </div>

    <div class="bg-white rounded-xl shadow-lg p-5">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-3">
        <div
          v-for="i in 3"
          :key="i"
          class="animate-pulse flex items-start gap-3"
        >
          <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="upcomingAssignments.length === 0"
        class="text-center py-8"
      >
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
        >
          <svg
            class="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <p class="text-sm text-gray-600 font-medium">All caught up!</p>
        <p class="text-xs text-gray-500 mt-1">
          No assignments due in the next 7 days
        </p>
      </div>

      <!-- Assignments List -->
      <div v-else class="space-y-3">
        <router-link
          v-for="assignment in displayAssignments"
          :key="assignment.id"
          to="/canvas"
          class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all group cursor-pointer"
        >
          <!-- Due Date Badge -->
          <div
            class="flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-bold"
            :class="getDueDateBadgeClass(assignment.due_at)"
          >
            <div class="text-[10px] uppercase opacity-75">
              {{ formatMonth(assignment.due_at) }}
            </div>
            <div class="text-lg leading-none">
              {{ formatDay(assignment.due_at) }}
            </div>
          </div>

          <!-- Assignment Info -->
          <div class="flex-1 min-w-0">
            <h3
              class="font-semibold text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors"
            >
              {{ assignment.name }}
            </h3>
            <p class="text-xs text-gray-600 mt-0.5">
              {{ assignment.course_name }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-gray-500">
                Due {{ formatRelativeTime(assignment.due_at) }}
              </span>
              <span
                v-if="assignment.points_possible"
                class="text-xs text-gray-400"
              >
                • {{ assignment.points_possible }} pts
              </span>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="flex-shrink-0">
            <span
              v-if="assignment.submission?.submitted_at"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Submitted
            </span>
            <span
              v-else-if="isOverdue(assignment.due_at)"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"
            >
              Overdue
            </span>
          </div>
        </router-link>

        <!-- Show More Link -->
        <router-link
          v-if="upcomingAssignments.length > maxDisplay"
          to="/canvas"
          class="block text-center text-xs text-blue-600 hover:text-blue-700 font-medium pt-2"
        >
          +{{ upcomingAssignments.length - maxDisplay }} more assignments
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useCanvasStore } from "../stores/canvas";

const canvasStore = useCanvasStore();
const maxDisplay = 5;

const loading = computed(() => canvasStore.loading);
const upcomingAssignments = computed(() => canvasStore.upcomingAssignments);
const displayAssignments = computed(() =>
  upcomingAssignments.value.slice(0, maxDisplay)
);

function formatMonth(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short" });
}

function formatDay(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.getDate().toString();
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  return `in ${diffDays} days`;
}

function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
}

function getDueDateBadgeClass(dateString: string | null): string {
  if (!dateString) return "bg-gray-100 text-gray-700";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "bg-red-100 text-red-700";
  if (diffDays === 0) return "bg-orange-100 text-orange-700";
  if (diffDays === 1) return "bg-yellow-100 text-yellow-700";
  return "bg-blue-100 text-blue-700";
}

onMounted(() => {
  // Load Canvas data if not already loaded
  if (
    canvasStore.isCanvasSetup &&
    canvasStore.assignments.length === 0 &&
    !canvasStore.loading
  ) {
    canvasStore.loadAssignments();
  }
});
</script>
