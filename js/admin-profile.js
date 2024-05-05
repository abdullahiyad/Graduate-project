//to show the links list in medium and small screens
let listIcon = document.querySelector("#menu-icon");
let dashboard = document.querySelector(".profile-container");
listIcon.addEventListener("click", () => {
  dashboard.classList.toggle("activeList");
});

let cancelBtn = document.querySelector(".cancel-btn");
let editBtn = document.querySelector(".edit-btn");
let profile = document.querySelector(".user-info");

editBtn.addEventListener("click", () => {
  profile.classList.toggle("on-edit");
});

cancelBtn.addEventListener("click", () => {
  window.location.reload();
  profile.classList.toggle("on-edit");
});

let nameField = document.querySelector(".name");
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
