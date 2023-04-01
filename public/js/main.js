//login && signup
const loginText = document.querySelector(".title-text .login");
      const loginForm = document.querySelector("form.login");
      const loginBtn = document.querySelector("label.login");
      const signupBtn = document.querySelector("label.signup");
      const signupLink = document.querySelector("form .signup-link a");
      signupBtn.onclick = (()=>{
        loginForm.style.marginLeft = "-50%";
        loginText.style.marginLeft = "-50%";
      });
      loginBtn.onclick = (()=>{
        loginForm.style.marginLeft = "0%";
        loginText.style.marginLeft = "0%";
      });
      signupLink.onclick = (()=>{
        signupBtn.click();
        return false;
      });





$("button.btn-secondary").on("click", function () {
  if ($("div#graph").css("visibility") == "hidden") {
    $("div#graph").css("visibility", "visible");
    $("div#graph").slideDown();
    $("button.btn-secondary").text("Display");
  } else {
    $("div#graph").slideToggle();
    $("button.btn-secondary").text("Hide");
  }
});

