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
import { subscribeChats, subscribeMessages, sendMessage /*, getOrCreateChat */ } from "../services/chatService";
import useUsersCache from "../hooks/useUsersCache";
import { logout, subscribeAuth } from "../services/authService";
import { subscribeAllUsers, displayNameOf } from "../services/userService";
import { chatIdFor } from "../services/chatService";

import { FiSearch } from "react-icons/fi";
import defaultProfile from "../assets/images/profile.svg";

import "../css/chat-thread.css";
import "../css/card.css";
import "../css/message-item.css";
import "../css/chat.css";


function formatAmPm(dateLike) {
    const d = dateLike instanceof Date ? dateLike : new Date(dateLike);
    return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).toLowerCase(); // 3:05 pm
}

export default function Chat() {

    const [activeTab, setActiveTab] = useState(() => localStorage.getItem("sbTab") || "messages");
    useEffect(() => { localStorage.setItem("sbTab", activeTab); }, [activeTab]);

    const { id: chatId } = useParams();
    const hasThread = Boolean(chatId);
    const navigate = useNavigate();
    const [people, setPeople] = useState([]);
    // معلومات المستخدم الحالي
    const [me, setMe] = useState(null);
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        if (!me) return;
        const off = subscribeAllUsers((list) => {
            setPeople(list.filter(u => u.id !== me.uid));
        });
        return () => off && off();
    }, [me]);


    useEffect(() => {
        const off = subscribeAuth((u) => {
            setMe(u || null);
            setDisplayName(u ? (u.displayName || u.email || "User") : "");
        });
        return () => off && off();
    }, []);

    // قائمة الشاتات والرسائل
    const [chats, setChats] = useState([]);       // من Firestore
    const [messages, setMessages] = useState([]); // من Firestore
    const [text, setText] = useState("");

    // كاش بيانات المستخدمين الآخرين
    const { users, ensureUser } = useUsersCache();

    // اشترك بقائمة الشاتات
    useEffect(() => {
        if (!me) return;
        const off = subscribeChats(me.uid, (rows) => {
            setChats(rows); // مرتبة latest أولاً من Firestore
            // حضّري كاش أسماء/صور الطرف الآخر
            rows.forEach((ch) => {
                const other = (ch.participants || []).find((u) => u !== me.uid);
                ensureUser(other);
            });
        });
        return () => off && off();
    }, [me, ensureUser]);

    // اشترك برسائل الشات الحالي
    useEffect(() => {
        setMessages([]);
        if (!me || !chatId) return;
        const chatExists = chats.some(c => c.id === chatId);
        if (!chatExists) return; // لسه ما وصلت الوثيقة من Firestore؛ استني

        const off = subscribeMessages(chatId, (rows) => setMessages(rows));
        return () => off && off();
    }, [me, chatId, chats]);

    const rows = useMemo(() => {
        if (!me) return [];
        return people.map(p => {
            const id = chatIdFor(me.uid, p.id);             // نفس الـ chatId للطرفين
            const ch = chats.find(c => c.id === id);        // هل يوجد شات سابق؟
            return {
                person: p,
                chatId: id,
                lastMessage: ch?.lastMessage || "",           // لو ما في شات = فاضي
                updatedAt: ch?.updatedAt || null,             // Timestamp أو null
            };
        }).sort((a, b) => {
            const ta = a.updatedAt?.toMillis?.() ?? 0;
            const tb = b.updatedAt?.toMillis?.() ?? 0;
            return tb - ta;                                  // الأحدث أولاً
        });
    }, [people, chats, me]);

    // فلترة الشاتات بالبحث
    const [query, setQuery] = useState("");
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter(r => {
            const name = displayNameOf(r.person).toLowerCase();
            const last = (r.lastMessage || "").toLowerCase();
            return name.includes(q) || last.includes(q);
        });
    }, [rows, query]);

    // فتح/إغلاق بوب أوفر الحساب
    const [menuOpen, setMenuOpen] = useState(false);
    const openMenu = () => setMenuOpen(true);

    const onLogout = async () => {
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (e) {
            console.error(e);
        }
    };

    // إرسال رسالة إلى الشات الحالي
    const onSend = async () => {
        const val = text.trim();
        if (!val || !me || !chatId) return;
        try {
            await sendMessage(chatId, val, me.uid); // سيُحدّث chats.updatedAt تلقائيًا
            setText("");
        } catch (e) {
            console.error(e);
        }
    };

    const handleBack = () => navigate("/chat");

    const bodyRef = useRef(null);

    const currentChat = chats.find(x => x.id === chatId);
    const otherUid = currentChat && me ? currentChat.participants.find(u => u !== me.uid) : null;
    const otherUser = otherUid ? users[otherUid] : null;
    const otherName = otherUser?.displayName || "Contact";
    const otherAvatar = otherUser?.photoURL || defaultProfile;


    return (
        <div className={`chat-desktop ${hasThread ? "has-thread" : "no-thread"}`}>
            <Sidebar
                active={activeTab}
                onChange={setActiveTab}
                onOpenSettings={() => setMenuOpen(true)}
            />

            <aside className="list-panel">
                <Card
                    header={
                        <div className="chat-head">
                            <h1 className="chat-title">Messages</h1>
                            <button className="chat-gear" onClick={openMenu} aria-label="Settings">
                                <img src={settingIcon} alt="" />
                            </button>
                        </div>
                    }
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

                    <div className="msg-list">
                        {filtered.length === 0 ? (
                            <div className="chat-empty">No results</div>
                        ) : (
                            filtered.map(({ person, chatId, lastMessage, updatedAt }) => {
                                const timeStr = updatedAt?.toDate ?
                                    updatedAt.toDate().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase()
                                    : "";
                                return (
                                    <MessageItem
                                        key={person.id}
                                        avatar={person.photoURL || defaultProfile}
                                        name={displayNameOf(person)}
                                        lastMessage={lastMessage || "Start a chat"}
                                        time={timeStr}
                                        onClick={() => {
                                            const id = chatIdFor(me.uid, person.id);
                                            navigate(`/chat/${id}`);
                                        }}
                                    />
                                );
                            })
                        )}
                    </div>

                </Card>
            </aside>

            <section className="thread-panel">
                {chatId ? (
                    <div className="thread-wrap">
                        <ThreadHeader
                            avatar={otherAvatar}
                            name={otherName}
                            onBack={handleBack}
                        />

                        <MessageList
                            messages={messages.map((m) => ({
                                id: m.id,
                                sender: me && m.senderId === me.uid ? "me" : "them",
                                text: m.text,
                                time: m.createdAt?.toDate ? formatAmPm(m.createdAt.toDate()) : "",
                            }))}
                            bodyRef={bodyRef}
                            avatarUrl={otherAvatar}
                        />

                        <ThreadInput value={text} setValue={setText} onSend={onSend} />
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