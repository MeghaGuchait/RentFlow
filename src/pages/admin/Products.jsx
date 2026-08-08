import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, EyeOff } from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { formatCurrency } from "../../utils/lateFee.js";

export default function Products() {
  const { products, updateProduct } = useStore();
  const [showNew, setShowNew] = useState(false);

  return (
    <AdminLayout title="Products">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-brand-text/50">{products.length} products · only Admin can publish/unpublish</p>
        <Button as={Link} to="/admin/products/new" size="sm">
          <Plus size={14} /> New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id} hover className="overflow-hidden">
            <img src={p.image} alt={p.name} className="h-36 w-full object-cover" />
            <div className="p-4">
              <p className="text-xs text-brand-text/45">{p.category}</p>
              <Link to={`/admin/products/${p.id}`} className="mt-1 block font-medium text-brand-text hover:text-brand-accent">
                {p.name}
              </Link>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-accent">{formatCurrency(p.pricePerDay)}/day</p>
                <p className="text-xs text-brand-text/40">{p.inStock} in stock</p>
              </div>
              <button
                onClick={() => updateProduct(p.id, { published: !p.published })}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-brand-text/12 py-1.5 text-xs font-medium text-brand-text/60 hover:bg-brand-accentSoft"
              >
                {p.published ? <><Eye size={13} /> Published</> : <><EyeOff size={13} /> Unpublished</>}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
