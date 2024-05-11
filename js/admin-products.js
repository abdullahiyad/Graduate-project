//to show the links list in medium and small screens
let listIcon = document.querySelector("#menu-icon");
let dashboard = document.querySelector(".product-container");
listIcon.addEventListener("click", () => {
  console.log("hi");
  dashboard.classList.toggle("activeList");
});

document.addEventListener("DOMContentLoaded", function () {
  // Function to convert ArrayBuffer to Base64-encoded string
  // Function to add product to the DOM
  function addProduct(image, name, price, type, description) {
    const base64String = arrayBufferToBase64(image.data.data);
    const imgElement = document.createElement("img");
    imgElement.src = `data:image/png;base64,${base64String}`;
    // You can also add other product details here if needed
    console.log(imgElement);
    console.log(name, price, type, description);
  }

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
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
        addProduct(
          product.image,
          product.name,
          product.price,
          product.type,
          product.description
        );
      });
    })
    .catch((error) => console.error("Error fetching product data:", error));
});

let moreDetialsBtn = document.querySelectorAll(".edit");
let closeDetialsBtn = document.querySelectorAll(".done-btn");
let deleteDetialsBtn = document.querySelectorAll(".delete-btn");
let editProductBtn = document.querySelectorAll(".edit-btn");
let cancelEditProductBtn = document.querySelectorAll(".cancel-btn");
// let inputFields = document.querySelectorAll(".edit-class input");
moreDetialsBtn.forEach((ele) => {
  ele.addEventListener("click", () => {
    ele.parentElement.classList.toggle("more-details");
  });
});
closeDetialsBtn.forEach((ele) => {
  ele.addEventListener("click", () => {
    ele.parentElement.parentElement.classList.toggle("more-details");
  });
});
deleteDetialsBtn.forEach((ele) => {
  ele.addEventListener("click", () => {
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
        ele.parentElement.parentElement.remove();
      }
    });
  });
});
cancelEditProductBtn.forEach((ele) => {
  ele.addEventListener("click", () => {
    window.location.reload();
  });
});
editProductBtn.forEach((ele) => {
  ele.addEventListener("click", () => {
    ele.parentElement.parentElement.classList.toggle("on-edit");
    ele.style.display = "none";
    ele.nextElementSibling.style.display = "none";
    ele.nextElementSibling.nextElementSibling.style.display = "block";
    ele.nextElementSibling.nextElementSibling.nextElementSibling.style.display =
      "block";
    ele.parentElement.parentElement.firstElementChild.nextElementSibling.lastElementChild.style.display =
      "block";
  });
});

let addProductBtn = document.querySelector(".new-product-btn");
let productFormDiv = document.querySelector(".new-product");
let productForm = document.querySelector(".product-form");
let content = document.querySelector(".content");
let cancelFormBtn = document.querySelector(".form-cancel-btn");

addProductBtn.addEventListener("click", () => {
  productFormDiv.classList.toggle("active-page");
  content.classList.toggle("hide-content");
});
cancelFormBtn.addEventListener("click", () => {
  console.log("hi");
  productFormDiv.classList.toggle("active-page");
  content.classList.toggle("hide-content");
});
