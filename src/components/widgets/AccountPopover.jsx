import { useRef } from "react";
import useAvatar from "../../hooks/useAvatar";
import { uploadUserAvatar } from "../../services/storageService";

export default function AccountPopover({ open, onClose, displayName, onLogout }) {
    const { avatar, setAvatar } = useAvatar();
    const fileRef = useRef(null);

    const pickPhoto = () => fileRef.current?.click();

    const onFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const dataUrl = await uploadUserAvatar(file);
        setAvatar(`${dataUrl}#v=${Date.now()}`); // كسر الكاش بخانة وهمية
        window.dispatchEvent(new CustomEvent("avatar:changed", { detail: `${dataUrl}#v=${Date.now()}` }));
        onClose?.();
    };

    if (!open) return null;

    return (
        <>
            <button className="chat-popover-mask" onClick={onClose} aria-label="Close menu" />
            <div
                className="chat-popover"
                role="menu"
                aria-label="Account menu"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="pop-avatar" onClick={pickPhoto} title="Change photo" type="button">
                    <img src={avatar} alt="Profile" />
                </button>

                <div className="pop-name">{displayName || "User"}</div>

                <button className="pop-logout" onClick={onLogout} type="button">
                    Logout
                </button>

                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            </div>
        </>
    );
}
