import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { lineId, product, qty, startDate, endDate, variant }

  const addItem = useCallback((product, options = {}) => {
    const lineId = `${product.id}-${Date.now()}`;
    setItems((prev) => [
      ...prev,
      {
        lineId,
        product,
        qty: options.qty || 1,
        startDate: options.startDate || "",
        endDate: options.endDate || "",
        variant: options.variant || {},
      },
    ]);
  }, []);

  const removeItem = useCallback((lineId) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const updateQty = useCallback((lineId, qty) => {
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, qty: Math.max(1, qty) } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.pricePerDay * i.qty, 0),
    [items]
  );
  const depositTotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.securityDeposit * i.qty, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, subtotal, depositTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
