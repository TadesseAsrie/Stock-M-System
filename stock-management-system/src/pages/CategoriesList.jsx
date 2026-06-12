import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useToast } from "../hooks/useToast";
import { generateRandomId } from "../utils/helpers";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import Table, { Thead, Tbody, Tr, Th, Td } from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import { IoAdd, IoCreate, IoTrash } from "react-icons/io5";

const CategoriesList = () => {
  const { categories, dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const handleSubmit = () => {
    if (!formData.name) {
      addToast("Category name is required", "error");
      return;
    }

    if (editingCategory) {
      dispatch({
        type: ACTIONS.UPDATE_CATEGORY,
        payload: { ...editingCategory, ...formData },
      });
      addToast("Category updated successfully", "success");
    } else {
      dispatch({
        type: ACTIONS.ADD_CATEGORY,
        payload: { id: generateRandomId(), ...formData },
      });
      addToast("Category added successfully", "success");
    }
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", status: "active" });
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      dispatch({ type: ACTIONS.DELETE_CATEGORY, payload: deleteConfirm });
      addToast("Category deleted successfully", "success");
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage product categories
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", description: "", status: "active" });
            setIsModalOpen(true);
          }}
        >
          <IoAdd className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category) => (
            <Tr key={category.id}>
              <Td className="font-medium">{category.name}</Td>
              <Td>{category.description || "-"}</Td>
              <Td>
                <Badge color={category.status === "active" ? "green" : "gray"}>
                  {category.status}
                </Badge>
              </Td>
              <Td>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setFormData(category);
                      setIsModalOpen(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <IoCreate className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(category.id)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <Select
            label="Status"
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingCategory ? "Update" : "Create"}
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
          <p>Are you sure you want to delete this category?</p>
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

export default CategoriesList;
