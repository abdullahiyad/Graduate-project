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

var today = new Date().toISOString().split("T")[0];
document.getElementsByName("reservation-date")[0].setAttribute("min", today);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const name = document.querySelector(".person-name").value;
    const phone = document.querySelector(".person-phone").value;
    const numOfPersons = document.querySelector(".persons-number").value;
    const insertedDate = document.querySelector(".reservation-date").value;
    const time = document.querySelector(".reservation-time").value;
    const details = document.querySelector(".more-details").value;
    console.log(insertedDate);
    // Send reservation data to the server
    fetch("/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        numOfPersons: numOfPersons,
        insDate: insertedDate,
        time: time,
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
        console.log("Reservation successful:", data);
        // Handle the success response here
        // For example, display a success message to the user
      })
      .catch((error) => {
        console.error("Error making reservation:", error.message);
        // Handle the error here
        // For example, display an error message to the user
      });
  });
});
