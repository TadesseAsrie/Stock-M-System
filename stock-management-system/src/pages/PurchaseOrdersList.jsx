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
import { IoAdd, IoCreate, IoTrash, IoEye } from "react-icons/io5";

const PurchaseOrdersList = () => {
  const { suppliers, products, purchaseOrders, dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    poNumber: "",
    supplierId: "",
    orderDate: new Date().toISOString().split("T")[0],
    status: "pending",
    items: [{ productId: "", quantity: 1, unitPrice: 0 }],
  });

  const addItem = () =>
    setFormData({
      ...formData,
      items: [...formData.items, { productId: "", quantity: 1, unitPrice: 0 }],
    });
  const removeItem = (index) =>
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const totalCost = useMemo(
    () =>
      formData.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
    [formData.items],
  );

  const handleSubmit = () => {
    if (
      !formData.poNumber ||
      !formData.supplierId ||
      formData.items.length === 0
    ) {
      addToast("Please fill all required fields", "error");
      return;
    }

    const orderData = {
      ...formData,
      id: editingOrder?.id || generateRandomId(),
      totalCost,
    };

    if (editingOrder) {
      dispatch({ type: ACTIONS.UPDATE_PURCHASE_ORDER, payload: orderData });
      addToast("Purchase order updated", "success");
    } else {
      dispatch({ type: ACTIONS.ADD_PURCHASE_ORDER, payload: orderData });
      addToast("Purchase order created", "success");
    }
    setIsModalOpen(false);
    setEditingOrder(null);
    setFormData({
      poNumber: "",
      supplierId: "",
      orderDate: new Date().toISOString().split("T")[0],
      status: "pending",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
    });
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      dispatch({ type: ACTIONS.DELETE_PURCHASE_ORDER, payload: deleteConfirm });
      addToast("Purchase order deleted", "success");
      setDeleteConfirm(null);
    }
  };

  const paginatedOrders = useMemo(() => {
    const sorted = [...purchaseOrders].sort(
      (a, b) => new Date(b.orderDate) - new Date(a.orderDate),
    );
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [purchaseOrders, currentPage]);

  const totalPages = Math.ceil(purchaseOrders.length / itemsPerPage);
  const getSupplierName = (id) =>
    suppliers.find((s) => s.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-gray-500">Manage purchase orders</p>
        </div>
        <Button
          onClick={() => {
            setEditingOrder(null);
            setFormData({
              poNumber: "",
              supplierId: "",
              orderDate: new Date().toISOString().split("T")[0],
              status: "pending",
              items: [{ productId: "", quantity: 1, unitPrice: 0 }],
            });
            setIsModalOpen(true);
          }}
        >
          <IoAdd /> Create PO
        </Button>
      </div>

      {purchaseOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>PO Number</Th>
                <Th>Supplier</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Total</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedOrders.map((po) => (
                <Tr key={po.id}>
                  <Td className="font-medium">{po.poNumber}</Td>
                  <Td>{getSupplierName(po.supplierId)}</Td>
                  <Td>{formatDate(po.orderDate)}</Td>
                  <Td>
                    <Badge
                      color={
                        po.status === "received"
                          ? "green"
                          : po.status === "approved"
                            ? "blue"
                            : po.status === "pending"
                              ? "yellow"
                              : "red"
                      }
                    >
                      {po.status}
                    </Badge>
                  </Td>
                  <Td>${po.totalCost}</Td>
                  <Td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingOrder(po);
                          setFormData(po);
                          setIsModalOpen(true);
                        }}
                      >
                        <IoCreate />
                      </button>
                      <button onClick={() => setDeleteConfirm(po.id)}>
                        <IoTrash className="text-red-600" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
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
        title={editingOrder ? "Edit Purchase Order" : "Create Purchase Order"}
        size="xl"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="PO Number"
            value={formData.poNumber}
            onChange={(e) =>
              setFormData({ ...formData, poNumber: e.target.value })
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
            label="Order Date"
            type="date"
            value={formData.orderDate}
            onChange={(e) =>
              setFormData({ ...formData, orderDate: e.target.value })
            }
          />
          <Select
            label="Status"
            options={[
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "received", label: "Received" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          />

          <div>
            <h4 className="font-medium mb-2">Items</h4>
            {formData.items.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Select
                  options={products.map((p) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                  value={item.productId}
                  onChange={(e) => updateItem(idx, "productId", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                  className="w-24"
                />
                <Input
                  type="number"
                  placeholder="Price"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
                  className="w-28"
                />
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addItem}
            >
              + Add Item
            </Button>
          </div>
          <div className="text-right font-bold">
            Total: ${totalCost.toFixed(2)}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingOrder ? "Update" : "Create"}
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
        <div>
          <p>Delete this purchase order?</p>
          <div className="flex justify-end space-x-3 mt-4">
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

export default PurchaseOrdersList;
