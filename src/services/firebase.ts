import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration - Using WEB config for Capacitor
const firebaseConfig = {
  apiKey: "AIzaSyDKxnm3SQLJPEA8SFgMfPI_Hj-67usI9Gg", // WEB API key
  authDomain: "disjoint-7fac1.firebaseapp.com",
  projectId: "disjoint-7fac1",
  storageBucket: "disjoint-7fac1.firebasestorage.app",
  messagingSenderId: "18155953495",
  appId: "1:18155953495:web:bb880953645a6c68217212", // WEB app ID
};

console.log("🔥 Firebase Config:", {
  apiKey: firebaseConfig.apiKey ? "✓ Set" : "✗ Missing",
  authDomain: firebaseConfig.authDomain || "✗ Missing",
  projectId: firebaseConfig.projectId || "✗ Missing",
});

console.log("🔥 Full Firebase Config (for debugging):", JSON.stringify(firebaseConfig, null, 2));

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("✅ Firebase initialized successfully");
console.log("🔐 Auth instance:", auth ? "✓ Created" : "✗ Failed");
console.log("📊 Firestore instance:", db ? "✓ Created" : "✗ Failed");

// Test auth connectivity after a brief delay
setTimeout(() => {
  console.log(
    "⏱️ Auth ready state check:",
    auth.currentUser === undefined ? "✓ Ready (no user)" : "✓ Has user"
  );
}, 1000);

export default app;
