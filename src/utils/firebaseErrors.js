export const mapAuthError = (err) => {
  const code = err?.code || "";
  if (code.includes("auth/invalid-credential")) return "Email or password is incorrect.";
  if (code.includes("auth/user-not-found")) return "No user found with this email.";
  if (code.includes("auth/email-already-in-use")) return "This Email is Already in use";
  if (code.includes("auth/wrong-password")) return "Incorrect password.";
  if (code.includes("auth/invalid-email")) return "Invalid email address.";
  if (code.includes("auth/too-many-requests")) return "Too many attempts. Please try again later.";
  return err?.message || "Request failed. Please try again.";
};
