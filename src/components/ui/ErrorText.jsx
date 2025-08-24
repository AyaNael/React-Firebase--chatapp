export default function ErrorText({ id, children }) {
  if (!children) return null;
  return <div id={id} className="field-error">{children}</div>;
}
