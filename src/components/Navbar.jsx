import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RentFlowLogo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const links = [
    { to: "/shop", label: "Products" },
    { to: "/terms", label: "Terms & Condition" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-brand-text/8 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/">
          <RentFlowLogo className="h-9 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-brand-text/70 hover:text-brand-accent">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-full p-2 hover:bg-brand-accentSoft">
            <ShoppingCart size={19} className="text-brand-text" />
            {items.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-semibold text-white">
                {items.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/profile" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-brand-accentSoft">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-accent text-xs font-semibold text-white">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
                <span className="text-sm font-medium">{user.name?.split(" ")[0]}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="rounded-full p-2 text-brand-text/60 hover:bg-brand-accentSoft hover:text-brand-accent"
                title="Logout"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-xl bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:bg-brand-accentDark md:inline-flex"
            >
              Customer Login
            </Link>
          )}

          <button className="rounded-full p-2 hover:bg-brand-accentSoft md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-brand-text/8 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 text-sm font-medium">
                  {l.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)} className="py-2 text-sm font-medium">
                    My Profile
                  </Link>
                  <button onClick={logout} className="py-2 text-left text-sm font-medium text-brand-accent">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-brand-accent">
                  Customer Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
