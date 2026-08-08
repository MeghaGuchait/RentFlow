import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { Facebook } from "lucide-react";
import RentFlowLogo from "../../components/Logo.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Signup() {
  const { signup, loginWithGoogle, loginWithFacebook, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await signup(form);
    setLoading(false);
    if (ok) navigate("/shop");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-accentSoft/30 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card"
      >
        <div className="mb-6 flex justify-center">
          <RentFlowLogo className="h-14 w-auto" />
        </div>

        <h2 className="text-center text-xl font-semibold text-brand-text">Create your account</h2>
        <p className="mt-1 text-center text-sm text-brand-text/50">Start renting in minutes</p>

        {error && <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
          <Input
            label="Email ID"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Input
              label="Confirm Password"
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>
          <p className="text-xs text-brand-text/40">
            6-12 characters, with an uppercase, lowercase, and one of @ $ &amp; _
          </p>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Register"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-brand-text/10" />
          <span className="text-xs text-brand-text/40">or continue with</span>
          <div className="h-px flex-1 bg-brand-text/10" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-center [&>div]:w-full">
            <GoogleLogin
              onSuccess={(cred) => loginWithGoogle(cred) && navigate("/shop")}
              onError={() => setError("Google sign-in failed.")}
              width="100%"
              text="signup_with"
            />
          </div>
          <button
            onClick={async () => (await loginWithFacebook()) && navigate("/shop")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-text/15 py-2.5 text-sm font-medium text-brand-text hover:bg-brand-text/[0.03]"
          >
            <Facebook size={17} className="text-[#1877F2]" />
            Continue with Facebook
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-brand-text/60">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-accent hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
