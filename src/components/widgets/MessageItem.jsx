// components/widgets/MessageItem.jsx
import defaultProfile from "../../assets/images/profile.svg";

function MessageItem({ avatar, name, lastMessage, time, onClick }) {
  return (
    <button type="button" className="msg-item" onClick={onClick} aria-label={`Open chat with ${name}`}>
      <img
        className="msg-avatar"
        src={avatar || defaultProfile}
        alt={`${name ?? "User"} avatar`}
        onError={(e) => (e.currentTarget.src = defaultProfile)}
      />
      <div className="msg-content">
        <div className="msg-row">
          <span className="msg-name">{name}</span>
          {time && <time className="msg-time">{time}</time>}
        </div>
        <div className="msg-row">
          <span className="msg-preview">{lastMessage}</span>
        </div>
      </div>
    </button>
  );
}
export default MessageItem;
