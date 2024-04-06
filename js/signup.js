let loading = document.querySelector(".loader");
window.addEventListener("load", function () {
  loading.style.display = "none";
});

const form = document.querySelector('signup-form');

form.addEventListener('signup-btn', async (e) => {
  e.preventDefault();
  const name = form.name.value;
  const phone = form.phone.value;
  const email = form.email.value;
  const password = form.password.value;

  try {
    await fetch('/signup',{
      method: 'POST',
      body: JSON.stringify({ name: name,phone: phone, email: email, password: password }),
      headers: { 'Content-Type': 'application/json'}
    });
    console.log('This is name:',name,phone,email,password);
  } catch (err) { 
    console.log(err);
  }
})
