const express = require("express");
const {
  fetchUsers,
  fetchUserById,
  updateUser,
  deleteUser,
} = require("../controller/User");

const router = express.Router();

router
  .get("/", fetchUsers)
  .get("/:id", fetchUserById)
  .patch("/:id", updateUser)
  .delete("/:id", deleteUser);

module.exports = router;
