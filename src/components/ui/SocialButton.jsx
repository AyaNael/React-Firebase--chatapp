export default function SocialButton({ iconSrc, children, className, ...rest }) {
  return (
    <button type="button" className={`btn-social ${className || ""}`} {...rest}>
      <img src={iconSrc} alt="" />
      {children}
    </button>
  );
}
