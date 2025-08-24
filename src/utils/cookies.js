import Cookies from "js-cookie";
export const setRememberMe = (remember) => {
  if (remember) Cookies.set("rememberMe", "true", { expires: 30 });
  else Cookies.set("rememberMe", "true"); // session cookie
};
export const getRememberMe = () => Cookies.get("rememberMe");
