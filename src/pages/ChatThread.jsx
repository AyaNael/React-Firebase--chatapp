// screens/ChatThread.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { threads, messagesMap } from "../data";

import ThreadHeader from "../components/thread/ThreadHeader";
import MessageList from "../components/thread/MessageList";
import ThreadInput from "../components/thread/ThreadInput";
import defaultAvatar from "../assets/profile.svg";

import "../css/chat-thread.css";

export default function ChatThread() {
    const { id } = useParams();
    const navigate = useNavigate();

    const thread = useMemo(() => threads.find((t) => t.id === id), [id]);

    const avatarSrc = defaultAvatar;

    const [messages, setMessages] = useState(messagesMap[id] || []);
    const [text, setText] = useState("");

    useEffect(() => {
        setMessages(messagesMap[id] || []);
        setText("");
    }, [id]);

    const bodyRef = useRef(null);


    if (!thread) {
        return (
            <div className="thread-wrap" style={{ padding: 16 }}>
                <button onClick={() => navigate("/chat")}>Back</button>
                <p>Thread not found.</p>
            </div>
        );
    }

    // أزرار الهيدر
    const handleBack = () => {
         navigate("/chat");
    };
    const handleVoiceCall = () => console.log("voice call ->", thread.id);
    const handleVideoCall = () => console.log("video call ->", thread.id);

    // إرسال رسالة
    const send = () => {
        const val = text.trim();
        if (!val) return;
        setMessages((prev) => [
            ...prev,
            {
                id: `m${prev.length + 1}`,
                sender: "me",
                text: val,
                time: new Date().toLocaleTimeString().slice(0, 5),
                status: "read",
            },
        ]);
        setText("");
    };

    return (
        <div className="thread-wrap">
            {/* Header */}
            <ThreadHeader
                avatar={avatarSrc}
                name={thread.name}
                status="Online"
                onBack={handleBack}
                onVoiceCall={handleVoiceCall}
                onVideoCall={handleVideoCall}
            />

            {/* Messages */}
            <MessageList
                messages={messages}
                bodyRef={bodyRef}
                avatarUrl={avatarSrc} />
            {/* Input */}
            <ThreadInput value={text} setValue={setText} onSend={send} />
        </div>
    );
}
