//to show the links list in medium and small screens
let listIcon = document.querySelector("#menu-icon");
let dashboard = document.querySelector(".orders-container");
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

let ordersTable = document.querySelector(".orders-table");
function addOrder(
  userName,
  userEmail,
  orderName,
  orderPhone,
  city,
  address1,
  address2,
  productsArray,
  totalPrice
) {
  const products = document.createElement("tbody");
  productsArray.forEach((element) => {
    products.appendChild(addProduct(element.name, element.quantity));
  });
  const newOrder = document.createElement("div");
  newOrder.innerHTML = `
   <div class="message flex-row">
                    <div class="info-container flex-row">
                        <div class="icon flex-row">
                            <i class="fa-solid fa-utensils"></i>
                            <p class="input-style .new-message">new order</p>
                        </div>

                        <div class="user-details">
                            <input type="text" class="customer-name input-style" value="${userName}">
                            <input type="email" class="customers-email input-style display-none" value="${userEmail}">
                            <!-- <input type="text" class="customer-info input-style display-none" value="0569912325"> -->
                        </div>
                    </div>
                    <div class="order-content display-none">
                        <div class="order-content input-style">
                            <div class=" display-none order-info ">
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
                                    ${products.innerHTML}
                                    <tfoot>
                                        <td>total price :${totalPrice} $</td>
                                        <td></td>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                    <p class="open-order" onclick="readMessagge(event)">details</p>
                    <div class="btns display-none ">
                        <input type="button" class="close-msg btn-style" value="close" onclick="closeMessagge(event)">
                    </div>
                </div>
  `;
  ordersTable.appendChild(newOrder.firstElementChild);
}

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
  fetch("/admin/orders/api")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let data = await response.json();
      console.log(data);
      return data;
    })
    .then((data) => {
      data.orders.forEach((order) => {
        // Extract user data
        const userName = order.userName;
        const userEmail = order.userEmail;
        console.log(order.userName, order.userEmail);
        // Extract delivery data
        const orderName = order.customer.name;
        const orderPhone = order.customer.phone;
        const city = order.customer.City;
        const address1 = order.customer.address1;
        const address2 = order.customer.address2 || "";

        // Extract product data
        const productsArray = order.products.map(product => ({
          name: product.productName,
          quantity: product.quantity,
        }));

        // Extract total price
        const totalPrice = order.totalPrice;

        // Add the order data to the HTML
        addOrder(userName, userEmail, orderName, orderPhone, city, address1, address2, productsArray, totalPrice);
      });
    })
    .catch((error) => console.error("Error fetching user data:", error));
});


// Change status to processing when click on processing 

// Change status to finished, with message the order will arrive within minutes
