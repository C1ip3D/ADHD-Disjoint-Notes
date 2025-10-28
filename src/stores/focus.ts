import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuthStore } from "./auth";

export interface Session {
  id?: string;
  type: "focus" | "break";
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
  completed: boolean;
  breaks: number;
  noteId?: string;
}

export const useFocusStore = defineStore("focus", () => {
  const authStore = useAuthStore();
  const currentSession = ref<Session | null>(null);
  const sessionHistory = ref<Session[]>([]);
  const loading = ref(false);

  // Timer state
  const isActive = ref(false);
  const isPaused = ref(false);
  const timeRemaining = ref(25 * 60); // 25 minutes in seconds
  const timerType = ref<"focus" | "break">("focus");

  // Settings
  const focusDuration = ref(25 * 60); // 25 minutes
  const breakDuration = ref(5 * 60); // 5 minutes

  // Computed
  const totalFocusMinutes = computed(() => {
    return sessionHistory.value.reduce((acc, session) => {
      if (session.type === "focus" && session.completed) {
        return acc + Math.floor(session.duration / 60);
      }
      return acc;
    }, 0);
  });

  const todaysSessions = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessionHistory.value.filter((session) => new Date(session.startTime) >= today);
  });

  const currentStreak = computed(() => {
    // Calculate consecutive days with at least one completed session
    const dates = new Set<string>();
    sessionHistory.value.forEach((session) => {
      if (session.completed) {
        const dateKey = session.startTime.toISOString().split("T")[0];
        if (dateKey) {
          dates.add(dateKey);
        }
      }
    });

    const sortedDates = Array.from(dates).sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split("T")[0] || "";
    let expectedDate = new Date(today || new Date());

    for (const dateStr of sortedDates) {
      const expectedDateStr = expectedDate.toISOString().split("T")[0];
      if (dateStr === expectedDateStr) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  });

  // Start timer
  function startTimer(type: "focus" | "break" = "focus") {
    timerType.value = type;
    timeRemaining.value = type === "focus" ? focusDuration.value : breakDuration.value;
    isActive.value = true;
    isPaused.value = false;

    currentSession.value = {
      type,
      startTime: new Date(),
      endTime: null,
      duration: 0,
      completed: false,
      breaks: 0,
    };
  }

  // Pause timer
  function pauseTimer() {
    isPaused.value = true;
  }

  // Resume timer
  function resumeTimer() {
    isPaused.value = false;
  }

  // Stop timer
  function stopTimer(completed: boolean = false) {
    if (currentSession.value) {
      currentSession.value.endTime = new Date();
      currentSession.value.completed = completed;
      currentSession.value.duration = Math.floor(
        (currentSession.value.endTime.getTime() - currentSession.value.startTime.getTime()) / 1000
      );
    }

    isActive.value = false;
    isPaused.value = false;
  }

  // Complete session
  async function completeSession() {
    if (!currentSession.value) return;

    stopTimer(true);

    // Save to Firestore
    if (authStore.user) {
      try {
        const userId = authStore.user.uid;
        const sessionData = {
          userId,
          type: currentSession.value.type,
          startTime: Timestamp.fromDate(currentSession.value.startTime),
          endTime: Timestamp.fromDate(currentSession.value.endTime!),
          duration: currentSession.value.duration,
          completed: true,
          breaks: currentSession.value.breaks,
          noteId: currentSession.value.noteId,
        };

        const docRef = await addDoc(collection(db, `users/${userId}/sessions`), sessionData);

        const savedSession: Session = {
          id: docRef.id,
          ...currentSession.value,
        };

        sessionHistory.value.unshift(savedSession);

        return savedSession;
      } catch (error) {
        console.error("Error saving session:", error);
      }
    }

    const completedSession = currentSession.value;
    currentSession.value = null;
    return completedSession;
  }

  // Reset timer
  function resetTimer() {
    isActive.value = false;
    isPaused.value = false;
    timeRemaining.value = timerType.value === "focus" ? focusDuration.value : breakDuration.value;
    currentSession.value = null;
  }

  // Tick timer (called every second)
  function tick() {
    if (!isActive.value || isPaused.value) return;

    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      // Timer finished
      completeSession();
    }
  }

  // Load session history
  async function loadSessionHistory() {
    if (!authStore.user) return;

    loading.value = true;

    try {
      const userId = authStore.user.uid;
      const sessionsRef = collection(db, `users/${userId}/sessions`);
      const q = query(sessionsRef, where("type", "in", ["focus", "break"]));
      const querySnapshot = await getDocs(q);

      sessionHistory.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          startTime: data.startTime.toDate(),
          endTime: data.endTime ? data.endTime.toDate() : null,
          duration: data.duration,
          completed: data.completed,
          breaks: data.breaks || 0,
          noteId: data.noteId,
        } as Session;
      });

      // Sort by start time descending
      sessionHistory.value.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    } catch (error) {
      console.error("Error loading session history:", error);
    } finally {
      loading.value = false;
    }
  }

  // Update settings
  function updateSettings(focus: number, breakTime: number) {
    focusDuration.value = focus * 60;
    breakDuration.value = breakTime * 60;

    // Save to localStorage
    localStorage.setItem("focusDuration", focus.toString());
    localStorage.setItem("breakDuration", breakTime.toString());
  }

  // Load settings
  function loadSettings() {
    const savedFocus = localStorage.getItem("focusDuration");
    const savedBreak = localStorage.getItem("breakDuration");

    if (savedFocus) {
      focusDuration.value = parseInt(savedFocus) * 60;
    }
    if (savedBreak) {
      breakDuration.value = parseInt(savedBreak) * 60;
    }
  }

  // Format time (MM:SS)
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return {
    currentSession,
    sessionHistory,
    loading,
    isActive,
    isPaused,
    timeRemaining,
    timerType,
    focusDuration,
    breakDuration,
    totalFocusMinutes,
    todaysSessions,
    currentStreak,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    completeSession,
    resetTimer,
    tick,
    loadSessionHistory,
    updateSettings,
    loadSettings,
    formatTime,
  };
});
