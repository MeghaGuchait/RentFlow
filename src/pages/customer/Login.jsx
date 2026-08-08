import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { Facebook } from "lucide-react";
import RentFlowLogo from "../../components/Logo.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { login, loginWithGoogle, loginWithFacebook, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ loginId: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(form.loginId, form.password);
    setLoading(false);
    if (ok) navigate(form.loginId.toLowerCase() === "admin@rentflow.io" ? "/admin" : "/shop");
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const ok = loginWithGoogle(credentialResponse);
    if (ok) navigate("/shop");
  };

  const handleFacebook = async () => {
    setError("");
    const ok = await loginWithFacebook();
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
          <RentFlowLogo showTagline className="h-20 w-auto" />
        </div>

        <h2 className="text-center text-xl font-semibold text-brand-text">Welcome back</h2>
        <p className="mt-1 text-center text-sm text-brand-text/50">Log in to manage your rentals</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Login ID"
            type="text"
            placeholder="you@example.com"
            value={form.loginId}
            onChange={(e) => setForm({ ...form, loginId: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-xs font-medium text-brand-accent hover:underline">
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
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
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in failed.")}
              width="100%"
              text="continue_with"
            />
          </div>
          <button
            onClick={handleFacebook}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-text/15 py-2.5 text-sm font-medium text-brand-text hover:bg-brand-text/[0.03]"
          >
            <Facebook size={17} className="text-[#1877F2]" />
            Continue with Facebook
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-brand-text/60">
          Do not have an account?{" "}
          <Link to="/signup" className="font-medium text-brand-accent hover:underline">
            Register Here
          </Link>
        </p>
        <p className="mt-1 text-center text-xs text-brand-text/40">
          Tip: use <span className="font-mono">admin@rentflow.io</span> to preview the admin dashboard.
        </p>
      </motion.div>
    </div>
  );
}
