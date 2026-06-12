import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { useToast } from "../hooks/useToast";
import { formatDate, generateRandomId } from "../utils/helpers";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import Table, { Thead, Tbody, Tr, Th, Td } from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { IoAdd, IoCreate, IoTrash } from "react-icons/io5";

const StockOutList = () => {
  const { products, stockOutEntries, dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    department: "",
    reason: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    if (!formData.productId || !formData.quantity) {
      addToast("Please fill required fields", "error");
      return;
    }

    const product = products.find((p) => p.id === formData.productId);
    if (product && Number(formData.quantity) > product.quantity) {
      addToast("Insufficient stock", "error");
      return;
    }

    const entryData = {
      ...formData,
      id: editingEntry?.id || generateRandomId(),
      quantity: Number(formData.quantity),
    };

    // Update product quantity
    if (product) {
      const updatedProduct = {
        ...product,
        quantity: product.quantity - Number(formData.quantity),
      };
      dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
    }

    if (editingEntry) {
      dispatch({ type: ACTIONS.UPDATE_STOCK_OUT, payload: entryData });
      addToast("Stock out entry updated", "success");
    } else {
      dispatch({ type: ACTIONS.ADD_STOCK_OUT, payload: entryData });
      addToast("Stock out recorded", "success");
    }
    setIsModalOpen(false);
    setEditingEntry(null);
    setFormData({
      productId: "",
      quantity: "",
      department: "",
      reason: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      const entry = stockOutEntries.find((e) => e.id === deleteConfirm);
      if (entry) {
        const product = products.find((p) => p.id === entry.productId);
        if (product) {
          const updatedProduct = {
            ...product,
            quantity: product.quantity + entry.quantity,
          };
          dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
        }
      }
      dispatch({ type: ACTIONS.DELETE_STOCK_OUT, payload: deleteConfirm });
      addToast("Stock out entry deleted", "success");
      setDeleteConfirm(null);
    }
  };

  const paginatedEntries = useMemo(() => {
    const sorted = [...stockOutEntries].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [stockOutEntries, currentPage]);

  const totalPages = Math.ceil(stockOutEntries.length / itemsPerPage);
  const getProductName = (id) =>
    products.find((p) => p.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Stock Out
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Record outgoing stock
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEntry(null);
            setFormData({
              productId: "",
              quantity: "",
              department: "",
              reason: "",
              date: new Date().toISOString().split("T")[0],
            });
            setIsModalOpen(true);
          }}
        >
          <IoAdd className="w-4 h-4 mr-2" />
          Record Stock Out
        </Button>
      </div>

      {stockOutEntries.length === 0 ? (
        <EmptyState title="No stock out entries" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Quantity</Th>
                  <Th>Department</Th>
                  <Th>Reason</Th>
                  <Th>Date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedEntries.map((entry) => (
                  <Tr key={entry.id}>
                    <Td className="font-medium">
                      {getProductName(entry.productId)}
                    </Td>
                    <Td className="text-red-600 font-medium">
                      -{entry.quantity}
                    </Td>
                    <Td>{entry.department || "-"}</Td>
                    <Td>{entry.reason || "-"}</Td>
                    <Td>{formatDate(entry.date)}</Td>
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
        title={editingEntry ? "Edit Stock Out" : "Record Stock Out"}
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Product"
            options={products.map((p) => ({
              value: p.id,
              label: `${p.name} (Stock: ${p.quantity})`,
            }))}
            value={formData.productId}
            onChange={(e) =>
              setFormData({ ...formData, productId: e.target.value })
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
            label="Department"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          />
          <Input
            label="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingEntry ? "Update" : "Record"}
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
          <p>This will restore product stock. Are you sure?</p>
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

export default StockOutList;
