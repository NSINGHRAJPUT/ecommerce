const express = require("express");
const {
  createUser,
  loginUser,
  forgotPassword,
  confirmTokenAndSetPassword,
} = require("../controller/Auth");

const router = express.Router();
//  /auth is already added in base path
router
  .post("/signup", createUser)
  .post("/login", loginUser)
  .post("/forgotpassword", forgotPassword)
  .post("/resetpassword", confirmTokenAndSetPassword);

module.exports = router;
