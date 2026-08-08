# RentFlow

A rental management platform — customer storefront + admin operations backend —
built with React, Vite, Tailwind CSS, and Framer Motion.

## What's included

**Customer side:** Landing, Login/Signup (email + Google + Facebook), Shop with
filters, Product detail with variants, Cart, Checkout (address → payment), Order
confirmation, My Orders, Profile.

**Admin side:** Operations Dashboard (8 live metrics), Orders (list + Kanban),
Order detail with quotation → sale order → pickup → return flow and automatic
**late fee + security deposit settlement**, Products (multi-tab form: general
info, attributes/variants, rental + late fee config), Price Lists, Attributes,
Rental Scheduler (calendar), Reports, Settings, Quotation Templates.

All data currently lives in React Context (`src/context/StoreContext.jsx`) seeded
from `src/data/mockData.js` — every function there is written as a clean seam to
swap in real API calls once you have a backend.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your OAuth keys (see below)
npm run dev
```

Open http://localhost:5173.

**Demo login:** use `admin@rentflow.io` (any password) to land in the admin
dashboard. Any other email/password combination logs in as a customer.

## Setting up Google Login

1. Go to https://console.cloud.google.com/apis/credentials
2. Create an OAuth 2.0 Client ID → Application type: **Web application**
3. Add your dev URL (`http://localhost:5173`) and production URL to
   **Authorized JavaScript origins**
4. Copy the generated Client ID into `.env` as `VITE_GOOGLE_CLIENT_ID`
5. The `<GoogleLogin>` button (in `Login.jsx` / `Signup.jsx`) returns a signed
   credential (ID token). **This app decodes it client-side for demo purposes
   only** — in production, send that token to your backend and verify it there
   (Google's `tokeninfo` endpoint or a server-side auth library) before issuing
   your own session.

## Setting up Facebook Login

1. Go to https://developers.facebook.com/apps and create an app → add the
   **Facebook Login** product
2. Under Facebook Login → Settings, add your site URL to **Valid OAuth Redirect URIs**
3. Copy the App ID into `.env` as `VITE_FACEBOOK_APP_ID`
4. `AuthContext.jsx` lazy-loads the Facebook JS SDK and calls `FB.login()` /
   `FB.api('/me', ...)` on demand — again, **verify the access token server-side**
   (Graph API `debug_token`) before trusting it in production.

## Project structure

```
src/
  components/         shared UI (Button, Input, Card, Modal, Badge, Tabs, StatCard)
  components/Logo.jsx RentFlow wordmark — tagline only renders on Landing & Login
  context/            AuthContext, CartContext, StoreContext (the mock "backend")
  data/mockData.js    seed products, orders, price lists, attributes
  utils/lateFee.js    late fee + deposit settlement calculator (core business logic)
  pages/customer/     storefront pages
  pages/admin/        operations backend pages
  App.jsx             route table
```

## Brand system

| Token | Value | Usage |
|---|---|---|
| `brand.text` | `#1e1e1e` | body text, wordmark |
| `brand.accent` | `#9d5977` | CTAs, active states, accent strip |
| `brand.white` | `#ffffff` | canvas |

Defined in `tailwind.config.js` — use `text-brand-text`, `bg-brand-accent`, etc.
throughout rather than hardcoding hex values, so a future rebrand is a one-file change.

## Next steps for a production build

1. Replace `StoreContext.jsx` and `AuthContext.jsx` mock logic with real API calls
2. Add server-side OAuth token verification for Google/Facebook
3. Add a real payment gateway (Stripe/Razorpay) in place of the mock Checkout flow
4. Generate real PDF invoices (e.g. `@react-pdf/renderer`) instead of the placeholder download button
5. Move seed data into your actual database
