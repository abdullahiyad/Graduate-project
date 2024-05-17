let cartIcon = document.querySelector(".cart-icon");
let cartCloseBtn = document.querySelector(".cart-tap .close");
let body = document.querySelector("body");
const elem = document.querySelector("product-img123");
cartIcon.addEventListener("click", () => {
  body.classList.toggle("activeTabCart");
});
cartCloseBtn.addEventListener("click", () => {
  body.classList.toggle("activeTabCart");
});

//function to add product to cart when click addtocart
let cartList = document.querySelector(".list-cart");
function addToCart(event) {
  const clickedElement = event.target;
  const productContainter = clickedElement.parentElement.parentElement;
  const productId = productContainter.querySelector(".product-id").textContent;
  const productName =
    productContainter.querySelector(".product-title").textContent;
  const productPrice = productContainter.querySelector(".price-x").textContent;
  const newProduct = document.createElement("div");
  newProduct.innerHTML = `
  <div class="product">
    <h4>${productName}</h4>
    <div class="quantity">
      <button class="dec">-</button>
      <span class="quan">${1}</span>
      <button class="inc">+</button>
    </div>
      <p><span>${productPrice}</span>$</p>
      <i class="fa-solid fa-circle-xmark remove"></i>
  </div>
`;
  cartList.appendChild(newProduct.firstElementChild);
}

//function to add proudct from database to menu page
let hotDrinksContainer = document.querySelector(".hot-drinks .products");
let coldDrinksContainer = document.querySelector(".cold-drinks .products");
let foodContainer = document.querySelector(".food .products");
let dessertContainer = document.querySelector(".dessert .products");
function addProduct(
  productId,
  productImg,
  productName,
  productPrice,
  productDescription,
  productType
) {
  const newProduct = document.createElement("div");
  newProduct.innerHTML = `
  <div class="product">
       <div class="product-id">${productId}</div>
       <div class="product-img"><img src="${productImg}" alt="">
       </div>
       <div class="product-info">
           <p class="product-title">${productName}</p>
           <p class="product-description">${productDescription}.</p>
       </div>
       <div class="price">
           <p><span class="price-x">${productPrice}</span> $</p>
           <button class="atc" onclick="addToCart(event)">Add To Cart</button>
       </div>
   </div>
  `;
  if (productType == "hot-drinks") {
    hotDrinksContainer.appendChild(newProduct.firstElementChild);
  } else if (productType == "cold-drinks") {
    coldDrinksContainer.appendChild(newProduct.firstElementChild);
  } else if (productType == "food") {
    foodContainer.appendChild(newProduct.firstElementChild);
  } else {
    dessertContainer.appendChild(newProduct.firstElementChild);
  }
}

document.addEventListener("DOMContentLoaded", function () {
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
        let base64Image = arrayBufferToBase64(product.image.data.data);
        let imgSrc = base64Image;
        // Assuming product.image contains ArrayBuffer image data
        addProduct(
          product._id,
          imgSrc,
          product.name,
          product.price,
          product.description,
          product.type
        );
      });
    })
    .catch((error) => console.error("Error fetching product data:", error));

  // Function to convert ArrayBuffer to Base64-encoded string
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return "data:image/jpeg;base64," + window.btoa(binary);
  }
});

//function to create cart tap elements and add it to cart list
//start

let productList = document.querySelector(".list-cart");
let addedProducts = new Set();
// function CreateListProduct(
//   producttitle = "product",
//   imageSrc = "/images/coffee.png",
//   Price = "0"
// )
//{
// if (!addedProducts.has(producttitle.toLocaleLowerCase())) {
//create elements
//   let product = document.createElement("div");
//   let productImage = document.createElement("img");
//   let productTitle = document.createElement("h4");
//   let quantityContainer = document.createElement("div");
//   let decreaseBtn = document.createElement("button");
//   let quantitySpan = document.createElement("span");
//   let increaseBtn = document.createElement("button");
//   let price = document.createElement("p");
//   // let priceSpan = document.createElement("span");
//   let removeIcon = document.createElement("i");

//   //add class to elements
//   product.className = "product";
//   quantityContainer.className = "quantity";
//   increaseBtn.className = "inc";
//   decreaseBtn.className = "dec";
//   quantitySpan.className = "quan";
//   removeIcon.classList = "fa-solid fa-circle-xmark remove";

//   //add content to elements
//   productImage.src = imageSrc;
//   productTitle.innerText = producttitle;
//   increaseBtn.textContent = "+";
//   decreaseBtn.textContent = "-";
//   quantitySpan.textContent = "1";
//   price.textContent = Price;
//   // priceSpan.textContent = " $";

//   //add elements to product container
//   quantityContainer.append(decreaseBtn, quantitySpan, increaseBtn);
//   product.append(
//     productImage,
//     productTitle,
//     quantityContainer,
//     price,
//     removeIcon
//   );
//   productList.appendChild(product);
//   // addedProducts.add(producttitle.toLocaleLowerCase());
// }

// add to cart button
// note: add to cart : atc   short cut
// let atcBtn = document.querySelectorAll(".page-container .menu .atc ");
// atcBtn.forEach((ele) => {
//   ele.addEventListener("click", () => {
//     CreateListProduct(
//       ele.parentElement.previousElementSibling.firstElementChild.textContent,
//       ele.parentElement.previousElementSibling.previousElementSibling
//         .firstElementChild.src,
//       ele.previousElementSibling.textContent
//     );
//   });
// });

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
