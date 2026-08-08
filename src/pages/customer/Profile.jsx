import React, { useState } from "react";
import { Camera } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Tabs from "../../components/ui/Tabs.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-brand-text">My Profile</h1>

        <Card className="mt-6 p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent text-xl font-semibold text-white">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
              <button className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 text-brand-accent shadow-card">
                <Camera size={13} />
              </button>
            </div>
            <div>
              <p className="font-medium text-brand-text">{user?.name}</p>
              <p className="text-sm text-brand-text/50">{user?.email}</p>
              <p className="text-xs capitalize text-brand-text/40">via {user?.provider || "email"}</p>
            </div>
          </div>

          <div className="mt-8">
            <Tabs tabs={[{ id: "profile", label: "Profile" }, { id: "address", label: "Address" }, { id: "payment", label: "Payment Info" }]}>
              {(active) => (
                <>
                  {active === "profile" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                      <Input label="Email" value={user?.email || ""} disabled />
                    </div>
                  )}
                  {active === "address" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="Shipping Address" className="sm:col-span-2" value={address} onChange={(e) => setAddress(e.target.value)} />
                      <Input label="City" />
                      <Input label="Zip Code" />
                    </div>
                  )}
                  {active === "payment" && (
                    <p className="text-sm text-brand-text/50">No saved payment methods yet.</p>
                  )}
                  <Button className="mt-6">Save Changes</Button>
                </>
              )}
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
}
