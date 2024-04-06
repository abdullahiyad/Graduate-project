let loading = document.querySelector(".loader");
window.addEventListener("load", function () {
  loading.style.display = "none";
});
let loginBtn = document.querySelector(".login-btn");
let username = document.querySelector(".email");
let pass = document.querySelector(".password");
loginBtn.addEventListener("click", () => {
  window.alert(username.textContent, pass.textContent);
});
