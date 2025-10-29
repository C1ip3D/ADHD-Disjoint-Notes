import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  createCanvasService,
  type CanvasAssignmentWithSubmission,
  type CanvasCourseGrade,
} from "../services/canvasLMS";
import { useSettingsStore } from "./settings";

export const useCanvasStore = defineStore("canvas", () => {
  const settingsStore = useSettingsStore();

  // State
  const assignments = ref<CanvasAssignmentWithSubmission[]>([]);
  const grades = ref<CanvasCourseGrade[]>([]);
  const loading = ref(false);
  const lastSync = ref<Date | null>(null);
  const error = ref<string | null>(null);

  // Computed
  const isCanvasSetup = computed(
    () => settingsStore.settings.canvasSetupCompleted
  );

  const upcomingAssignments = computed(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return assignments.value
      .filter((assignment) => {
        if (!assignment.due_at) return false;
        const dueDate = new Date(assignment.due_at);
        return dueDate >= now && dueDate <= sevenDaysFromNow;
      })
      .sort((a, b) => {
        if (!a.due_at || !b.due_at) return 0;
        return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
      });
  });

  const overdueAssignments = computed(() => {
    const now = new Date();

    return assignments.value.filter((assignment) => {
      if (!assignment.due_at) return false;
      const dueDate = new Date(assignment.due_at);
      const isOverdue = dueDate < now;
      const notSubmitted = !assignment.submission?.submitted_at;
      return isOverdue && notSubmitted;
    });
  });

  const submittedAssignments = computed(() => {
    return assignments.value.filter(
      (assignment) => assignment.submission?.submitted_at
    );
  });

  const pendingAssignments = computed(() => {
    return assignments.value.filter((assignment) => {
      const hasSubmission = assignment.submission?.submitted_at;
      const hasDueDate = assignment.due_at;
      const isOverdue = hasDueDate && new Date(assignment.due_at!) < new Date();
      return !hasSubmission && !isOverdue;
    });
  });

  const missingAssignments = computed(() => {
    return assignments.value.filter(
      (assignment) => assignment.submission?.missing
    );
  });

  // Actions
  async function loadAssignments() {
    if (!isCanvasSetup.value) {
      error.value = "Canvas not set up";
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const canvasService = createCanvasService(
        settingsStore.settings.canvasUrl,
        settingsStore.settings.canvasToken
      );

      const allAssignments = await canvasService.fetchAllAssignments();
      assignments.value = allAssignments;
      lastSync.value = new Date();
    } catch (err: any) {
      console.error("Error loading assignments:", err);
      error.value = err.message || "Failed to load assignments";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadGrades() {
    if (!isCanvasSetup.value) {
      error.value = "Canvas not set up";
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const canvasService = createCanvasService(
        settingsStore.settings.canvasUrl,
        settingsStore.settings.canvasToken
      );

      const courseGrades = await canvasService.fetchCourseGrades();
      grades.value = courseGrades;
    } catch (err: any) {
      console.error("Error loading grades:", err);
      error.value = err.message || "Failed to load grades";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function syncCanvasData() {
    if (!isCanvasSetup.value) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      await Promise.all([loadAssignments(), loadGrades()]);
    } catch (err: any) {
      console.error("Error syncing Canvas data:", err);
      error.value = err.message || "Failed to sync Canvas data";
    } finally {
      loading.value = false;
    }
  }

  function getAssignmentsByCourse(courseId: number) {
    return assignments.value.filter(
      (assignment) => assignment.course_id === courseId
    );
  }

  function getGradeByCourse(courseId: number) {
    return grades.value.find((grade) => grade.course_id === courseId);
  }

  function filterAssignments(options: {
    courseId?: number;
    status?: "all" | "submitted" | "pending" | "missing" | "overdue";
  }) {
    let filtered = [...assignments.value];

    // Filter by course
    if (options.courseId) {
      filtered = filtered.filter(
        (assignment) => assignment.course_id === options.courseId
      );
    }

    // Filter by status
    if (options.status && options.status !== "all") {
      const now = new Date();
      switch (options.status) {
        case "submitted":
          filtered = filtered.filter(
            (assignment) => assignment.submission?.submitted_at
          );
          break;
        case "pending":
          filtered = filtered.filter((assignment) => {
            const hasSubmission = assignment.submission?.submitted_at;
            const hasDueDate = assignment.due_at;
            const isOverdue = hasDueDate && new Date(assignment.due_at!) < now;
            return !hasSubmission && !isOverdue;
          });
          break;
        case "missing":
          filtered = filtered.filter(
            (assignment) => assignment.submission?.missing
          );
          break;
        case "overdue":
          filtered = filtered.filter((assignment) => {
            if (!assignment.due_at) return false;
            const dueDate = new Date(assignment.due_at);
            const isOverdue = dueDate < now;
            const notSubmitted = !assignment.submission?.submitted_at;
            return isOverdue && notSubmitted;
          });
          break;
      }
    }

    return filtered;
  }

  function clearData() {
    assignments.value = [];
    grades.value = [];
    lastSync.value = null;
    error.value = null;
  }

  return {
    // State
    assignments,
    grades,
    loading,
    lastSync,
    error,
    // Computed
    isCanvasSetup,
    upcomingAssignments,
    overdueAssignments,
    submittedAssignments,
    pendingAssignments,
    missingAssignments,
    // Actions
    loadAssignments,
    loadGrades,
    syncCanvasData,
    getAssignmentsByCourse,
    getGradeByCourse,
    filterAssignments,
    clearData,
  };
});
