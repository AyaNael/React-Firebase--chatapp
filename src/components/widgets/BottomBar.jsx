// components/widgets/BottomBar.jsx
import worldIcon   from "../../assets/images/world-icon.svg";
import chatIcon    from "../../assets/images/chat-icon.svg";
import videoIcon   from "../../assets/images/camera-video-icon.svg";
import musicIcon   from "../../assets/images/music-icon.svg";
import scheduleIcon from "../../assets/images/schedule-icon.svg";

export default function BottomBar({ active = "messages", onChange }) {
  const items = [
    { key: "world",    icon: worldIcon,   label: "Explore" },
    { key: "messages", icon: chatIcon,    label: "Messages" },
    { key: "calls",    icon: videoIcon,   label: "Calls" },
    { key: "media",    icon: musicIcon,   label: "Media" },
    { key: "schedule", icon: scheduleIcon,label: "Schedule" },
  ];

  return (
    <nav className="bottom-bar" role="navigation" aria-label="Primary">
      {items.map((it) => (
        <button
          key={it.key}
          className={`bb-item ${active === it.key ? "is-active" : ""}`}
          title={it.label}
          aria-label={it.label}
          aria-pressed={active === it.key}
          type="button"
          onClick={() => onChange?.(it.key)}
        >
          <img className="bb-icon" src={it.icon} alt="" />
        </button>
      ))}
    </nav>
  );
}
