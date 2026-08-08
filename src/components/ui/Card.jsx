import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function Card({ className, children, hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={hover ? { y: -3, boxShadow: "0 8px 30px rgba(30,30,30,0.08)" } : undefined}
      className={clsx("rounded-2xl border border-brand-text/8 bg-white shadow-card", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
