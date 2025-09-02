import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import { useEffect, useState } from "react";
import { subscribeAuth } from "./services/authService";

// إضافات جديدة:
import { getRememberMe } from "./utils/cookies";
import { applyAuthPersistence } from "./services/authService";
import { ensureUserProfile, setUserOffline } from "./services/chatService";
import { auth } from "./config/firebase";

function App() {
  const [user, setUser] = useState(null);
  const [init, setInit] = useState(true);

  useEffect(() => {
    const remember = getRememberMe?.();
    applyAuthPersistence(!!remember).catch(() => { });

    const unsub = subscribeAuth(async (u) => {
      setUser(u);
      if (u) {
        try { 
          await ensureUserProfile(u); 
        }
        catch (err){
          console.error("ensureUserProfile ERROR:", err);
        }
      }
      setInit(false);
    });

    const onBeforeUnload = () => {
      const uid = auth.currentUser?.uid;
      if (uid) setUserOffline(uid);
    };
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      unsub && unsub();
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  if (init) return null;

  const RequireAuth = ({ children }) =>
    user ? children : <Navigate to="/login" replace />;

  const RedirectIfAuthed = ({ children }) =>
    user ? <Navigate to="/chat" replace /> : children;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" replace /> : <Navigate to="/signup" replace />} />

        <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
        <Route path="/signup" element={<RedirectIfAuthed><Signup /></RedirectIfAuthed>} />

        <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />
        <Route path="/chat/:id" element={<RequireAuth><Chat /></RequireAuth>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
