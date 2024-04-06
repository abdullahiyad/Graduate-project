let cartIcon = document.querySelector(".cart-icon");
let cartCloseBtn = document.querySelector(".cart-tap .close");
let body = document.querySelector("body");

cartIcon.addEventListener("click", () => {
  body.classList.toggle("activeTabCart");
});
cartCloseBtn.addEventListener("click", () => {
  body.classList.toggle("activeTabCart");
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
