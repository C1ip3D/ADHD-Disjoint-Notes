import { useGamificationStore, XP_REWARDS } from "../stores/gamification";

export class XPTracker {
  /**
   * Award XP for an event and check for level ups and badges
   */
  static async awardXP(eventType: keyof typeof XP_REWARDS): Promise<{
    leveledUp: boolean;
    newLevel: number;
    newBadges: any[];
    xpAwarded: number;
  }> {
    const gamificationStore = useGamificationStore();
    const xpAwarded = XP_REWARDS[eventType];

    // Award XP
    const result = await gamificationStore.awardXP(eventType);

    // Check for new badges
    const newBadges = await gamificationStore.checkAndAwardBadges();

    return {
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
      newBadges,
      xpAwarded,
    };
  }

  /**
   * Track stat increment and award badges
   */
  static async incrementStat(
    statType: "focusSessionsCompleted" | "quizzesPerfect" | "flashcardsReviewed" | "notesCreated",
    amount: number = 1
  ): Promise<any[]> {
    const gamificationStore = useGamificationStore();
    return await gamificationStore.incrementStat(statType, amount);
  }

  /**
   * Show level up notification
   */
  static showLevelUpNotification(level: number) {
    // This will be triggered by the LevelUpModal component
    const event = new CustomEvent("levelUp", { detail: { level } });
    window.dispatchEvent(event);
  }

  /**
   * Show badge unlocked notification
   */
  static showBadgeNotification(badge: any) {
    const event = new CustomEvent("badgeUnlocked", { detail: { badge } });
    window.dispatchEvent(event);
  }

  /**
   * Show XP gain animation
   */
  static showXPGain(amount: number, eventType: string) {
    const event = new CustomEvent("xpGained", {
      detail: { amount, eventType },
    });
    window.dispatchEvent(event);
  }

  /**
   * Get XP for event type
   */
  static getXPAmount(eventType: keyof typeof XP_REWARDS): number {
    return XP_REWARDS[eventType];
  }

  /**
   * Format XP display
   */
  static formatXP(xp: number): string {
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}K`;
    }
    return xp.toString();
  }
}
