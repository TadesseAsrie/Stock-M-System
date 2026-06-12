import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { searchFilter, sortItems, paginate } from "../utils/helpers";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Table, { Thead, Tbody, Tr, Th, Td } from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { IoDownload } from "react-icons/io5";

const InventoryList = () => {
  const { products, categories } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const inventoryData = useMemo(() => {
    return products.map((product) => {
      const category = categories.find((c) => c.id === product.categoryId);
      let stockStatus = "in_stock";
      if (product.quantity === 0) stockStatus = "out_of_stock";
      else if (product.quantity <= product.reorderLevel)
        stockStatus = "low_stock";
      else if (product.quantity <= product.reorderLevel / 2)
        stockStatus = "critical";

      return {
        ...product,
        categoryName: category?.name || "Unknown",
        availableStock: product.quantity - (product.reservedStock || 0),
        stockStatus,
      };
    });
  }, [products, categories]);

  const filteredData = useMemo(() => {
    let filtered = inventoryData;
    if (searchTerm) {
      filtered = searchFilter(filtered, searchTerm, ["name", "code"]);
    }
    if (filterStatus) {
      filtered = filtered.filter((item) => item.stockStatus === filterStatus);
    }
    return sortItems(filtered, "name", "asc");
  }, [inventoryData, searchTerm, filterStatus]);

  const paginatedData = paginate(filteredData, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusBadge = (status) => {
    const badges = {
      in_stock: { label: "In Stock", color: "green" },
      low_stock: { label: "Low Stock", color: "yellow" },
      critical: { label: "Critical", color: "red" },
      out_of_stock: { label: "Out of Stock", color: "gray" },
    };
    return <Badge color={badges[status].color}>{badges[status].label}</Badge>;
  };

  const handleExport = () => {
    const csv = [
      [
        "Product",
        "Code",
        "Current Stock",
        "Reserved",
        "Available",
        "Reorder Level",
        "Status",
      ],
    ];
    filteredData.forEach((item) => {
      csv.push([
        item.name,
        item.code,
        item.quantity,
        item.reservedStock || 0,
        item.availableStock,
        item.reorderLevel,
        item.stockStatus,
      ]);
    });
    const csvContent = csv.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track current stock levels
          </p>
        </div>
        <Button variant="secondary" onClick={handleExport}>
          <IoDownload className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          options={[
            { value: "", label: "All Status" },
            { value: "in_stock", label: "In Stock" },
            { value: "low_stock", label: "Low Stock" },
            { value: "critical", label: "Critical" },
            { value: "out_of_stock", label: "Out of Stock" },
          ]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-48"
        />
      </div>

      {filteredData.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Current Stock</Th>
                  <Th>Reserved</Th>
                  <Th>Available</Th>
                  <Th>Reorder Level</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedData.map((item) => (
                  <Tr key={item.id}>
                    <Td className="font-medium">{item.name}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>{item.reservedStock || 0}</Td>
                    <Td
                      className={
                        item.availableStock <= item.reorderLevel
                          ? "text-red-600 font-medium"
                          : ""
                      }
                    >
                      {item.availableStock}
                    </Td>
                    <Td>{item.reorderLevel}</Td>
                    <Td>{getStatusBadge(item.stockStatus)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default InventoryList;
