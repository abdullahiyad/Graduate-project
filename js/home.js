let linkIcon = document.querySelector(".burger-icon");
let linkList = document.querySelector("ul");
linkIcon.addEventListener("click", function () {
  if (linkIcon.classList.contains("clicked")) {
    linkList.style.display = "none";
    linkIcon.classList.remove("clicked");
  } else {
    linkList.style.display = "block";
    linkIcon.classList.add("clicked");
  }
});

/* loading */
let loading = document.querySelector(".loader");
window.addEventListener("load", function () {
  loading.style.display = "none";
});
/* loading end */

/* home links list */

let link = document.querySelectorAll(".links li");
link.forEach((element) => {
  if (window.innerWidth <= 800) {
    element.addEventListener("click", function () {
      if (linkIcon.classList.contains("clicked")) {
        linkList.style.display = "none";
        linkIcon.classList.remove("clicked");
      } else {
        linkList.style.display = "block";
        linkIcon.classList.add("clicked");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  redirect();
});

function redirect() {
  fetch("/home/api")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let data = await response.json();
      var users;
      data.users.forEach((user) => {
        users = user;
      });
      document.getElementById('loginIc').removeAttribute('href');
      const loginIcon = document.getElementById('loginIc');
      if (users.status === 'admin') {
        document.getElementById('loginIc').removeAttribute('href');
        loginIcon.href = 'admin/dashboard';
      } else if(users.status === 'user') {
        document.getElementById('loginIc').removeAttribute('href');
        loginIcon.href = 'user/dashboard';
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));
}