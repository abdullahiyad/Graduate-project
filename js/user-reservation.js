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

function showMsgs(event) {
  const clickedElement = event.target;
  clickedElement.parentElement.parentElement.classList.toggle("show-msgs");
}

let reservationID;
function rejectReservation(event) {
  const clickedElement = event.target;
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, cancel it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "canceled!",
        text: "the reservation has been canceled.",
        icon: "success",
      });
      reservationID =
        clickedElement.parentElement.previousElementSibling
          .previousElementSibling.previousElementSibling.lastElementChild
          .lastElementChild.value;
      //function to send this reservation info to rejected reservation database
      //
      //function here
      //
      clickedElement.parentElement.parentElement.remove();
    }
  });
}
let rejectedContainer = document.querySelector(
  ".rejected-reservation .content-section"
);
let acceptedContainer = document.querySelector(
  ".accepted-reservation .content-section"
);
let pendingContainer = document.querySelector(
  ".pending-reservation .content-section"
);

function addMessagePending(
  userName,
  userEmail,
  reservationId,
  reservationName,
  reservationPhone,
  reservationDate,
  reservationTime,
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
Time: [${reservationTime}]
Number of persons: [${numOfPersons}]

We would appreciate it if you could confirm our reservation at your earliest convenience. 
here more details : [${moreDetails}]

                        </textarea>
                    </div>
                    <p class="open-msg" onclick="readMessagge(event)">read</p>
                    <div class="btns display-none ">
                        <input type="button" class="reject-btn btn-style" onclick="rejectReservation(event)"
                            value="cancel">
                        <input type="button" class="close-msg btn-style" value="close" onclick="closeMessagge(event)">
                    </div>
                </form>
  `;
  pendingContainer.appendChild(newMessage.firstElementChild);
}

function addMessageAccepted(
  reservationId,
  reservationName,
  reservationPhone,
  reservationDate,
  reservationTime,
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
                            <input type="text" class="customer-name input-style" value="YKPO Cafe">
                            <input type="email" class="customers-email input-style display-none" value="Admin@YKPO.com">
                            <!-- <input type="text" class="customer-info input-style display-none" value="0569912325"> -->
                            <input type="text" class="reservation-id" value="${reservationId}">
                        </div>
                    </div>
                    <div class="message-content display-none">
                        <textarea name="" id="" class="message-content input-style">

subject: reservation request

We are pleased to inform you that your request to book a reservation in our café has been accepted,                         
the reservation details below:                           
Contact Name: [${reservationName}]
Contact Phone: [${reservationPhone}]
Date: [${reservationDate}]
Time: [${reservationTime}]
Number of persons: [${numOfPersons}]


here more details : [${moreDetails}]

                        </textarea>
                    </div>
                    <p class="open-msg" onclick="readMessagge(event)">read</p>
                    <div class="btns display-none ">
                        <input type="button" class="reject-btn btn-style" onclick="rejectReservation(event)"
                            value="cancel">
                        <input type="button" class="close-msg btn-style" value="close" onclick="closeMessagge(event)">
                    </div>
                </form>
  `;
  acceptedContainer.appendChild(newMessage.firstElementChild);
}

function addMessageRejected(
  reservationId,
  reservationName,
  reservationPhone,
  reservationDate,
  reservationTime,
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
                            <input type="text" class="customer-name input-style" value="YKPO Cafe">
                            <input type="email" class="customers-email input-style display-none" value="Admin@YKPO.com">
                            <!-- <input type="text" class="customer-info input-style display-none" value="0569912325"> -->
                            <input type="text" class="reservation-id" value="${reservationId}">
                        </div>
                    </div>
                    <div class="message-content display-none">
                        <textarea name="" id="" class="message-content input-style">

subject: reservation request

We are sorry, but we have to make a decision to reject the reservation you made for our cafe,                         
the reservation details below:                           
Contact Name: [${reservationName}]
Contact Phone: [${reservationPhone}]
Date: [${reservationDate}]
Time: [${reservationTime}]
Number of persons: [${numOfPersons}]


here more details : [${moreDetails}]

                        </textarea>
                    </div>
                    <p class="open-msg" onclick="readMessagge(event)">read</p>
                    <div class="btns display-none ">
                        
                        <input type="button" class="close-msg btn-style" value="close" onclick="closeMessagge(event)">
                    </div>
                </form>
  `;
  rejectedContainer.appendChild(newMessage.firstElementChild);
}

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

document.addEventListener("DOMContentLoaded", () => {
  fetch("/user/messages/api")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let data = await response.json();
      // console.log(data);
      return data;
    })
    .then((data) => {
      data.forEach((reservation) => {
        console.log(reservation.state);
        if(reservation.state === "pending") {
          addMessagePending(
            reservation.userName,
            reservation.userEmail,
            reservation._id,
            reservation.resName,
            reservation.phone,
            new Date(reservation.newDate).toLocaleString(), // Format date
            reservation.numPerson,
            reservation.details
          );
        } else if(reservation.state === "accepted") {
          addMessageAccepted(
            reservation.userName,
            reservation.userEmail,
            reservation._id,
            reservation.resName,
            reservation.phone,
            new Date(reservation.newDate).toLocaleString(), // Format date
            reservation.numPerson,
            reservation.details
          );
        } else if(reservation.state === "rejected") {
          addMessageRejected(
            reservation.userName,
            reservation.userEmail,
            reservation._id,
            reservation.resName,
            reservation.phone,
            new Date(reservation.newDate).toLocaleString(), // Format date
            reservation.numPerson,
            reservation.details
          );
        }
        
      });
    })
    .catch((error) => console.error("Error fetching user data:", error));
});
