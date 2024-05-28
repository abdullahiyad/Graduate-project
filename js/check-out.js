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

//function for buttons back and submit
function backFunc() {
  window.location.href = "/menu";
}

function submitFunc() {
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
      submitOrder();
      setTimeout(() => {
        // window.location.href = "/menu";
      }, 1000);
    }
  });
}

//function to submit order to database
function submitOrder() {
  let productsArray = JSON.parse(sessionStorage.getItem("productsArray"));
  let name = document.querySelector(".address .name").value;
  let phone = document.querySelector(".address .phone").value;
  let city = document.querySelector(".address .city").value;
  let address = document.querySelector(".address .address1").value;
  let address2 = document.querySelector(".address .address2").value;
}
