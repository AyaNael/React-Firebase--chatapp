import defaultProfile from "../../assets/images/profile.svg";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as MastercardLine } from "../../assets/images/mastercard-line.svg";

import chatIcon from "../../assets/images/chat-icon.svg";
import worldIcon from "../../assets/images/world-icon.svg";
import scheduleIcon from "../../assets/images/schedule-icon.svg";
import musicIcon from "../../assets/images/music-icon.svg";
import videoIcon from "../../assets/images/camera-video-icon.svg";
import logoutIcon from "../../assets/images/logout.svg";
import settingIcon from "../../assets/images/settings.svg";

export default function Sidebar({ active = "messages", onChange }) {
    const mainItems = [
        { key: "world", icon: worldIcon, label: "Explore" },
        { key: "messages", icon: chatIcon, label: "Messages" },
        { key: "calls", icon: videoIcon, label: "Calls" },
        { key: "media", icon: musicIcon, label: "Media" },
        { key: "schedule", icon: scheduleIcon, label: "Schedule" },
    ];

    const navigate = useNavigate();

    const bottomItems = [
        { key: "settings", icon: settingIcon, label: "Settings" },
        { key: "logout", icon: logoutIcon, label: "Logout", onClick: () => navigate("/signup"), noActive: true },
    ];

    const [avatar, setAvatar] = useState(defaultProfile);
    const inputRef = useRef(null);
    const prevUrlRef = useRef(null);

    const handlePick = () => inputRef.current?.click();
    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
        const url = URL.createObjectURL(file);
        prevUrlRef.current = url;
        setAvatar(url);
    };
    useEffect(() => () => prevUrlRef.current && URL.revokeObjectURL(prevUrlRef.current), []);

    const renderItem = ({ key, icon, label, onClick, noActive }) => {
        const isActive = !noActive && active === key;
        const handleClick = () => {
            if (onClick) onClick();
            else onChange?.(key);
        };
        return (
            <button
                key={key}
                className={`sb-item ${isActive ? "is-active" : ""}`}
                title={label}
                aria-label={label}
                aria-pressed={isActive}
                type="button"
                onClick={handleClick}
            >
                <img src={icon} className="sb-icon" alt="" />
            </button>
        );
    };

    return (
        <nav className="sidebar">
            <div className="sb-top">
                <button type="button" className="sb-brand" title="Brand">
                    <MastercardLine className="sb-brand-icon" />
                </button>

                <button type="button" className="sb-avatar" onClick={handlePick} title="Change photo">
                    <img src={avatar} alt="Me" />
                    <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
                </button>
            </div>

            <hr className="sb-divider" />

            <ul className="sb-nav">
                {mainItems.map((it) => (
                    <li key={it.key}>{renderItem(it)}</li>
                ))}
            </ul>

            <div className="sb-bottom">
                {bottomItems.map((it) => renderItem(it))}
            </div>
        </nav>
    );
}
