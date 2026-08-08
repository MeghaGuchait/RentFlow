import React, { useState } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { useStore } from "../../context/StoreContext.jsx";

export default function PriceLists() {
  const { priceLists, addPriceList } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [priceType, setPriceType] = useState("Discount");
  const [value, setValue] = useState(0);
  const [minQty, setMinQty] = useState(0);

  const handleCreate = () => {
    addPriceList({
      name,
      isDefault: false,
      rules: [{ applyOn: "All Products", priceType, value, minQty }],
    });
    setOpen(false);
    setName("");
    setValue(0);
  };

  return (
    <AdminLayout title="Price Lists">
      <div className="mb-5 flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus size={14} /> New Price List
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {priceLists.map((pl) => (
          <Card key={pl.id} className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-brand-text">{pl.name}</h3>
              {pl.isDefault && <span className="rounded-full bg-brand-accentSoft px-2 py-0.5 text-[10px] font-medium text-brand-accentDark">Default</span>}
            </div>
            {pl.rules.map((r, i) => (
              <p key={i} className="text-xs text-brand-text/50">
                {r.applyOn} · {r.priceType} {r.discountPct ? `${r.discountPct}%` : r.value ? `$${r.value}` : ""} · min qty {r.minQty}
              </p>
            ))}
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Pricelist Rule">
        <div className="space-y-4">
          <Input label="Name (My Price List)" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-brand-text/80">Price Type</span>
            <select value={priceType} onChange={(e) => setPriceType(e.target.value)} className="w-full rounded-lg border border-brand-text/15 px-3.5 py-2.5 text-sm">
              <option>Discount</option>
              <option>Fixed Price</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input label={priceType === "Discount" ? "Discount %" : "Fixed Price $"} type="number" value={value} onChange={(e) => setValue(+e.target.value)} />
            <Input label="Min Qty" type="number" value={minQty} onChange={(e) => setMinQty(+e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleCreate}>Save Price List</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
