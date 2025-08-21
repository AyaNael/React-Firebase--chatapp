import { useState } from "react";
import AuthLayout from "../layout/AuthLayout";
import "../css/auth.css";
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const validate = (vals) => {
    const e = {};
    if (!vals.email.trim()) {
      e.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(vals.email.trim())
    ) {
      e.email = "Please enter a valid email address.";
    }

    if (!vals.password) {
      e.password = "Password is required.";
    } else if (vals.password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }

    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === "checkbox" ? checked : value;
    setValues((prev) => ({ ...prev, [name]: v }));

    setErrors((prev) => {
      const next = { ...prev };
      const fieldErrors = validate({ ...values, [name]: v });
      next[name] = fieldErrors[name];
      return next;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(values);
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    const v = validate(values);
    setErrors(v);
    setTouched({ email: true, password: true });

    const hasErrors = Object.keys(v).length > 0;
    if (hasErrors) {
      setSubmitting(false);
      return;
    }

    try {
      const email = values.email.trim();
      const password = values.password;
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/chat');

    } catch (err) {
      const msg = mapAuthError(err);
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };
  const mapAuthError = (err) => {
    const code = err?.code || "";
    if (code.includes("auth/invalid-credential")) return "Email or password is incorrect.";
    if (code.includes("auth/user-not-found")) return "No user found with this email.";
    if (code.includes("auth/email-already-in-use")) return "This Email is Already in use";
    if (code.includes("auth/wrong-password")) return "Incorrect password.";
    if (code.includes("auth/invalid-email")) return "Invalid email address.";
    if (code.includes("auth/too-many-requests")) return "Too many attempts. Please try again later.";
    return err?.message || "Login failed. Please try again.";
  }

  return (
    <AuthLayout
      swap={
        <>
          Dont have an account?{" "}
          <a href="/signup" className="link"> Sign up</a>
        </>
      }>
      <h1 className="auth-title">Welcome back!</h1>
      <p className="auth-subtitle">
        Enter your credentials to access your account.
      </p>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <label className="field">
          <span className="field-label">Email address</span>
          <input
            placeholder="Enter your email"
            name="email"
            type="email"
            className={`field-input ${touched.email && errors.email ? "is-invalid" : ""}`}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby="email-error"
            required
          />
          {touched.email && errors.email && (
            <div id="email-error" className="field-error">{errors.email}</div>
          )}
        </label>

        {/* Password */}
        <label className="field">
          <div className="field-row">
            <span className="field-label">Password</span>
            <a href='login' className="link-sm">forgot password?</a>
          </div>
          <input
            placeholder="Enter a password"
            name="password"
            type="password"
            className={`field-input ${touched.password && errors.password ? "is-invalid" : ""}`}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.password && errors.password)}
            aria-describedby="password-error"
            required
          />
          {touched.password && errors.password && (
            <div id="password-error" className="field-error">{errors.password}</div>
          )}
        </label>

        {/* Remember me */}
        <label className="check">
          <input
            type="checkbox"
            name="remember"
            checked={values.remember}
            onChange={handleChange}
          />{" "}
          <span>Remember me for 30 days</span>
        </label>

        {formError && <div className="form-error">{formError}</div>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

    </AuthLayout >

  );
}
