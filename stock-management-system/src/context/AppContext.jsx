import React, { createContext, useContext, useReducer, useEffect } from "react";
import { initialData } from "../data/dummyData";
import useLocalStorage from "../hooks/useLocalStorage";

const AppContext = createContext();

const ACTIONS = {
  // Products
  ADD_PRODUCT: "ADD_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
  // Categories
  ADD_CATEGORY: "ADD_CATEGORY",
  UPDATE_CATEGORY: "UPDATE_CATEGORY",
  DELETE_CATEGORY: "DELETE_CATEGORY",
  // Suppliers
  ADD_SUPPLIER: "ADD_SUPPLIER",
  UPDATE_SUPPLIER: "UPDATE_SUPPLIER",
  DELETE_SUPPLIER: "DELETE_SUPPLIER",
  // Stock In
  ADD_STOCK_IN: "ADD_STOCK_IN",
  UPDATE_STOCK_IN: "UPDATE_STOCK_IN",
  DELETE_STOCK_IN: "DELETE_STOCK_IN",
  // Stock Out
  ADD_STOCK_OUT: "ADD_STOCK_OUT",
  UPDATE_STOCK_OUT: "UPDATE_STOCK_OUT",
  DELETE_STOCK_OUT: "DELETE_STOCK_OUT",
  // Purchase Orders
  ADD_PURCHASE_ORDER: "ADD_PURCHASE_ORDER",
  UPDATE_PURCHASE_ORDER: "UPDATE_PURCHASE_ORDER",
  DELETE_PURCHASE_ORDER: "DELETE_PURCHASE_ORDER",
  // Notifications
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  MARK_NOTIFICATION_READ: "MARK_NOTIFICATION_READ",
  DELETE_NOTIFICATION: "DELETE_NOTIFICATION",
  // Users
  ADD_USER: "ADD_USER",
  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",
  // Settings
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };
    case ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
      };
    case ACTIONS.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };

    case ACTIONS.ADD_CATEGORY:
      return { ...state, categories: [...state.categories, action.payload] };
    case ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c,
        ),
      };
    case ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
      };

    case ACTIONS.ADD_SUPPLIER:
      return { ...state, suppliers: [...state.suppliers, action.payload] };
    case ACTIONS.UPDATE_SUPPLIER:
      return {
        ...state,
        suppliers: state.suppliers.map((s) =>
          s.id === action.payload.id ? action.payload : s,
        ),
      };
    case ACTIONS.DELETE_SUPPLIER:
      return {
        ...state,
        suppliers: state.suppliers.filter((s) => s.id !== action.payload),
      };

    case ACTIONS.ADD_STOCK_IN:
      return {
        ...state,
        stockInEntries: [...state.stockInEntries, action.payload],
      };
    case ACTIONS.UPDATE_STOCK_IN:
      return {
        ...state,
        stockInEntries: state.stockInEntries.map((s) =>
          s.id === action.payload.id ? action.payload : s,
        ),
      };
    case ACTIONS.DELETE_STOCK_IN:
      return {
        ...state,
        stockInEntries: state.stockInEntries.filter(
          (s) => s.id !== action.payload,
        ),
      };

    case ACTIONS.ADD_STOCK_OUT:
      return {
        ...state,
        stockOutEntries: [...state.stockOutEntries, action.payload],
      };
    case ACTIONS.UPDATE_STOCK_OUT:
      return {
        ...state,
        stockOutEntries: state.stockOutEntries.map((s) =>
          s.id === action.payload.id ? action.payload : s,
        ),
      };
    case ACTIONS.DELETE_STOCK_OUT:
      return {
        ...state,
        stockOutEntries: state.stockOutEntries.filter(
          (s) => s.id !== action.payload,
        ),
      };

    case ACTIONS.ADD_PURCHASE_ORDER:
      return {
        ...state,
        purchaseOrders: [...state.purchaseOrders, action.payload],
      };
    case ACTIONS.UPDATE_PURCHASE_ORDER:
      return {
        ...state,
        purchaseOrders: state.purchaseOrders.map((po) =>
          po.id === action.payload.id ? action.payload : po,
        ),
      };
    case ACTIONS.DELETE_PURCHASE_ORDER:
      return {
        ...state,
        purchaseOrders: state.purchaseOrders.filter(
          (po) => po.id !== action.payload,
        ),
      };

    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case ACTIONS.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n,
        ),
      };
    case ACTIONS.DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload,
        ),
      };

    case ACTIONS.ADD_USER:
      return { ...state, users: [...state.users, action.payload] };
    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u,
        ),
      };
    case ACTIONS.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.payload),
      };

    case ACTIONS.UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [storedData, setStoredData] = useLocalStorage(
    "stockAppData",
    initialData,
  );
  const [state, dispatch] = useReducer(reducer, storedData);

  useEffect(() => {
    setStoredData(state);
  }, [state, setStoredData]);

  const value = {
    ...state,
    dispatch,
    ACTIONS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
