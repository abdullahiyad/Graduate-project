const express = require('express');
const jwt = require('jsonwebtoken');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const user = require("../nodejs/Database/models/users");
const Product = require('../nodejs/Database/models/products');
const cookie = require("cookie-parser");
let errors = { name: "", phone: "", email: "", password: "" };
const bcrypt = require("bcrypt");
const product = require('../nodejs/Database/models/products');
const maxAge = 2 * 24 * 60 * 60;
const secretKey = 'OdayIsNerd';
let userState;
const handleErrors = (err) => {
  console.log('I am in the HandleError api');
  if (err.code === 11000) {
    errors.email = "AIU";
    errors.phone = "AIU";
    return errors;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const createToken = (id) => {
  return jwt.sign({id}, secretKey, {expiresIn: maxAge});
}
module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = async (req, res) => {
  console.log('I am in the Signup api');
  const { name, phone, email, password } = req.body;
  try {
    const users = await user.create({ name, phone, email, password });
    const token =  createToken(users._id);
    res.status(201).cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }).redirect("/home");
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).send(errors);
  }
};
module.exports.login_post = async (req, res) => {
  console.log('I am in the login api');
  try {
    const check = await user.findOne({email: req.body.email});
    userState = check.status;
    localStorage.setItem("status", userState);
    if(!check){
      console.log("Can't find user");
    }else{
      const isPassMatch = await bcrypt.compare(req.body.password,check.password);
      if(isPassMatch && userState === 'admin'){
        const token =  createToken();
        res.status(201).cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }).redirect("/admin/dashboard");
      } else {
        res.send('Password or Email error');
      }
    }
  } catch (err){
    console.log(err);
  }
};
module.exports.home_get = (req, res) => {
  res.render("home");
};
module.exports.home_post = (req, res) => {
  res.send("This is home page");
};
module.exports.menu_get = (req, res) => {
  res.render("menu");
};
module.exports.menu_data_get = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({products});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
};
module.exports.menu_post = async (req, res) => {
  console.log('This is the post method');
};
module.exports.dashboard_get = (req, res) => {
  res.render("admin/dashboard");
};
module.exports.dashboard_post = (req, res) => {
  res.send("This is dashboard page");
};
module.exports.customer_get = async (req, res) => {
  res.render('admin/customer');
};
module.exports.customer_data_get = async (req, res) => {
  try {
    const users = await user.find();
    res.json({users});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//this code takes all users needed
module.exports.customer_post = (req, res) => {
  res.send("This is customers page");
};
module.exports.customer_put = (req, res) => {
  res.send("This for update users");
}
module.exports.customer_delete = (req, res) => {
  res.send("This for update users");
}
const fs = require('fs');

module.exports.products_post = async (req, res) => {
  console.log('I am in the product API');
  const name = req.body['product-name'];
  const price = req.body['product-price'];
  const type = req.body['product-type'];
  const description = req.body['product-desc'];
  //console.log(base64Image);
  const image = {
    data: req.file.buffer,
    contentType: req.file.mimetype
  }
  try {
    const givenScore = (parseInt(price, 10))/10;
    let prod = new Product({name: name, price: price, type: type, image: image, givenScore: givenScore, description: description});  
  await prod.save();
  res.redirect('products');
  } catch (err) {
    console.log(err);
    res.send(err);
  }
}

module.exports.products_get = async (req, res) => {
  res.render('admin/products');
}

//this function to get data from database for products
module.exports.products_data_get = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
}

module.exports.logout_Del_Cookie = async (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/home');
}

