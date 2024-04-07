let loading = document.querySelector(".loader");
window.addEventListener("load", function () {
  loading.style.display = "none";
});

//This code written by Oday
const form = document.querySelector("form");
const error = document.querySelector(".error");

//show error message
function errorMsg() {
  error.style.display = "block";
}
module.exports = { errorMsg };

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   // emailError.textContent = '';
//   // passwordError.textContent = '';
//   const email = form.email.value;
//   const password = form.password.value;

//   try {
//     const res = await fetch("/login", {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//       headers: { "Content-Type": "application/json" },
//     });
//     const data = await res.json();
//     console.log(data);
//     if (data.error) {
//       error.style.display = "block";
//     }
//     // if(data.user){
//     //   location.assign('/home');
//     // }
//   } catch (err) {
//     console.log(err);
//   }
// });
