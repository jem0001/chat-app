const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  getUserForSidebar,
  getMessage,
  sendMessage,
} = require("../controllers/message.controller");

const router = express.Router();

router.get("/users", authMiddleware, getUserForSidebar);
router.get("/:id", authMiddleware, getMessage);

router.post("/:id", authMiddleware, sendMessage);
module.exports = router;
