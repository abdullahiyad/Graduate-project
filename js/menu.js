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
  fetch("/admin/products/api")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    })
    .then((data) => {
      data.products.forEach((product) => {
        // Assuming product.image contains ArrayBuffer image data
        let imgSrc =
          "data:image/jpeg;base64," +
          arrayBufferToBase64(product.image.data.data);
        addProduct(
          imgSrc,
          product.name,
          product.price,
          product.description,
          product.type,
          product._id
        );
      });
      console.log(data);
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
const loginIcon = document.getElementById('loginIc');
function redirect() {
  fetch("/menu/switch")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let data = await response.json();
      var users;
      data.users.forEach((user) => {
        users = user;
      });
      loginIcon.setAttribute("href", null);
      console.log(loginIcon.href);
      if (users.status === 'admin') {
        loginIcon.href = '/admin/dashboard';
        console.log(loginIcon.href);
      } else if(users.status === 'user') {
        loginIcon.href = '/user/profile';
        console.log(loginIcon.href);
      }
      console.log('Redirect link updated:', loginIcon.href);
    })
    .catch((error) => console.error("Error fetching user data:", error));
}

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
//------------------------------------------------------------------------\\ 
//                          From admin/products Page: 
//------------------------------------------------------------------------\\
// let productTable = document.querySelector(".products-table");
// function addProduct(
//   imgSrc,
//   productName,
//   productPrice,
//   productDesc,
//   productType,
//   productId
// ) {
//   const newProduct = ` 
//                     <form action="" method="none">
//                         <div class="product-id">${productId}</div>
//                         <div class="product-img part edit-class on-edit" name="product-img">
//                             <label for="product-img">product Image :</label>
//                             <img src="${imgSrc}" alt="productimage">
//                             <input type="file" id="choose-file" name="choose-file" accept="image/*">
//                             <p class="note">*chose new image if you want change the current
//                                 image*</p>
//                         </div>
//                         <div class="part s">
//                             <label>product name :</label>
//                             <input type="text" class="product-title" value="${productName}">
//                         </div>
//                         <div class="part ">
//                             <label>product price :</label>
//                             $<input type="text" class="product-price" value="${productPrice}">
//                         </div>
//                         <div class="part product-desc">
//                             <label>product description :</label>
//                             <input type="text" class="product-desc-input" value="${productDesc}">
//                         </div>
//                         <div class="type-container input-field-container part">
//                             <div class="type-show">${productType}</div>
//                                <label>type : </label>
//                                <select name="product-type" id="#type">
//                                <option value="hot-drinks" selected>hot Drinks</option>
//                                <option value="cold-drinks">cold Drinks</option>
//                                <option value="food">food</option>
//                                <option value="dessert">dessert</option>
//                           </select>
//                         </div>
//                         <div class="edit" onclick="showDetails(event)" >more</div>
//                         <div class="product-btns part">
//                             <input type="button" value="Delete" class="delete-btn" onclick="deleteProduct(event)">
//                             <input type="button" value="Edit" class="edit-btn" onclick="eidtProductBtnFunction(event)">
//                             <input type="button" value="Done" class="done-btn" onclick="doneShowDetails(event)">
//                             <input type="submit" value="Save" class="save-btn" />
//                             <input type="button" value="cancel" class="cancel-btn" onclick="cancelBtnFunction(event)">
//                         </div>
//                     </form>
//   `;
//   const tempDiv = document.createElement("div");
//   tempDiv.classList = "product-item";
//   tempDiv.innerHTML = newProduct;
//   const newProductElement = tempDiv;

//   // Append the new product element to the product table
//   productTable.appendChild(newProductElement);
// }

// document.addEventListener("DOMContentLoaded", function () {
//   // Fetch product data from the backend and populate the table
//   fetch("/menu/api")
//     .then(async (response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const data = await response.json();
//       return data;
//     })
//     .then((data) => {
//       data.products.forEach((product) => {
//         // Assuming product.image contains ArrayBuffer image data
//         let imgSrc =
//           "data:image/jpeg;base64," +
//           arrayBufferToBase64(product.image.data.data);
//         // Now imgSrc contains the Base64-encoded image data, which you can use as the src attribute of an <img> tag
//         // Example usage:
//         addProduct(
//           imgSrc,
//           product.name,
//           product.price,
//           product.description,
//           product.type,
//           product._id
//         );
//       });
//     })
//     .catch((error) => console.error("Error fetching product data:", error));

//   // Function to convert ArrayBuffer to Base64-encoded string
//   function arrayBufferToBase64(buffer) {
//     let binary = "";
//     const bytes = new Uint8Array(buffer);
//     const len = bytes.byteLength;
//     for (let i = 0; i < len; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return btoa(binary);
//   }
// });
//------------------------------------------------------------------------\\
//             Last line of copy from admin products page
//------------------------------------------------------------------------\\

// creating Cart and save it in sessionStorage or localStorage
// in first I will try using sessionStorage

function addProductToSessionStorage(name, price) {
  if (typeof(Storage) !== "undefined") {
    if (!sessionStorage.getItem('cart')) {
      sessionStorage.setItem('cart', JSON.stringify([]));
    }
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    cart.push({ name: name, price: price, quantity: 1 });
    sessionStorage.setItem('cart', JSON.stringify(cart));
    console.log('Product added to cart:', name);
  } else {
    console.error("Sorry, your browser does not support sessionStorage.");
  }
}

// Function to extract product data from HTML and add it to sessionStorage
function addToCart(button) {
  const productDiv = button.closest('.product');
  const name = productDiv.querySelector('.prodcut-title').textContent.trim();
  const price = parseFloat(productDiv.querySelector('.price p').textContent);
  addProductToSessionStorage(name, price);
}
// Attach click event listener to all "Add To Cart" buttons
document.querySelectorAll('.atc').forEach(button => {
  button.addEventListener('click', function() {
    addToCart(this);
  });
});