import React, { useState } from "react";
import { Camera, CheckCircle2, ShieldCheck, Building } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Tabs from "../../components/ui/Tabs.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [address, setAddress] = useState(user?.address || "221B Baker Street, Suite 4B");
  const [city, setCity] = useState(user?.city || "Mumbai");
  const [zip, setZip] = useState(user?.zip || "400001");
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [gstNo, setGstNo] = useState(user?.gstNo || "");
  const [savedMsg, setSavedMsg] = useState("");

  const handleAvatarChange = () => {
    const avatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    ];
    const nextAv = avatars[Math.floor(Math.random() * avatars.length)];
    updateUserProfile({ avatar: nextAv });
    setSavedMsg("Profile avatar updated successfully!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const handleSave = () => {
    updateUserProfile({ name, phone, address, city, zip, companyName, gstNo });
    setSavedMsg("Profile information saved successfully.");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-brand-text">Account Profile &amp; Settings</h1>
        <Card className="mt-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile avatar" className="h-16 w-16 rounded-full object-cover border-2 border-brand-accent/30" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent text-xl font-semibold text-white">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
              <button
                onClick={handleAvatarChange}
                className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 text-brand-accent shadow-card border border-brand-text/10 hover:bg-brand-accentSoft"
                title="Change Avatar photo"
              >
                <Camera size={13} />
              </button>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-brand-text text-base">{user?.name}</p>
                <span className="rounded-full bg-brand-accentSoft px-2 py-0.5 text-xs font-semibold text-brand-accentDark capitalize">
                  {user?.role || "Customer"}
                </span>
              </div>
              <p className="text-xs text-brand-text/50">{user?.email}</p>
              {user?.companyName && (
                <p className="text-xs text-purple-700 font-medium flex items-center gap-1 mt-0.5">
                  <Building size={12} /> {user.companyName} (GST: {user.gstNo || "N/A"})
                </p>
              )}
            </div>
          </div>

          {savedMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 border border-emerald-200">
              <CheckCircle2 size={15} /> {savedMsg}
            </div>
          )}

          <div className="mt-8">
            <Tabs
              tabs={[
                { id: "profile", label: "Profile Info" },
                { id: "address", label: "Address Details" },
                { id: "company", label: "Company / GST" },
              ]}
            >
              {(active) => (
                <>
                  {active === "profile" && (
                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                      <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      <Input label="Email" value={user?.email || ""} disabled />
                    </div>
                  )}

                  {active === "address" && (
                    <div className="space-y-4 text-xs">
                      <Input
                        label="Default Shipping Address"
                        className="sm:col-span-2"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
                        <Input label="Zip Code" value={zip} onChange={(e) => setZip(e.target.value)} />
                      </div>
                    </div>
                  )}

                  {active === "company" && (
                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <Input
                        label="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Apex Rentals Ltd"
                      />
                      <Input
                        label="GST Number"
                        value={gstNo}
                        onChange={(e) => setGstNo(e.target.value)}
                        placeholder="27AAAAA0000A1Z5"
                      />
                    </div>
                  )}

                  <Button className="mt-6" onClick={handleSave}>
                    Save Profile Changes
                  </Button>
                </>
              )}
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
}
