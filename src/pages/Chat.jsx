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

import { FiSearch } from "react-icons/fi";
import defaultProfile from "../assets/images/profile.svg";

import "../css/chat-thread.css";
import "../css/card.css";
import "../css/message-item.css";
import "../css/chat.css";

const threads = [
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

export default function Chat() {
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem("sbTab") || "messages");
    useEffect(() => { localStorage.setItem("sbTab", activeTab); }, [activeTab]);

    const { id } = useParams();
    const hasThread = Boolean(id);
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState("Newest");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return threads;
        return threads.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.lastMessage.toLowerCase().includes(q)
        );
    }, [query]);

    const sorted = useMemo(() => {
        const items = [...filtered];
        switch (sortBy) {
            case "Newest": return items.sort((a, b) => b.time.localeCompare(a.time));
            case "Oldest": return items.sort((a, b) => a.time.localeCompare(b.time));
            case "A-Z": return items.sort((a, b) => a.name.localeCompare(b.name));
            case "Z-A": return items.sort((a, b) => b.name.localeCompare(a.name));
            default: return items;
        }
    }, [filtered, sortBy]);

    const [messages, setMessages] = useState(messagesMap[id] || []);
    const [text, setText] = useState("");
    const bodyRef = useRef(null);


    useEffect(() => {
        setMessages(messagesMap[id] || []);
        setText("");
    }, [id]);


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
            },
        ]);
        setText("");
    };

    const handleBack = () => {
        navigate("/chat");
    };

    const avatarSrc = defaultProfile;

    return (
        <div className={`chat-desktop ${hasThread ? "has-thread" : "no-thread"}`}>
            <Sidebar active={activeTab} onChange={setActiveTab} />

            <aside className="list-panel">
                <Card
                    header={<h1 className="chat-title">Messages</h1>}
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
                            name={threads.find((t) => t.id === id)?.name || "Contact"}
                            status="Online"
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

        </div>

    );
}
