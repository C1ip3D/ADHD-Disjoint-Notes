import { MLEngine } from "./mlEngine";

// Base intervals for each difficulty level (in milliseconds)
const BASE_INTERVALS = {
  1: 3600000, // 1 hour
  2: 21600000, // 6 hours
  3: 86400000, // 1 day
  4: 259200000, // 3 days
  5: 604800000, // 7 days
} as const;

export class SpacedRepetitionService {
  /**
   * Calculate next review time using ML-enhanced spaced repetition
   */
  static async calculateNextReview(
    cardId: string,
    difficulty: number,
    successRate: number,
    consecutiveCorrect: number
  ): Promise<{ nextReviewDate: Date; intervalMs: number }> {
    try {
      // Get ML prediction
      const prediction = await MLEngine.predictFlashcardInterval(cardId, difficulty, successRate);

      const nextReviewDate = new Date(Date.now() + prediction.nextReviewMs);

      return {
        nextReviewDate,
        intervalMs: prediction.nextReviewMs,
      };
    } catch (error) {
      console.error("Error calculating next review:", error);
      // Fallback to standard algorithm
      return this.calculateNextReviewFallback(difficulty, successRate, consecutiveCorrect);
    }
  }

  /**
   * Fallback algorithm when ML service is unavailable
   */
  static calculateNextReviewFallback(
    difficulty: number,
    successRate: number,
    consecutiveCorrect: number
  ): { nextReviewDate: Date; intervalMs: number } {
    let baseInterval =
      BASE_INTERVALS[difficulty as keyof typeof BASE_INTERVALS] || BASE_INTERVALS[3];

    // Adjust based on success rate
    if (successRate > 0.8) {
      baseInterval *= 1.5;
    } else if (successRate < 0.5) {
      baseInterval *= 0.7;
    }

    // Bonus for consecutive correct answers
    if (consecutiveCorrect >= 3) {
      baseInterval *= 1.2;
    }

    const nextReviewDate = new Date(Date.now() + baseInterval);

    return {
      nextReviewDate,
      intervalMs: baseInterval,
    };
  }

  /**
   * Adjust difficulty based on review result
   */
  static adjustDifficulty(
    currentDifficulty: number,
    correct: boolean,
    consecutiveCorrect: number
  ): 1 | 2 | 3 | 4 | 5 {
    let newDifficulty = currentDifficulty;

    if (correct) {
      // Decrease difficulty (make easier/longer interval)
      if (consecutiveCorrect >= 2) {
        newDifficulty = Math.max(1, currentDifficulty - 1);
      }
    } else {
      // Increase difficulty (make harder/shorter interval)
      newDifficulty = Math.min(5, currentDifficulty + 1);
    }

    return newDifficulty as 1 | 2 | 3 | 4 | 5;
  }

  /**
   * Format interval for display
   */
  static formatInterval(intervalMs: number): string {
    const hours = Math.floor(intervalMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days >= 1) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours >= 1) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      const minutes = Math.floor(intervalMs / (1000 * 60));
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
  }

  /**
   * Get difficulty label
   */
  static getDifficultyLabel(difficulty: number): string {
    const labels = {
      1: "Very Easy",
      2: "Easy",
      3: "Medium",
      4: "Hard",
      5: "Very Hard",
    };
    return labels[difficulty as keyof typeof labels] || "Medium";
  }

  /**
   * Get difficulty color
   */
  static getDifficultyColor(difficulty: number): string {
    const colors = {
      1: "#10b981", // green
      2: "#3b82f6", // blue
      3: "#f59e0b", // amber
      4: "#ef4444", // red
      5: "#dc2626", // dark red
    };
    return colors[difficulty as keyof typeof colors] || "#f59e0b";
  }
}
