import Input from "./Input";
import ErrorText from "./ErrorText";

export default function Field({
  label, name, type="text", value, onChange, onBlur, placeholder,
  touched, error, rightSlot // مثل "forgot password?"
}) {
  const invalid = touched && error;
  const errId = `${name}-error`;

  return (
    <label className="field">
      <div className="field-row">
        <span className="field-label">{label}</span>
        {rightSlot}
      </div>

      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        invalid={invalid}
        ariaDescribedBy={errId}
      />

      <ErrorText id={errId}>{invalid ? error : ""}</ErrorText>
    </label>
  );
}
