export default function Checkbox({ name, checked, onChange, children }) {
  return (
    <label className="check">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <span>{children}</span>
    </label>
  );
}
