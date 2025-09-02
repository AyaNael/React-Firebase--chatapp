// src/hooks/useUsersCache.js
import { useRef, useState, useCallback, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export default function useUsersCache() {
  const [users, setUsers] = useState({});          // { uid: {id, displayName, ...} }
  const unsubsRef = useRef({});                    // { uid: () => void }

  // أضيفي/أكشفي اشتراك مستخدم معيّن مرّة واحدة
  const ensureUser = useCallback((uid) => {
    if (!uid) return;
    // إن كان عندنا اشتراك سابق لنفس uid لا نكرره
    if (unsubsRef.current[uid]) return;

    const unsubscribe = onSnapshot(doc(db, "users", uid), (snap) => {
      if (snap.exists()) {
        setUsers((prev) => ({ ...prev, [uid]: { id: uid, ...snap.data() } }));
      }
    });

    unsubsRef.current[uid] = unsubscribe;
  }, []);

  // (اختياري) إلغاء اشتراك مستخدم واحد وتنظيفه من الكاش
  const clearUser = useCallback((uid) => {
    const m = unsubsRef.current;
    if (m[uid]) {
      try { m[uid](); } catch { }
      delete m[uid];
    }
    setUsers((prev) => {
      const copy = { ...prev };
      delete copy[uid];
      return copy;
    });
  }, []);

  // تنظيف *كل* الاشتراكات عند unmount
  useEffect(() => {
    // خُذي مرجع الكائن الحالي مرة واحدة (لا تعملي reassignment لاحقًا لـ unsubsRef.current)
    const bag = unsubsRef.current;

    return () => {
      Object.values(bag).forEach((unsub) => {
        try { unsub && unsub(); } catch { }
      });
    };
  }, []);

  return { users, ensureUser, clearUser };
}
