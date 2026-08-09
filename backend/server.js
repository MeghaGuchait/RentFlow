/**
 * server.js — RentFlow Backend Entry Point
 *
 * Architecture:
 *   React/Vite Frontend (port 5173)
 *        ↓
 *   REST API (port 4000)          ← THIS FILE
 *        ↓
 *   Express Router + Middleware
 *        ↓
 *   Controllers → Services
 *        ↓
 *   Database (Prisma + SQLite) — wired in Stage 2
 *
 * Stages:
 *   Stage 1 (current): Server foundation + health endpoint
 *   Stage 2: Database + models (Prisma)
 *   Stage 3: Authentication + JWT
 *   Stage 4: Product & inventory APIs
 *   Stage 5: Rental & order APIs
 *   Stage 6: Settlement & late-fee logic
 *   Stage 7: Frontend API integration
 *   Stage 8: Admin integration
 */

"use strict";

// ─── 1. Load Environment ──────────────────────────────────────────────────────
const { loadEnv, getConfig } = require("./config/env");
loadEnv(); // Must be called before getConfig() reads process.env

const config = getConfig();

// ─── 2. Dependencies ──────────────────────────────────────────────────────────
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// ─── 3. Middleware imports ────────────────────────────────────────────────────
const { createRequestLogger } = require("./middleware/requestLogger");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

// ─── 4. Route imports ────────────────────────────────────────────────────────
const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");       // Stage 3
const productsRouter = require("./routes/products"); // Stage 4
const ordersRouter = require("./routes/orders");   // Stage 5
const adminRouter = require("./routes/admin");     // Stage 8

// ─── 5. Create Express app ───────────────────────────────────────────────────
const app = express();

// ─── 6. Security middleware ───────────────────────────────────────────────────
// helmet sets sensible security-related HTTP headers
app.use(helmet());

// CORS — only allow requests from the React dev server (and production origin)
app.use(
  cors({
    origin: config.cors.origin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rate limiting — protects against brute-force and abuse
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // default: 15 minutes
  max: config.rateLimit.max,           // default: 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: "Too many requests — please try again later." },
  },
});
app.use("/api", limiter);

// ─── 7. Request parsing ───────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ─── 8. HTTP request logging ─────────────────────────────────────────────────
app.use(createRequestLogger());

// ─── 9. API Routes ───────────────────────────────────────────────────────────
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);         // Stage 3
app.use("/api/products", productsRouter); // Stage 4
app.use("/api/orders", ordersRouter);     // Stage 5
app.use("/api/admin", adminRouter);       // Stage 8

// ─── 10. Root route (non-API) — helpful redirect message ─────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RentFlow Backend API",
    docs: `${req.protocol}://${req.get("host")}/api/health`,
    version: "1.0.0",
  });
});

// ─── 11. Error Handling (must come LAST) ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── 12. Start Server ────────────────────────────────────────────────────────
const PORT = config.port;

app.listen(PORT, () => {
  console.log("────────────────────────────────────────────");
  console.log(`  RentFlow Backend`);
  console.log(`  Running on  : http://localhost:${PORT}`);
  console.log(`  Health      : http://localhost:${PORT}/api/health`);
  console.log(`  Environment : ${config.nodeEnv}`);
  console.log(`  CORS origin : ${config.cors.origin}`);
  console.log("────────────────────────────────────────────");
});

// ─── 13. Graceful shutdown ───────────────────────────────────────────────────
process.on("SIGTERM", () => {
  console.log("[server] SIGTERM received — shutting down gracefully.");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("[server] SIGINT received — shutting down gracefully.");
  process.exit(0);
});

module.exports = app; // exported for testing
