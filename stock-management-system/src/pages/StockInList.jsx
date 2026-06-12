import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { useToast } from "../hooks/useToast";
import { formatDate, generateRandomId } from "../utils/helpers";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import Table, { Thead, Tbody, Tr, Th, Td } from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { IoAdd, IoCreate, IoTrash } from "react-icons/io5";

const StockInList = () => {
  const { products, suppliers, stockInEntries, dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    productId: "",
    supplierId: "",
    quantity: "",
    unitCost: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    referenceNumber: "",
  });

  const handleSubmit = () => {
    if (!formData.productId || !formData.quantity || !formData.unitCost) {
      addToast("Please fill all required fields", "error");
      return;
    }

    const entryData = {
      ...formData,
      id: editingEntry?.id || generateRandomId(),
      quantity: Number(formData.quantity),
      unitCost: Number(formData.unitCost),
      createdAt:
        editingEntry?.createdAt || new Date().toISOString().split("T")[0],
    };

    // Update product quantity
    const product = products.find((p) => p.id === formData.productId);
    if (product) {
      const updatedProduct = {
        ...product,
        quantity: product.quantity + Number(formData.quantity),
      };
      dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
    }

    if (editingEntry) {
      dispatch({ type: ACTIONS.UPDATE_STOCK_IN, payload: entryData });
      addToast("Stock in entry updated", "success");
    } else {
      dispatch({ type: ACTIONS.ADD_STOCK_IN, payload: entryData });
      addToast("Stock added successfully", "success");
    }
    setIsModalOpen(false);
    setEditingEntry(null);
    setFormData({
      productId: "",
      supplierId: "",
      quantity: "",
      unitCost: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      referenceNumber: "",
    });
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      const entry = stockInEntries.find((e) => e.id === deleteConfirm);
      if (entry) {
        const product = products.find((p) => p.id === entry.productId);
        if (product) {
          const updatedProduct = {
            ...product,
            quantity: product.quantity - entry.quantity,
          };
          dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
        }
      }
      dispatch({ type: ACTIONS.DELETE_STOCK_IN, payload: deleteConfirm });
      addToast("Stock in entry deleted", "success");
      setDeleteConfirm(null);
    }
  };

  const paginatedEntries = useMemo(() => {
    const sorted = [...stockInEntries].sort(
      (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate),
    );
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [stockInEntries, currentPage]);

  const totalPages = Math.ceil(stockInEntries.length / itemsPerPage);

  const getProductName = (id) =>
    products.find((p) => p.id === id)?.name || "Unknown";
  const getSupplierName = (id) =>
    suppliers.find((s) => s.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Stock In
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Record incoming stock
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEntry(null);
            setFormData({
              productId: "",
              supplierId: "",
              quantity: "",
              unitCost: "",
              purchaseDate: new Date().toISOString().split("T")[0],
              referenceNumber: "",
            });
            setIsModalOpen(true);
          }}
        >
          <IoAdd className="w-4 h-4 mr-2" />
          Add Stock Entry
        </Button>
      </div>

      {stockInEntries.length === 0 ? (
        <EmptyState title="No stock in entries" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Supplier</Th>
                  <Th>Quantity</Th>
                  <Th>Unit Cost</Th>
                  <Th>Total</Th>
                  <Th>Date</Th>
                  <Th>Reference</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedEntries.map((entry) => (
                  <Tr key={entry.id}>
                    <Td className="font-medium">
                      {getProductName(entry.productId)}
                    </Td>
                    <Td>{getSupplierName(entry.supplierId)}</Td>
                    <Td>{entry.quantity}</Td>
                    <Td>${entry.unitCost}</Td>
                    <Td className="font-medium">
                      ${(entry.quantity * entry.unitCost).toFixed(2)}
                    </Td>
                    <Td>{formatDate(entry.purchaseDate)}</Td>
                    <Td>{entry.referenceNumber || "-"}</Td>
                    <Td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingEntry(entry);
                            setFormData(entry);
                            setIsModalOpen(true);
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          <IoCreate className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(entry.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <IoTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </Td>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEntry ? "Edit Stock Entry" : "Add Stock Entry"}
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Product"
            options={products.map((p) => ({
              value: p.id,
              label: `${p.name} (${p.code})`,
            }))}
            value={formData.productId}
            onChange={(e) =>
              setFormData({ ...formData, productId: e.target.value })
            }
          />
          <Select
            label="Supplier"
            options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
            value={formData.supplierId}
            onChange={(e) =>
              setFormData({ ...formData, supplierId: e.target.value })
            }
          />
          <Input
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />
          <Input
            label="Unit Cost"
            type="number"
            step="0.01"
            value={formData.unitCost}
            onChange={(e) =>
              setFormData({ ...formData, unitCost: e.target.value })
            }
          />
          <Input
            label="Purchase Date"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) =>
              setFormData({ ...formData, purchaseDate: e.target.value })
            }
          />
          <Input
            label="Reference Number"
            value={formData.referenceNumber}
            onChange={(e) =>
              setFormData({ ...formData, referenceNumber: e.target.value })
            }
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingEntry ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p>This will also reduce product stock. Are you sure?</p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StockInList;
