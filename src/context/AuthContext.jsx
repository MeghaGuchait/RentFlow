import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "rentflow_auth_user";
const USERS_KEY = "rentflow_registered_users";
const FB_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || "";

const defaultUsers = [
  { email: "admin@rentflow.io", name: "Priya Sharma", role: "admin" },
  {
    email: "vendor@rentflow.io",
    name: "Apex Rentals",
    role: "vendor",
    companyName: "Apex Rentals Ltd",
    gstNo: "27AAAAA0000A1Z5",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    if (typeof window === "undefined") return defaultUsers;
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : defaultUsers;
    } catch {
      return defaultUsers;
    }
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = useCallback(
    async (loginId, password) => {
      setError("");
      if (!loginId || !password) {
        setError("Invalid User ID or Password.");
        return false;
      }

      const cleanId = loginId.trim().toLowerCase();

      if (cleanId === "admin@rentflow.io") {
        setUser({
          id: "u-admin",
          name: "Priya Sharma",
          email: cleanId,
          role: "admin",
          companyName: "RentFlow HQ",
          provider: "password",
        });
        return true;
      }

      if (cleanId === "vendor@rentflow.io") {
        setUser({
          id: "u-vendor",
          name: "Apex Equipment Rentals",
          email: cleanId,
          role: "vendor",
          companyName: "Apex Rentals Ltd",
          gstNo: "27AAAAA0000A1Z5",
          provider: "password",
        });
        return true;
      }

      const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanId);
      if (existing) {
        setUser({
          id: existing.id || `u-${Date.now()}`,
          name: existing.name || cleanId.split("@")[0],
          email: existing.email,
          role: existing.role || "customer",
          companyName: existing.companyName || "",
          gstNo: existing.gstNo || "",
          provider: "password",
        });
        return true;
      }

      setUser({
        id: `u-${Date.now()}`,
        name: cleanId.split("@")[0] || "Customer",
        email: cleanId,
        role: "customer",
        provider: "password",
      });

      return true;
    },
    [registeredUsers]
  );

  const signup = useCallback(
    async ({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      isVendor = false,
      companyName = "",
      gstNo = "",
      couponCode = "",
    }) => {
      setError("");
      const cleanEmail = (email || "").trim().toLowerCase();

      if (!cleanEmail) {
        setError("Email ID is required.");
        return false;
      }

      const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
      if (exists) {
        setError("An account with this Email ID already exists.");
        return false;
      }

      if (password !== confirmPassword) {
        setError("Password and Confirm Password must match.");
        return false;
      }

      const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&_]).{6,12}$/.test(password);
      if (!strongPw) {
        setError(
          "Password length must be between 6 and 12 characters and include at least 1 uppercase letter, 1 lowercase letter, and 1 special character (@, $, &, _)."
        );
        return false;
      }

      if (isVendor && !companyName) {
        setError("Company Name is required for Vendor signup.");
        return false;
      }

      const newAccount = {
        id: `u-${Date.now()}`,
        name: `${firstName || ""} ${lastName || ""}`.trim() || companyName || cleanEmail.split("@")[0],
        firstName: firstName || "",
        lastName: lastName || "",
        email: cleanEmail,
        role: isVendor ? "vendor" : "customer",
        companyName: isVendor ? companyName : "",
        gstNo: isVendor ? gstNo : "",
        appliedCoupon: couponCode ? couponCode.toUpperCase() : null,
        discountPct:
          couponCode && ["XXXX10", "WELCOME10", "NEW10"].includes(couponCode.toUpperCase())
            ? 10
            : 0,
        provider: "password",
      };

      setRegisteredUsers((prev) => [...prev, newAccount]);
      setUser(newAccount);
      return true;
    },
    [registeredUsers]
  );

  const updateUserProfile = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const loginWithGoogle = useCallback((credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError("Google sign-in failed.");
      return false;
    }

    try {
      const payload = JSON.parse(atob(credentialResponse.credential.split(".")[1]));
      const email = payload.email || "";
      const name =
        payload.name || `${payload.given_name || ""} ${payload.family_name || ""}`.trim() ||
        email.split("@")[0];

      setUser({
        id: payload.sub ? `u-google-${payload.sub}` : `u-${Date.now()}`,
        name,
        email,
        role: "customer",
        provider: "google",
      });
      return true;
    } catch {
      setError("Google sign-in failed.");
      return false;
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    if (!FB_APP_ID) {
      setError("Facebook login is not configured.");
      return false;
    }

    const fbUser = {
      id: `u-facebook-${Date.now()}`,
      name: "Facebook User",
      email: `facebook_user_${Date.now()}@facebook.com`,
      role: "customer",
      provider: "facebook",
    };

    setUser(fbUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError("");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        setError,
        login,
        signup,
        logout,
        updateUserProfile,
        loginWithGoogle,
        loginWithFacebook,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
