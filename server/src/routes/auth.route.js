const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  checkAuth,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../configs/multer");

const router = express.Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

router.post("/logout", logoutUser);

router.patch(
  "/update-profile",
  authMiddleware,
  upload.single("profile-pic"),
  updateProfile
);

router.get("/check", authMiddleware, checkAuth);

module.exports = router;
