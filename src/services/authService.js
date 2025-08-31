import {
    signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../config/firebase";

export const signInEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signUpEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
export const subscribeAuth = (cb) => onAuthStateChanged(auth, cb);
export const applyAuthPersistence = (remember) =>
    setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);