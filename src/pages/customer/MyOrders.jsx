import React, { useState } from "react";
import { Printer } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import InvoiceModal from "../../components/InvoiceModal.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { formatCurrency, formatDate } from "../../utils/lateFee.js";
export default function MyOrders() {
  const { orders, products } = useStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-10">
         <h1 className="text-2xl font-semibold text-brand-text">My Rental Orders</h1>
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const product = products.find((p) => p.id === order.productId);
            return (
              <Card key={order.id} className="p-5 rounded-3xl border border-brand-text/10 bg-white shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4">
                    {product && <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-brand-text">Order {order.id}</p>
                        <span className="text-[11px] font-mono text-brand-text/45">({order.deliveryMethod || "Store Pickup"})</span>
                      </div>
                      <p className="text-sm text-brand-text/60 font-medium">{product?.name || "Rental Item"}</p>
                      <p className="text-xs text-brand-text/40">
                        Rental: {formatDate(order.pickupDate)} → {formatDate(order.returnDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge status={order.status} />
                    <p className="text-sm font-semibold text-brand-text">{formatCurrency(order.total)}</p>
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      <Printer size={13} /> Invoice
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      {selectedOrder && (
        <InvoiceModal open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} order={selectedOrder} />
      )}
    </div>
  );
}

