/**
 * services/README.md
 * 
 * Services directory — business logic layer.
 *
 * Services contain the core business rules of RentFlow and are called
 * by controllers. They are intentionally decoupled from Express so they
 * can be unit-tested without spinning up an HTTP server.
 *
 * Services to be added in subsequent stages:
 *
 * Stage 3:  authService.js    — registration, login, token generation
 * Stage 4:  productService.js — product CRUD, availability checks
 * Stage 5:  orderService.js   — order creation, status transitions
 * Stage 6:  settlementService.js — late-fee & deposit settlement logic
 * Stage 8:  reportService.js  — aggregated reporting data
 */
