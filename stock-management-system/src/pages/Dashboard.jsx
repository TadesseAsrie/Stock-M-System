import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import DashboardCards from "../components/dashboard/DashboardCards";
import StockMovementChart from "../components/dashboard/StockMovementChart";
import MonthlyInventoryChart from "../components/dashboard/MonthlyInventoryChart";
import CategoryDistributionChart from "../components/dashboard/CategoryDistributionChart";
import PurchaseSummaryChart from "../components/dashboard/PurchaseSummaryChart";
import RecentActivities from "../components/dashboard/RecentActivities";

const Dashboard = () => {
  const {
    products,
    categories,
    suppliers,
    stockInEntries,
    stockOutEntries,
    purchaseOrders,
  } = useApp();

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalSuppliers = suppliers.length;
    const availableStock = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStock = products.filter(
      (p) => p.quantity <= p.reorderLevel && p.quantity > 0,
    ).length;
    const outOfStock = products.filter((p) => p.quantity === 0).length;

    return {
      totalProducts,
      totalCategories,
      totalSuppliers,
      availableStock,
      lowStock,
      outOfStock,
    };
  }, [products, categories, suppliers]);

  const stockMovementData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      month,
      in: Math.floor(Math.random() * 1000) + 500,
      out: Math.floor(Math.random() * 800) + 300,
    }));
  }, []);

  const monthlyInventoryData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      month,
      value: Math.floor(Math.random() * 50000) + 20000,
    }));
  }, []);

  const categoryDistribution = useMemo(() => {
    const categoryMap = new Map();
    products.forEach((product) => {
      const category = categories.find((c) => c.id === product.categoryId);
      const catName = category?.name || "Unknown";
      categoryMap.set(catName, (categoryMap.get(catName) || 0) + 1);
    });
    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [products, categories]);

  const purchaseSummaryData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      month,
      amount: Math.floor(Math.random() * 30000) + 10000,
    }));
  }, []);

  const recentActivities = [
    {
      type: "product",
      message: 'New product "Smartwatch" added',
      date: new Date(),
    },
    {
      type: "stock",
      message: "Stock updated for Laptop Pro (+50 units)",
      date: new Date(Date.now() - 3600000),
    },
    {
      type: "supplier",
      message: 'New supplier "Tech Gadgets" added',
      date: new Date(Date.now() - 7200000),
    },
    {
      type: "purchase",
      message: "Purchase Order PO-2024-006 created",
      date: new Date(Date.now() - 86400000),
    },
    {
      type: "stock",
      message: "Stock out recorded for Wireless Mouse (12 units)",
      date: new Date(Date.now() - 172800000),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's your inventory overview.
        </p>
      </div>

      <DashboardCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockMovementChart data={stockMovementData} />
        <MonthlyInventoryChart data={monthlyInventoryData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDistributionChart data={categoryDistribution} />
        <PurchaseSummaryChart data={purchaseSummaryData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;
