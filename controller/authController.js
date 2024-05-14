const express = require("express");
const jwt = require("jsonwebtoken");
const user = require("../nodejs/Database/models/users");
const Product = require("../nodejs/Database/models/products");
const multer = require("multer");
const cookie = require("cookie-parser");
const fs = require("fs");
const path = require("path");
let errors = { name: "", phone: "", email: "", password: "" };
const bcrypt = require("bcrypt");
const maxAge = 2 * 24 * 60 * 60;
const secretKey = "OdayIsNerd";
var userState;
const handleErrors = (err) => {
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
  return jwt.sign({ id }, secretKey, { expiresIn: maxAge });
};
module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const users = await user.create({ name, phone, email, password });
    const token = createToken(users._id);
    res
      .status(201)
      .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
      .redirect("/home");
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).send(errors);
  }
};
module.exports.login_post = async (req, res) => {
  try {
    const check = await user.findOne({ email: req.body.email });
    if (!check) {
      console.log("cant find user");
    } else {
      userState = check.status;
      const isPassMatch = await bcrypt.compare(
        req.body.password,
        check.password
      );
      if (isPassMatch && userState === "admin") {
        const token = createToken(check._id);
        res
          .status(201)
          .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
          .redirect("/admin/dashboard");
      } else if (isPassMatch && userState === "user") {
        const token = createToken(check._id);
        res
          .status(201)
          .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
          .redirect("/home");
      }
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.home_get = (req, res) => {
  res.render("home");
};
module.exports.home_get_data = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return null;
    }
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.id;
    const users = await user.find({ _id: userId });
    res.json({ users });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
};
module.exports.menu_get = (req, res) => {
  res.render("menu");
};
module.exports.menu_data_get = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
};
module.exports.menu_post = async (req, res) => {
  console.log("This is the post method");
};

module.exports.dashboard_get = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.send("You don't have access to this page");
  }
  const decodedToken = jwt.verify(token, secretKey);
  const userId = decodedToken.id;
  const User = await user.findOne({_id: userId});
  if( User.status === 'user'){
    res.render("home");
  } else {
    res.render("admin/dashboard");
  }
};

module.exports.dashboard_post = (req, res) => {
  res.send("This is dashboard page");
};

module.exports.customer_get = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.send("You don't have access to this page");
  }
  const decodedToken = jwt.verify(token, secretKey);
  const userId = decodedToken.id;
  const User = await user.findOne({_id: userId});
  if( User.status === 'user'){
    res.render("home");
  } else {
    res.render("admin/customer");
  }
};
module.exports.customer_data_get = async (req, res) => {
  try {
    const users = await user.find();
    res.json({ users });
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
};

module.exports.products_post = async (req, res) => {
  const name = req.body["product-name"];
  const price = req.body["product-price"];
  const type = req.body["product-type"];
  const description = req.body["product-desc"];
  const image = {
    // '../Graduate-project/images/coffee.png'
    data: fs.readFileSync(
      path.join(process.cwd() + "/images/" + req.file.originalname)
    ),
    contentType: req.file.mimetype,
  };
  try {
    const givenScore = parseInt(price, 10) / 10;
    let prod = new Product({
      name: name,
      price: price,
      type: type,
      image: image,
      givenScore: givenScore,
      description: description,
    });
    await prod.save();
    res.redirect("products");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports.products_get = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.send("You don't have access to this page");
  }
  const decodedToken = jwt.verify(token, secretKey);
  const userId = decodedToken.id;
  const User = await user.findOne({_id: userId});
  if( User.status === 'user'){
    res.render("home");
  } else {
    res.render("admin/products");
  }
};

//this function to get data from database for products
module.exports.products_data_get = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
};

module.exports.admin_profile_get = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.send("You don't have access to this page");
  }
  const decodedToken = jwt.verify(token, secretKey);
  const userId = decodedToken.id;
  const User = await user.findOne({_id: userId});
  if( User.status === 'user'){
    res.render("home");
  } else {
    res.render("admin/profile");
  }
};

function getUserData(req) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return null;
    }
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.id;
    return userId;
  } catch (err) {
    console.error("Error decoding JWT:", err);
    return null;
  }
}

module.exports.admin_profile_get_api = async (req, res) => {
  try {
    const userId = getUserData(req);
    const userData = await user.findById(userId);
    res.json(userData);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.admin_profile_post = async (req, res) => {
  console.log("This is post method");
};
module.exports.logout_Del_Cookie = async (req, res) => {
  res.clearCookie("jwt").send("Logout Successfully");
};

module.exports.delete_product_id = async (req, res) => {
  try {
    const Id = req.body.id;
    const result = await Product.findByIdAndDelete(Id);
    if (!result) {
      return res.status(404).send("Product not found");
    }
    res.send("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.delete_user_email = async (req, res) => {
  try {
    const userEmail = req.body.email;
    console.log(userEmail);
    const result = await user.findOneAndDelete({ email: userEmail });
    if (!result) {
      return res.status(404).send("user not found");
    }
    res.send("user deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.update_data = async (req, res) => {
  console.log("inside update method");
  try {
    const email = req.body.email;
    console.log(email);
    user
      .findOne({ email: email })
      .then((usr) => {
        console.log("inside find");
        user
          .update(usr._id, req.body)
          .then((users) => {
            res.json(users);
          })
          .catch((err) => {
            res.send(err);
          });
      })
      .catch((err) => {
        console.log("Can't find user");
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports.update_user_data = async (req, res) => {
  try {
    const email = req.body.email;
    const updatedUser = await user.findOneAndUpdate(
      { email: email },
      { $set: { name: req.body.name, status: req.body.status } },
      { new: true }
    );
    console.log(updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.update_profile_data = async (req, res) => {
  try {
    const userId = getUserData();
    console.log(userId);
    const updatedUser = await user.findOneAndUpdate(
      { _id: userId },
      { $set: { name: req.body.name, phone: req.body.phone } },
      { new: true }
    );
    console.log(updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.delete_loggedIn_user = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const result = await user.findOneAndDelete({ email: userEmail });
    if (!result) {
      return res.status(404).send("User not found");
    }
    res.clearCookie("jwt").send("Deleted Successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
};