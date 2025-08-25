// screens/ChatThread.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { threads, messagesMap } from "../data";
import "../css/chat-thread.css"; // ستايلات بسيطة للمحادثة

export default function ChatThread() {
  const { id } = useParams();
  const navigate = useNavigate();
  const thread = useMemo(() => threads.find(t => t.id === id), [id]);

  // رسائل هذه المحادثة (للديمو نخزنها محليًا)
  const [messages, setMessages] = useState(messagesMap[id] || []);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  if (!thread) return <div style={{ padding: 16 }}>Thread not found.</div>;

  const send = (e) => {
    e.preventDefault();
    const val = text.trim();
    if (!val) return;
    setMessages(prev => [
      ...prev,
      { id: `m${prev.length + 1}`, sender: "me", text: val, time: new Date().toLocaleTimeString().slice(0,5) }
    ]);
    setText("");
  };

  return (
    <div className="thread-wrap">
      {/* Header */}
      <div className="thread-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <img className="thread-avatar" src={thread.avatar} alt={thread.name} />
        <div className="thread-title">
          <div className="name">{thread.name}</div>
          <div className="status">Online</div>
        </div>
        <div className="header-actions">
          {/* مكان لأيقونات الاتصال/الفيديو إن حبيت */}
        </div>
      </div>

      {/* Messages */}
      <div className="thread-body">
        {messages.map(m => (
          <div key={m.id} className={`msg-row ${m.sender === "me" ? "me" : "them"}`}>
            <div className="bubble">{m.text}</div>
            <div className="time">{m.time}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form className="thread-input" onSubmit={send}>
        <input
          type="text"
          placeholder="Type your message here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="send-btn">Send</button>
      </form>
    </div>
  );
}
