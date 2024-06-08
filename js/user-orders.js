// const { config } = require("dotenv");

//to show the links list in medium and small screens
let listIcon = document.querySelector("#menu-icon");
let dashboard = document.querySelector(".messages-container");
listIcon.addEventListener("click", () => {
  dashboard.classList.toggle("activeList");
});

function showMsgs(event) {
  const clickedElement = event.target;
  clickedElement.parentElement.parentElement.classList.toggle("show-msgs");
}

//function to show message more details
function readMessagge(event) {
  const clickedElement = event.target;
  clickedElement.parentElement.classList.toggle("more-details");
}
function closeMessagge(event) {
  const clickedElement = event.target;
  clickedElement.parentElement.parentElement.classList.toggle("more-details");
}

let pendingOrders = document.querySelector(".orders-table .pending-orders");
let oldOrders = document.querySelector(".orders-table .history-orders");
// let ordersTable = document.querySelector(".orders-table");
function addOrder(
  userName,
  userEmail,
  orderName,
  orderPhone,
  city,
  address1,
  address2,
  ordersDate,
  orderState,
  productsArray,
  totalPrice
) {
  const products = document.createElement("tbody");
  productsArray.forEach((element) => {
    products.appendChild(addProduct(element.productName, element.quantity));
  });
  const newOrder = document.createElement("div");
  newOrder.className = "message flex-row";
  newOrder.innerHTML = `
    <div class="info-container flex-row">
      <div class="icon flex-row">
        <i class="fa-solid fa-utensils"></i>
        <p class="input-style new-message">new order</p>
      </div>
      <div class="user-details">
        <input type="text" class="customer-name input-style" value="${userName}">
        <input type="email" class="customers-email input-style display-none" value="${userEmail}">
      </div>
    </div>
    <div class="order-content display-none">
      <div class="order-content input-style">
        <div class="display-none order-info">
          <h3>order information :</h3>
          <div class="name input-style">name : ${orderName}</div>
          <div class="phone input-style">phone : ${orderPhone}</div>
          <div class="city input-style">city : ${city}</div>
          <div class="address1 input-style">address : ${address1}</div>
          <div class="address2 input-style">address2 : ${address2}</div>
        </div>
        <div class="order-details">
          <h3>order details : </h3>
          <table>
            <thead>
              <tr>
                <th>product</th>
                <th>quantity</th>
              </tr>
            </thead>
            ${products.outerHTML}
            <tfoot>
              <td>total price : ${totalPrice} $</td>
              <td></td>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
    <p class="open-order" onclick="readMessagge(event)">details</p>
    <div class="btns display-none">
      <input type="button" class="close-msg btn-style" value="close" onclick="closeMessagge(event)">
    </div>
  `;

  pendingOrders.appendChild(newOrder.firstElementChild);
  const currentTime = new Date();
  const ordersDate = new Date(ordersDate);
  // Calculate 24 hours in milliseconds
  const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
  const timeDifference = currentTime - orderDate;
  if (
    timeDifference > millisecondsIn24Hours ||
    orderState.toLowerCase() === "submitted"
  ) {
    oldOrders.appendChild(newOrder.firstElementChild);
  } else {
    pendingOrders.appendChild(newOrder.firstElementChild);
  }
}

//test the function
const productsArr = [
  { name: "coffee", quan: 3 },
  { name: "tea", quan: 2 },
];
addOrder(
  "ahmed",
  "abdullahiyad@gmail.com",
  "ali",
  "1571681681",
  "jenin",
  "arabah",
  "address2",
  "2024-06-06T22:00:00Z",
  "pending",
  productsArr,
  300
);

//function add products
function addProduct(productName, productQuantity) {
  const row = document.createElement("tr");
  const col1 = document.createElement("td");
  col1.textContent = productName;
  const col2 = document.createElement("td");
  col2.textContent = productQuantity;
  row.appendChild(col1);
  row.appendChild(col2);
  return row;
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
  fetch("/user/orders/api")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let data = await response.json();
      return data;
    })
    .then((data) => {
      data.forEach((Order) => {
        console.log(Order.products);
        addOrder(
          Order.userName,
          Order.userEmail,
          Order.orderName,
          Order.orderPhone,
          Order.city,
          Order.address1,
          Order.address2,
          Order.orderDate.toLocalString(),
          Order.orderState,
          Order.productArray,
        );
        const test = {
          userName: Order.userName,
          userEmail: Order.userEmail,
          orderName: Order.orderName,
          orderPhone: Order.orderPhone,
          orderCity: Order.city,
          orderAddress1: Order.address1,
          orderAddress2: Order.address2,
          orderDate: Order.orderDate.toLocalString(),
          orderState: Order.orderState,
          orderProducts: Order.productArray,
        };
        console.log(test);
      });
    })
    .catch((error) => console.error("Error fetching orders data:", error));
});
