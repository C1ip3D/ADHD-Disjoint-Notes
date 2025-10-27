import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, indexedDBLocalPersistence, initializeAuth } from "firebase/auth";
import { Capacitor } from "@capacitor/core";

// Firebase configuration - Using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

console.log("🚀 Initializing Firebase...");
console.log("Platform:", Capacitor.getPlatform());
console.log("Native:", Capacitor.isNativePlatform());
console.log("Firebase Config:", {
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : "Missing",
  authDomain: firebaseConfig.authDomain || "Missing",
  projectId: firebaseConfig.projectId || "Missing",
  storageBucket: firebaseConfig.storageBucket || "Missing",
  messagingSenderId: firebaseConfig.messagingSenderId || "Missing",
  appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 20)}...` : "Missing",
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with proper persistence for Capacitor
const auth = Capacitor.isNativePlatform()
  ? (() => {
      console.log("📱 Using Capacitor native platform - initializing with indexedDB persistence");
      return initializeAuth(app, {
        persistence: indexedDBLocalPersistence,
      });
    })()
  : (() => {
      console.log("🌐 Using web platform - using default auth");
      return getAuth(app);
    })();

// Initialize Firestore
const db = getFirestore(app);

console.log("✅ Firebase initialized successfully");
console.log("✅ Auth instance:", auth ? "Created" : "Failed");
console.log("✅ Firestore instance:", db ? "Created" : "Failed");

export { db, auth };
export default app;
