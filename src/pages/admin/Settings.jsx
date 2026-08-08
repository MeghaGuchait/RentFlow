import React, { useState } from "react";
import { Upload, CheckCircle2, ShieldCheck, Tag, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Tabs from "../../components/ui/Tabs.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Settings() {
  const { settings, updateSettings } = useStore();
  const { user } = useAuth();
  const [form, setForm] = useState({
    enableLateFee: settings.enableLateFee,
    globalLateFeePerHour: settings.globalLateFeePerHour,
    globalGracePeriodHours: settings.globalGracePeriodHours,
    maxLateFeeLimit: settings.maxLateFeeLimit,
    companyHeader: settings.companyHeader,
    companyFooter: settings.companyFooter,
  });
  const [saveMsg, setSaveMsg] = useState("");

  const handleSave = () => {
    updateSettings(form);
    setSaveMsg("Settings updated successfully! Applied globally to all rental operations.");
    setTimeout(() => setSaveMsg(""), 3500);
  };

  return (
    <AdminLayout title="System Settings">
      <p className="mb-4 text-xs text-brand-text/50">
        Organization-wide rental settings. Visible to Admin users. Configure late fees, grace periods, deposit caps, and invoice templates.
      </p>

      {saveMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
          <CheckCircle2 size={16} /> {saveMsg}
        </div>
      )}

      <Card className="p-6">
        <Tabs
          tabs={[
            { id: "rental", label: "Late Fees & Policy" },
            { id: "user", label: "Admin Profile" },
            { id: "company", label: "Invoice Branding" },
            { id: "pricelists", label: "Attributes & Pricelists" },
          ]}
        >
          {(active) => (
            <>
              {active === "rental" && (
                <div className="space-y-5 text-xs">
                  <label className="flex flex-col gap-3 text-sm font-semibold text-brand-text">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.enableLateFee}
                        onChange={(e) => setForm({ ...form, enableLateFee: e.target.checked })}
                        className="h-4 w-4 accent-brand-accent rounded"
                      />
                      Enable Automatic Late Fee / Overdue Penalty Calculation
                    </span>
                    <p className="text-xs text-brand-text/50">
                      When enabled, late returns calculate penalty charges automatically and deduct from security deposits upon return settlement.
                    </p>
                  </label>
                  {form.enableLateFee && (
                    <div className="grid gap-4 sm:grid-cols-3 max-w-2xl bg-brand-text/[0.02] p-4 rounded-xl border border-brand-text/5">
                      <Input
                        label="Default Late Fee ($ per hour)"
                        type="number"
                        value={form.globalLateFeePerHour}
                        onChange={(e) => setForm({ ...form, globalLateFeePerHour: +e.target.value })}
                      />
                      <Input
                        label="Grace Period (Hours)"
                        type="number"
                        value={form.globalGracePeriodHours}
                        onChange={(e) => setForm({ ...form, globalGracePeriodHours: +e.target.value })}
                      />
                      <Input
                        label="Max Penalty Cap ($)"
                        type="number"
                        value={form.maxLateFeeLimit}
                        onChange={(e) => setForm({ ...form, maxLateFeeLimit: +e.target.value })}
                      />
                    </div>
                  )}
                </div>
              )}

              {active === "user" && (
                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <Input label="Name" defaultValue={user?.name || "Priya Sharma"} />
                  <Input label="Email ID" defaultValue={user?.email || "admin@rentflow.io"} disabled />
                  <Input label="Role" defaultValue={user?.role?.toUpperCase() || "ADMIN"} disabled />
                  <Input label="Phone" defaultValue="+91 90000 00000" />
                </div>
              )}

              {active === "company" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-brand-text mb-1">Official Invoice Header Text</label>
                    <input
                      className="w-full rounded-lg border border-brand-text/15 px-3 py-2 text-xs"
                      value={form.companyHeader}
                      onChange={(e) => setForm({ ...form, companyHeader: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-brand-text mb-1">Invoice Footer / Legal Notice</label>
                    <input
                      className="w-full rounded-lg border border-brand-text/15 px-3 py-2 text-xs"
                      value={form.companyFooter}
                      onChange={(e) => setForm({ ...form, companyFooter: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {active === "pricelists" && (
                <div className="space-y-4 text-xs">
                  <p className="text-brand-text/60">Manage system-wide product variants, brand attributes, and promotional price lists.</p>
                  <div className="flex gap-3">
                    <Link
                      to="/admin/pricelists"
                      className="flex items-center gap-1.5 rounded-xl border border-brand-accent/20 bg-brand-accentSoft px-4 py-2 font-semibold text-brand-accentDark hover:bg-brand-accent/15"
                    >
                      <Tag size={15} /> Configure Price Lists →
                    </Link>
                    <Link
                      to="/admin/attributes"
                      className="flex items-center gap-1.5 rounded-xl border border-brand-accent/20 bg-brand-accentSoft px-4 py-2 font-semibold text-brand-accentDark hover:bg-brand-accent/15"
                    >
                      <ListChecks size={15} /> Configure Product Attributes →
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3 pt-4 border-t border-brand-text/8">
                <Button onClick={handleSave}>Save System Settings</Button>
              </div>
            </>
          )}
        </Tabs>
      </Card>
    </AdminLayout>
  );
}
