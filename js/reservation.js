// const { CURSOR_FLAGS } = require("mongodb");

var today = new Date().toISOString().split("T")[0];
document.getElementsByName("reservation-date")[0].setAttribute("min", today);

document.addEventListener("DOMContentLoaded", function () {
  setMinDateTime();
  // Check if logged in
  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const name = document.querySelector(".person-name").value;
    const phone = document.querySelector(".person-phone").value;
    const numOfPersons = parseInt(
      document.querySelector(".persons-number").value,
      10
    );
    let insertedDate = document.querySelector(".reservation-date").value;
    const details = document.querySelector(".more-details").value;
    // Send reservation data to the server
    fetch("/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        numOfPersons: numOfPersons, // Ensure numOfPersons is an integer
        insDate: insertedDate, // Convert date to ISO string in UTC
        details: details,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Server response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          title: "Success!",
          text: "Your reservation has been created successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        window.location.href = "/reservation";
      })
      .catch((error) => {
        // console.error("Error making reservation:", error.message);
        Swal.fire({
          title: "Error!",
          text: "You have already have a reservation in cafe",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      });
  });
});

function redirect(event) {
  // Change /home/api to /reservation/api
  fetch("/reservation/api")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let data = await response.json();
      var users;
      data.users.forEach((user) => {
        users = user;
      });
      const loginIcon = document.getElementById("loginIc");
      document.getElementById("loginIc").removeAttribute("href");
      if (users.status === "admin") {
        document.getElementById("loginIc").removeAttribute("href");
        loginIcon.href = "admin/dashboard";
      } else if (users.status === "user") {
        document.getElementById("loginIc").removeAttribute("href");
        loginIcon.href = "user/dashboard";
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  redirect();
});

function setMinDateTime() {
  const input = document.querySelector(".reservation-date");
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const minDateTime = `${year}-${month}-${day}T00:00`;
  input.min = minDateTime;
}
