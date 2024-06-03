//to show the links list in medium and small screens
let listIcon = document.querySelector("#menu-icon");
let dashboard = document.querySelector(".messages-container");
listIcon.addEventListener("click", () => {
  dashboard.classList.toggle("activeList");
});

//function to show message more details
function readMessagge(event) {
  const clickedElement = event.target;
  clickedElement.parentElement.classList.toggle("more-details");
}
function closeMessagge(event) {
  const clickedElement = event.target;
  clickedElement.parentElement.parentElement.classList.toggle("more-details");
}

// if reject reservation
//let reservationID;
function rejectReservation(event) {
  const clickedElement = event.target;
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Reject it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Rejected!",
        text: "The reservation request has been rejected.",
        icon: "success",
      });

      // Extract reservation ID from the DOM
      const reservationID =
        clickedElement.parentElement.previousElementSibling
          .previousElementSibling.previousElementSibling.lastElementChild
          .lastElementChild.value;
      console.log(reservationID);
      // Send the reservation ID and state to the server
      fetch("/admin/messages", {
        method: "PUT", // Specify the HTTP method as PUT
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify({ id: reservationID, state: "rej" }), // Send the reservation ID and state
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("There is something wrong");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Reservation update successful:", data);
          // Handle the success response here
          clickedElement.parentElement.parentElement.remove();
        })
        .catch((err) => {
          console.error("Reservation update failed:", err);
        });
    }
  });
}
let messagesTable = document.querySelector(".messages-table");
function addMessage(
  userName,
  userEmail,
  reservationId,
  reservationName,
  reservationPhone,
  reservationDate,
  numOfPersons,
  moreDetails = "none"
) {
  const newMessage = document.createElement("div");
  newMessage.innerHTML = `
   <form action="" class="message flex-row" method="">
                    <div class="info-container flex-row">
                        <div class="icon flex-row">
                            <i class="fa-regular fa-envelope"></i>
                            <p class="input-style .new-message">new message</p>
                        </div>

                        <div>
                            <input type="text" class="customer-name input-style" value="${userName}">
                            <input type="email" class="customers-email input-style display-none" value="${userEmail}">
                            <!-- <input type="text" class="customer-info input-style display-none" value="0569912325"> -->
                            <input type="text" class="reservation-id" value="${reservationId}">
                        </div>
                    </div>
                    <div class="message-content display-none">
                        <textarea name="" id="" class="message-content input-style">

subject: reservation request

I want to make a reservation at your esteemed cafe.                          
Please find the reservation details below:                           
Contact Name: [${reservationName}]
Contact Phone: [${reservationPhone}]
Date: [${reservationDate}]
Number of persons: [${numOfPersons}]

We would appreciate it if you could confirm our reservation at your earliest convenience. 
here more details : [${moreDetails}]

                        </textarea>
                    </div>
                    <p class="open-msg" onclick="readMessagge(event)">read</p>
                    <div class="btns display-none ">
                        <button class="accept-btn btn-style" onclick="acceptReservation(event)">Accept</button>
                        <input type="button" class="reject-btn btn-style" onclick="rejectReservation(event)"
                            value="reject">
                        <input type="button" class="close-msg btn-style" value="close" onclick="closeMessagge(event)">
                    </div>
                </form>
  `;
  messagesTable.appendChild(newMessage.firstElementChild);
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("/admin/messages/api")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let data = await response.json();
      console.log(data);
      return data;
    })
    .then((data) => {
      data.forEach((reservation) => {
        addMessage(
          reservation.customer.userName,
          reservation.customer.userEmail,
          reservation._id,
          reservation.resName,
          reservation.phone,
          new Date(reservation.newDate).toLocaleString(), // Format date
          reservation.numPerson,
          reservation.details
        );
      });
    })
    .catch((error) => console.error("Error fetching user data:", error));
});

window.logout = function () {
  fetch("/admin/messages/logout", {
    method: "POST", // Change the method to POST
  })
    .then((result) => {
      window.location.href = "/home";
    })
    .catch((err) => {
      console.log(err);
    });
};

// if accept reservation
function acceptReservation(event) {
  event.preventDefault(); // Prevent default button behavior
  const clickedElement = event.target;
  const reservationID =
    clickedElement.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.lastElementChild.lastElementChild.value;
  console.log(reservationID);
  fetch("/admin/messages", {
    method: "PUT", // Specify the HTTP method as PUT for updating
    headers: {
      "Content-Type": "application/json", // Specify the content type
    },
    body: JSON.stringify({ id: reservationID, state: "acc" }), // Send the reservation ID and state
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("There is something error");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Reservation accepted successfully:", data);
      Swal.fire({
        title: "Accepted!",
        text: "The reservation request has been accepted.",
        icon: "success",
      });
      // Optionally, you can update the UI to reflect the change
      // For example, remove the accepted reservation from the DOM
      clickedElement.parentElement.parentElement.remove();
    })
    .catch((err) => {
      console.error("Reservation acceptance failed:", err);
      Swal.fire({
        title: "Error!",
        text: "There was an error accepting the reservation.",
        icon: "error",
      });
    });
}
