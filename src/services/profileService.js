// src/services/profileService.js
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

/** يضغط الصورة ويرجّع DataURL JPEG */
export async function resizeToDataURL(file, maxSide = 200, quality = 0.7) {
  const img = await loadImage(file);
  const { width, height } = img;

  const scale = Math.min(1, maxSide / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise((res) =>
    canvas.toBlob(res, "image/jpeg", quality)
  );
  const dataUrl = await blobToDataURL(blob);
  return dataUrl;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

function blobToDataURL(blob) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

/** يرفع الأفاتار إلى Firestore داخل users/{uid}.photoURL ويرجع الـ DataURL */
export async function uploadAvatarToFirestore(file) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");

  // اضغط الصورة
  const dataUrl = await resizeToDataURL(file, 200, 0.7);

  // لحماية الحد الأقصى للوثيقة (~1MB)
  if (dataUrl.length > 900_000) {
    throw new Error("Avatar too large even after compression.");
  }

  const ref = doc(db, "users", user.uid);
  await updateDoc(ref, {
    photoURL: dataUrl,
    lastSeen: serverTimestamp(),
  });

  return dataUrl;
}
