import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { useStore } from "../../context/StoreContext.jsx";

const DISPLAY_TYPES = ["Radio", "Pills", "Check Box", "Image"];

export default function Attributes() {
  const { attributes, addAttribute } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [displayType, setDisplayType] = useState("Pills");
  const [valuesText, setValuesText] = useState("");

  const handleCreate = () => {
    addAttribute({
      name,
      displayType,
      values: valuesText.split(",").map((v) => v.trim()).filter(Boolean),
    });
    setOpen(false);
    setName("");
    setValuesText("");
  };

  return (
    <AdminLayout title="Attributes">
      <div className="mb-5 flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus size={14} /> New Attribute
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {attributes.map((attr) => (
          <Card key={attr.id} className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-brand-text">{attr.name}</h3>
              <span className="rounded-full bg-brand-accentSoft px-2 py-0.5 text-[10px] font-medium text-brand-accentDark">
                {attr.displayType}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {attr.values.map((v) => (
                <span key={v} className="rounded-full border border-brand-text/12 px-2.5 py-1 text-xs text-brand-text/60">
                  {v}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Attribute">
        <div className="space-y-4">
          <Input label="Attribute Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Brand, Color, Size" />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-brand-text/80">Display Type</span>
            <select value={displayType} onChange={(e) => setDisplayType(e.target.value)} className="w-full rounded-lg border border-brand-text/15 px-3.5 py-2.5 text-sm">
              {DISPLAY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <Input
            label="Values (comma-separated)"
            value={valuesText}
            onChange={(e) => setValuesText(e.target.value)}
            placeholder="Red, Green, Blue"
          />
          <Button className="w-full" onClick={handleCreate}>Save Attribute</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
