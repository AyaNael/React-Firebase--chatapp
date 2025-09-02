// src/services/storageService.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export async function uploadUserAvatar(file) {
    const user = auth.currentUser;
    if (!user) throw new Error("Not signed in");

    const storage = getStorage(); // يستخدم الـ storageBucket من config
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `avatars/${user.uid}/avatar.${ext}`;

    const r = ref(storage, path);
    await uploadBytes(r, file, { contentType: file.type });
    const url = await getDownloadURL(r);

    // حدّث ملفك في Auth + Firestore (حتى يظهر للآخرين)
    try { await updateProfile(user, { photoURL: url }); } catch { }
    await setDoc(
        doc(db, "users", user.uid),
        { photoURL: url, updatedAt: serverTimestamp() },
        { merge: true }
    );

    return url; // أعيدي الـ URL للاستخدام في الواجهة
}
