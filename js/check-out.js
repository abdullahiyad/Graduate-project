// const { config } = require("dotenv");
// const { ConnectionPoolMonitoringEvent } = require("mongodb");

//function add product to bill
let billTable = document.querySelector(".product-table");
let totalAmount = 0;
let neededScore = 0;
let userScore = 0;
let amountContainer = document.querySelector(".total .price .number");
document.addEventListener("DOMContentLoaded", () => {
  // Function to format currency
  function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }

  // Redirect logic
  fetch("/checkout/switch")
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
      if (users.status === "admin") {
        loginIcon.removeAttribute("href");
        loginIcon.href = "admin/dashboard";
      } else if (users.status === "user") {
        loginIcon.removeAttribute("href");
        loginIcon.href = "user/dashboard";
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));

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
          <div class="sign">₪</div>
        </div>
      </div>
    `;
    billTable.appendChild(productElement.firstElementChild);
  });

  // Display the total amount
  amountContainer.textContent = totalAmount.toFixed(2);
  checkScore();
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
    let PayCash = document.querySelector(".Cash");   
    let PayScore = document.querySelector(".Score");
    let payMethod;

    if(PayCash.checked) {
      payMethod = "Cash";
    } else if(PayScore.checked) {
      payMethod = "Score"
    }
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

async function submitOrder(
  name,
  phone,
  city,
  address,
  address2,
  productsArray,
  paymentMethod
) {
  const orderData = {
    customer: {
      name: name,
      phone: phone,
      City: city,
      address1: address,
      address2: address2,
    },
    cart: productsArray,
    pM: paymentMethod,
  };


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
    // console.log("Order created successfully:", data);
  } catch (error) {
    console.error("Error submitting order:", error);
  }
}

//function to make an element disabled
function disabledFunc() {
  const scoreRadio = document.querySelector("#coins");
  scoreRadio.classList.toggle("disabled");
}

//function to claculate the score need to pay the order
function calcScore() {
  const orderSalaryInScore = document.querySelector(
    ".bill .total .price .number"
  );
  if (orderSalaryInScore.textContent == 0) {
    setTimeout(() => {
      calcScore();
    }, 50);
  } else {
    neededScore = orderSalaryInScore.textContent * 50;
    // console.log("needed Score for order =", neededScore);
  }
}

function checkScore() {
  calcScore();
  if (neededScore <= userScore) {
    document.querySelector("#coinsR").disabled = false;
    document.querySelector("#coinsLabel").disabled = false;
    document.querySelector("#coinsLabel-notEnough").style.display = "none";
  } else {
    document.querySelector("#coinsLabel").style.display = "none";
    document.querySelector("#coinsR").disabled = true;
    document.querySelector("#coinsLabel-notEnough").style.display = "contents";
  }
}

function checkRadio() {
  if (document.querySelector("#coinsR").disabled) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You don't have enough score to pay for this order!",
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("/user/dashboard/api")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      userScore = data.Score;
    })
    .catch((error) => console.error("Error fetching dashboard data:", error));
});
