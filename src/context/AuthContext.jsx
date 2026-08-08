import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "rentflow_auth_user";
const FB_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || "";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  // --- Email/password (mock) ---------------------------------------------
  // Swap the body of this function for a real POST /api/auth/login call.
  const login = useCallback(async (loginId, password) => {
    setError("");
    if (!loginId || !password) {
      setError("Invalid User ID or Password.");
      return false;
    }
    // Demo credential shortcut: admin@rentflow.io / any password logs in as admin.
    const role = loginId.trim().toLowerCase() === "admin@rentflow.io" ? "admin" : "customer";
    setUser({
      id: `u-${Date.now()}`,
      name: role === "admin" ? "Priya Sharma" : loginId.split("@")[0] || "Customer",
      email: loginId,
      role,
      provider: "password",
    });
    return true;
  }, []);

  const signup = useCallback(async ({ firstName, lastName, email, password, confirmPassword }) => {
    setError("");
    const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&_]).{6,12}$/.test(password);
    if (password !== confirmPassword) {
      setError("Password and Confirm Password must match.");
      return false;
    }
    if (!strongPw) {
      setError("Password must be 6-12 chars with upper, lower & one of @ $ & _");
      return false;
    }
    setUser({
      id: `u-${Date.now()}`,
      name: `${firstName} ${lastName}`.trim(),
      email,
      role: "customer",
      provider: "password",
    });
    return true;
  }, []);

  // --- Google OAuth --------------------------------------------------------
  // Real integration: @react-oauth/google's <GoogleLogin> returns a credential
  // (ID token) in onSuccess. Send that token to your backend, verify it with
  // Google's tokeninfo endpoint or a server-side library, then issue your own
  // session/JWT. Here we decode the token client-side only for demo purposes.
  const loginWithGoogle = useCallback((credentialResponse) => {
    try {
      const payload = JSON.parse(atob(credentialResponse.credential.split(".")[1]));
      setUser({
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        role: "customer",
        provider: "google",
      });
      return true;
    } catch (e) {
      setError("Google sign-in failed. Please try again.");
      return false;
    }
  }, []);

  // --- Facebook Login --------------------------------------------------------
  // Real integration: loads the Facebook JS SDK, opens the FB.login popup,
  // then calls FB.api('/me', ...) for the profile. The access token returned
  // by FB.login should be sent to your backend for verification (Graph API
  // debug_token) before you trust it. This is a client-only demo stub.
  const loginWithFacebook = useCallback(() => {
    return new Promise((resolve) => {
      if (!FB_APP_ID) {
        setError("Facebook App ID not configured (set VITE_FACEBOOK_APP_ID).");
        resolve(false);
        return;
      }
      const runLogin = () => {
        window.FB.login(
          (response) => {
            if (response.authResponse) {
              window.FB.api("/me", { fields: "name,email,picture" }, (profile) => {
                setUser({
                  id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  avatar: profile.picture?.data?.url,
                  role: "customer",
                  provider: "facebook",
                });
                resolve(true);
              });
            } else {
              setError("Facebook sign-in was cancelled.");
              resolve(false);
            }
          },
          { scope: "public_profile,email" }
        );
      };

      if (window.FB) {
        runLogin();
        return;
      }

      window.fbAsyncInit = function () {
        window.FB.init({ appId: FB_APP_ID, cookie: true, xfbml: false, version: "v19.0" });
        runLogin();
      };
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      document.body.appendChild(script);
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider
      value={{ user, error, setError, login, signup, logout, loginWithGoogle, loginWithFacebook }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
