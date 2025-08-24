import "../../css/auth.css";
import Divider from "../ui/Divider";
import SocialAuthButtons from "../widgets/SocialAuthButtons";

function AuthLayout({ children, swap }) {
    return (
        <main className="auth">
            <section className="auth-left">
                <div className="auth-card">
                    {children}

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
