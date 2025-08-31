// Chat.jsx
import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import MessageItem from "../components/widgets/MessageItem";
import ThreadHeader from "../components/widgets/ThreadHeader";
import MessageList from "../components/widgets/MessageList";
import ThreadInput from "../components/widgets/ThreadInput";
import Sidebar from "../components/widgets/Sidebar";
import BottomBar from "../components/widgets/BottomBar";
import settingIcon from "../assets/images/settings.svg";
import AccountPopover from "../components/widgets/AccountPopover";

import { logout, subscribeAuth } from "../services/authService";

import { FiSearch } from "react-icons/fi";
import defaultProfile from "../assets/images/profile.svg";

import "../css/chat-thread.css";
import "../css/card.css";
import "../css/message-item.css";
import "../css/chat.css";

const initialThreads = [
    { id: "t2", name: "Raghad Murad", lastMessage: "See you tomorrow!", time: "15:30" },
    { id: "t3", name: "Layan Jarrar", lastMessage: "See you tomorrow!", time: "15:30" },
    { id: "t4", name: "Yaqeen Hamouda", lastMessage: "Awesome!", time: "16:45" },
    { id: "t5", name: "Amal Zaben", lastMessage: "Good idea 😄", time: "16:45" },
];

const messagesMap = {
    t1: [
        { id: "m1", sender: "them", text: "Hello! Have you seen my backpack anywhere in office?", time: "15:42" },
        { id: "m2", sender: "me", text: "Hi, yes—David has found it, ask our concierge 👀", time: "15:43" },
    ],
    t2: [{ id: "m1", sender: "them", text: "See you tomorrow!", time: "15:30" }],
    t3: [],
    t4: [{ id: "m1", sender: "them", text: "Awesome!", time: "16:45" }],
    t5: [{ id: "m1", sender: "them", text: "Good idea 😄", time: "16:45" }],
};
function seedLastAt(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d.getTime();
}

export default function Chat() {
    const [activeTab, setActiveTab] = useState("messages");
    useEffect(() => { localStorage.setItem("sbTab", activeTab); }, [activeTab]);

    const [threadsState, setThreadsState] = useState(
        initialThreads.map(t => ({ ...t, lastAt: seedLastAt(t.time) }))
    );
    const { id } = useParams();
    const hasThread = Boolean(id);
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState("Newest");

    const [menuOpen, setMenuOpen] = useState(false);
    const [displayName, setDisplayName] = useState("");


    useEffect(() => {
        const unsub = subscribeAuth((u) => {
            if (!u) { setDisplayName(""); return; }
            setDisplayName(u.displayName || u.email || "User");
        });
        return () => unsub && unsub();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const source = threadsState;
        if (!q) return source;
        return source.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.lastMessage.toLowerCase().includes(q)
        );
    }, [query, threadsState]);

    const sorted = useMemo(() => {
        const items = [...filtered];
        switch (sortBy) {
            case "Newest":
                return items.sort((a, b) => (b.lastAt ?? 0) - (a.lastAt ?? 0));
            case "Oldest":
                return items.sort((a, b) => (a.lastAt ?? 0) - (b.lastAt ?? 0));
            case "A-Z":
                return items.sort((a, b) => a.name.localeCompare(b.name));
            case "Z-A":
                return items.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return items;
        }
    }, [filtered, sortBy]);


    const [messages, setMessages] = useState(messagesMap[id] || []);
    const [text, setText] = useState("");
    const bodyRef = useRef(null);
    const openMenu = () => setMenuOpen(true);

    const onLogout = async () => {
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        setMessages(messagesMap[id] || []);
        setText("");
    }, [id]);
    const send = () => {
        const val = text.trim();
        if (!val) return;

        // ✅ استخدمي كائن Date باسم مختلف لتجنب أي تظليل
        const d = new Date();
        const msgTime = d
            .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
            .toLowerCase();
        const lastAt = d.getTime();

        // أضف الرسالة الجديدة (بدون slice)
        setMessages(prev => [
            ...prev,
            { id: `m${prev.length + 1}`, sender: 'me', text: val, time: msgTime }
        ]);

        // حدّث الثريد وحطّه أول القائمة
        setThreadsState(prev => {
            const idx = prev.findIndex(t => t.id === id);
            if (idx === -1) return prev;
            const updated = { ...prev[idx], lastMessage: val, time: msgTime, lastAt };
            const arr = prev.slice();
            arr.splice(idx, 1);   // احذف القديم
            arr.unshift(updated); // ادفعه للبداية
            return arr;
        });

        if (sortBy !== 'Newest') setSortBy('Newest');
        setText('');
    };


    const handleBack = () => {
        navigate("/chat");
    };

    const avatarSrc = defaultProfile;
    return (
        <div className={`chat-desktop ${hasThread ? "has-thread" : "no-thread"}`}>
            <Sidebar active={activeTab}
                onChange={setActiveTab}
                onOpenSettings={() => setMenuOpen(true)} />


            <aside className="list-panel">
                <Card
                    header={<div className="chat-head">
                        <h1 className="chat-title">Messages</h1>
                        <button className="chat-gear" onClick={openMenu} aria-label="Settings">
                            <img src={settingIcon} alt="" />
                        </button>
                    </div>}
                    className="chat-card"
                    bodyClass="chat-card__body"
                    padded={false}
                >
                    <div className="chat-search">
                        <FiSearch className="search-icon" />
                        <Input
                            placeholder="Search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Search messages"
                        />
                    </div>

                    <div className="chat-sort">
                        <span>Sort by</span>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="Newest">Newest</option>
                            <option value="Oldest">Oldest</option>
                            <option value="A-Z">A–Z</option>
                            <option value="Z-A">Z–A</option>
                        </select>
                    </div>

                    <div className="msg-list">
                        {sorted.length === 0 ? (
                            <div className="chat-empty">No results</div>
                        ) : (
                            sorted.map((t) => (
                                <MessageItem
                                    key={t.id}
                                    avatar={defaultProfile}
                                    name={t.name}
                                    lastMessage={t.lastMessage}
                                    time={t.time}
                                    onClick={() => navigate(`/chat/${t.id}`)}
                                />
                            ))
                        )}
                    </div>
                </Card>
            </aside>

            <section className="thread-panel">
                {id ? (
                    <div className="thread-wrap">
                        <ThreadHeader
                            avatar={avatarSrc}
                            name={threadsState.find((t) => t.id === id)?.name || "Contact"}
                            onBack={handleBack}
                        />
                        <MessageList messages={messages} bodyRef={bodyRef} avatarUrl={avatarSrc} />
                        <ThreadInput value={text} setValue={setText} onSend={send} />
                    </div>
                ) : (
                    <div className="thread-empty">
                        <h3>Select a conversation</h3>
                        <p>Choose a chat from the list to start messaging.</p>
                    </div>
                )}
            </section>
            <BottomBar active={activeTab} onChange={setActiveTab} />


            {menuOpen && (
                <AccountPopover
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    displayName={displayName}
                    onLogout={onLogout}
                />
            )}
        </div>

    );
}
