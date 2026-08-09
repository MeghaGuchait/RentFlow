/**
 * controllers/authController.js
 * Express controllers handling registration, login, profile retrieval, and OAuth.
 */

const authService = require("../services/authService");

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { user, token } = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { user, token },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { message: err.message },
    });
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: "Email and password are required." },
      });
    }

    const { user, token } = await authService.authenticateUser(email, password);
    res.json({
      success: true,
      message: "Login successful.",
      data: { user, token },
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: { message: err.message },
    });
  }
}

/**
 * GET /api/auth/me
 * Retrieves current authenticated user (protected route)
 */
async function getMe(req, res, next) {
  try {
    // req.user is injected by authentication middleware
    res.json({
      success: true,
      data: { user: req.user },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/google
 * Social Google Sign-in Verification
 */
async function googleLogin(req, res, next) {
  try {
    const { credential } = req.body;
    const { user, token } = await authService.authenticateGoogle(credential);
    res.json({
      success: true,
      message: "Google sign-in successful.",
      data: { user, token },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { message: err.message },
    });
  }
}

module.exports = {
  register,
  login,
  getMe,
  googleLogin,
};
