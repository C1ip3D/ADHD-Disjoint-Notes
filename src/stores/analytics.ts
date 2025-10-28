import { defineStore } from "pinia";
import { ref } from "vue";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuthStore } from "./auth";

export interface QuizAttempt {
  subject: string;
  score: number;
  duration: number;
  timestamp: Date;
  noteId: string;
  format: "text" | "outline" | "mindmap";
  section?: number;
}

export interface FlashcardAttempt {
  cardId: string;
  correct: boolean;
  responseTime: number;
  difficulty: number;
  timestamp: Date;
}

export interface NoteViewEvent {
  noteId: string;
  format: "text" | "outline" | "mindmap";
  duration: number;
  timestamp: Date;
}

export interface FocusSession {
  startTime: Date;
  endTime: Date;
  duration: number;
  completed: boolean;
  sound?: string;
  breaks: number;
  noteId?: string;
  hour: number;
}

export interface DailyAnalytics {
  date: string;
  studyMinutes: number;
  focusMinutes: number;
  quizScores: number[];
  flashcardAccuracy: number;
  noteFormatsUsed: { [key: string]: number };
  performanceByHour: { [hour: number]: { score: number; count: number } };
  xpEarned: number;
  sessionsCompleted: number;
}

export const useAnalyticsStore = defineStore("analytics", () => {
  const authStore = useAuthStore();
  const loading = ref(false);
  const currentDayAnalytics = ref<DailyAnalytics | null>(null);

  // Track quiz attempt
  async function trackQuizAttempt(attempt: QuizAttempt) {
    if (!authStore.user) return;

    try {
      const userId = authStore.user.uid;
      const dateKey = getDateKey(new Date());

      // Add to sessions collection
      await addDoc(collection(db, `users/${userId}/sessions`), {
        type: "quiz",
        ...attempt,
        timestamp: Timestamp.fromDate(attempt.timestamp),
      });

      // Update daily analytics
      await updateDailyAnalytics(dateKey, {
        quizScores: [attempt.score],
        studyMinutes: Math.floor(attempt.duration / 60),
        noteFormatsUsed: { [attempt.format]: 1 },
        performanceByHour: {
          [attempt.timestamp.getHours()]: { score: attempt.score, count: 1 },
        },
      });
    } catch (error) {
      console.error("Error tracking quiz attempt:", error);
    }
  }

  // Track flashcard review
  async function trackFlashcardReview(attempt: FlashcardAttempt) {
    if (!authStore.user) return;

    try {
      const userId = authStore.user.uid;
      const dateKey = getDateKey(new Date());

      await addDoc(collection(db, `users/${userId}/sessions`), {
        type: "flashcard",
        ...attempt,
        timestamp: Timestamp.fromDate(attempt.timestamp),
      });

      await updateDailyAnalytics(dateKey, {
        flashcardAccuracy: attempt.correct ? 1 : 0,
      });
    } catch (error) {
      console.error("Error tracking flashcard review:", error);
    }
  }

  // Track note view
  async function trackNoteView(event: NoteViewEvent) {
    if (!authStore.user) return;

    try {
      const userId = authStore.user.uid;
      const dateKey = getDateKey(new Date());

      await addDoc(collection(db, `users/${userId}/sessions`), {
        type: "note_view",
        ...event,
        timestamp: Timestamp.fromDate(event.timestamp),
      });

      await updateDailyAnalytics(dateKey, {
        noteFormatsUsed: { [event.format]: 1 },
      });
    } catch (error) {
      console.error("Error tracking note view:", error);
    }
  }

  // Track focus session
  async function trackFocusSession(session: FocusSession) {
    if (!authStore.user) return;

    try {
      const userId = authStore.user.uid;
      const dateKey = getDateKey(session.startTime);

      await addDoc(collection(db, `users/${userId}/sessions`), {
        type: "focus",
        ...session,
        startTime: Timestamp.fromDate(session.startTime),
        endTime: Timestamp.fromDate(session.endTime),
      });

      await updateDailyAnalytics(dateKey, {
        focusMinutes: Math.floor(session.duration / 60),
        sessionsCompleted: session.completed ? 1 : 0,
        performanceByHour: {
          [session.hour]: { score: session.completed ? 100 : 0, count: 1 },
        },
      });
    } catch (error) {
      console.error("Error tracking focus session:", error);
    }
  }

  // Get user analytics for ML predictions
  async function getUserAnalytics() {
    if (!authStore.user) return null;

    try {
      const userId = authStore.user.uid;

      // Get last 30 days of sessions
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sessionsRef = collection(db, `users/${userId}/sessions`);
      const q = query(sessionsRef, where("timestamp", ">=", Timestamp.fromDate(thirtyDaysAgo)));
      const snapshot = await getDocs(q);

      const quizScores: { format: string; score: number }[] = [];
      const quizErrors: { section?: number; noteId: string }[] = [];
      const sessionHistory: any[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const type = data.type;

        if (type === "quiz") {
          quizScores.push({
            format: data.format || "text",
            score: data.score || 0,
          });

          if (data.score < 70 && data.section !== undefined) {
            quizErrors.push({
              section: data.section,
              noteId: data.noteId,
            });
          }
        } else if (type === "focus") {
          sessionHistory.push({
            hour: data.hour,
            completed: data.completed,
            score: data.completed ? 100 : 50,
          });
        }
      });

      return {
        quizScores,
        quizErrors,
        sessionHistory,
      };
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      return null;
    }
  }

  // Helper: Update daily analytics
  async function updateDailyAnalytics(dateKey: string, updates: Partial<DailyAnalytics>) {
    if (!authStore.user) return;

    try {
      const userId = authStore.user.uid;
      const analyticsRef = doc(db, `users/${userId}/analytics/${dateKey}`);
      const analyticsDoc = await getDoc(analyticsRef);

      let current: DailyAnalytics;

      if (analyticsDoc.exists()) {
        current = analyticsDoc.data() as DailyAnalytics;
      } else {
        current = {
          date: dateKey,
          studyMinutes: 0,
          focusMinutes: 0,
          quizScores: [],
          flashcardAccuracy: 0,
          noteFormatsUsed: {},
          performanceByHour: {},
          xpEarned: 0,
          sessionsCompleted: 0,
        };
      }

      // Merge updates
      if (updates.studyMinutes) {
        current.studyMinutes += updates.studyMinutes;
      }
      if (updates.focusMinutes) {
        current.focusMinutes += updates.focusMinutes;
      }
      if (updates.quizScores) {
        current.quizScores = [...current.quizScores, ...updates.quizScores];
      }
      if (updates.flashcardAccuracy !== undefined) {
        const total = current.flashcardAccuracy * (current.quizScores.length || 1);
        current.flashcardAccuracy =
          (total + updates.flashcardAccuracy) / (current.quizScores.length + 1);
      }
      if (updates.noteFormatsUsed) {
        Object.entries(updates.noteFormatsUsed).forEach(([format, count]) => {
          current.noteFormatsUsed[format] = (current.noteFormatsUsed[format] || 0) + count;
        });
      }
      if (updates.performanceByHour) {
        Object.entries(updates.performanceByHour).forEach(([hour, data]) => {
          const h = parseInt(hour);
          if (!current.performanceByHour[h]) {
            current.performanceByHour[h] = { score: 0, count: 0 };
          }
          current.performanceByHour[h].score += data.score;
          current.performanceByHour[h].count += data.count;
        });
      }
      if (updates.xpEarned) {
        current.xpEarned += updates.xpEarned;
      }
      if (updates.sessionsCompleted) {
        current.sessionsCompleted += updates.sessionsCompleted;
      }

      await setDoc(analyticsRef, current);
      currentDayAnalytics.value = current;
    } catch (error) {
      console.error("Error updating daily analytics:", error);
    }
  }

  // Helper: Get date key (YYYY-MM-DD)
  function getDateKey(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  // Load today's analytics
  async function loadTodayAnalytics() {
    if (!authStore.user) return;

    try {
      loading.value = true;
      const userId = authStore.user.uid;
      const dateKey = getDateKey(new Date());
      const analyticsRef = doc(db, `users/${userId}/analytics/${dateKey}`);
      const analyticsDoc = await getDoc(analyticsRef);

      if (analyticsDoc.exists()) {
        currentDayAnalytics.value = analyticsDoc.data() as DailyAnalytics;
      } else {
        currentDayAnalytics.value = null;
      }
    } catch (error) {
      console.error("Error loading today's analytics:", error);
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    currentDayAnalytics,
    trackQuizAttempt,
    trackFlashcardReview,
    trackNoteView,
    trackFocusSession,
    getUserAnalytics,
    loadTodayAnalytics,
  };
});
