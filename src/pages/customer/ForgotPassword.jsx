import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import RentFlowLogo from "../../components/Logo.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Swap for: POST /api/auth/forgot-password { email }
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-accentSoft/30 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card"
      >
        <div className="mb-6 flex justify-center">
          <RentFlowLogo className="h-14 w-auto" />
        </div>
        <h2 className="text-center text-xl font-semibold text-brand-text">Reset Password</h2>

        {sent ? (
          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="text-brand-accent" size={36} />
            <p className="text-sm text-brand-text/60">
              The password reset link has been sent to your email.
            </p>
            <Link to="/login" className="text-sm font-medium text-brand-accent hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Enter Email ID"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
