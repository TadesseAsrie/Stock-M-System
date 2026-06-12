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

const UsersList = () => {
  const { users, dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Staff",
    status: "active",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      addToast("Please fill required fields", "error");
      return;
    }
    const userData = { ...formData, id: editingUser?.id || generateRandomId() };
    if (editingUser) {
      dispatch({ type: ACTIONS.UPDATE_USER, payload: userData });
      addToast("User updated", "success");
    } else {
      dispatch({ type: ACTIONS.ADD_USER, payload: userData });
      addToast("User added", "success");
    }
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "Staff", status: "active" });
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      dispatch({ type: ACTIONS.DELETE_USER, payload: deleteConfirm });
      addToast("User deleted", "success");
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-500">Manage system users</p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              name: "",
              email: "",
              role: "Staff",
              status: "active",
            });
            setIsModalOpen(true);
          }}
        >
          <IoAdd /> Add User
        </Button>
      </div>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Badge
                  color={
                    user.role === "Admin"
                      ? "purple"
                      : user.role === "Manager"
                        ? "blue"
                        : "green"
                  }
                >
                  {user.role}
                </Badge>
              </Td>
              <Td>
                <Badge color={user.status === "active" ? "green" : "gray"}>
                  {user.status}
                </Badge>
              </Td>
              <Td>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setFormData(user);
                      setIsModalOpen(true);
                    }}
                  >
                    <IoCreate />
                  </button>
                  <button onClick={() => setDeleteConfirm(user.id)}>
                    <IoTrash className="text-red-600" />
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
        title={editingUser ? "Edit User" : "Add User"}
      >
        <div>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Select
            label="Role"
            options={[
              { value: "Admin", label: "Admin" },
              { value: "Manager", label: "Manager" },
              { value: "Staff", label: "Staff" },
            ]}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
              {editingUser ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
      >
        <div>
          <p>Delete this user?</p>
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

export default UsersList;
