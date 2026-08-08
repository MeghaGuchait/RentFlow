import React, { useState } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { useStore } from "../../context/StoreContext.jsx";

export default function QuotationTemplate() {
  const { templates, addTemplate } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [validityDays, setValidityDays] = useState(7);
  const [paymentTermsPct, setPaymentTermsPct] = useState(50);

  const handleCreate = () => {
    addTemplate({ name, validityDays, paymentTermsPct });
    setOpen(false);
    setName("");
  };

  return (
    <AdminLayout title="Quotation Templates">
      <div className="mb-5 flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus size={14} /> New Template
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.id} className="p-5">
            <h3 className="font-medium text-brand-text">{t.name}</h3>
            <p className="mt-2 text-xs text-brand-text/50">Quotation Validity: {t.validityDays} days</p>
            <p className="text-xs text-brand-text/50">Payment Terms: {t.paymentTermsPct}% upfront</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">Edit Header/Footer</Button>
              <Button size="sm" variant="ghost">Use Template</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Quotation Template">
        <div className="space-y-4">
          <Input label="Template Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Home Rental Furniture" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Validity (days)" type="number" value={validityDays} onChange={(e) => setValidityDays(+e.target.value)} />
            <Input label="Payment Terms (%)" type="number" value={paymentTermsPct} onChange={(e) => setPaymentTermsPct(+e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleCreate}>Save Template</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
