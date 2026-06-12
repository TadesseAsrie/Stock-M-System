import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useToast } from "../hooks/useToast";
import { searchFilter, generateRandomId } from "../utils/helpers";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import Table, { Thead, Tbody, Tr, Th, Td } from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { IoAdd, IoEye, IoCreate, IoTrash } from "react-icons/io5";
import SupplierForm from "../components/suppliers/SupplierForm";

const SuppliersList = () => {
  const { suppliers, dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const itemsPerPage = 10;

  const filteredSuppliers = useMemo(() => {
    let filtered = suppliers;
    if (searchTerm) {
      filtered = searchFilter(filtered, searchTerm, [
        "name",
        "company",
        "email",
      ]);
    }
    if (filterStatus) {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }
    return filtered;
  }, [suppliers, searchTerm, filterStatus]);

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const handleDelete = () => {
    if (deleteConfirm) {
      dispatch({ type: ACTIONS.DELETE_SUPPLIER, payload: deleteConfirm });
      addToast("Supplier deleted successfully", "success");
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Suppliers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your suppliers
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingSupplier(null);
            setIsModalOpen(true);
          }}
        >
          <IoAdd className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          options={[
            { value: "", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-48"
        />
      </div>

      {filteredSuppliers.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Company</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedSuppliers.map((supplier) => (
                  <Tr key={supplier.id}>
                    <Td className="font-medium">{supplier.name}</Td>
                    <Td>{supplier.company}</Td>
                    <Td>{supplier.email}</Td>
                    <Td>{supplier.phone}</Td>
                    <Td>
                      <Badge
                        color={supplier.status === "active" ? "green" : "gray"}
                      >
                        {supplier.status}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/suppliers/${supplier.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <IoEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingSupplier(supplier);
                            setIsModalOpen(true);
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          <IoCreate className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(supplier.id)}
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
        title={editingSupplier ? "Edit Supplier" : "Add Supplier"}
        size="lg"
      >
        <SupplierForm
          supplier={editingSupplier}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this supplier?</p>
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

export default SuppliersList;
