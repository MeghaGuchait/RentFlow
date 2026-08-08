import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Tabs from "../../components/ui/Tabs.jsx";
import { useStore } from "../../context/StoreContext.jsx";

const EMPTY = {
  name: "",
  category: "Electronics",
  productType: "Goods",
  pricePerDay: 0,
  pricePerHour: 0,
  pricePerWeek: 0,
  securityDeposit: 0,
  inStock: 0,
  image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
  description: "",
  rental: { periodicity: "day", pickupTime: "10:00", returnTime: "19:00", paddingHours: 1 },
  lateFee: { perHour: 0, gracePeriodHours: 0, maxLateFee: 0 },
  variants: {},
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, attributes, addProduct, updateProduct } = useStore();
  const isNew = id === "new";
  const existing = !isNew && products.find((p) => p.id === id);
  const [form, setForm] = useState(existing || EMPTY);

  const handleSave = () => {
    if (isNew) addProduct(form);
    else updateProduct(id, form);
    navigate("/admin/products");
  };

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setRental = (patch) => setForm((f) => ({ ...f, rental: { ...f.rental, ...patch } }));
  const setLateFee = (patch) => setForm((f) => ({ ...f, lateFee: { ...f.lateFee, ...patch } }));

  return (
    <AdminLayout title={isNew ? "New Product" : `Edit — ${form.name}`}>
      <Card className="p-6">
        <Tabs tabs={[{ id: "general", label: "General Information" }, { id: "attrs", label: "Attributes & Variants" }, { id: "rental", label: "Rental" }]}>
          {(active) => (
            <>
              {active === "general" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Product Name" value={form.name} onChange={(e) => set({ name: e.target.value })} />
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-brand-text/80">Category</span>
                    <select
                      value={form.category}
                      onChange={(e) => set({ category: e.target.value })}
                      className="w-full rounded-lg border border-brand-text/15 px-3.5 py-2.5 text-sm"
                    >
                      {["Electronics", "Furniture", "Photography", "Events", "Tools"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <Input label="Sales Price / day ($)" type="number" value={form.pricePerDay} onChange={(e) => set({ pricePerDay: +e.target.value })} />
                  <Input label="Sales Price / hour ($)" type="number" value={form.pricePerHour} onChange={(e) => set({ pricePerHour: +e.target.value })} />
                  <Input label="Quantity on Hand" type="number" value={form.inStock} onChange={(e) => set({ inStock: +e.target.value })} />
                  <Input label="Image URL" value={form.image} onChange={(e) => set({ image: e.target.value })} />
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-brand-text/80">Description</span>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => set({ description: e.target.value })}
                      className="w-full rounded-lg border border-brand-text/15 px-3.5 py-2.5 text-sm"
                    />
                  </label>
                  <p className="text-xs text-brand-text/40 sm:col-span-2">
                    Tip: to add a deposit or downpayment product, create a Service-type product named
                    "Deposit" and attach it on the invoice line — same for warranty add-ons.
                  </p>
                </div>
              )}

              {active === "attrs" && (
                <div className="space-y-5">
                  {attributes.map((attr) => (
                    <div key={attr.id}>
                      <p className="mb-2 text-sm font-medium text-brand-text/70">{attr.name} ({attr.displayType})</p>
                      <div className="flex flex-wrap gap-2">
                        {attr.values.map((v) => {
                          const active = form.variants[attr.name]?.includes(v);
                          return (
                            <button
                              key={v}
                              type="button"
                              onClick={() =>
                                set({
                                  variants: {
                                    ...form.variants,
                                    [attr.name]: active
                                      ? form.variants[attr.name].filter((x) => x !== v)
                                      : [...(form.variants[attr.name] || []), v],
                                  },
                                })
                              }
                              className={`rounded-full border px-3 py-1 text-xs ${
                                active ? "border-brand-accent bg-brand-accentSoft text-brand-accentDark" : "border-brand-text/15 text-brand-text/60"
                              }`}
                            >
                              {v}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {active === "rental" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-brand-text/80">Periodicity</span>
                    <select
                      value={form.rental.periodicity}
                      onChange={(e) => setRental({ periodicity: e.target.value })}
                      className="w-full rounded-lg border border-brand-text/15 px-3.5 py-2.5 text-sm"
                    >
                      {["hour", "day", "week", "month"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </label>
                  <Input label="Padding Time (hrs)" type="number" value={form.rental.paddingHours} onChange={(e) => setRental({ paddingHours: +e.target.value })} />
                  <Input label="Pickup Time" type="time" value={form.rental.pickupTime} onChange={(e) => setRental({ pickupTime: e.target.value })} />
                  <Input label="Return Time" type="time" value={form.rental.returnTime} onChange={(e) => setRental({ returnTime: e.target.value })} />

                  <div className="sm:col-span-2 rounded-xl bg-brand-accentSoft/50 p-4">
                    <p className="mb-3 text-sm font-semibold text-brand-text">Late Fee / Overdue Penalty</p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Input label="Late Fee ($/hr)" type="number" value={form.lateFee.perHour} onChange={(e) => setLateFee({ perHour: +e.target.value })} />
                      <Input label="Grace Period (hrs)" type="number" value={form.lateFee.gracePeriodHours} onChange={(e) => setLateFee({ gracePeriodHours: +e.target.value })} />
                      <Input label="Max Late Fee ($)" type="number" value={form.lateFee.maxLateFee} onChange={(e) => setLateFee({ maxLateFee: +e.target.value })} />
                    </div>
                    <p className="mt-2 text-xs text-brand-text/45">
                      Example: rented 4h, returned 4.5h late → 1 late hour × rate. A "Late Fees" line is
                      auto-added to the order when Process Return is confirmed.
                    </p>
                  </div>

                  <Input label="Security Deposit ($)" type="number" value={form.securityDeposit} onChange={(e) => set({ securityDeposit: +e.target.value })} />
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <Button variant="outline" onClick={() => navigate("/admin/products")}>Discard</Button>
                <Button onClick={handleSave}>Save Product</Button>
              </div>
            </>
          )}
        </Tabs>
      </Card>
    </AdminLayout>
  );
}
