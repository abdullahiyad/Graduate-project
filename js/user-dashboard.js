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

//function to update statics
function updateStatics(totalSalesN, totalOrdersN, totalUsersN) {
  const totalSales = document.querySelector(".sales .num span");
  totalSales.innerHTML = totalSalesN;
  const totalOrders = document.querySelector(".total-orders .num span");
  totalOrders.innerHTML = totalOrdersN;
  const totalReservations = document.querySelector(
    ".total-resrvation .num span"
  );
  totalReservations.innerHTML = totalUsersN;
}
