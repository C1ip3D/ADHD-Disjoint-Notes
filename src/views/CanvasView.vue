<template>
  <div
    class="canvas-view min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4"
    style="
      padding-top: max(env(safe-area-inset-top), 1.5rem);
      padding-bottom: 1.5rem;
    "
  >
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Canvas</h1>
          <p class="text-sm text-gray-600 mt-1">
            Grades and assignments from your courses
          </p>
        </div>
        <button
          @click="handleSync"
          :disabled="loading"
          class="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg"
        >
          <svg
            class="w-5 h-5"
            :class="{ 'animate-spin': loading }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Last Sync Info -->
      <div v-if="lastSync" class="text-xs text-gray-500 -mt-2">
        Last synced {{ formatLastSync(lastSync) }}
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg
            class="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0"
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
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>

      <!-- Canvas Not Setup -->
      <div v-if="!isCanvasSetup" class="bg-white rounded-xl shadow-lg p-8">
        <div class="text-center max-w-md mx-auto">
          <div
            class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">
            Connect Canvas LMS
          </h2>
          <p class="text-sm text-gray-600 mb-6">
            Connect your Canvas account to view your grades and assignments
            here.
          </p>
          <router-link
            to="/dashboard"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg"
          >
            Go to Dashboard to Setup
          </router-link>
        </div>
      </div>

      <template v-else>
        <!-- Filter Bar -->
        <div class="bg-white rounded-xl shadow-lg p-4">
          <div class="flex flex-wrap gap-3">
            <!-- Course Filter -->
            <select
              v-model="selectedCourse"
              class="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            >
              <option value="all">All Courses</option>
              <option
                v-for="course in courses"
                :key="course.id"
                :value="course.id"
              >
                {{ course.name }}
              </option>
            </select>

            <!-- Status Filter -->
            <select
              v-model="selectedStatus"
              class="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            >
              <option
                v-for="status in statusOptions"
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
                <span v-if="status.count > 0">({{ status.count }})</span>
              </option>
            </select>
          </div>
        </div>

        <!-- Course Grades Section -->
        <div v-if="grades.length > 0">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">
            Course Grades
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="grade in filteredGrades"
              :key="grade.course_id"
              class="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all"
            >
              <h3 class="font-bold text-gray-900 mb-1 truncate">
                {{ grade.course_name }}
              </h3>
              <p class="text-xs text-gray-500 mb-4">{{ grade.course_code }}</p>

              <!-- Grade Display -->
              <div class="flex items-end gap-2 mb-3">
                <div class="text-3xl font-bold text-blue-600">
                  {{ getLetterGrade(grade.current_score) }}
                </div>
                <div
                  v-if="grade.current_score !== null"
                  class="text-lg text-gray-600 mb-1"
                >
                  ({{ grade.current_score.toFixed(1) }}%)
                </div>
              </div>

              <!-- Progress Bar -->
              <div
                v-if="grade.current_score !== null"
                class="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
              >
                <div
                  class="h-full rounded-full transition-all"
                  :class="getGradeColor(grade.current_score)"
                  :style="{ width: `${grade.current_score}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Assignments Section -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-3">Assignments</h2>

          <!-- Loading State -->
          <div v-if="loading" class="bg-white rounded-xl shadow-lg p-5">
            <div class="space-y-4">
              <div
                v-for="i in 5"
                :key="i"
                class="animate-pulse flex items-start gap-4"
              >
                <div class="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="filteredAssignments.length === 0"
            class="bg-white rounded-xl shadow-lg p-8"
          >
            <div class="text-center">
              <div
                class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <p class="text-sm text-gray-600 font-medium">
                No assignments found
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Try changing your filters or sync your Canvas data
              </p>
            </div>
          </div>

          <!-- Assignments List -->
          <div v-else class="space-y-3">
            <div
              v-for="assignment in filteredAssignments"
              :key="assignment.id"
              class="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all"
            >
              <div class="flex items-start gap-4">
                <!-- Due Date Badge -->
                <div
                  class="flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center text-sm font-bold"
                  :class="getDueDateBadgeClass(assignment.due_at)"
                >
                  <div
                    v-if="assignment.due_at"
                    class="text-[10px] uppercase opacity-75"
                  >
                    {{ formatMonth(assignment.due_at) }}
                  </div>
                  <div v-if="assignment.due_at" class="text-2xl leading-none">
                    {{ formatDay(assignment.due_at) }}
                  </div>
                  <div v-else class="text-xs text-center">No Due Date</div>
                </div>

                <!-- Assignment Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-gray-900 mb-1">
                        {{ assignment.name }}
                      </h3>
                      <div
                        class="flex items-center gap-2 text-xs text-gray-600"
                      >
                        <span class="font-medium">{{
                          assignment.course_name
                        }}</span>
                        <span class="text-gray-400">•</span>
                        <span>{{ assignment.course_code }}</span>
                      </div>
                    </div>

                    <!-- Status Badge -->
                    <div class="flex-shrink-0">
                      <span
                        :class="getStatusBadgeClass(assignment)"
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      >
                        {{ getStatusText(assignment) }}
                      </span>
                    </div>
                  </div>

                  <!-- Assignment Details -->
                  <div
                    class="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-3"
                  >
                    <div
                      v-if="assignment.due_at"
                      class="flex items-center gap-1"
                    >
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span
                        >Due {{ formatRelativeTime(assignment.due_at) }}</span
                      >
                    </div>

                    <div
                      v-if="assignment.points_possible"
                      class="flex items-center gap-1"
                    >
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
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        ></path>
                      </svg>
                      <span>{{ assignment.points_possible }} points</span>
                    </div>

                    <div
                      v-if="assignment.submission?.score !== null"
                      class="flex items-center gap-1 font-medium text-green-600"
                    >
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span
                        >Grade: {{ assignment.submission?.score }}/{{
                          assignment.points_possible
                        }}</span
                      >
                    </div>

                    <div
                      v-if="assignment.submission?.submitted_at"
                      class="flex items-center gap-1 text-green-600"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span
                        >Submitted
                        {{
                          formatDate(assignment.submission?.submitted_at)
                        }}</span
                      >
                    </div>
                  </div>

                  <!-- View in Canvas Link -->
                  <a
                    v-if="assignment.html_url"
                    :href="assignment.html_url"
                    target="_blank"
                    class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium mt-3"
                  >
                    View in Canvas
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCanvasStore } from "../stores/canvas";
import { useSettingsStore } from "../stores/settings";
import type { CanvasAssignmentWithSubmission } from "../services/canvasLMS";

const canvasStore = useCanvasStore();
const settingsStore = useSettingsStore();

// State
const selectedCourse = ref<number | "all">("all");
const selectedStatus = ref<
  "all" | "submitted" | "pending" | "missing" | "overdue"
>("all");

// Computed
const isCanvasSetup = computed(() => canvasStore.isCanvasSetup);
const loading = computed(() => canvasStore.loading);
const error = computed(() => canvasStore.error);
const lastSync = computed(() => canvasStore.lastSync);
const grades = computed(() => canvasStore.grades);
const courses = computed(() => settingsStore.settings.canvasCourses);

const statusOptions = computed(() => [
  {
    value: "all" as const,
    label: "All",
    count: canvasStore.assignments.length,
  },
  {
    value: "pending" as const,
    label: "Pending",
    count: canvasStore.pendingAssignments.length,
  },
  {
    value: "submitted" as const,
    label: "Submitted",
    count: canvasStore.submittedAssignments.length,
  },
  {
    value: "overdue" as const,
    label: "Overdue",
    count: canvasStore.overdueAssignments.length,
  },
  {
    value: "missing" as const,
    label: "Missing",
    count: canvasStore.missingAssignments.length,
  },
]);

const filteredAssignments = computed(() => {
  return canvasStore.filterAssignments({
    courseId: selectedCourse.value === "all" ? undefined : selectedCourse.value,
    status: selectedStatus.value,
  });
});

const filteredGrades = computed(() => {
  if (selectedCourse.value === "all") {
    return grades.value;
  }
  return grades.value.filter(
    (grade) => grade.course_id === selectedCourse.value
  );
});

// Methods
async function handleSync() {
  try {
    await canvasStore.syncCanvasData();
  } catch (err) {
    console.error("Sync failed:", err);
  }
}

function formatLastSync(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
}

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

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return `${Math.abs(diffDays)} day${
      Math.abs(diffDays) !== 1 ? "s" : ""
    } ago`;
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
}

function getDueDateBadgeClass(dateString: string | null): string {
  if (!dateString) return "bg-gray-100 text-gray-700";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "bg-red-100 text-red-700";
  if (diffDays === 0) return "bg-orange-100 text-orange-700";
  if (diffDays <= 2) return "bg-yellow-100 text-yellow-700";
  return "bg-blue-100 text-blue-700";
}

function getLetterGrade(score: number | null): string {
  if (score === null) return "N/A";

  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

function getGradeColor(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 80) return "bg-blue-500";
  if (score >= 70) return "bg-yellow-500";
  if (score >= 60) return "bg-orange-500";
  return "bg-red-500";
}

function getStatusText(assignment: CanvasAssignmentWithSubmission): string {
  if (assignment.submission?.score !== null) return "Graded";
  if (assignment.submission?.submitted_at) return "Submitted";
  if (assignment.submission?.missing) return "Missing";
  if (assignment.due_at && new Date(assignment.due_at) < new Date())
    return "Overdue";
  return "Pending";
}

function getStatusBadgeClass(
  assignment: CanvasAssignmentWithSubmission
): string {
  if (assignment.submission?.score !== null)
    return "bg-green-100 text-green-700";
  if (assignment.submission?.submitted_at) return "bg-blue-100 text-blue-700";
  if (assignment.submission?.missing) return "bg-red-100 text-red-700";
  if (assignment.due_at && new Date(assignment.due_at) < new Date())
    return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

onMounted(async () => {
  if (isCanvasSetup.value) {
    // Load data if not already loaded
    if (canvasStore.assignments.length === 0) {
      await canvasStore.syncCanvasData();
    }
  }
});
</script>
