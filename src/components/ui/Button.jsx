// src/components/ui/Button.jsx
export default function Button({ 
  type = "button", 
  children, 
  className = "", 
  disabled = false, 
  onClick 
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn-primary ${className}`}
    >
      {children}
    </button>
  );
}
