/**
 * routes/auth.js
 * Routing for user registration, local login, profile fetch, and social login verification.
 */

const { Router } = require("express");
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = Router();

// Public endpoints
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleLogin);

// Protected endpoints
router.get("/me", requireAuth, authController.getMe);

module.exports = router;
