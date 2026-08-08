import React, { useState } from "react";
import { Plus, Trash2, FileText, CheckCircle2 } from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { useStore } from "../../context/StoreContext.jsx";

export default function QuotationTemplate() {
  const { templates, products, addTemplate, deleteTemplate } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [validityDays, setValidityDays] = useState(7);
  const [paymentTermsPct, setPaymentTermsPct] = useState(50);
  const [headerNote, setHeaderNote] = useState("Official Quotation — RentFlow Equipment Solutions");
  const [footerNote, setFooterNote] = useState("Valid for specified days. Security deposit refundable upon return inspection.");
  const [lines, setLines] = useState([
    { productId: products[0]?.id || "", qty: 1, unitPrice: products[0]?.pricePerDay || 45 },
  ]);                                                                                                              const handleAddLine = () => {
    setLines([...lines, { productId: products[0]?.id || "", qty: 1, unitPrice: 20 }]);
  };
  const handleRemoveLine = (idx) => {
    setLines(lines.filter((_, i) => i !== idx));
  };
  const handleCreate = () => {                                                                      if (!name.trim()) return;
    addTemplate({
      name,
      validityDays,
      paymentTermsPct,
      headerNote,
      footerNote,
      lines,
    });
    setOpen(false);
    setName("");
    setLines([{ productId: products[0]?.id || "", qty: 1, unitPrice: 45 }]);
  };
  return (
    <AdminLayout title="Quotation Templates">                                                                                                          <div className="mb-5 flex items-center justify-between">
        <p className="text-xs text-brand-text/50">
          Create standardized quotation templates with validity days, payment terms %, and default product lines for fast quotation generation.
        </p>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus size={14} /> New Template
        </Button>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (                                                                                          <Card key={t.id} className="p-5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-text text-base">{t.name}</h3>
                <span className="rounded-full bg-brand-accentSoft px-2.5 py-0.5 text-xs font-bold text-brand-accentDark">
                  {t.validityDays} Days Valid
                </span>
              </div>
              <p className="mt-2 text-xs text-brand-text/60">
                Payment Terms: <strong>{t.paymentTermsPct}% Advance</strong>
              </p>
              {t.lines && (
                <div className="mt-3 rounded-lg bg-brand-text/[0.02] p-2.5 border border-brand-text/5 text-xs space-y-1">
                  <p className="font-semibold text-brand-text/70 uppercase tracking-wider text-[10px]">Quote Line Items:</p>
                  {t.lines.map((l, i) => {
                    const pr = products.find((p) => p.id === l.productId);
                    return (
                      <p key={i} className="text-brand-text/70">
                        • {pr?.name || "Standard Item"} ({l.qty} Units)
                      </p>
                    );
                  })}
                </div>
              )}
            </div>                                                                                                     <div className="flex items-center gap-2 pt-2 border-t border-brand-text/5">
              <Button size="sm" variant="outline" className="flex-1">
                Edit Template
              </Button>
              <button
                onClick={() => deleteTemplate(t.id)}
                className="p-2 text-brand-text/40 hover:text-red-500 hover:bg-red-50 rounded-lg"
                title="Delete Template"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </Card>
        ))}
      </div>                                                          <Modal open={open} onClose={() => setOpen(false)} title="New Quotation Template &amp; Quote Builder">
        <div className="space-y-4 text-xs">
          <Input label="Template Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Home Rental Furniture" />
          <div className="grid grid-cols-2 gap-3">                                                                                   <Input label="Validity (Days)" type="number" value={validityDays} onChange={(e) => setValidityDays(+e.target.value)} />
            <Input label="Payment Terms (% Advance)" type="number" value={paymentTermsPct} onChange={(e) => setPaymentTermsPct(+e.target.value)} />
          </div>                                                                                                              <div>
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
          </div>                                                                                                                   {/* Quote Builder Lines */}
          <div className="space-y-2 pt-2 border-t border-brand-text/10">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-brand-text">Quote Lines</p>
              <button type="button" onClick={handleAddLine} className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1">
                <Plus size={13} /> Add Product Line
              </button>
            </div>
            {lines.map((line, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-lg bg-brand-text/[0.02] p-2 border border-brand-text/5">
                <select
                  className="flex-1 rounded-md border border-brand-text/15 px-2 py-1 text-xs"
                  value={line.productId}
                  onChange={(e) => {
                    const p = products.find((pr) => pr.id === e.target.value);
                    const updated = [...lines];
                    updated[idx] = { ...updated[idx], productId: e.target.value, unitPrice: p?.pricePerDay || 20 };
                    setLines(updated);
                  }}                                                                                                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className="w-16 rounded-md border border-brand-text/15 px-2 py-1 text-xs"
                  value={line.qty}
                  onChange={(e) => {
                    const updated = [...lines];
                    updated[idx].qty = +e.target.value;
                    setLines(updated);
                  }}
                />
                <button type="button" onClick={() => handleRemoveLine(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <Button className="w-full mt-2" onClick={handleCreate}>Save Quotation Template</Button>                                                                          </div>
      </Modal>
    </AdminLayout>
  );
}
