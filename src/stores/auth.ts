import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import { auth } from "../services/firebase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const userDisplayName = computed(
    () => user.value?.displayName || user.value?.email?.split("@")[0] || "User"
  );

  // Initialize auth state listener
  onAuthStateChanged(auth, (firebaseUser) => {
    console.log("🔄 Auth state changed:", firebaseUser ? `User: ${firebaseUser.email}` : "No user");
    user.value = firebaseUser;
    loading.value = false;
  });

  async function signUp(email: string, password: string, displayName?: string) {
    loading.value = true;
    error.value = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }

      return userCredential.user;
    } catch (err: any) {
      error.value = getAuthErrorMessage(err.code);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function signIn(email: string, password: string) {
    loading.value = true;
    error.value = null;

    try {
      console.log("🔐 Calling Firebase signInWithEmailAndPassword...");
      console.log("📧 Email:", email);
      console.log("🔑 Password length:", password.length);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      console.log("✅ Firebase sign-in successful:", userCredential.user.email);
      console.log("✅ User UID:", userCredential.user.uid);
      return userCredential.user;
    } catch (err: any) {
      console.error("❌ Firebase sign-in failed:", err);
      console.error("❌ Error code:", err.code);
      console.error("❌ Error message:", err.message);
      error.value = getAuthErrorMessage(err.code) || err.message;
      throw err;
    } finally {
      loading.value = false;
      console.log("🏁 Sign-in process complete");
    }
  }

  async function logout() {
    loading.value = true;
    error.value = null;

    try {
      await signOut(auth);
    } catch (err: any) {
      error.value = getAuthErrorMessage(err.code);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function resetPassword(email: string) {
    loading.value = true;
    error.value = null;

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      error.value = getAuthErrorMessage(err.code);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    userDisplayName,
    signUp,
    signIn,
    logout,
    resetPassword,
    clearError,
  };
});

function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    "auth/user-not-found": "No account found with this email address.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/too-many-requests": "Too many failed attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Please check your connection.",
    "auth/invalid-credential": "Invalid email or password.",
  };

  return errorMessages[errorCode] || "An error occurred. Please try again.";
}
