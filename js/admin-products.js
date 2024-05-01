//to show the links list in medium and small screens
let listIcon = document.querySelector("#menu-icon");
let dashboard = document.querySelector(".product-container");
listIcon.addEventListener("click", () => {
  console.log("hi");
  dashboard.classList.toggle("activeList");
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
    ele.parentElement.parentElement.remove();
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
let productForm = document.querySelector(".new-product");
let content = document.querySelector(".content");
let cancelFormBtn = document.querySelector(".form-cancel-btn");

addProductBtn.addEventListener("click", () => {
  productForm.classList.toggle("active-page");
  content.classList.toggle("hide-content");
});
cancelFormBtn.addEventListener("click", () => {
  console.log("hi");
  productForm.classList.toggle("active-page");
  content.classList.toggle("hide-content");
});
