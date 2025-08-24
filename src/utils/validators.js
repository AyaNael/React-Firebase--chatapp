export const validateLogin = (vals) => {
  const e = {};
  if (!vals.email?.trim()) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(vals.email.trim()))
    e.email = "Please enter a valid email address.";

  if (!vals.password) e.password = "Password is required.";
  else if (vals.password.length < 6)
    e.password = "Password must be at least 6 characters.";

  return e;
};

export const validateSignup = (vals) => {
  const e = {};
  if (!vals.name?.trim()) e.name = "Name is required.";
  else if (vals.name.trim().length < 2) e.name = "Name must be at least 2 characters.";

  Object.assign(e, validateLogin(vals)); // نفس قواعد الإيميل/الباسورد
  if (!vals.agree) e.agree = "You must agree to the terms & policy.";

  return e;
};
