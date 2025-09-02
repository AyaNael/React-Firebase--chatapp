import AuthLayout from "../components/widgets/AuthLayout";
import Field from "../components/ui/Field";
import Checkbox from "../components/ui/Checkbox";
import useFormState from "../hooks/useFormState";
import { validateSignup } from "../utils/validators";
import { mapAuthError } from "../utils/firebaseErrors";
import { signUpEmail } from "../services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { updateProfile } from "firebase/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { values, touched, errors, handleChange, handleBlur, validateAll, setTouched } =
    useFormState({ name: "", email: "", password: "", agree: false }, validateSignup);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    const { hasErrors } = validateAll();
    setTouched({ name: true, email: true, password: true, agree: true });
    if (hasErrors) { setSubmitting(false); return; }

    try {
      const cred = await signUpEmail(values.email.trim(), values.password);
      const user = cred.user;

      const displayName = values.name.trim() || "User";
      await updateProfile(user, { displayName });


      await setDoc(doc(db, "users", user.uid), {
        displayName,
        email: user.email || "",
        photoURL: user.photoURL || "",
        isOnline: true,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      }, { merge: true });
      navigate("/login");
    } catch (err) {
      setFormError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout swap={<>Have an account? <a href="/login" className="link">Sign In</a></>}>
      <h1 className="auth-title">Get Started Now</h1>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Field
          label="Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your name"
          touched={touched.name}
          error={errors.name}
        />

        <Field
          label="Email address"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your email"
          touched={touched.email}
          error={errors.email}
        />

        <Field
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter a password"
          touched={touched.password}
          error={errors.password}
        />

        <Checkbox name="agree" checked={values.agree} onChange={handleChange}>
          I agree to terms & policy
        </Checkbox>
        {touched.agree && errors.agree && <div className="field-error">{errors.agree}</div>}

        {formError && <div className="form-error">{formError}</div>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Signing up..." : "Signup"}
        </button>


      </form>
    </AuthLayout>
  );
}
