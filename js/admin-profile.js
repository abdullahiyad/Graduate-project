//to show the links list in medium and small screens
let listIcon = document.querySelector("#menu-icon");
let dashboard = document.querySelector(".profile-container");
listIcon.addEventListener("click", () => {
  dashboard.classList.toggle("activeList");
});

let cancelBtn = document.querySelector(".cancel-btn");
let saveBtn = document.querySelector(".save-btn");
let editBtn = document.querySelector(".edit-btn");
let profile = document.querySelector(".user-info");

let changePasswordBtn = document.querySelector(".change-pass-btn");
let passwordContainer = document.querySelectorAll(".password-container");

changePasswordBtn.addEventListener("click", () => {
  passwordContainer[0].classList.toggle("change");
  passwordContainer[1].classList.toggle("change");
  changePasswordBtn.classList.toggle("change");
  cancelBtn.style.display = "block";
  saveBtn.style.display = "block";
});

console.log("inside js file");
fetch("/admin/profile/api")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let data = await response.json();
      return data;
    })
    .then((data) => {
      updateInfo(data.name, data.email, data.phone);
    })
    .catch((error) => console.error("Error fetching user data:", error));
editBtn.addEventListener("click", () => {
  profile.classList.toggle("on-edit");
});
fetch("/admin/profile/update")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let data = await response.json();
      return data;
    })
    .then((data) => {
      updateInfo(data.name, data.email, data.phone);
    })
    .catch((error) => console.error("Error fetching user data:", error));
editBtn.addEventListener("click", () => {
  profile.classList.toggle("on-edit");
});


cancelBtn.addEventListener("click", () => {
  window.location.reload();
  profile.classList.toggle("on-edit");
});

let nameField = document.querySelector(".nameField");
let emailField = document.querySelector(".email");
let phoneField = document.querySelector(".phone");

function updateInfo(name, email, phone) {
  nameField.value = name;
  emailField.value = email;
  phoneField.value = phone;
}

window.logout = function () {
  fetch("/admin/dashboard/logout", {
    method: "POST", // Change the method to POST
  })
    .then((result) => {
      console.log("logout success");
    })
    .catch((err) => {
      console.log(err);
    });
};
