import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2iGOUwaH3_2CnhubCkHRCoMr0HKtdYsM",
  authDomain: "gen-lang-client-0799007039.firebaseapp.com",
  projectId: "gen-lang-client-0799007039",
  storageBucket: "gen-lang-client-0799007039.firebasestorage.app",
  messagingSenderId: "192478094706",
  appId: "1:192478094706:web:6414c75c35716008ec29eb",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services
export const auth = firebase.auth();
export const firestore = firebase.firestore();
