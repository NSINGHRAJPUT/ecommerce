const mongoose = require("mongoose");
const EcUser = require("../modal/user");
const Product = require("../modal/Product");
const Category = require("../modal/Brand");
const Brand = require("../modal/Brand");
const Cart = require("../modal/Cart");
const Order = require("../modal/Order");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MOONGOOSE_URI, {});
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const models = {
  Product,
  EcUser,
  Category,
  Brand,
  Cart,
  Order,
};

module.exports = { connectDB, models };
