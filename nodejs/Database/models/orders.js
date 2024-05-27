const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    userName: {
      type: String,
      ref: "user",
      require: true,
    },
    userEmail: {
      type: String,
      ref: "user",
      require: true,
    },
    userPhone: {
      type: String,
      ref: "user",
      require: true,
    },
    userScore: {
        type: Number,
        ref:"user",
        require: true
    },
  },
  products: {
    name: {
      type: String,
      ref: "Product", // Reference to the Product model
      require: true,
    },
    price: {
      type: Number,
      ref: "product",
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
