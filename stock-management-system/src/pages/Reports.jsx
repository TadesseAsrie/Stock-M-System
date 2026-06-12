import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../utils/helpers";
import Card, { CardHeader, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { IoDownload } from "react-icons/io5";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const {
    products,
    categories,
    suppliers,
    stockInEntries,
    stockOutEntries,
    purchaseOrders,
  } = useApp();
  const [reportType, setReportType] = useState("inventory");
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: new Date().toISOString().split("T")[0],
  });

  const filteredStockIn = stockInEntries.filter(
    (s) => s.purchaseDate >= dateRange.start && s.purchaseDate <= dateRange.end,
  );
  const filteredStockOut = stockOutEntries.filter(
    (s) => s.date >= dateRange.start && s.date <= dateRange.end,
  );
  const filteredOrders = purchaseOrders.filter(
    (po) => po.orderDate >= dateRange.start && po.orderDate <= dateRange.end,
  );

  const inventoryValue = products.reduce(
    (sum, p) => sum + p.quantity * p.costPrice,
    0,
  );
  const totalStockInValue = filteredStockIn.reduce(
    (sum, s) => sum + s.quantity * s.unitCost,
    0,
  );
  const totalStockOutValue = filteredStockOut.reduce((sum, s) => {
    const product = products.find((p) => p.id === s.productId);
    return sum + s.quantity * (product?.costPrice || 0);
  }, 0);

  const categoryData = categories.map((cat) => ({
    name: cat.name,
    value: products.filter((p) => p.categoryId === cat.id).length,
  }));
  const stockMovementData = [
    { name: "Stock In", value: totalStockInValue },
    { name: "Stock Out", value: totalStockOutValue },
  ];

  const exportCSV = () => {
    let data = [];
    if (reportType === "inventory")
      data = products.map((p) => ({
        Name: p.name,
        Code: p.code,
        Quantity: p.quantity,
        "Cost Price": p.costPrice,
        "Total Value": p.quantity * p.costPrice,
      }));
    else if (reportType === "stock_in")
      data = filteredStockIn.map((s) => ({
        Product: products.find((p) => p.id === s.productId)?.name,
        Quantity: s.quantity,
        "Unit Cost": s.unitCost,
        Total: s.quantity * s.unitCost,
        Date: s.purchaseDate,
      }));
    else if (reportType === "stock_out")
      data = filteredStockOut.map((s) => ({
        Product: products.find((p) => p.id === s.productId)?.name,
        Quantity: s.quantity,
        Department: s.department,
        Date: s.date,
      }));
    else if (reportType === "supplier")
      data = suppliers.map((s) => ({
        Name: s.name,
        Company: s.company,
        Email: s.email,
        Status: s.status,
      }));
    else if (reportType === "purchase")
      data = filteredOrders.map((po) => ({
        "PO Number": po.poNumber,
        Supplier: suppliers.find((s) => s.id === po.supplierId)?.name,
        Total: po.totalCost,
        Status: po.status,
        Date: po.orderDate,
      }));

    const headers = Object.keys(data[0] || {});
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((h) => JSON.stringify(row[h] || "")).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-gray-500">Generate and export reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          label="Report Type"
          options={[
            { value: "inventory", label: "Inventory Report" },
            { value: "stock_in", label: "Stock In Report" },
            { value: "stock_out", label: "Stock Out Report" },
            { value: "supplier", label: "Supplier Report" },
            { value: "purchase", label: "Purchase Report" },
          ]}
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        />
        <Input
          label="Start Date"
          type="date"
          value={dateRange.start}
          onChange={(e) =>
            setDateRange({ ...dateRange, start: e.target.value })
          }
        />
        <Input
          label="End Date"
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
        <div className="flex items-end">
          <Button onClick={exportCSV}>
            <IoDownload className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <p className="text-gray-500">Inventory Value</p>
            <p className="text-2xl font-bold">
              {formatCurrency(inventoryValue)}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-gray-500">Total Stock In (Selected)</p>
            <p className="text-2xl font-bold">
              {formatCurrency(totalStockInValue)}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-gray-500">Total Stock Out (Selected)</p>
            <p className="text-2xl font-bold">
              {formatCurrency(totalStockOutValue)}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-gray-500">Net Movement</p>
            <p className="text-2xl font-bold">
              {formatCurrency(totalStockInValue - totalStockOutValue)}
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3>Category Distribution</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#3B82F6" />
                  <Cell fill="#10B981" />
                  <Cell fill="#F59E0B" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3>Stock Movement Value</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockMovementData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
