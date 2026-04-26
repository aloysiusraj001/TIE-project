import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function requireEnv(name: string) {
  const v = import.meta.env[name];
  if (!v || typeof v !== "string" || v.startsWith("YOUR_")) {
    throw new Error(
      `Missing or invalid ${name}. Create a ".env" in the repo root (copy from ".env.example"), then restart the dev server / rebuild.`,
    );
  }
  return v;
}

const firebaseConfig = {
  apiKey: requireEnv("VITE_FIREBASE_API_KEY"),
  authDomain: requireEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: requireEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: requireEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: requireEnv("VITE_FIREBASE_APP_ID"),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

// Ensure sessions survive refresh/browser restart for all roles.
void setPersistence(firebaseAuth, browserLocalPersistence).catch(() => {
  // Some environments (e.g. blocked third-party storage) may reject persistence.
});

