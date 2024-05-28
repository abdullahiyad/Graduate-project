const express = require("express");
const jwt = require("jsonwebtoken");
const user = require("../nodejs/Database/models/users");
const Product = require("../nodejs/Database/models/products");
const reservation = require('../nodejs/Database/models/reservation');
const Order = require('../nodejs/Database/models/orders')
const moment = require('moment-timezone');
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
      res.status(404).sent("Can't find user");
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
          .redirect("/user/profile");
      }
    }
  } catch (err) {
    res.status(500).send(err);
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

module.exports.switch_page = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return null;
    }
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.id;
    const users = await user.find({ _id: userId });
    console.log(users);
    res.json({ users });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
}


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
    res.render("user/dashboard");
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

// Assuming you have already imported the required modules and defined the product schema

module.exports.edit_product = async (req, res) => {
  try {
    const productId = req.body.id;
    const name = req.body["product-name"];
    const price = req.body["product-price"];
    const type = req.body["product-type"];
    const description = req.body["product-desc"];
    
    let image;
    if (req.file) {
      image = {
        data: fs.readFileSync(
          path.join(process.cwd() + "/images/" + req.file.originalname)
        ),
        contentType: req.file.mimetype,
      };
    }
    
    // Create an object with the fields to be updated
    const updates = {};
    if (image) updates.image = image;
    if (name) updates.name = name;
    if (price) updates.price = price;
    if (description) updates.description = description;
    if (type) updates.type = type;
    
    // Update the product using findOneAndUpdate
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: updates },
      { new: true } // To return the updated document
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
    res.render("user/profile");
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

async function getProduct(req) {
  try {
    const productId = req.params.productId || req.body.productId;
    if (!productId) {
      return null;
    }
    const product = await Product.findById(productId);
    if (!product) {
      return null;
    }
    return product;
  } catch (err) {
    console.error("Error fetching product data:", err);
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

async function checkPass(userId, oldPassword) {
  const userDoc = await user.findById(userId);
  if (!userDoc) {
    return false;
  }
  const isMatch = await bcrypt.compare(oldPassword, userDoc.password);
  return isMatch;
}

module.exports.update_profile_data = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return null;
    }
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.id;
    const oldPassword = req.body.oldPassword;
    const isPasswordCorrect = await checkPass(userId, oldPassword);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }
    
    const newPassword = req.body.newPassword.trim();
    if (newPassword !== '') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const updatedUser = await user.findOneAndUpdate(
        { _id: userId },
        { $set: { name: req.body.name, email: req.body.email, phone: req.body.phone, password: hashedPassword } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(updatedUser);
    } else {
      const updatedUser = await user.findOneAndUpdate(
        { _id: userId },
        { $set: { name: req.body.name, email: req.body.email, phone: req.body.phone } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(updatedUser);
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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

module.exports.messages_get = (req, res) => {
  res.render('admin/messages');
}

module.exports.user_profile_get = (req, res) => {
  res.render('user/profile');
}

module.exports.user_reservation_get = (req, res) => {
  res.render('user/reservation');
}

module.exports.reservation_get = (req, res) => {
  res.render('reservation');
}

module.exports.reservation_post =  async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.id;
    const userData = await user.findById(userId);
    const { name, phone, numOfPersons, insDate, details } = req.body;

    if (!name || !phone || !numOfPersons || !insDate) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const reservationDate = moment.tz(insDate, "UTC").tz("Etc/GMT-3").toDate();
    const newReservation = new reservation({
      customer: {
        userName: userData.name,
        userEmail: userData.email
      },
      resName: name,
      phone: phone,
      numPerson: numOfPersons,
      newDate: reservationDate,
      details: details || "No details",
    });
    await newReservation.save();
    res.status(201).json({ message: "Reservation created successfully" });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.user_profile_get_api = async (req, res) => {
  try {
    const userId = getUserData(req);
    const userData = await user.findById(userId);
    res.json(userData);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports.checkOut = (req, res) => {
  res.render('check-out');
};

module.exports.checkOut_post = async (req, res) => {
  try {
    const user = await getUserData(req);
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const cart = req.body.cart;
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Process cart items and calculate total price
    let totalPrice = 0;
    const products = await Promise.all(cart.map(async item => {
      const product = await Product.findById(item.productId).exec();
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      totalPrice += product.price * item.quantity;
      return {
        name: product.name,
        price: product.price,
        quantity: item.quantity
      };
    }));

    const orderData = {
      customer: {
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        userScore: user.score,
      },
      products: products,
      totalPrice: totalPrice,
      status: 'pending',
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error("Error processing order:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.messages_data_get = async (req, res) => {
  try {
    const reservations = await reservation.find({state: "pending"});
    console.log(reservations);
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.message_acc_rej = async (req, res) => {
  try {
    const { id, state } = req.body;

    // Validate the state
    if (state !== 'acc' && state !== 'rej') {
      return res.status(400).json({ error: "Invalid state value" });
    }

    // Update the reservation state based on the provided state
    const updatedReservation = await reservation.findByIdAndUpdate(
      id,
      { state: state === 'acc' ? 'accepted' : 'rejected' },
      { new: true } // Return the updated document
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Reservation updated successfully", reservation: updatedReservation });

  } catch (err) {
    console.error("Error updating reservation state:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};