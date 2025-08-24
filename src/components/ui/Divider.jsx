// src/components/ui/Divider.jsx
export default function Divider({ children = "Or" }) {
  return (
    <div className="divider">
      {children}
    </div>
  );
}
