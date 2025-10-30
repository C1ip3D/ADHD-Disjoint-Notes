import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuthStore } from "./auth";

export interface Flashcard {
  id: string;
  userId: string;
  noteId: string;
  term: string;
  definition: string;
  example?: string;
  imageUrl?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  lastReviewed: Date | null;
  nextReview: Date;
  successRate: number;
  reviewCount: number;
  consecutiveCorrect: number;
  createdAt: Date;
}

export const useFlashcardsStore = defineStore("flashcards", () => {
  const authStore = useAuthStore();
  const flashcards = ref<Flashcard[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const dueFlashcards = computed(() => {
    const now = new Date();
    return flashcards.value.filter((card) => new Date(card.nextReview) <= now);
  });

  const totalReviewsToday = computed(() => {
    return dueFlashcards.value.length;
  });

  const flashcardsByNote = computed(() => {
    const grouped: { [noteId: string]: Flashcard[] } = {};
    flashcards.value.forEach((card) => {
      if (!grouped[card.noteId]) {
        grouped[card.noteId] = [];
      }
      const noteGroup = grouped[card.noteId];
      if (noteGroup) {
        noteGroup.push(card);
      }
    });
    return grouped;
  });

  const averageSuccessRate = computed(() => {
    if (flashcards.value.length === 0) return 0;
    const sum = flashcards.value.reduce(
      (acc, card) => acc + card.successRate,
      0
    );
    return Math.round((sum / flashcards.value.length) * 100);
  });

  // Fetch all flashcards
  async function fetchFlashcards() {
    if (!authStore.user) return;

    loading.value = true;
    error.value = null;

    try {
      const userId = authStore.user.uid;
      const flashcardsRef = collection(db, "flashcards");
      const q = query(
        flashcardsRef,
        where("userId", "==", userId),
        orderBy("nextReview", "asc")
      );
      const querySnapshot = await getDocs(q);

      flashcards.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          noteId: data.noteId,
          term: data.term,
          definition: data.definition,
          example: data.example,
          imageUrl: data.imageUrl,
          difficulty: data.difficulty,
          lastReviewed: data.lastReviewed ? data.lastReviewed.toDate() : null,
          nextReview: data.nextReview.toDate(),
          successRate: data.successRate || 0,
          reviewCount: data.reviewCount || 0,
          consecutiveCorrect: data.consecutiveCorrect || 0,
          createdAt: data.createdAt.toDate(),
        } as Flashcard;
      });
    } catch (err) {
      error.value = "Failed to fetch flashcards";
      console.error("Error fetching flashcards:", err);
    } finally {
      loading.value = false;
    }
  }

  // Create flashcard
  async function createFlashcard(
    flashcard: Omit<Flashcard, "id" | "userId" | "createdAt">
  ) {
    if (!authStore.user) throw new Error("User not authenticated");

    loading.value = true;
    error.value = null;

    try {
      const userId = authStore.user.uid;

      // Build document data, excluding undefined optional fields for Firebase
      const docData: any = {
        userId,
        noteId: flashcard.noteId,
        term: flashcard.term,
        definition: flashcard.definition,
        difficulty: flashcard.difficulty || 3,
        lastReviewed: flashcard.lastReviewed
          ? Timestamp.fromDate(flashcard.lastReviewed)
          : null,
        nextReview: Timestamp.fromDate(flashcard.nextReview),
        successRate: flashcard.successRate || 0,
        reviewCount: flashcard.reviewCount || 0,
        consecutiveCorrect: flashcard.consecutiveCorrect || 0,
        createdAt: Timestamp.now(),
      };

      // Only add optional fields if they have values
      if (flashcard.example) {
        docData.example = flashcard.example;
      }
      if (flashcard.imageUrl) {
        docData.imageUrl = flashcard.imageUrl;
      }

      const docRef = await addDoc(collection(db, "flashcards"), docData);

      const newCard: Flashcard = {
        id: docRef.id,
        userId,
        ...flashcard,
        createdAt: new Date(),
      };

      flashcards.value.push(newCard);
      return newCard;
    } catch (err) {
      error.value = "Failed to create flashcard";
      console.error("Error creating flashcard:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Update flashcard after review
  async function updateFlashcardReview(
    cardId: string,
    correct: boolean,
    nextReviewMs: number
  ) {
    if (!authStore.user) throw new Error("User not authenticated");

    try {
      const cardIndex = flashcards.value.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) throw new Error("Flashcard not found");

      const card = flashcards.value[cardIndex];
      if (!card) throw new Error("Flashcard not found");
      const now = new Date();

      // Update difficulty
      let newDifficulty = card.difficulty;
      if (correct) {
        newDifficulty = Math.max(1, card.difficulty - 1) as 1 | 2 | 3 | 4 | 5;
        card.consecutiveCorrect++;
      } else {
        newDifficulty = Math.min(5, card.difficulty + 1) as 1 | 2 | 3 | 4 | 5;
        card.consecutiveCorrect = 0;
      }

      // Update success rate
      const newReviewCount = card.reviewCount + 1;
      const newSuccessRate =
        (card.successRate * card.reviewCount + (correct ? 1 : 0)) /
        newReviewCount;

      // Calculate next review date
      const nextReview = new Date(now.getTime() + nextReviewMs);

      // Update Firestore
      const cardRef = doc(db, "flashcards", cardId);
      await updateDoc(cardRef, {
        difficulty: newDifficulty,
        lastReviewed: Timestamp.fromDate(now),
        nextReview: Timestamp.fromDate(nextReview),
        successRate: newSuccessRate,
        reviewCount: newReviewCount,
        consecutiveCorrect: card.consecutiveCorrect,
      });

      // Update local state
      if (flashcards.value[cardIndex]) {
        flashcards.value[cardIndex] = {
          ...card,
          difficulty: newDifficulty,
          lastReviewed: now,
          nextReview,
          successRate: newSuccessRate,
          reviewCount: newReviewCount,
        };
      }
    } catch (err) {
      error.value = "Failed to update flashcard";
      console.error("Error updating flashcard:", err);
      throw err;
    }
  }

  // Delete flashcard
  async function deleteFlashcard(cardId: string) {
    if (!authStore.user) throw new Error("User not authenticated");

    loading.value = true;
    error.value = null;

    try {
      await deleteDoc(doc(db, "flashcards", cardId));
      flashcards.value = flashcards.value.filter((card) => card.id !== cardId);
    } catch (err) {
      error.value = "Failed to delete flashcard";
      console.error("Error deleting flashcard:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Get flashcards for a specific note
  function getFlashcardsByNote(noteId: string): Flashcard[] {
    return flashcards.value.filter((card) => card.noteId === noteId);
  }

  // Clear flashcards
  function clearFlashcards() {
    flashcards.value = [];
  }

  return {
    flashcards,
    loading,
    error,
    dueFlashcards,
    totalReviewsToday,
    flashcardsByNote,
    averageSuccessRate,
    fetchFlashcards,
    createFlashcard,
    updateFlashcardReview,
    deleteFlashcard,
    getFlashcardsByNote,
    clearFlashcards,
  };
});
