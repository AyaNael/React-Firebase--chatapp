import SocialButton from "../ui/SocialButton";
import googleIcon from "../../assets/images/google.svg";
import appleIcon from "../../assets/images/apple.svg";

export default function SocialAuthButtons({ onGoogle, onApple }) {
  return (
    <div className="social-login">
      <SocialButton className="google" iconSrc={googleIcon} onClick={onGoogle}>
        Sign in with Google
      </SocialButton>

      <SocialButton className="apple" iconSrc={appleIcon} onClick={onApple}>
        Sign in with Apple
      </SocialButton>
    </div>
  );
}
