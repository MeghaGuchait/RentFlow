import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { useStore } from "../../context/StoreContext.jsx";

export default function QuotationTemplate() {
  const { templates = [], products = [], addTemplate, deleteTemplate } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [validityDays, setValidityDays] = useState(7);
  const [paymentTermsPct, setPaymentTermsPct] = useState(50);
  const [headerNote, setHeaderNote] = useState("Official Quotation — RentFlow Equipment Solutions");
  const [footerNote, setFooterNote] = useState("Valid for specified days. Security deposit refundable upon return inspection.");

  const defaultProductId = products[0]?.id || "";
  const defaultPrice = products[0]?.pricePerDay || 45;
  const [lines, setLines] = useState([{ productId: defaultProductId, qty: 1, unitPrice: defaultPrice }]);

  const handleAddLine = () => {
    setLines((s) => [...s, { productId: defaultProductId, qty: 1, unitPrice: 20 }]);
  };

  const handleRemoveLine = (idx) => {
    setLines((s) => s.filter((_, i) => i !== idx));
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    addTemplate({
      id: Date.now().toString(),
      name,
      validityDays,
      paymentTermsPct,
      headerNote,
      footerNote,
      lines,
    });
    setOpen(false);
    setName("");
    setLines([{ productId: defaultProductId, qty: 1, unitPrice: defaultPrice }]);
  };

  return (
    <AdminLayout title="Quotation Templates">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-brand-text/50 md:max-w-2xl">
          Create standardized quotation templates with validity days, payment terms, and default product lines for faster quote creation.
        </p>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus size={14} /> New Template
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-brand-text text-base">{template.name}</h3>
                <span className="rounded-full bg-brand-accentSoft px-2.5 py-0.5 text-xs font-bold text-brand-accentDark">
                  {template.validityDays}d
                </span>
              </div>
              <p className="mt-2 text-xs text-brand-text/60">
                Payment Terms: <strong>{template.paymentTermsPct}% advance</strong>
              </p>
              {template.lines?.length > 0 && (
                <div className="mt-3 rounded-lg bg-brand-text/[0.02] p-3 border border-brand-text/5 text-xs space-y-1">
                  <p className="font-semibold text-brand-text/70 uppercase tracking-wider text-[10px]">Quote Lines</p>
                  {template.lines.map((line, index) => {
                    const product = products.find((p) => p.id === line.productId);
                    return (
                      <p key={index} className="text-brand-text/70">
                        • {product?.name || "Standard Item"} ({line.qty} units)
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-brand-text/5">
              <Button size="sm" variant="outline" className="flex-1">
                Edit Template
              </Button>
              <button
                type="button"
                onClick={() => deleteTemplate(template.id)}
                className="p-2 text-brand-text/40 hover:text-red-500 hover:bg-red-50 rounded-lg"
                title="Delete Template"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Quotation Template & Quote Builder">
        <div className="space-y-4 text-xs">
          <Input
            label="Template Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Home Rental Furniture"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Validity (days)"
              type="number"
              value={validityDays}
              onChange={(e) => setValidityDays(+e.target.value)}
            />
            <Input
              label="Payment Terms (% advance)"
              type="number"
              value={paymentTermsPct}
              onChange={(e) => setPaymentTermsPct(+e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-brand-text mb-1">Header Note</label>
            <input
              className="w-full rounded-lg border border-brand-text/15 px-3 py-1.5 text-xs"
              value={headerNote}
              onChange={(e) => setHeaderNote(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-brand-text mb-1">Footer Note</label>
            <input
              className="w-full rounded-lg border border-brand-text/15 px-3 py-1.5 text-xs"
              value={footerNote}
              onChange={(e) => setFooterNote(e.target.value)}
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-brand-text/10">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-brand-text">Quote Builder</p>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1"
              >
                <Plus size={13} /> Add Product Line
              </button>
            </div>
            {lines.map((line, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-2 rounded-lg bg-brand-text/[0.02] p-2 border border-brand-text/5">
                <select
                  className="flex-1 rounded-md border border-brand-text/15 px-2 py-1 text-xs"
                  value={line.productId}
                  onChange={(e) => {
                    const product = products.find((p) => p.id === e.target.value);
                    const updated = [...lines];
                    updated[idx] = {
                      ...updated[idx],
                      productId: e.target.value,
                      unitPrice: product?.pricePerDay || 20,
                    };
                    setLines(updated);
                  }}
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className="w-20 rounded-md border border-brand-text/15 px-2 py-1 text-xs"
                  value={line.qty}
                  onChange={(e) => {
                    const updated = [...lines];
                    updated[idx].qty = +e.target.value;
                    setLines(updated);
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLine(idx)}
                  className="text-red-500 p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <Button className="w-full mt-2" onClick={handleCreate}>
            Save Quotation Template
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
