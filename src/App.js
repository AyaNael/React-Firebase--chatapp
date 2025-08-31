import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';
import Signup from "./pages/Signup";
import { useEffect, useState } from "react";
import { subscribeAuth } from "./services/authService";

function App() {
  const [user, setUser] = useState(null);
  const [init, setInit] = useState(true);

  useEffect(() => {
    const unsub = subscribeAuth(u => { setUser(u); setInit(false); });
    return () => unsub && unsub();
  }, []);

  if (init) return null;

  const RequireAuth = ({ children }) =>
    user ? children : <Navigate to="/login" replace />;

  const RedirectIfAuthed = ({ children }) =>
    user ? <Navigate to="/chat" replace /> : children;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
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
