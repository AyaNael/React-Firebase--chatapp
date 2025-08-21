import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyBfj2bR_T0OJsgTibqvLHbpXlPFoyrLaMo",
  authDomain: "chatapp-6a3a3.firebaseapp.com",
  projectId: "chatapp-6a3a3",
  storageBucket: "chatapp-6a3a3.firebasestorage.app",
  messagingSenderId: "345750171532",
  appId: "1:345750171532:web:9f3b2093b1575cb6c0f0a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);