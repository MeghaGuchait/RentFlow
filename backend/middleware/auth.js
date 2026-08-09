/**
 * middleware/auth.js
 * Middleware to verify JWT authentication and handle authorization permissions by role.
 */

const jwt = require("jsonwebtoken");
const prisma = require("../config/database");
const { getConfig } = require("../config/env");

const config = getConfig();

/**
 * Protect routes: verify JWT, fetch User from DB, and attach to req.user
 */
async function requireAuth(req, res, next) {
  try {
    let token = null;

    // Read Bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: "Access denied. No token provided." },
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: { message: "Invalid or expired authentication token." },
      });
    }

    // Retrieve user from DB to ensure they still exist and check their role
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: "Authentication failed. User no longer exists." },
      });
    }

    // Attach user (without password hash) to request object
    delete user.passwordHash;
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Authorize route access based on user role(s)
 * @param {string[]} allowedRoles - array of roles allowed to access the route
 */
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized. Authentication is required." },
      });
    }

    const hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: { message: `Forbidden. Access requires one of these roles: ${allowedRoles.join(", ")}` },
      });
    }

    next();
  };
}

/**
 * Shortcut helper for admin-only operations
 */
const requireAdmin = requireRole(["admin"]);

module.exports = {
  requireAuth,
  requireRole,
  requireAdmin,
};
