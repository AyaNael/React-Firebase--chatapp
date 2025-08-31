// components/widgets/MessageBubble.jsx
export default function MessageBubble({
  sender = "them",
  text,
  time,
  avatarUrl,
}) {
  const formatToAmPm = (t) => {
    if (!t) return "";
    // لو كانت بشكل "HH:MM" (24h) حوّليها
    if (/^\d{1,2}:\d{2}$/.test(t)) {
      const [h, m] = t.split(":").map(Number);
      const d = new Date();
      d.setHours(h || 0, m || 0, 0, 0);
      return d
        .toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
        .toLowerCase(); // am/pm صغيرة
    }
    // لو هي أصلاً "3:42 pm" اتركيها كما هي
    return t;
  };

  return (
    <div className={`bubble-row ${sender === "me" ? "is-me" : "is-them"}`}>
      {sender === "them" && (
        <img className="bubble-avatar" src={avatarUrl} alt="contact" />
      )}

      <div className="bubble">
        {text && <span>{text}</span>}
        <div className="bubble-meta">
          <span className="time">{formatToAmPm(time)}</span>
        </div>
      </div>
    </div>
  );
}
