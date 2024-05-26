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
