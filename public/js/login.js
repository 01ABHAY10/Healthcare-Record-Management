//login && signup
const loginText = $(".title-text .login");
const loginForm = $("form.login");
const loginBtn = $("label.login");
const signupBtn = $("label.signup");
const signupLink = $("form .signup-link a");
signupBtn.onclick = () => {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
};
loginBtn.onclick = () => {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
};
signupLink.onclick = () => {
  signupBtn.click();
  return false;
};
