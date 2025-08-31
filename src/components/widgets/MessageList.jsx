// components/thread/MessageList.jsx
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, bodyRef, avatarUrl }) {
    return (
        <div ref={bodyRef} className="thread-body">
            {messages.map((m) => (
                <MessageBubble
                    key={m.id}
                    sender={m.sender}
                    text={m.text}
                    time={m.time}
                    avatarUrl={avatarUrl}
                />
            ))}
        </div>
    );
}
