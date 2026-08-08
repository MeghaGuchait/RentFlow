import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

const VARIANTS = {
  primary: "bg-brand-accent text-white hover:bg-brand-accentDark shadow-soft",
  outline: "border border-brand-text/15 text-brand-text hover:border-brand-accent hover:text-brand-accent",
  ghost: "text-brand-text hover:bg-brand-accentSoft",
  subtle: "bg-brand-accentSoft text-brand-accentDark hover:bg-brand-accent hover:text-white",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5 rounded-lg",
  md: "text-sm px-5 py-2.5 rounded-xl",
  lg: "text-base px-7 py-3.5 rounded-xl",
};

export default function Button({
  as = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  const Comp = typeof as === "string" ? motion[as] || motion.button : motion(as);

  return (
    <Comp
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
