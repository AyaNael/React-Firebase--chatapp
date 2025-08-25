import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import MessageItem from "../components/widgets/MessageItem";
import { FiSearch } from "react-icons/fi";

import "../css/card.css";
import "../css/message-item.css";
import "../css/chat.css";   // ملف CSS جديد خاص بالـ Chat screen

const threads = [
    { id: "t1", avatar: "https://i.pravatar.cc/64?img=12", name: "Aya Hijaz", lastMessage: "How are you doing?", time: "16:45" },
    { id: "t2", avatar: "https://i.pravatar.cc/64?img=5", name: "Raghad Murad", lastMessage: "See you tomorrow!", time: "15:30" },
    { id: "t3", avatar: "https://i.pravatar.cc/64?img=15", name: "Layan Jarrar", lastMessage: "See you tomorrow!", time: "15:30" },
    { id: "t4", avatar: "https://i.pravatar.cc/64?img=30", name: "Yaqeen Hamouda", lastMessage: "Awesome!", time: "16:45" },
    { id: "t5", avatar: "https://i.pravatar.cc/64?img=22", name: "Amal Zaben", lastMessage: "Good idea 😄", time: "16:45" },
];
export const messagesMap = {
    t1: [
        { id: "m1", sender: "them", text: "Hello! Have you seen my backpack?", time: "15:42" },
        { id: "m2", sender: "me", text: "Yes, with David at concierge 👀", time: "15:43" },
    ],
    t2: [
        { id: "m1", sender: "them", text: "Meeting at 4?", time: "14:10" },
    ],
    t3: [],
    t4: [{ id: "m1", sender: "them", text: "Awesome!", time: "16:45" }],
    t5: [{ id: "m1", sender: "them", text: "Good idea 😄", time: "16:45" }],
};

export default function Chat() {
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
        let items = [...filtered];
        switch (sortBy) {
            case "Newest":
                return items.sort((a, b) => b.time.localeCompare(a.time));
            case "Oldest":
                return items.sort((a, b) => a.time.localeCompare(b.time));
            case "A-Z":
                return items.sort((a, b) => a.name.localeCompare(b.name));
            case "Z-A":
                return items.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return items;
        }
    }, [filtered, sortBy]);

    return (
        <div className="chat-screen">
            <Card
                header={<h1 className="chat-title">Messages</h1>}
                className="chat-card"
                bodyClass="chat-card__body"
                padded={false}
            >
                {/* Search bar */}
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
                    <span>Sort by </span>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                        <option value="A-Z">A–Z</option>
                        <option value="Z-A">Z–A</option>
                    </select>
                </div>

                {/* Threads list */}
                <div className="msg-list">
                    {sorted.length === 0 ? (
                        <div className="chat-empty">No results</div>
                    ) : (
                        filtered.map((t) => (
                            <MessageItem
                                key={t.id}
                                avatar={t.avatar}
                                name={t.name}
                                lastMessage={t.lastMessage}
                                time={t.time}
                                onClick={() => console.log("open chat:", t.id)}
                            />
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
