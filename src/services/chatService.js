import {
    doc, getDoc, setDoc,
    collection, serverTimestamp, onSnapshot, query,
    where, orderBy, limit, writeBatch, updateDoc
} from "firebase/firestore";
import { db } from "../config/firebase";

export const chatIdFor = (a, b) => [a, b].sort().join("_");

// ✅ إنشاء/تحديث بروفايل المستخدم عند تسجيل الدخول
export async function ensureUserProfile(user) {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        await setDoc(ref, {
            displayName: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            isOnline: true,
            createdAt: serverTimestamp(),
            lastSeen: serverTimestamp(),
        });
    } else {
        await setDoc(ref, {
            isOnline: true,
            lastSeen: serverTimestamp(),
            displayName: user.displayName || snap.data().displayName || "",
            photoURL: user.photoURL || snap.data().photoURL || "",
        }, { merge: true });
    }
}

// ✅ تعيين حالة المستخدم Offline عند الإغلاق
export async function setUserOffline(uid) {
    if (!uid) return;
    await setDoc(doc(db, "users", uid), {
        isOnline: false,
        lastSeen: serverTimestamp(),
    }, { merge: true });
}

// إنشاء/جلب الشات
export async function getOrCreateChat(myUid, otherUid) {
    const id = chatIdFor(myUid, otherUid);
    const ref = doc(db, "chats", id);


    try {
        // لو الشات موجود، هذا يكفّي ويجنّبنا القراءة
        await updateDoc(ref, { updatedAt: serverTimestamp() });
    } catch (e) {
        // لو مش موجود → أنشئيه لأول مرة
        await setDoc(ref, {
            participants: [myUid, otherUid],
            lastMessage: "",
            lastSenderId: "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }

    return id;
}

export function subscribeChats(uid, cb) {
    const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", uid),
        orderBy("updatedAt", "desc")
    );
    return onSnapshot(
        q,
        snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
        err => console.error("chats listener error:", err) // 👈
    );
}

export function subscribeMessages(chatId, cb, pageSize = 100) {
    const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "asc"),
        limit(pageSize)
    );
    return onSnapshot(
        q,
        snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
        err => console.error("messages listener error:", err) // 👈
    );

}

export async function sendMessage(chatId, text, senderId) {
    const batch = writeBatch(db);

    try {
        const msgRef = doc(collection(db, "chats", chatId, "messages"));
        batch.set(msgRef, { text, senderId, createdAt: serverTimestamp() });

        const chatRef = doc(db, "chats", chatId);
        batch.set(chatRef, {
            lastMessage: text,
            lastSenderId: senderId,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        await batch.commit();
    } catch (err) {
        console.error("sendMessage ERROR:", err);
        throw err;
    }
}
