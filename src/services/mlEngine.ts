// Use environment variable if available, fallback to localhost
const ML_API = import.meta.env.VITE_ML_API_URL || "http://localhost:5000";

export interface NoteFormatPrediction {
  recommendedFormat: string;
  confidence: number;
  scores: { [format: string]: number };
}

export interface AttentionZonesPrediction {
  weakSections: number[];
  errorCounts: { [section: number]: number };
}

export interface OptimalTimePrediction {
  topHours: number[];
  productivity: number[];
  allScores: { [hour: number]: number };
}

export interface QuizDifficultyPrediction {
  difficulty: "easy" | "medium" | "hard";
  adjustment: number;
}

export interface FlashcardIntervalPrediction {
  nextReviewMs: number;
  difficulty: number;
}

export class MLEngine {
  // Predict best note format
  static async predictNoteFormat(
    userId: string,
    quizScores: Array<{ format: string; score: number }>
  ): Promise<NoteFormatPrediction> {
    try {
      const response = await fetch(`${ML_API}/predict/note-format`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          quizScores,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to predict note format");
      }

      return await response.json();
    } catch (error) {
      console.error("ML Engine error (note format):", error);
      // Fallback
      return {
        recommendedFormat: "text",
        confidence: 0.5,
        scores: { text: 75 },
      };
    }
  }

  // Predict attention zones
  static async predictAttentionZones(
    userId: string,
    quizErrors: Array<{ section?: number; noteId: string }>
  ): Promise<AttentionZonesPrediction> {
    try {
      const response = await fetch(`${ML_API}/predict/attention-zones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          quizErrors,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to predict attention zones");
      }

      return await response.json();
    } catch (error) {
      console.error("ML Engine error (attention zones):", error);
      return {
        weakSections: [],
        errorCounts: {},
      };
    }
  }

  // Predict optimal study time
  static async predictOptimalTime(
    userId: string,
    sessionHistory: Array<{ hour: number; completed: boolean; score?: number }>
  ): Promise<OptimalTimePrediction> {
    try {
      const response = await fetch(`${ML_API}/predict/optimal-time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          sessionHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to predict optimal time");
      }

      return await response.json();
    } catch (error) {
      console.error("ML Engine error (optimal time):", error);
      // Fallback to afternoon hours
      return {
        topHours: [14, 15, 16],
        productivity: [0.8, 0.75, 0.7],
        allScores: { 14: 0.8, 15: 0.75, 16: 0.7 },
      };
    }
  }

  // Predict quiz difficulty
  static async predictQuizDifficulty(
    userId: string,
    recentScores: number[]
  ): Promise<QuizDifficultyPrediction> {
    try {
      const response = await fetch(`${ML_API}/predict/quiz-difficulty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          recentScores,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to predict quiz difficulty");
      }

      return await response.json();
    } catch (error) {
      console.error("ML Engine error (quiz difficulty):", error);
      return {
        difficulty: "medium",
        adjustment: 0,
      };
    }
  }

  // Predict flashcard review interval
  static async predictFlashcardInterval(
    cardId: string,
    difficulty: number,
    successRate: number
  ): Promise<FlashcardIntervalPrediction> {
    try {
      const response = await fetch(`${ML_API}/predict/flashcard-interval`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId,
          difficulty,
          successRate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to predict flashcard interval");
      }

      return await response.json();
    } catch (error) {
      console.error("ML Engine error (flashcard interval):", error);
      // Fallback to 1 day
      return {
        nextReviewMs: 86400000,
        difficulty,
      };
    }
  }

  // Get all predictions for user
  static async getAllPredictions(userId: string, analytics: any) {
    const [format, zones, time, difficulty] = await Promise.all([
      this.predictNoteFormat(userId, analytics.quizScores || []),
      this.predictAttentionZones(userId, analytics.quizErrors || []),
      this.predictOptimalTime(userId, analytics.sessionHistory || []),
      this.predictQuizDifficulty(
        userId,
        (analytics.quizScores || []).map((q: any) => q.score)
      ),
    ]);

    return {
      noteFormat: format,
      attentionZones: zones,
      optimalTime: time,
      quizDifficulty: difficulty,
    };
  }
}
