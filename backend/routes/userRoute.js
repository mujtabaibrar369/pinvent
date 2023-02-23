const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  isLogedIn,
  updateUserProfile,
  changePassword,
  resetPassword,
} = require("../controller/userController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect, userProfile);
router.get("/isLogedIn", isLogedIn);
router.patch("/updateUserProfile", protect, updateUserProfile);
router.patch("/changePassword", protect, changePassword);
router.post("/resetPassword", resetPassword);

module.exports = router;
