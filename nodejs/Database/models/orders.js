const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    userName: {
      type: String,
      ref: "users",
      require: true,
    },
    userEmail: {
      type: String,
      ref: "users",
      require: true,
    },
    userPhone: {
      type: String,
      ref: "users",
      require: true,
    },
    userScore: {
        type: Number,
        ref:"users",
        require: true
    },
  },
  products: {
    name: {
      type: String,
      ref: "products", // Reference to the Product model
      require: true,
    },
    price: {
      type: Number,
      ref: "products",
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
  },
  totalPrice: {
    type: Number,
    require: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Order = mongoose.model("Order", orderSchema);
