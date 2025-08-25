import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBLlXgS082SWNsgoH2JmKiRvJFiET1bi1U",
  authDomain: "react-chatapp-839f1.firebaseapp.com",
  projectId: "react-chatapp-839f1",
  storageBucket: "react-chatapp-839f1.firebasestorage.app",
  messagingSenderId: "129364357640",
  appId: "1:129364357640:web:7a31764e39a1fc28bf97bd",
  measurementId: "G-T59HHER0MH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);


