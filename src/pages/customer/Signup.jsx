import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { User, Store, Tag } from "lucide-react";
import RentFlowLogo from "../../components/Logo.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Signup() {
  const { signup, loginWithGoogle, loginWithFacebook, error, setError } = useAuth();
  const navigate = useNavigate();
  const [isVendor, setIsVendor] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    gstNo: "",
    couponCode: "WELCOME10",
  });
  const [loading, setLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await signup({ ...form, isVendor });
    setLoading(false);
    if (ok) {
      navigate(isVendor ? "/admin" : "/shop");
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const ok = loginWithGoogle(credentialResponse);
    if (ok) navigate("/shop");
  };

  const handleFacebook = async () => {
    setError("");
    setFbLoading(true);
    try {
      const ok = await loginWithFacebook();
      if (ok) navigate("/shop");
    } finally {
      setFbLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-accentSoft/30 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card"
      >
        <div className="mb-4 flex justify-center">
          <RentFlowLogo className="h-12 w-auto" />
        </div>

        <h2 className="text-center text-xl font-semibold text-brand-text">
          {isVendor ? "Vendor Partner Registration" : "Create Customer Account"}
        </h2>
        <p className="mt-1 text-center text-xs text-brand-text/50">
          {isVendor ? "List your products & manage rental orders" : "Start renting premium products in minutes"}
        </p>

        <div className="mt-5 mb-4 flex rounded-xl bg-brand-text/5 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsVendor(false);
              setError("");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              !isVendor ? "bg-white shadow-sm text-brand-accent" : "text-brand-text/60"
            }`}
          >
            <User size={14} /> Customer Sign-up
          </button>
          <button
            type="button"
            onClick={() => {
              setIsVendor(true);
              setError("");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              isVendor ? "bg-white shadow-sm text-purple-700" : "text-brand-text/60"
            }`}
          >
            <Store size={14} /> Become a Vendor
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <Input
              label="First Name"
              value={form.firstName}
              required
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              value={form.lastName}
              required
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          <Input
            label="Email ID"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-2.5">
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>

          <p className="text-[11px] text-brand-text/45 leading-tight">
            * 6 to 12 characters, including at least 1 uppercase letter, 1 lowercase letter, and 1 special character (@, $, &amp;, _).
          </p>

          {isVendor && (
            <div className="grid grid-cols-2 gap-2.5">
              <Input
                label="Company Name"
                required={isVendor}
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
              <Input
                label="GST No"
                placeholder="27AAAAA0000A1Z5"
                value={form.gstNo}
                onChange={(e) => setForm({ ...form, gstNo: e.target.value })}
              />
            </div>
          )}

          <div className="rounded-xl bg-amber-50/70 p-2.5 border border-amber-200/60">
            <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-1">
              <Tag size={13} /> Signup Coupon Code (10% Discount)
            </div>
            <Input
              placeholder="e.g. WELCOME10 or XXXX10"
              value={form.couponCode}
              onChange={(e) => setForm({ ...form, couponCode: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Creating account…" : isVendor ? "Register Vendor Account" : "Register Account"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-brand-text/10" />
          <span className="text-xs text-brand-text/40">or continue with</span>
          <div className="h-px flex-1 bg-brand-text/10" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-center [&>div]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in failed.")}
              width="100%"
              text="continue_with"
            />
          </div>
          <button
            type="button"
            onClick={handleFacebook}
            disabled={fbLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-brand-text/15 py-2.5 text-sm font-medium text-brand-text hover:bg-brand-text/[0.03] disabled:opacity-60 disabled:pointer-events-none"
            aria-label="Continue with Facebook"
          >
            {fbLoading ? (
              "Continuing…"
            ) : (
              <span className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-[#1877F2]">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 fill-white" aria-hidden>
                    <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.676V1.325C24 .597 23.403 0 22.675 0z" />
                  </svg>
                </span>
                Continue with Facebook
              </span>
            )}
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-brand-text/60">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-accent hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

