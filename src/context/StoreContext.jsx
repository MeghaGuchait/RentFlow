import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import {
  PRODUCTS,
  ORDERS,
  ATTRIBUTES,
  PRICE_LISTS,
  QUOTATION_TEMPLATES,
  CATEGORIES,
} from "../data/mockData.js";
import { calculateSettlement } from "../utils/lateFee.js";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);
  const [orders, setOrders] = useState(ORDERS);
  const [attributes, setAttributes] = useState(ATTRIBUTES);
  const [priceLists, setPriceLists] = useState(PRICE_LISTS);
  const [templates, setTemplates] = useState(QUOTATION_TEMPLATES);

  const [settings, setSettings] = useState({
    enableLateFee: true,
    globalLateFeePerHour: 10,
    globalGracePeriodHours: 1,
    maxLateFeeLimit: 200,
    enableAttributes: true,
    enablePriceLists: true,
    companyHeader: "RentFlow Enterprise — Modern Equipment Rentals",
    companyFooter:
      "Thank you for renting with RentFlow! For support, contact support@rentflow.io",
  });

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const addProduct = useCallback((product) => {
    setProducts((prev) => [...prev, { ...product, id: `p-${Date.now()}` }]);
  }, []);

  const updateProduct = useCallback((id, patch) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...patch } : product)));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  }, []);

  const addAttribute = useCallback((attribute) => {
    setAttributes((prev) => [...prev, { ...attribute, id: `attr-${Date.now()}` }]);
  }, []);

  const addTemplate = useCallback((template) => {
    setTemplates((prev) => [...prev, { ...template, id: `qt-${Date.now()}` }]);
  }, []);

  const addPriceList = useCallback((priceList) => {
    setPriceLists((prev) => [...prev, { ...priceList, id: `pl-${Date.now()}` }]);
  }, []);

  const createOrder = useCallback(
    (order) => {
      const id = `SO${String(1000 + orders.length + 1).padStart(4, "0")}`;
      const newOrder = {
        ...order,
        id,
        status: order.status || "reserved",
        createdAt: new Date().toISOString(),
        invoiceStatus: order.invoiceStatus || (order.status === "quotation" ? "quotation_sent" : "invoiced"),
      };
      setOrders((prev) => [newOrder, ...prev]);
      return id;
    },
    [orders.length]
  );

  const updateOrderStatus = useCallback((id, status, extra = {}) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        let invoiceStatus = o.invoiceStatus;
        if (status === "quotation_sent") invoiceStatus = "quotation_sent";
        if (status === "reserved") invoiceStatus = "confirmed";
        if (status === "picked_up") invoiceStatus = "invoiced";
        if (status === "cancelled") invoiceStatus = "nothing_to_invoice";
        return { ...o, status, invoiceStatus, ...extra };
      })
    );
  }, []);

  /**
   * Processes a return with condition inspection & deposit settlement:
   * @param {string} orderId
   * @param {string} actualReturnDate
   * @param {object} inspection { condition: 'good'|'damaged'|'missing', damageFee: 0, missingAccFee: 0, notes: '' }
   */
  const processReturn = useCallback(
    (orderId, actualReturnDate, inspection = {}) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return null;
      const product = products.find((p) => p.id === order.productId);
      const lateFeePerHour = product?.lateFee?.perHour ?? settings.globalLateFeePerHour;
      const gracePeriodHours = product?.lateFee?.gracePeriodHours ?? settings.globalGracePeriodHours;
      const maxLateFee = product?.lateFee?.maxLateFee ?? settings.maxLateFeeLimit;
      const settlement = calculateSettlement({
        dueDate: order.returnDate,
        actualDate: actualReturnDate || new Date().toISOString(),
        gracePeriodHours,
        lateFeePerHour,
        depositAmount: order.depositHeld || 0,
        maxLateFee,
        damageFee: Number(inspection.damageFee) || 0,
        missingAccFee: Number(inspection.missingAccFee) || 0,
      });
      const isLateOrDamaged = settlement.isLate || settlement.damageFee > 0 || settlement.missingAccFee > 0;
      const newStatus = isLateOrDamaged ? "late_return" : "returned";
      updateOrderStatus(orderId, newStatus, {
        settlement,
        actualReturnDate: actualReturnDate || new Date().toISOString(),
        inspectionNotes: inspection.notes || "",
        productCondition: inspection.condition || "good",
      });
      return settlement;
    },
    [orders, products, settings, updateOrderStatus]
  );

  const updateTemplate = useCallback((id, patch) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTemplate = useCallback((id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dashboardStats = useMemo(() => {
    return {
      depositsHeld: orders
        .filter((o) => !["returned", "late_return", "cancelled"].includes(o.status))
        .reduce((s, o) => s + (o.depositHeld || 0), 0),
      lateFeeCollected: orders.reduce((s, o) => s + (o.settlement?.lateFee || 0) + (o.settlement?.damageFee || 0), 0),
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
        settings,
        categories: CATEGORIES,
        dashboardStats,
        updateSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        addPriceList,
        addAttribute,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        createOrder,
        updateOrderStatus,
        processReturn,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
