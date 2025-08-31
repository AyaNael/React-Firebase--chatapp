// src/hooks/useAvatar.js
import { useEffect, useState, useCallback } from "react";
import defaultProfile from "../assets/images/profile.svg";

const KEY = "app/avatar";
// حد أعلى قريب من كوتا 5MB
const MAX_DATAURL_BYTES = Math.floor(4.75 * 1024 * 1024); // ~4.75MB

const readAvatar = () => localStorage.getItem(KEY) || defaultProfile;

function dataUrlSizeBytes(dataUrl) {
  const comma = dataUrl.indexOf(",");
  if (comma === -1) return 0;
  const b64 = dataUrl.slice(comma + 1);
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  // حجم البيانات الفعلي بعد فك base64
  return (b64.length * 3) / 4 - padding;
}

function writeAvatarSafe(dataUrl) {
  try {
    localStorage.setItem(KEY, dataUrl);
    window.dispatchEvent(new CustomEvent("avatar:changed", { detail: dataUrl }));
    return true;
  } catch {
    return false; // كوتا ممتلئة/غير متاحة
  }
}

export const fileToDataURL = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export default function useAvatar() {
  const [avatar, setAvatarState] = useState(readAvatar());

  useEffect(() => {
    const onChange = (e) => setAvatarState(e?.detail || readAvatar());
    window.addEventListener("avatar:changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("avatar:changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  // يقبل أي dataURL، يرفض فقط إذا تخطّى الحد الفعلي
  const setAvatar = useCallback((dataUrl) => {
    if (!dataUrl || typeof dataUrl !== "string") return false;

    const isDataUrl = dataUrl.startsWith("data:");
    if (isDataUrl) {
      const size = dataUrlSizeBytes(dataUrl);
      if (size > MAX_DATAURL_BYTES) return false; // فقط الحد الأعلى
    }

    const ok = writeAvatarSafe(dataUrl);
    if (ok) setAvatarState(dataUrl);
    return ok;
  }, []);

  // لا تعملي أي تقدير مسبق — حولي أولاً ثم افحَصي الحجم الحقيقي
  const setAvatarFromFile = useCallback(
    async (file) => {
      if (!file) return false;
      const dataUrl = await fileToDataURL(file);
      return setAvatar(dataUrl);
    },
    [setAvatar]
  );

  return { avatar, setAvatar, setAvatarFromFile, MAX_DATAURL_BYTES };
}
