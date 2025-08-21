import "../css/auth.css";
import googleIcon from "../assets/google.svg";
import appleIcon from "../assets/apple.svg";
function AuthLayout({ children, swap }) {
    return (
        <main className="auth">
            <section className="auth-left">
                <div className="auth-card">
                    {children}

                    {/* Divider */}
                    <div className="divider">Or</div>

                    {/* Social login buttons */}
                    <div className="social-login">
                        <button type="button" className="btn-social google">
                            <img src={googleIcon} alt="google icon"/>
                            Sign in with Google
                        </button>
                        <button type="button" className="btn-social apple">
                            <img src={appleIcon} alt="apple icon" />
                            Sign in with Apple

                        </button>
                    </div>

                    {/* Swap link (login/signup) */}
                    {swap && <div className="swap">{swap}</div>}
                </div>
            </section>

            <aside className="auth-right" aria-hidden="true" />
        </main>
    );
}

export default AuthLayout;
