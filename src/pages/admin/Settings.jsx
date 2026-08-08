import React, { useState } from "react";
import { Upload } from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Tabs from "../../components/ui/Tabs.jsx";
import { CURRENT_ADMIN } from "../../data/mockData.js";

export default function Settings() {
  const [lateFeeEnabled, setLateFeeEnabled] = useState(true);
  const [defaultLateFee, setDefaultLateFee] = useState(10);

  return (
    <AdminLayout title="Settings">
      <p className="mb-4 text-xs text-brand-text/40">Visible to Admin only. Non-admin users see their info under Profile.</p>
      <Card className="p-6">
        <Tabs
          tabs={[
            { id: "user", label: "User" },
            { id: "security", label: "Security" },
            { id: "rental", label: "Rental Period" },
            { id: "company", label: "Company" },
          ]}
        >
          {(active) => (
            <>
              {active === "user" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Name" defaultValue={CURRENT_ADMIN.name} />
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-brand-text/80">Role</span>
                    <select defaultValue="Admin" className="w-full rounded-lg border border-brand-text/15 px-3.5 py-2.5 text-sm">
                      <option>Admin</option>
                      <option>Vendor</option>
                      <option>Customer</option>
                    </select>
                  </label>
                  <Input label="Email" defaultValue={CURRENT_ADMIN.email} />
                  <Input label="Phone" defaultValue={CURRENT_ADMIN.phone} />
                </div>
              )}

              {active === "security" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Current Password" type="password" />
                  <div />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm New Password" type="password" />
                  <Button className="sm:col-span-2 w-fit">Change Password</Button>
                </div>
              )}

              {active === "rental" && (
                <div className="space-y-5">
                  <label className="flex items-center gap-2 text-sm font-medium text-brand-text/80">
                    <input
                      type="checkbox"
                      checked={lateFeeEnabled}
                      onChange={(e) => setLateFeeEnabled(e.target.checked)}
                      className="accent-brand-accent"
                    />
                    Late Fee / Overdue Penalty
                  </label>
                  <p className="text-xs text-brand-text/45">Manage your default late fee or overdue charges.</p>
                  {lateFeeEnabled && (
                    <div className="grid max-w-xs gap-4">
                      <Input
                        label="Late Fees ($ per hour late)"
                        type="number"
                        value={defaultLateFee}
                        onChange={(e) => setDefaultLateFee(+e.target.value)}
                      />
                      <p className="text-xs text-brand-text/40">
                        This applies to all products by default — override per-product on the Product page.
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3 text-sm">
                    <a href="/admin/products" className="text-brand-accent hover:underline">Manage Attributes →</a>
                    <a href="/admin/products" className="text-brand-accent hover:underline">Manage Price Lists →</a>
                  </div>
                </div>
              )}

              {active === "company" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Company Name" defaultValue={CURRENT_ADMIN.company} />
                  <Input label="GST No" />
                  <Input label="Address" className="sm:col-span-2" />
                  <div className="sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-brand-text/80">Company Logo</span>
                    <button className="flex items-center gap-2 rounded-lg border border-dashed border-brand-text/20 px-4 py-3 text-sm text-brand-text/50 hover:border-brand-accent">
                      <Upload size={15} /> Upload
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <Button variant="outline">Discard</Button>
                <Button>Save</Button>
              </div>
            </>
          )}
        </Tabs>
      </Card>
    </AdminLayout>
  );
}
