import { useEffect, useRef } from "react";

export default function ThreadInput({
  value,
  setValue,
  onSend,
  placeholder = "Type your message here…",
  sendLabel = "Send",
}) {
  const taRef = useRef(null);

  // dynamic textarea expanding
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px"; // max hieght
  }, [value]);

  const handleKeyDown = (e) => {
    // Enter-> new line , shift+enter -> send
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  return (
    <form
      className="thread-input"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSend();
      }}
    >
      <textarea
        ref={taRef}
        className="thread-textarea"
        rows={1}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="send-btn" disabled={!value.trim()}>
        {sendLabel}
      </button>
    </form>
  );
}
