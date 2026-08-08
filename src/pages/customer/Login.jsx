import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import RentFlowLogo from "../../components/Logo.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { login, loginWithGoogle, loginWithFacebook, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ loginId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);

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
