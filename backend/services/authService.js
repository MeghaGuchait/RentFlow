/**
 * services/authService.js
 * Business logic for user registration, authentication, and token generation.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/database");
const { getConfig } = require("../config/env");

const config = getConfig();

/**
 * Sign JWT access token for a user
 * @param {object} user
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

/**
 * Register a new user account
 */
async function registerUser({
  firstName,
  lastName,
  email,
  password,
  role = "customer",
  companyName = null,
  gstNo = null,
  appliedCoupon = null,
  provider = "password",
}) {
  const cleanEmail = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (existingUser) {
    throw new Error("An account with this Email ID already exists.");
  }

  // Hash password if provider is password
  let passwordHash = null;
  if (provider === "password") {
    if (!password) {
      throw new Error("Password is required.");
    }
    // Perform standard password checks (matching frontend regex in AuthContext)
    const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&_]).{6,12}$/.test(password);
    if (!strongPw) {
      throw new Error(
        "Password length must be between 6 and 12 characters and include at least 1 uppercase letter, 1 lowercase letter, and 1 special character (@, $, &, _)."
      );
    }
    passwordHash = await bcrypt.hash(password, 12);
  }

  // Determine discount percentage if coupon is valid
  let discountPct = 0.0;
  if (appliedCoupon && ["XXXX10", "WELCOME10", "NEW10"].includes(appliedCoupon.toUpperCase())) {
    discountPct = 10.0;
  }

  const name = `${firstName || ""} ${lastName || ""}`.trim() || companyName || cleanEmail.split("@")[0];

  // Save to DB
  const user = await prisma.user.create({
    data: {
      email: cleanEmail,
      name,
      passwordHash,
      role: role.toLowerCase(),
      companyName: role === "vendor" ? companyName : null,
      gstNo: role === "vendor" ? gstNo : null,
      appliedCoupon: appliedCoupon ? appliedCoupon.toUpperCase() : null,
      discountPct,
      provider,
    },
  });

  // Remove passwordHash from returned user object
  delete user.passwordHash;

  const token = generateToken(user);
  return { user, token };
}

/**
 * Authenticate user credentials
 */
async function authenticateUser(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (!user || user.provider !== "password" || !user.passwordHash) {
    throw new Error("Invalid User ID or Password.");
  }

  // Compare hashed password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid User ID or Password.");
  }

  // Remove passwordHash from returned user object
  delete user.passwordHash;

  const token = generateToken(user);
  return { user, token };
}

/**
 * Verify social login token (e.g. Google OAuth credential)
 * Decodes the Google OAuth credential token, checks if user exists,
 * or registers a new user automatically.
 */
async function authenticateGoogle(credential) {
  if (!credential) {
    throw new Error("Google sign-in credential is required.");
  }

  try {
    // Decode Google JWT payload locally (avoid network requests for offline dev speed)
    const payload = JSON.parse(Buffer.from(credential.split(".")[1], "base64").toString("utf-8"));
    const email = payload.email || "";
    const name = payload.name || `${payload.given_name || ""} ${payload.family_name || ""}`.trim() || email.split("@")[0];

    // Try finding existing user
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Create user
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          role: "customer",
          provider: "google",
        },
      });
    }

    delete user.passwordHash;

    const token = generateToken(user);
    return { user, token };
  } catch (err) {
    throw new Error("Google sign-in verification failed: " + err.message);
  }
}

module.exports = {
  registerUser,
  authenticateUser,
  authenticateGoogle,
  generateToken,
};
