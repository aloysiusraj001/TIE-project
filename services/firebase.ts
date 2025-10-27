import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTPu3MRQm_Bq7Ur3Mg7jEw77T97MBhzXE",
  authDomain: "gen-lang-client-0799007039.firebaseapp.com",
  projectId: "gen-lang-client-0799007039",
  storageBucket: "gen-lang-client-0799007039.firebasestorage.app",
  messagingSenderId: "192478094706",
  appId: "1:192478094706:web:6414c75c35716008ec29eb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
