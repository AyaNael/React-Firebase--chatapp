import "../css/auth.css";
import googleIcon from "../assets/google.svg";
import appleIcon from "../assets/apple.svg";
import SocialAuthButtons from "../widgets/SocialAuthButtons";
import Divider from "../ui/Divider"

function AuthLayout({ children, swap }) {
    return (
        <main className="auth">
            <section className="auth-left">
                <div className="auth-card">
                    {children}

                    {/* Divider */}
                    <Divider>Or</Divider>
                    <SocialAuthButtons onGoogle={() => { }} onApple={() => { }} />


                    {/* Swap link (login/signup) */}
                    {swap && <div className="swap">{swap}</div>}
                </div>
            </section>

            <aside className="auth-right" aria-hidden="true" />
        </main>
    );
}

export default AuthLayout;
