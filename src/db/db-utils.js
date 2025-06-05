const dbConnect = require("./db");
const User = require("../models/User");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Order = require("../models/Order");

async function getUserById(id) {
  await dbConnect();
  return await User.findById(id).select("-password");
}

async function getUserByEmail(email) {
  await dbConnect();
  return await User.findOne({ email });
}

async function createUser(userData) {
  await dbConnect();
  return await User.create(userData);
}

async function getAllProducts(category) {
  await dbConnect();
  const query = category ? { category } : {};
  return await Product.find(query).populate("reviews");
}

async function getProductById(id) {
  await dbConnect();
  return await Product.findById(id).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "name",
    },
  });
}

async function createProduct(productData) {
  await dbConnect();
  return await Product.create(productData);
}

async function createReview(reviewData) {
  await dbConnect();
  const review = await Review.create(reviewData);
  await Product.findByIdAndUpdate(reviewData.product, {
    $push: { reviews: review._id },
  });
  return review;
}

async function getOrdersByUser(userId) {
  await dbConnect();
  return await Order.find({ user: userId })
    .populate("items.product")
    .sort({ createdAt: -1 });
}

async function createOrder(orderData) {
  await dbConnect();
  return await Order.create(orderData);
}

async function updateOrderStatus(orderId, status) {
  await dbConnect();
  return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
}

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  getAllProducts,
  getProductById,
  createProduct,
  createReview,
  getOrdersByUser,
  createOrder,
  updateOrderStatus,
};
