const express = require("express");
const jwt = require("jsonwebtoken");
const webPush = require("web-push");
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
const { render } = require("ejs");
const orders = require("../nodejs/Database/models/orders");
const maxAge = 2 * 24 * 60 * 60;
const secretKey = "OdayIsNerd";
// Notifications variable: vapid key
const publicVapidKey = 'BIfnXiQ8o1KKEM75QjeKg9Q16hA956r7RolBrUmbHnBcuBrk3Giyvk3sb2feXYiE9Vkk-ObPF9Nmf4DhG8J_Hfo';
const privateVapidKey = 'ZmtVuSTm9tMvIHMr0jkFvj5_crXS2gh7ci6blnBIiCo';

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
      res.status(500).json({ error: "the email or password is not correct. please try again"});
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
          .json({state: "admin"});
      } else if (isPassMatch && userState === "user") {
        const token = createToken(check._id);
        res
          .status(201)
          .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
          .json({state: "user"})
      } else {
        res.status(500).json({ error: "the email or password is not correct. please try again"});
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
module.exports.home_get = (req, res) => {
  res.render("home");
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
    const userId = getUserData(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userData = await user.findById(userId);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const products = await Product.find();
    res.json({ user: userData, products });
  } catch (error) {
    console.error("Error fetching products and user data:", error);
    res.status(500).json({ error: "Error fetching products and user data" });
  }
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

module.exports.dashboard_get_data = async (req, res) => {
  try {
    // Step 1: Find all accepted reservations
    const reservations = await reservation.find({ state: 'accepted' });
    
    // Step 2: Prepare an array to store formatted reservation data
    let reservationsForm = [];
    
    // Step 3: Loop through each reservation to fetch user data and format the output
    for (const reserve of reservations) {
      // Fetch user data using userId
      const userData = await user.findById(reserve.userId);
      // Format the reservation data with userName and userEmail
      const formattedReservation = {
        _id: reserve._id,
        userName: userData.name,
        userEmail: userData.email,
        resName: reserve.resName,
        resPhone: reserve.phone,
        newDate: reserve.newDate,
        numOfPersons: reserve.numPerson,
        details: reserve.details,
      };
      reservationsForm.push(formattedReservation);
    };
    // Step 2: Find users created in the last 24 hours
    const H24 = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUsers = await user.find({ createdAt: { $gte: H24 } });
    // Step 3: Find orders created in the last 24 hours
    const recentOrders = await Order.find({ createdAt: { $gte: H24 } });
    // Step 4: Calculate the total sales for all orders
    const totalSales = await Order.aggregate([
      {
        $match: { createdAt: { $gte: H24 } } // Filter to consider only recent orders
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalPrice' } // Summing totalPrice field for all matching orders
        }
      }
    ]);
    // Format totalSales to a number (0 if no orders found)
    const totalSalesAmount = totalSales.length > 0 ? totalSales[0].totalAmount : 0;

    const jData = {
      reserve: reservationsForm,
      recentUsers: recentUsers.length,
      recentOrders: recentOrders.length,
      totalSales: totalSalesAmount
    }
    // Step 5: Send the data in the response
    res.json(jData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
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
  console.log("Test1");
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return null;
    }
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.id;
    console.log(userId);
    const newPassword = req.body.newPassword.trim();
    if (newPassword !== '') {
      const oldPassword = req.body.oldPassword;
      const isPasswordCorrect = await checkPass(userId, oldPassword);
      if (!isPasswordCorrect) {
        console.log("Incorrect Password");
        return res.status(400).json({ error: "Old password is incorrect" });
      }
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
      console.log("Else condition");
      const updatedUser = await user.findOneAndUpdate(
        { _id: userId },
        { $set: { name: req.body.name, email: req.body.email, phone: req.body.phone } },
        { new: true }
      );
      console.log(updatedUser);
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

module.exports.reservation_post = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.id;
    const userData = await user.findById(userId);
    console.log(userData);
    const { name, phone, numOfPersons, insDate, details } = req.body;
    if (!name || !phone || !numOfPersons || !insDate) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const alreadyReserved = await reservation.findOne({userId: userId});
    console.log(alreadyReserved);
    if(alreadyReserved){
      return res.status(400).json({ error: "you already reserved" });
    }
    const reservationDate = moment.tz(insDate, "UTC").tz("Etc/GMT-3").toDate();
    const newReservation = new reservation({
      userId: userId,
      resName: name,
      phone: phone,
      numPerson: numOfPersons,
      newDate: reservationDate,
      details: details || "No details",
    });
    console.log("New Reservation: ", newReservation);
    await newReservation.save();
    res.status(201).json({ message: "Reservation created successfully" });
  } catch (error) {
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
    const userId = getUserData(req);
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    console.log(userId);
    const { customer, cart } = req.body;
    console.log("Customer: ", customer, "\n cart: ", cart);
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (!customer || !customer.name || !customer.phone || !customer.City || !customer.address1) {
      return res.status(400).json({ error: "Customer information is incomplete" });
    }

    // Check for recent orders within the last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentOrder = await Order.findOne({ userId: userId, createdAt: { $gte: tenMinutesAgo } }).exec();
    if (recentOrder) {
      return res.status(429).json({ error: "You can only place an order every 10 minutes" });
    }

    // Process cart items and calculate total price
    let totalPrice = 0;
    const products = await Promise.all(cart.map(async item => {
      const product = await Product.findById(item.id).exec();
      if (!product) {
        throw new Error(`Product with ID ${item.id} not found`);
      }
      totalPrice += product.price * item.quan;
      return {
        productId: item.id,
        quantity: item.quan,
      };
    }));

    const orderData = {
      userId: userId,
      customer: {
        name: customer.name,
        phone: customer.phone,
        City: customer.City,
        address1: customer.address1,
        address2: customer.address2 || "", // Optional field
      },
      products: products,
      totalPrice: totalPrice,
    };
    
    const newOrder = new Order(orderData);
    await newOrder.save();

    // Increment the user's orderNumbers field
    await user.findByIdAndUpdate(
      userId,
      { $inc: { orderNumbers: 1 } },
      { new: true }
    );

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error("Error processing order:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports.messages_data_get = async (req, res) => {
  try {
    const reservations = await reservation.find({ state: "pending" });
    const usersData = [];
    
    reservations.forEach((data) => {
      usersData.push(user.findById(data.userId));
    });

    const userDataList = await Promise.all(usersData);
    const Reservations = [];

    reservations.forEach((data, index) => {
      const users = userDataList[index];
      if (users) {
        Reservations.push({
          userName: users.name,
          userEmail: users.email,
          reservationId: data._id,
          resName: data.resName,
          phone: data.phone,
          reserveDate: data.newDate,
          numPerson: data.numPerson,
          details: data.details
        });
      }
      // console.log("this id test: ",data._id);
    });
    res.status(200).json(Reservations);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports.message_acc_rej_com = async (req, res) => {
  try {
    const { id, state } = req.body;
    console.log("this id: ", id);
    
    // Validate the state
    if (!['accepted', 'rejected', 'completed'].includes(state)) {
      return res.status(400).json({ error: "Invalid state value" });
    }

    // Update the reservation state based on the provided state
    const updatedReservation = await reservation.findByIdAndUpdate(
      id,
      { state: state },
      { new: true } // Return the updated document
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // If the reservation is completed, increment the user's reservationNumbers
    if (state === 'completed') {
      const userId = updatedReservation.userId; // Assuming the reservation document contains a userId field
      await user.findByIdAndUpdate(
        userId,
        { $inc: { reservationNumbers: 1 } },
        { new: true }
      );
    }

    // Send a success response
    res.status(200).json({ message: "Reservation updated successfully", reservation: updatedReservation });

  } catch (err) {
    console.error("Error updating reservation state:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports.getOrders = (req, res) => {
  res.render('admin/orders');
};

module.exports.get_orders_data = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find();

    // Process each order to get user and product information
    const ordersData = await Promise.all(orders.map(async order => {
      // Fetch user information
      const User = await user.findById(order.userId).exec();
      if (!User) {
        throw new Error(`User with ID ${order.userId} not found`);
      }

      // Fetch product information
      const products = await Promise.all(order.products.map(async productItem => {
        const product = await Product.findById(productItem.productId).exec();
        if (!product) {
          throw new Error(`Product with ID ${productItem.productId} not found`);
        }
        return {
          productId: product._id,
          productName: product.name,
          quantity: productItem.quantity
        };
      }));
      // Construct order data with user and product information
      return {
        orderId: order._id,
        userName: User.name,
        userEmail: User.email,
        userScore: User.score,
        customer: order.customer,
        products: products,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt
      };
    }));
    // Send the combined data back to the client
    res.status(200).json({ orders: ordersData });
  } catch (err) {
    console.error("Error fetching orders data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


webPush.setVapidDetails('mailto:ooday2424@gmail.com', publicVapidKey, privateVapidKey);

module.exports.subscription_post = (req, res) => {
    const subscription = req.body;
    res.status(201).json({});

    // Create payload
    const payload = JSON.stringify({ 
        title: 'Push Test',
        body: 'This is a test push notification',
        icon: 'http://image.ibb.co/frYOFD/tmlogo.png' 
    });

    webPush.sendNotification(subscription, payload).catch(err => console.error(err));
};

module.exports.user_dashboard_get = (req, res) => {
    res.render("user/dashboard");
}

module.exports.get_user_orders = (req, res) => {
  res.render('user/orders');
};

module.exports.get_user_messages = async (req, res) => {
  try {
    // Get the userId from the request
    const userId = getUserData(req);

    // Fetch the user data
    const userData = await user.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Search for reservations by userId
    const userReservations = await reservation.find({ userId: userId });

    // Check if reservations exist for the user
    if (userReservations.length === 0) {
      return res.status(404).json({ message: "No reservations found for this user" });
    }

    // Format the reservations data with user details
    const reservationsForm = userReservations.map(data => ({
      userName: userData.name,
      userEmail: userData.email,
      reservationId: data._id,
      resName: data.resName,
      phone: data.phone,
      reserveDate: data.newDate,
      numPerson: data.numPerson,
      details: data.details,
      state: data.state
    }));
    // Send the formatted reservations in the response
    res.status(200).json(reservationsForm);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.get_orders_user_data = async (req, res) => {
  try {
    // Get the userId from the request
    const userId = getUserData(req);
    
    // Fetch the user data
    const userData = await user.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Fetch the orders for the user
    const userOrders = await Order.find({ userId: userId });
    if (userOrders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    // Fetch product details for each order
    const ordersData = await Promise.all(userOrders.map(async (order) => {
      const products = await Promise.all(order.products.map(async (product) => {
        const productData = await Product.findById(product.productId);
        return {
          productName: productData.name,
          quantity: product.quantity
        };
      }));

      return {
        userName: userData.name,
        userEmail: userData.email,
        orderId: order._id,
        orderName: order.customer.name,
        orderPhone: order.customer.phone,
        city: order.customer.City,
        address1: order.customer.address1,
        address2: order.customer.address2,
        products,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        state: order.status,
      };
    }));
    // Send the formatted orders in the response
    res.status(200).json(ordersData);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.user_dashboard_post = async (req, res) => {
  try {
    const userId = getUserData(req);
    const userData = user.findById(userId);
    const userOrders = await orders.find({userId: userId});
    let userOrdersLen;
    if(userOrders.length == 0){
      userOrdersLen = 0;
    } else {
      userOrdersLen = userOrders.length;
    }
    const jData = {
      userScore: userData.score,
      ordersNumber: userOrdersLen,
      userCreate: userData.createdAt
    };
    res.json(jData);
  } catch (err) {
    res.json(err);
  }
};
