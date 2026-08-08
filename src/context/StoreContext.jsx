import React, { createContext, useContext, useState, useCallback } from "react";
import {
  PRODUCTS,
  ORDERS,
  PRICE_LISTS,
  ATTRIBUTES,
  QUOTATION_TEMPLATES,
  CATEGORIES,
} from "../data/mockData.js";
import { calculateSettlement } from "../utils/lateFee.js";

// This context is the single source of truth for the prototype's "backend".
// Every function here is a natural seam for swapping in real API calls:
// e.g. replace setProducts(...) with a POST/PUT to /api/products and refetch.
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);
  const [orders, setOrders] = useState(ORDERS);
  const [priceLists, setPriceLists] = useState(PRICE_LISTS);
  const [attributes, setAttributes] = useState(ATTRIBUTES);
  const [templates, setTemplates] = useState(QUOTATION_TEMPLATES);

  const addProduct = useCallback((product) => {
    setProducts((prev) => [...prev, { ...product, id: `p-${Date.now()}` }]);
  }, []);

  const updateProduct = useCallback((id, patch) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const createOrder = useCallback((order) => {
    const id = `SO${String(1000 + orders.length + 1).slice(1)}`;
    setOrders((prev) => [...prev, { ...order, id, status: order.status || "reserved" }]);
    return id;
  }, [orders.length]);

  const updateOrderStatus = useCallback((id, status, extra = {}) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status, ...extra } : o)));
  }, []);

  /** Processes a return: computes late fee/deposit refund and closes the order. */
  const processReturn = useCallback(
    (orderId, actualReturnDate) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return null;
      const product = products.find((p) => p.id === order.productId);
      const settlement = calculateSettlement({
        dueDate: order.returnDate,
        actualDate: actualReturnDate,
        gracePeriodHours: product?.lateFee?.gracePeriodHours || 0,
        lateFeePerHour: product?.lateFee?.perHour || 0,
        depositAmount: order.depositHeld,
        maxLateFee: product?.lateFee?.maxLateFee ?? Infinity,
      });
      updateOrderStatus(orderId, settlement.isLate ? "late_return" : "returned", {
        settlement,
        actualReturnDate,
      });
      return settlement;
    },
    [orders, products, updateOrderStatus]
  );

  const addPriceList = useCallback((pl) => {
    setPriceLists((prev) => [...prev, { ...pl, id: `pl-${Date.now()}` }]);
  }, []);

  const addAttribute = useCallback((attr) => {
    setAttributes((prev) => [...prev, { ...attr, id: `attr-${Date.now()}` }]);
  }, []);

  const addTemplate = useCallback((tpl) => {
    setTemplates((prev) => [...prev, { ...tpl, id: `qt-${Date.now()}` }]);
  }, []);

  // --- Derived dashboard metrics -----------------------------------------
  const dashboardStats = React.useMemo(() => {
    const now = new Date();
    const isToday = (d) => new Date(d).toDateString() === now.toDateString();
    return {
      activeRentals: orders.filter((o) => o.status === "picked_up").length,
      dueToday: orders.filter((o) => isToday(o.returnDate)).length,
      upcomingPickups: orders.filter((o) => o.status === "reserved").length,
      upcomingReturns: orders.filter((o) => ["picked_up", "late_pickup"].includes(o.status)).length,
      overdue: orders.filter((o) => o.status === "late_pickup" || o.status === "late_return").length,
      revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
      depositsHeld: orders
        .filter((o) => !["returned", "late_return", "cancelled"].includes(o.status))
        .reduce((s, o) => s + (o.depositHeld || 0), 0),
      lateFeeCollected: orders.reduce((s, o) => s + (o.settlement?.lateFee || 0), 0),
    };
  }, [orders]);

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        priceLists,
        attributes,
        templates,
        categories: CATEGORIES,
        dashboardStats,
        addProduct,
        updateProduct,
        deleteProduct,
        createOrder,
        updateOrderStatus,
        processReturn,
        addPriceList,
        addAttribute,
        addTemplate,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
