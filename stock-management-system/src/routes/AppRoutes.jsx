import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import ProductsList from "../pages/ProductsList";
import ProductDetail from "../pages/ProductDetail";
import CategoriesList from "../pages/CategoriesList";
import InventoryList from "../pages/InventoryList";
import StockInList from "../pages/StockInList";
import StockOutList from "../pages/StockOutList";
import SuppliersList from "../pages/SuppliersList";
import SupplierDetail from "../pages/SupplierDetail";
import PurchaseOrdersList from "../pages/PurchaseOrdersList";
import Reports from "../pages/Reports";
import NotificationsList from "../pages/NotificationsList";
import UsersList from "../pages/UsersList";
import Settings from "../pages/Settings";

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/stock-in" element={<StockInList />} />
        <Route path="/stock-out" element={<StockOutList />} />
        <Route path="/suppliers" element={<SuppliersList />} />
        <Route path="/suppliers/:id" element={<SupplierDetail />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersList />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<NotificationsList />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
