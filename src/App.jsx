import React from "react";
import { Routes, Route } from "react-router-dom";

// Customer pages
import Landing from "./pages/customer/Landing.jsx";
import Login from "./pages/customer/Login.jsx";
import Signup from "./pages/customer/Signup.jsx";
import ForgotPassword from "./pages/customer/ForgotPassword.jsx";
import Shop from "./pages/customer/Shop.jsx";
import ProductDetail from "./pages/customer/ProductDetail.jsx";
import Cart from "./pages/customer/Cart.jsx";
import Checkout from "./pages/customer/Checkout.jsx";
import OrderConfirmation from "./pages/customer/OrderConfirmation.jsx";
import MyOrders from "./pages/customer/MyOrders.jsx";
import Profile from "./pages/customer/Profile.jsx";
import { Terms, About, Contact } from "./pages/customer/StaticPages.jsx";

// Admin pages
import Dashboard from "./pages/admin/Dashboard.jsx";
import Orders from "./pages/admin/Orders.jsx";
import OrderDetail from "./pages/admin/OrderDetail.jsx";
import Products from "./pages/admin/Products.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import PriceLists from "./pages/admin/PriceLists.jsx";
import Attributes from "./pages/admin/Attributes.jsx";
import Schedule from "./pages/admin/Schedule.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Settings from "./pages/admin/Settings.jsx";
import QuotationTemplate from "./pages/admin/QuotationTemplate.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public / customer-facing */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Requires a logged-in customer */}
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Admin backend */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><Orders /></ProtectedRoute>} />
      <Route path="/admin/orders/:id" element={<ProtectedRoute role="admin"><OrderDetail /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute role="admin"><Products /></ProtectedRoute>} />
      <Route path="/admin/products/:id" element={<ProtectedRoute role="admin"><ProductForm /></ProtectedRoute>} />
      <Route path="/admin/pricelists" element={<ProtectedRoute role="admin"><PriceLists /></ProtectedRoute>} />
      <Route path="/admin/attributes" element={<ProtectedRoute role="admin"><Attributes /></ProtectedRoute>} />
      <Route path="/admin/schedule" element={<ProtectedRoute role="admin"><Schedule /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><Settings /></ProtectedRoute>} />
      <Route path="/admin/quotation-templates" element={<ProtectedRoute role="admin"><QuotationTemplate /></ProtectedRoute>} />
    </Routes>
  );
}
