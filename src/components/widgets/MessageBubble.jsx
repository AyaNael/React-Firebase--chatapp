export default function MessageBubble({
    sender = "them",      // "me" | "them"
    text,
    time,
    avatarUrl,
}) {
    return (
        <div className={`bubble-row ${sender === "me" ? "is-me" : "is-them"}`}>
            {sender === "them" && (
                <img className="bubble-avatar" src={avatarUrl} alt="contact" />
            )}

            <div className="bubble">
                {text && <span>{text}</span>}
                <div className="bubble-meta">
                    <span className="time">{time}</span>
                </div>
            </div>
        </div>
    );

}
