// services/userService.js
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

export function subscribeAllUsers(cb) {
    const q = query(collection(db, "users"), orderBy("displayName"));
    return onSnapshot(q, (snap) => {
        cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
}

export function displayNameOf(u) {
    return u?.displayName || u?.email || (u?.id ? u.id.slice(0, 6) : "User");
}
