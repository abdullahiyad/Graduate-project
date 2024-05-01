let loading = document.querySelector(".loader");
window.addEventListener("load", function () {
  loading.style.display = "none";
});

//This code written by Oday
const form = document.querySelector("form");
const error = document.querySelector(".error");
const userStatus = 
//Function to get and dealing with localStorage

window.addToLocalStorage = function() {
  fetch('/login', {
    method: 'POST' // Change the method to POST
  }).then(async(response) => {
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    let data = await response.json();
    return data;
  }).then(data => {
    data.users(user =>{
      addStatus(user.status);
    });
  }).catch((err) => {
    console.log(err);
  });
}
function addStatus(userStatus) {
  window.localStorage.setItem('status', userStatus);
}
//show error message
function errorMsg() {
  error.style.display = "block";
}
module.exports(errorMsg);