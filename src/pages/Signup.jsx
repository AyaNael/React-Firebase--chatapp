import { useState } from "react";
import AuthLayout from "../layout/AuthLayout";
import "../css/auth.css";
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        agree: false,
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(""); // خطأ عام (إن احتجته لاحقًا)

    const validate = (vals) => {
        const e = {};

        // Name
        if (!vals.name.trim()) {
            e.name = "Name is required.";
        } else if (vals.name.trim().length < 2) {
            e.name = "Name must be at least 2 characters.";
        }

        // Email
        if (!vals.email.trim()) {
            e.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(vals.email.trim())) {
            e.email = "Please enter a valid email address.";
        }

        // Password
        if (!vals.password) {
            e.password = "Password is required.";
        } else if (vals.password.length < 6) {
            e.password = "Password must be at least 6 characters.";
        }

        // Terms
        if (!vals.agree) {
            e.agree = "You must agree to the terms & policy.";
        }

        return e;
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const v = type === "checkbox" ? checked : value;
        setValues((prev) => ({ ...prev, [name]: v }));

        const fieldErrors = validate({ ...values, [name]: v });
        setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
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
        setTouched({
            name: true,
            email: true,
            password: true,
            agree: true,
        });

        if (Object.keys(v).length) {
            setSubmitting(false);
            return;
        }


        try {
            const email = values.email.trim();
            const password = values.password;
            await createUserWithEmailAndPassword(auth, email, password);

            navigate('/login');

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
                    Have an account?{" "}
                    <a href="/login" className="link"> Sign In</a>
                </>
            }>
            <h1 className="auth-title">Get Started Now</h1>

            <form className="auth-form" onSubmit={onSubmit} noValidate>
                {/* Name */}
                <label className="field">
                    <span className="field-label">Name</span>
                    <input
                        placeholder="Enter your name"
                        name="name"
                        type="text"
                        className={`field-input ${touched.name && errors.name ? "is-invalid" : ""}`}
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    {touched.name && errors.name && (
                        <div className="field-error">{errors.name}</div>
                    )}
                </label>

                {/* Email */}
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
                        required
                    />
                    {touched.email && errors.email && (
                        <div className="field-error">{errors.email}</div>
                    )}
                </label>

                {/* Password */}
                <label className="field">
                    <span className="field-label">Password</span>
                    <input
                        placeholder="Enter a password"
                        name="password"
                        type="password"
                        className={`field-input ${touched.password && errors.password ? "is-invalid" : ""}`}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        minLength={6}
                    />
                    {touched.password && errors.password && (
                        <div className="field-error">{errors.password}</div>
                    )}
                </label>


                {/* Terms */}
                <label className="check">
                    <input
                        type="checkbox"
                        name="agree"
                        checked={values.agree}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />{" "}
                    <span>I agree to terms & policy</span>
                </label>
                {touched.agree && errors.agree && (
                    <div className="field-error">{errors.agree}</div>
                )}

                {formError && <div className="form-error">{formError}</div>}

                <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? "Signing up..." : "Signup"}
                </button>
            </form>


        </AuthLayout>
    );
}
