

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCW9LF6yxcVmls0Q2D21p3m0kQjuqCSdrI",
  authDomain: "shopmarkets-3d562.firebaseapp.com",
  databaseURL: "https://shopmarkets-3d562-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shopmarkets-3d562",
  storageBucket: "shopmarkets-3d562.firebasestorage.app",
  messagingSenderId: "456618903566",
  appId: "1:456618903566:web:22fd2ac34d49143153d45f",
  measurementId: "G-4QKG17P3T7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
