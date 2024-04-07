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


//This code written by Oday
const form = document.querySelector('form');
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');


form.addEventListener('submit',async (e) => {
  e.preventDefault();

  // emailError.textContent = '';
  // passwordError.textContent = '';
  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch('/login',{
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {'Content-Type':'application/json'}
    });
    const data = await res.json();
    console.log(data);
    if(data.error){
      emailError.textContent = data.errors.email;
      password.textContent = data.errors.password;
    }
    // if(data.user){
    //   location.assign('/home');
    // }
  } catch (err) {
    console.log(err);
  }
});