// components/thread/ThreadHeader.jsx
import { FiVideo, FiPhone } from "react-icons/fi";

export default function ThreadHeader({
  avatar,
  name,
  status = "Online",
  onBack,
  onVideoCall,
  onVoiceCall,
}) {
  const handleVideo = onVideoCall ?? (() => {});
  const handleVoice = onVoiceCall ?? (() => {});

  return (
    <div className="thread-header">
      <button className="back-btn" onClick={onBack} aria-label="Back">‹</button>

      <img className="thread-avatar" src={avatar} alt={name} />

      <div className="thread-title">
        <div className="name">{name}</div>
        {status && <div className="status">{status}</div>}
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={handleVideo}
          aria-label="Video call"
          title="Video call"
        >
          <FiVideo />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={handleVoice}
          aria-label="Voice call"
          title="Voice call"
        >
          <FiPhone />
        </button>
      </div>
    </div>
  );
}
