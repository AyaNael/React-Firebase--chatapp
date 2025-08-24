export default function Input({
  name, type="text", value, onChange, onBlur,
  placeholder, invalid, ariaDescribedBy
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`field-input ${invalid ? "is-invalid" : ""}`}
      aria-invalid={Boolean(invalid)}
      aria-describedby={ariaDescribedBy}
      required
    />
  );
}
