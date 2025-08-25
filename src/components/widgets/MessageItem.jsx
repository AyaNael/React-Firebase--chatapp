import { useRef, useState, useEffect } from "react";
import defaultProfile from "../../assets/profile.svg";

function MessageItem({
    name,
    lastMessage,
    time,
    onClick,
}) {
    const [image, setImage] = useState(defaultProfile);
    const fileInputRef = useRef(null);
    const prevUrlRef = useRef(null);

    const handleClick = (e) => {
        if (onClick) onClick(e);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // clean any prev url
        if (prevUrlRef.current) {
            URL.revokeObjectURL(prevUrlRef.current);
        }
        const url = URL.createObjectURL(file);
        prevUrlRef.current = url;
        setImage(url);
    };

    useEffect(() => {
        return () => {
            if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
        };
    }, []);

    return (
        <button
            type="button"
            className="msg-item"
            onClick={handleClick}
            aria-label={`Open chat with ${name}`}
        >
            <img
                className="msg-avatar"
                src={image}
                alt={`${name ?? "User"} avatar`}
                referrerPolicy="no-referrer"
                onError={(e) => (e.currentTarget.src = defaultProfile)}
                onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                }}
                style={{ borderRadius: "50%", cursor: "pointer" }}
            />

            <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
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
