const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Роут для регистрации пользователя
router.post("/register", authController.registerUser);
router.post("/getUser", authController.getUser);
router.post("/login", authController.login);

module.exports = router;
