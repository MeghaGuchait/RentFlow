import React from "react";
import { Download } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { formatCurrency, formatDate } from "../../utils/lateFee.js";

export default function MyOrders() {
  const { orders, products } = useStore();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-brand-text">My Orders</h1>

        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const product = products.find((p) => p.id === order.productId);
            return (
              <Card key={order.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {product && <img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover" />}
                  <div>
                    <p className="font-medium text-brand-text">Order {order.id}</p>
                    <p className="text-sm text-brand-text/50">{product?.name}</p>
                    <p className="text-xs text-brand-text/40">
                      {formatDate(order.pickupDate)} → {formatDate(order.returnDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge status={order.status} />
                  <p className="text-sm font-semibold text-brand-text">{formatCurrency(order.total)}</p>
                  <Button variant="outline" size="sm">
                    <Download size={13} /> Invoice
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
