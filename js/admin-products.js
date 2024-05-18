//to show the links list in medium and small screens
let listIcon = document.querySelector("#menu-icon");
let dashboard = document.querySelector(".product-container");
listIcon.addEventListener("click", () => {
  dashboard.classList.toggle("activeList");
});

//function to add product
let productTable = document.querySelector(".products-table");
function addProduct(
  imgSrc,
  productName,
  productPrice,
  productDesc,
  productType,
  productId
) {
  const newProduct = ` 
                    <form action="" method="none">
                        <div class="product-id">${productId}</div>
                        <div class="product-img part edit-class on-edit" name="product-img">
                            <label for="product-img">product Image :</label>
                            <img src="${imgSrc}" alt="productimage">
                            <input type="file" id="choose-file" name="choose-file" accept="image/*">
                            <p class="note">*chose new image if you want change the current
                                image*</p>
                        </div>
                        <div class="part s">
                            <label>product name :</label>
                            <input type="text" class="product-title" value="${productName}">
                        </div>
                        <div class="part ">
                            <label>product price :</label>
                            $<input type="text" class="product-price" value="${productPrice}">
                        </div>
                        <div class="part product-desc">
                            <label>product description :</label>
                            <input type="text" class="product-desc-input" value="${productDesc}">
                        </div>
                        <div class="type-container input-field-container part">
                            <div class="type-show">${productType}</div>
                               <label>type : </label>
                               <select name="product-type" id="type">
                               <option value="hot-drinks" selected>hot Drinks</option>
                               <option value="cold-drinks">cold Drinks</option>
                               <option value="food">food</option>
                               <option value="dessert">dessert</option>
                          </select>
                        </div>
                        <div class="edit" onclick="showDetails(event)" >more</div>
                        <div class="product-btns part">
                            <input type="button" value="Delete" class="delete-btn" onclick="deleteProduct(event)">
                            <input type="button" value="Edit" class="edit-btn" onclick="eidtProductBtnFunction(event)">
                            <input type="button" value="Done" class="done-btn" onclick="doneShowDetails(event)">
                            <input type="button" value="Save" class="save-btn" onclick="updateProduct(event)"/>
                            <input type="button" value="cancel" class="cancel-btn" onclick="cancelBtnFunction(event)">
                        </div>
                    </form>
  `;
  const tempDiv = document.createElement("div");
  tempDiv.classList = "product-item";
  tempDiv.innerHTML = newProduct;
  const newProductElement = tempDiv;

  // Append the new product element to the product table
  productTable.appendChild(newProductElement);
}
//adding proudct from data base to page
document.addEventListener("DOMContentLoaded", function () {
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
        // Now imgSrc contains the Base64-encoded image data, which you can use as the src attribute of an <img> tag
        // Example usage:
        addProduct(
          imgSrc,
          product.name,
          product.price,
          product.description,
          product.type,
          product._id
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
    return btoa(binary);
  }
});

let addProductBtn = document.querySelector(".new-product-btn");
let productFormDiv = document.querySelector(".new-product");
let productForm = document.querySelector(".product-form");
let content = document.querySelector(".content");

//delete product
function deleteProduct(event) {
  const clickedElement = event.target;
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "the product has been deleted.",
        icon: "success",
      });
      //Start delete event
      const productId =
        clickedElement.parentElement.parentElement.firstElementChild.innerHTML;
      fetch("/admin/products", {
        method: "DELETE", // Specify the HTTP method as DELETE
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify({ id: productId }), // Send the product ID to delete
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("There is something error");
          }
          // Check if the response body contains the success message
          return response.text();
        })
        .then((data) => {
          console.log("Product deletion successful:", data);
          // Handle the success response here
          // For example, remove the deleted product from the DOM
          clickedElement.parentElement.parentElement.parentElement.remove();
        })
        .catch((err) => {
          console.error("Product deletion failed:", err);
          // Handle the error here
        });
      //finish delete event
    }
  });
}

//edit product btn
function eidtProductBtnFunction(event) {
  const ele = event.target;
  ele.parentElement.parentElement.classList.toggle("on-edit");
  ele.style.display = "none";
  ele.nextElementSibling.style.display = "none";
  ele.nextElementSibling.nextElementSibling.style.display = "block";
  ele.nextElementSibling.nextElementSibling.nextElementSibling.style.display =
    "block";
  ele.parentElement.parentElement.firstElementChild.nextElementSibling.lastElementChild.style.display =
    "block";
}

//cancel edit on product
function cancelBtnFunction(event) {
  window.location.reload();
}

//active and disable add product page
function activeAddProductPage() {
  productFormDiv.classList.toggle("active-page");
  content.classList.toggle("hide-content");
}

//close more details of product
function doneShowDetails(event) {
  const clickedElement = event.target;
  clickedElement.parentElement.parentElement.classList.toggle("more-details");
}

//show more details of product
function showDetails(event) {
  const clickedElement = event.target;
  clickedElement.parentElement.classList.toggle("more-details");
  const type =
    clickedElement.previousElementSibling.firstElementChild.textContent.toLowerCase();
  clickedElement.previousElementSibling.lastElementChild.value = type;
}

window.logout = function () {
  fetch("/admin/dashboard/logout", {
    method: "POST", // Change the method to POST
  })
    .then((result) => {
      console.log("logout success");
      window.location.href = "/home";
    })
    .catch((err) => {
      console.log(err);
    });
};

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.querySelector(".logout");
  logoutButton.addEventListener("click", logout);
});

//function to update btn
function updateProduct(event) {
  const clickedElement = event.target;
  const product = clickedElement.parentElement.parentElement;
  const id = product.querySelector(".product-id").textContent;
  const img = product.querySelector("#choose-file").value;
  const name = product.querySelector(".product-title").value;
  const price = product.querySelector(".product-price").value;
  const description = product.querySelector(".product-desc-input").value;
  const type = product.querySelector("#type").value;
  console.log(id, img, name, price, description, type);

  //function to send this data to databasea
  //here
}
