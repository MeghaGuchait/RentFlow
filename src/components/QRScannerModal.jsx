import React, { useState } from "react";
import { Scan, CheckCircle2, AlertCircle } from "lucide-react";
import Modal from "./ui/Modal.jsx";
import Button from "./ui/Button.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { useNavigate } from "react-router-dom";
export default function QRScannerModal({ open, onClose }) {
  const { orders } = useStore();
  const navigate = useNavigate();
  const [scannedCode, setScannedCode] = useState("");
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const handleScanSimulate = (code) => {
    const query = (code || scannedCode).trim().toUpperCase();
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      const match = orders.find((o) => o.id.toUpperCase() === query);
      if (match) {
        setResult({ success: true, order: match });
      } else {
            setResult({ success: false, message: `No active rental order found for code "${query}".` });
      }
    }, 600);
  };
  const handleOpenOrder = () => {
    if (result?.order) {
      onClose();
      navigate(`/admin/orders/${result.order.id}`);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title="QR / Barcode Scanner">
      <div className="space-y-4">
        <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-accent/40 bg-brand-accentSoft/30 p-8 text-center">
          <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
            <Scan className={`h-8 w-8 ${scanning ? "animate-pulse" : ""}`} />
            <div className="absolute inset-0 rounded-2xl border-2 border-brand-accent/60 animate-ping opacity-25"></div>
          </div>
           <p className="text-sm font-semibold text-brand-text">Scan Rental Barcode or QR Code</p>
          <p className="text-xs text-brand-text/50 max-w-xs mt-1">
            Point physical scanner or select a quick sample barcode below to simulate instant pickup/return check.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {orders.slice(0, 4).map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setScannedCode(o.id);
                  handleScanSimulate(o.id);
                }}
                className="rounded-lg border border-brand-text/15 bg-white px-2.5 py-1 text-xs font-mono text-brand-accent hover:bg-brand-accentSoft"
              >
                Scan {o.id}
              </button>
            ))}
          </div>
        </div>
<div className="flex gap-2">
          <input
            type="text"
            placeholder="Or type order barcode e.g. SO0001"
            value={scannedCode}
            onChange={(e) => setScannedCode(e.target.value)}
            className="flex-1 rounded-xl border border-brand-text/15 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
          />
          <Button onClick={() => handleScanSimulate()} disabled={scanning}>
            {scanning ? "Scanning..." : "Verify"}
          </Button>
        </div>
        {result && (
          <div
            className={`rounded-xl p-4 text-sm ${
              result.success ? "bg-emerald-50 border border-emerald-200 text-emerald-900" : "bg-red-50 border border-red-200 text-red-900"
            }`}
          >
            {result.success ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Order Verified: {result.order.id}
                </div>
                <p className="text-xs text-emerald-800">
                  Customer: <strong>{result.order.customer}</strong> · Status: <strong>{result.order.status}</strong>
                </p>
                <div className="pt-2 flex justify-end">
                  <Button size="sm" onClick={handleOpenOrder}>
                    View &amp; Process Order →
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{result.message}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}