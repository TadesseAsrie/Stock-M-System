import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useToast } from "../hooks/useToast";
import { searchFilter, sortItems, paginate } from "../utils/helpers";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import Table, { Thead, Tbody, Tr, Th, Td } from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Alert from "../components/ui/Alert";
import { IoSearch, IoAdd, IoTrash, IoCreate, IoEye } from "react-icons/io5";
import ProductForm from "../components/products/ProductForm";

const ProductsList = () => {
  const { products, categories, suppliers, dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = searchFilter(filtered, searchTerm, ["name", "code", "sku"]);
    }
    if (filterCategory) {
      filtered = filtered.filter((p) => p.categoryId === filterCategory);
    }
    if (filterStatus) {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    return sortItems(filtered, sortBy, sortOrder);
  }, [products, searchTerm, filterCategory, filterStatus, sortBy, sortOrder]);

  const paginatedProducts = paginate(
    filteredProducts,
    currentPage,
    itemsPerPage,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleDelete = () => {
    if (deleteConfirm) {
      dispatch({ type: ACTIONS.DELETE_PRODUCT, payload: deleteConfirm });
      addToast("Product deleted successfully", "success");
      setDeleteConfirm(null);
    }
  };

  const getCategoryName = (categoryId) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getSupplierName = (supplierId) => {
    return suppliers.find((s) => s.id === supplierId)?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your product inventory
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          <IoAdd className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name, code or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<IoSearch />}
          />
        </div>
        <Select
          options={[
            { value: "", label: "All Categories" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-48"
        />
        <Select
          options={[
            { value: "", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-40"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or filter"
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Image</Th>
                  <Th>Code</Th>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Supplier</Th>
                  <Th>Price</Th>
                  <Th>Quantity</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedProducts.map((product) => (
                  <Tr key={product.id}>
                    <Td>
                      <img
                        src={product.image || "https://via.placeholder.com/40"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </Td>
                    <Td className="font-mono text-xs">{product.code}</Td>
                    <Td className="font-medium">{product.name}</Td>
                    <Td>{getCategoryName(product.categoryId)}</Td>
                    <Td>{getSupplierName(product.supplierId)}</Td>
                    <Td>${product.sellingPrice}</Td>
                    <Td>
                      <span
                        className={
                          product.quantity <= product.reorderLevel
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        {product.quantity}
                      </span>
                    </Td>
                    <Td>
                      <Badge
                        color={product.status === "active" ? "green" : "gray"}
                      >
                        {product.status}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <IoEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          <IoCreate className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
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
        title={editingProduct ? "Edit Product" : "Add Product"}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
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
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
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

export default ProductsList;
