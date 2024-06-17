let loading = document.querySelector(".loader");
window.addEventListener("load", function () {
  loading.style.display = "none";
});

//function to check the values of inputs filed
let emailValidate = false;
let phoneValidate = false;
let passwordValidate = false;
//function to check email
function checkEmail(event) {
  const email = event.target.value;
  if (true) {
    event.target.classList.remove("notValid");
    event.target.classList.add("valid");
    emailValidate = true;
  } else {
    event.target.classList.add("notValid");
    emailValidate = false;
  }
}
//function to check phone number
function checkPhone(event) {
  const phone = event.target.value;
  const phoneRegex = /^(059|056)\d{7}$/;
  if (phoneRegex.test(phone)) {
    phoneValidate = true;
    event.target.classList.remove("notValid");
    event.target.classList.add("valid");
  } else {
    event.target.classList.add("notValid");
    phoneValidate = false;
  }
}
//function to check password
function checkPassword(event) {
  const passwrod = event.target.value;
  const passwordRegex =
    /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[A-Z]).{8,}$/;
  if (passwordRegex.test(passwrod)) {
    passwordValidate = true;
    event.target.classList.remove("notValid");
    event.target.classList.add("valid");
  } else {
    passwordValidate = false;
    event.target.classList.add("notValid");
  }
}

const form = document.querySelector(".signup-form");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".signup-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.name.value;
    const phone = form.phone.value;
    const email = form.email.value;
    const password = form.password.value;

    if (phoneValidate && emailValidate && passwordValidate) {
      try {
        await fetch("/signup", {
          method: "POST",
          body: JSON.stringify({
            name: name,
            phone: phone,
            email: email,
            password: password,
          }),
          headers: { "Content-Type": "application/json" },
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Thank you for signing up! Your account is ready.",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location.href = "user/dashboard";
        }, 1500);
      } catch (err) {
        console.log(err);
      }
    }
  });
});
