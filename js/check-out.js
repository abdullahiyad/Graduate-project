// const { config } = require("dotenv");
// const { ConnectionPoolMonitoringEvent } = require("mongodb");

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

//function add product to bill
let billTable = document.querySelector(".product-table");
let totalAmount = 0;
let amountContainer = document.querySelector(".total .price .number");
document.addEventListener("DOMContentLoaded", () => {
  // to redirect to profile page
  redirect();
  // Function to format currency
  function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }

  // Retrieve the product details from session storage
  let productsArray = JSON.parse(sessionStorage.getItem("productsArray"));

  const productElement = document.createElement("div");
  productsArray.forEach((product) => {
    const total = product.quan * product.price;
    totalAmount += total;
    productElement.innerHTML = `
      <div class="product">
            <div class="product-name">${product.name}</div>
            <div class="product-quantity">X <span class="quan">${product.quan}</span></div>
            <div class="price">
            <div class="number">${product.price}</div>
            <div class="sign">$</div>
        </div>
    </div>
    `;
    billTable.appendChild(productElement.firstElementChild);
  });
  // Display the total amount
  amountContainer.textContent = totalAmount.toFixed(2);
});

//form submition
document
  .getElementById("orderForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    let productsArray = JSON.parse(sessionStorage.getItem("productsArray"));
    let name = document.querySelector(".address .name").value;
    let phone = document.querySelector(".address .phone").value;
    let city = document.querySelector(".address .city").value;
    let address = document.querySelector(".address .address1").value;
    let address2 = document.querySelector(".address .address2").value;
    // Check if the form is valid
    if (this.checkValidity()) {
      // If the form is valid, show the SweetAlert confirmation
      Swal.fire({
        title: "confirm order?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, submit it",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "submitted",
            text: "Your order has been submitted.",
            icon: "success",
          });
          //here the info that should submitted for backend
          console.log(name, phone, city, address, address2);
          console.log(productsArray);
          
          submitOrder(name, phone, city, address, address2, productsArray);

          setTimeout(() => {
            sessionStorage.removeItem("productsArray");
            window.location.href = "/menu";
          }, 1000);
        }
      });
    } else {
      // If the form is invalid, trigger the browser's validation UI
      this.reportValidity();
    }
  });

//function for back button
function backFunc() {
  window.location.href = "/menu";
}


async function submitOrder(name, phone, city, address, address2, productsArray) {

  const orderData = {
    customer: {
      name: name,
      phone: phone,
      City: city,
      address1: address,
      address2: address2,
    },
    cart: productsArray,
  };

  console.log(orderData);

  try {
    const response = await fetch("/menu/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Order created successfully:", data);
  } catch (error) {
    console.error("Error submitting order:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {

});

function redirect() {
  fetch("/checkout/")
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
        loginIcon.href = 'user/profile';
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));
}
