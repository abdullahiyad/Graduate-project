var today = new Date().toISOString().split("T")[0];
document.getElementsByName("reservation-date")[0].setAttribute("min", today);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const name = document.querySelector(".person-name").value;
    const phone = document.querySelector(".person-phone").value;
    const numOfPersons = document.querySelector(".persons-number").value;
    const Date = document.querySelector(".reservation-date").value;
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
        numOfPersons: numOfPersons,
        Date: Date,
        time: time,
        details: details,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Reservation successful:", data);
        // Handle the success response here
        // For example, display a success message to the user
      })
      .catch((error) => {
        console.error("Error making reservation:", error);
        // Handle the error here
        // For example, display an error message to the user
      });
  });
});
