import AuthLayout from "../components/widgets/AuthLayout";
import Field from "../components/ui/Field";
import Checkbox from "../components/ui/Checkbox";
import useFormState from "../hooks/useFormState";
import { validateLogin } from "../utils/validators";
import { mapAuthError } from "../utils/firebaseErrors";
import { setRememberMe, getRememberMe } from "../utils/cookies";
import { signInEmail, subscribeAuth, logout } from "../services/authService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { values, touched, errors, handleChange, handleBlur, validateAll, setTouched } =
    useFormState({ email: "", password: "", remember: false }, validateLogin);

  // منطق rememberMe عند بدء التطبيق
  useEffect(() => {
    const unsub = subscribeAuth(async (user) => {
      const remember = getRememberMe();
      if (user && !remember) await logout();
    });
    return () => unsub && unsub();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    const { hasErrors } = validateAll();
    setTouched({ email: true, password: true });

    if (hasErrors) { setSubmitting(false); return; }

    try {
      setRememberMe(values.remember);
      await signInEmail(values.email.trim(), values.password);
      navigate("/chat");
    } catch (err) {
      setFormError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      swap={<>Dont have an account? <a href="/signup" className="link">Sign up</a></>}
    >
      <h1 className="auth-title">Welcome back!</h1>
      <p className="auth-subtitle">Enter your credentials to access your account.</p>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Field
          label="Email address"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.email}
          error={errors.email}
        />

        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="Enter a password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.password}
          error={errors.password}
          rightSlot={<a href="/login" className="link-sm">forgot password?</a>}
        />

        <Checkbox name="remember" checked={values.remember} onChange={handleChange}>
          Remember me for 30 days
        </Checkbox>

        {formError && <div className="form-error">{formError}</div>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

      
      </form>
    </AuthLayout>
  );
}
