import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuthStore } from "./auth";

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  requirement: number;
  type: "focus" | "streak" | "quiz" | "flashcard" | "notes";
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface XPEvent {
  type: string;
  amount: number;
  timestamp: Date;
}

export const XP_REWARDS = {
  note_created: 3,
  focus_complete: 10,
  brain_reset: 5,
  flashcard_correct: 2,
  flashcard_wrong: 1,
  quiz_completed: 10,
  quiz_perfect: 20,
  daily_login: 5,
  streak_milestone: 15,
  teach_back_practice: 8,
} as const;

export const BADGES: Badge[] = [
  {
    id: "focus_10",
    name: "Focus Starter",
    icon: "target",
    description: "Complete 10 focus sessions",
    requirement: 10,
    type: "focus",
    unlocked: false,
  },
  {
    id: "focus_50",
    name: "Focus Master",
    icon: "trophy",
    description: "Complete 50 focus sessions",
    requirement: 50,
    type: "focus",
    unlocked: false,
  },
  {
    id: "streak_3",
    name: "Getting Consistent",
    icon: "fire",
    description: "Study for 3 days in a row",
    requirement: 3,
    type: "streak",
    unlocked: false,
  },
  {
    id: "streak_7",
    name: "7-Day Streak",
    icon: "star",
    description: "Study for 7 days in a row",
    requirement: 7,
    type: "streak",
    unlocked: false,
  },
  {
    id: "streak_30",
    name: "Monthly Champion",
    icon: "crown",
    description: "Study for 30 days in a row",
    requirement: 30,
    type: "streak",
    unlocked: false,
  },
  {
    id: "quiz_5",
    name: "Quiz Novice",
    icon: "notes",
    description: "Ace 5 quizzes with 100% score",
    requirement: 5,
    type: "quiz",
    unlocked: false,
  },
  {
    id: "quiz_10",
    name: "Quiz Champion",
    icon: "medal",
    description: "Ace 10 quizzes with 100% score",
    requirement: 10,
    type: "quiz",
    unlocked: false,
  },
  {
    id: "flashcard_100",
    name: "Flashcard Enthusiast",
    icon: "flashcard",
    description: "Review 100 flashcards",
    requirement: 100,
    type: "flashcard",
    unlocked: false,
  },
  {
    id: "flashcard_500",
    name: "Flashcard Ace",
    icon: "flashcard",
    description: "Review 500 flashcards",
    requirement: 500,
    type: "flashcard",
    unlocked: false,
  },
  {
    id: "notes_10",
    name: "Note Taker",
    icon: "book",
    description: "Create 10 notes",
    requirement: 10,
    type: "notes",
    unlocked: false,
  },
  {
    id: "notes_50",
    name: "Knowledge Builder",
    icon: "brain",
    description: "Create 50 notes",
    requirement: 50,
    type: "notes",
    unlocked: false,
  },
];

export const useGamificationStore = defineStore("gamification", () => {
  const authStore = useAuthStore();
  const xp = ref(0);
  const level = ref(0);
  const currentStreak = ref(0);
  const longestStreak = ref(0);
  const badges = ref<Badge[]>([...BADGES]);
  const xpHistory = ref<XPEvent[]>([]);
  const loading = ref(false);

  // Computed
  const xpToNextLevel = computed(() => {
    return (level.value + 1) * 100;
  });

  const xpProgress = computed(() => {
    const currentLevelXP = level.value * 100;
    const xpInCurrentLevel = xp.value - currentLevelXP;
    return (xpInCurrentLevel / 100) * 100; // percentage
  });

  const unlockedBadges = computed(() => {
    return badges.value.filter((b) => b.unlocked);
  });

  const lockedBadges = computed(() => {
    return badges.value.filter((b) => !b.unlocked);
  });

  // Stats counters
  const stats = ref({
    focusSessionsCompleted: 0,
    quizzesPerfect: 0,
    flashcardsReviewed: 0,
    notesCreated: 0,
    lastLoginDate: null as string | null,
  });

  // Load user gamification data
  async function loadUserData() {
    if (!authStore.user) return;

    try {
      loading.value = true;
      const userId = authStore.user.uid;
      const profileRef = doc(db, `users/${userId}/profile/gamification`);
      const profileDoc = await getDoc(profileRef);

      if (profileDoc.exists()) {
        const data = profileDoc.data();
        xp.value = data.xp || 0;
        level.value = data.level || 0;
        currentStreak.value = data.currentStreak || 0;
        longestStreak.value = data.longestStreak || 0;
        stats.value = data.stats || stats.value;

        // Load badges
        if (data.badges) {
          badges.value = badges.value.map((badge) => {
            const savedBadge = data.badges.find((b: Badge) => b.id === badge.id);
            return savedBadge
              ? { ...badge, unlocked: true, unlockedAt: savedBadge.unlockedAt }
              : badge;
          });
        }
      } else {
        // Initialize profile
        await saveUserData();
      }

      // Check daily login
      await checkDailyLogin();
    } catch (error) {
      console.error("Error loading gamification data:", error);
    } finally {
      loading.value = false;
    }
  }

  // Save user data
  async function saveUserData() {
    if (!authStore.user) return;

    try {
      const userId = authStore.user.uid;
      const profileRef = doc(db, `users/${userId}/profile/gamification`);

      await setDoc(profileRef, {
        xp: xp.value,
        level: level.value,
        currentStreak: currentStreak.value,
        longestStreak: longestStreak.value,
        badges: unlockedBadges.value.map((b) => ({
          id: b.id,
          unlockedAt: b.unlockedAt,
        })),
        stats: stats.value,
      });
    } catch (error) {
      console.error("Error saving gamification data:", error);
    }
  }

  // Award XP
  async function awardXP(eventType: keyof typeof XP_REWARDS) {
    const amount = XP_REWARDS[eventType];
    const oldLevel = level.value;

    xp.value += amount;
    level.value = Math.floor(xp.value / 100);

    xpHistory.value.push({
      type: eventType,
      amount,
      timestamp: new Date(),
    });

    await saveUserData();

    // Check for level up
    if (level.value > oldLevel) {
      return { leveledUp: true, newLevel: level.value };
    }

    return { leveledUp: false, newLevel: level.value };
  }

  // Check and award badges
  async function checkAndAwardBadges() {
    const newBadges: Badge[] = [];

    badges.value.forEach((badge) => {
      if (badge.unlocked) return;

      let shouldUnlock = false;

      switch (badge.type) {
        case "focus":
          shouldUnlock = stats.value.focusSessionsCompleted >= badge.requirement;
          break;
        case "streak":
          shouldUnlock = currentStreak.value >= badge.requirement;
          break;
        case "quiz":
          shouldUnlock = stats.value.quizzesPerfect >= badge.requirement;
          break;
        case "flashcard":
          shouldUnlock = stats.value.flashcardsReviewed >= badge.requirement;
          break;
        case "notes":
          shouldUnlock = stats.value.notesCreated >= badge.requirement;
          break;
      }

      if (shouldUnlock) {
        badge.unlocked = true;
        badge.unlockedAt = new Date();
        newBadges.push(badge);
      }
    });

    if (newBadges.length > 0) {
      await saveUserData();
    }

    return newBadges;
  }

  // Increment stat and check badges
  async function incrementStat(statType: keyof typeof stats.value, amount: number = 1) {
    if (statType === "lastLoginDate") return;

    (stats.value[statType] as number) += amount;
    await saveUserData();
    return await checkAndAwardBadges();
  }

  // Check daily login
  async function checkDailyLogin() {
    const today = new Date().toISOString().split("T")[0] || "";
    const lastLogin = stats.value.lastLoginDate;

    if (lastLogin !== today) {
      // Award login XP
      await awardXP("daily_login");

      // Update streak
      if (lastLogin && today) {
        const lastDate = new Date(lastLogin);
        const todayDate = new Date(today);
        const dayDiff = Math.floor(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 1) {
          // Consecutive day
          currentStreak.value++;
          if (currentStreak.value > longestStreak.value) {
            longestStreak.value = currentStreak.value;
          }

          // Check for streak milestones
          if ([3, 7, 30].includes(currentStreak.value)) {
            await awardXP("streak_milestone");
          }
        } else if (dayDiff > 1) {
          // Streak broken
          currentStreak.value = 1;
        }
      } else {
        currentStreak.value = 1;
      }

      stats.value.lastLoginDate = today;
      await saveUserData();
      await checkAndAwardBadges();
    }
  }

  return {
    xp,
    level,
    currentStreak,
    longestStreak,
    badges,
    xpHistory,
    loading,
    stats,
    xpToNextLevel,
    xpProgress,
    unlockedBadges,
    lockedBadges,
    loadUserData,
    awardXP,
    incrementStat,
    checkAndAwardBadges,
    checkDailyLogin,
  };
});
