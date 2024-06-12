//to show the links list in medium and small screens
let listIcon = document.querySelector("#menu-icon");
let dashboard = document.querySelector(".dashboard-container");
listIcon.addEventListener("click", () => {
  dashboard.classList.toggle("activeList");
});

window.logout = function () {
  fetch("/admin/dashboard/logout", {
    method: "POST", // Change the method to POST
  })
    .then((result) => {
      console.log("logout success");
      window.location.href = "/home";
    })
    .catch((err) => {
      console.log(err);
    });
};

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.querySelector(".logout");
  logoutButton.addEventListener("click", logout);
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
                            <i class="fa-solid fa-receipt"></i>
                            <p class="input-style .new-message">reservation</p>
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


reservation details :                           
Contact Name: [${reservationName}]
Contact Phone: [${reservationPhone}]
Date: [${reservationDate}]
Number of persons: [${numOfPersons}]

here more details : [${moreDetails}]
                        </textarea>
                    </div>
                    <p class="open-msg" onclick="readMessagge(event)">details</p>
                    <div class="btns display-none ">
                       <!-- <button class="accept-btn btn-style" onclick="acceptReservation(event)">Accept</button> -->
                        <input type="button" class="reject-btn btn-style" onclick="rejectReservation(event)"
                            value="delete"> 
                        <input type="button" class="close-msg btn-style" value="close" onclick="closeMessagge(event)">
                    </div>
                </form>
  `;
  messagesTable.appendChild(newMessage.firstElementChild);
}

addMessage(
  "ali",
  "asldfj@gmail.com",
  5,
  "ahmed",
  "0651561981",
  "25-4-2002",
  5,
  "none"
);

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
