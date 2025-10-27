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
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { type Note } from "../services/aiProvider";
import { useAuthStore } from "./auth";

export const useNotesStore = defineStore("notes", () => {
  const notes = ref<Note[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();

  const sortedNotes = computed(() => {
    return [...notes.value].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  const notesBySubject = computed(() => {
    const grouped: Record<string, Note[]> = {};
    notes.value.forEach((note) => {
      const subject = note.subject || "General";
      if (!grouped[subject]) {
        grouped[subject] = [];
      }
      grouped[subject].push(note);
    });
    return grouped;
  });

  async function fetchNotes() {
    if (!authStore.isAuthenticated) return;

    loading.value = true;
    error.value = null;

    try {
      const notesRef = collection(db, "notes");
      const q = query(
        notesRef,
        where("userId", "==", authStore.user?.uid),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);

      notes.value = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate(),
          } as Note)
      );
    } catch (err) {
      error.value = "Failed to fetch notes";
      console.error("Error fetching notes:", err);
    } finally {
      loading.value = false;
    }
  }

  async function addNote(note: Omit<Note, "id">) {
    if (!authStore.isAuthenticated) throw new Error("User not authenticated");

    loading.value = true;
    error.value = null;

    try {
      const docRef = await addDoc(collection(db, "notes"), {
        ...note,
        userId: authStore.user?.uid,
        timestamp: note.timestamp,
      });

      const newNote: Note = {
        id: docRef.id,
        ...note,
      };

      notes.value.unshift(newNote);
      return newNote;
    } catch (err) {
      error.value = "Failed to add note";
      console.error("Error adding note:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateNote(id: string, updates: Partial<Note>) {
    if (!authStore.isAuthenticated) throw new Error("User not authenticated");

    loading.value = true;
    error.value = null;

    try {
      const noteRef = doc(db, "notes", id);
      await updateDoc(noteRef, updates);

      const index = notes.value.findIndex((note) => note.id === id);
      if (index !== -1) {
        notes.value[index] = { ...notes.value[index], ...updates } as Note;
      }
    } catch (err) {
      error.value = "Failed to update note";
      console.error("Error updating note:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteNote(id: string) {
    if (!authStore.isAuthenticated) throw new Error("User not authenticated");

    loading.value = true;
    error.value = null;

    try {
      await deleteDoc(doc(db, "notes", id));
      notes.value = notes.value.filter((note) => note.id !== id);
    } catch (err) {
      error.value = "Failed to delete note";
      console.error("Error deleting note:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function getNotesBySubject(subject: string): Note[] {
    return notes.value.filter((note) => note.subject === subject);
  }

  function clearNotes() {
    notes.value = [];
  }

  return {
    notes,
    loading,
    error,
    sortedNotes,
    notesBySubject,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    getNotesBySubject,
    clearNotes,
  };
});
