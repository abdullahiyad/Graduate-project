let cartIcon = document.querySelector(".cart-icon");
let cartCloseBtn = document.querySelector(".cart-tap .close");
let body = document.querySelector("body");
const elem = document.querySelector('product-img123');
cartIcon.addEventListener("click", () => {
  body.classList.toggle("activeTabCart");
});
cartCloseBtn.addEventListener("click", () => {
  body.classList.toggle("activeTabCart");
});

document.addEventListener("DOMContentLoaded", function () {
  // Function to add product to the class named product-form
  function addProduct(imageData, name, price, type, description) {
    console.log(imageData, name, price, type, description);
  }

  // Fetch product data from the backend and populate the table
  fetch("/menu/api")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    })
    .then((data) => {
      data.products.forEach((product) => {
        addProduct(product.image.data, product.name, product.price, product.type, product.description);
      });
    })
    .catch((error) => console.error("Error fetching product data:", error));

  // Function to convert ArrayBuffer to Base64-encoded string
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:image/png;base64,' + window.btoa(binary);
  }
});

//function to create cart tap elements and add it to cart list
//start

let productList = document.querySelector(".list-cart");
// let addedProducts = new Set();
function CreateListProduct(producttitle = "product", imageSrc, Price = "0") {
  // if (!addedProducts.has(producttitle.toLocaleLowerCase())) {
  //create elements
  let product = document.createElement("div");
  let productImage = document.createElement("img");
  let productTitle = document.createElement("h4");
  let quantityContainer = document.createElement("div");
  let decreaseBtn = document.createElement("button");
  let quantitySpan = document.createElement("span");
  let increaseBtn = document.createElement("button");
  let price = document.createElement("p");
  // let priceSpan = document.createElement("span");
  let removeIcon = document.createElement("i");

  //add class to elements
  product.className = "product";
  quantityContainer.className = "quantity";
  increaseBtn.className = "inc";
  decreaseBtn.className = "dec";
  quantitySpan.className = "quan";
  removeIcon.classList = "fa-solid fa-circle-xmark remove";

  //add content to elements
  productImage.src = imageSrc;
  productTitle.innerText = producttitle;
  increaseBtn.textContent = "+";
  decreaseBtn.textContent = "-";
  quantitySpan.textContent = "1";
  price.textContent = Price;
  // priceSpan.textContent = " $";

  //add elements to product container
  // price.appendChild(priceSpan);
  quantityContainer.append(decreaseBtn, quantitySpan, increaseBtn);
  product.append(
    productImage,
    productTitle,
    quantityContainer,
    price,
    removeIcon
  );
  productList.appendChild(product);
  // addedProducts.add(producttitle.toLocaleLowerCase());
}
// }
//end

// /* increase and descrease button */
// let incBtn = document.querySelectorAll(".inc");
// let decBtn = document.querySelectorAll(".dec");

// incBtn.forEach((element) => {
//   element.addEventListener("click", () => {
//     element.previousElementSibling.innerHTML =
//       Number(element.previousElementSibling.innerHTML) + 1;
//   });
// });
// decBtn.forEach((element) => {
//   element.addEventListener("click", () => {
//     if (element.nextElementSibling.innerHTML == 1) {
//       /* remove product  */
//       element.parentElement.parentElement.style.opacity = "0";
//       setTimeout(() => {
//         element.parentElement.parentElement.remove();
//       }, 300);
//     }
//     element.nextElementSibling.innerHTML =
//       Number(element.nextElementSibling.innerHTML) - 1;
//   });
// });

// //remove product from cart button
// let remBtn = document.querySelectorAll(".list-cart .remove");
// remBtn.forEach((element) => {
//   element.addEventListener("click", () => {
//     element.parentElement.style.opacity = "0";
//     setTimeout(() => {
//       element.parentElement.remove();
//     }, 300);
//   });
// });

//add to cart button
//note: add to cart : atc   short cut
let atcBtn = document.querySelectorAll(".page-container .menu .atc ");
atcBtn.forEach((ele) => {
  ele.addEventListener("click", () => {
    CreateListProduct(
      ele.parentElement.previousElementSibling.firstElementChild.textContent,
      ele.parentElement.previousElementSibling.previousElementSibling
        .firstElementChild.src,
      ele.previousElementSibling.textContent
    );
  });
});

//burger icon
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

/* home links list */

let link = document.querySelectorAll(".links li");
link.forEach((element) => {
  if (window.innerWidth <= 800) {
    element.addEventListener("click", function () {
      if (linkIcon.classList.contains("clicked")) {
        linkList.style.display = "none";
        linkIcon.classList.remove("clicked");
      } else {
        linkList.style.display = "block";
        linkIcon.classList.add("clicked");
      }
    });
  }
});
