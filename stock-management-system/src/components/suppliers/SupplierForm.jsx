import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../hooks/useToast";
import { generateRandomId } from "../../utils/helpers";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const SupplierForm = ({ supplier, onClose }) => {
  const { dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: supplier?.name || "",
    company: supplier?.company || "",
    email: supplier?.email || "",
    phone: supplier?.phone || "",
    address: supplier?.address || "",
    status: supplier?.status || "active",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      addToast("Please fill required fields", "error");
      return;
    }

    const supplierData = {
      ...formData,
      id: supplier?.id || generateRandomId(),
    };

    if (supplier) {
      dispatch({ type: ACTIONS.UPDATE_SUPPLIER, payload: supplierData });
      addToast("Supplier updated successfully", "success");
    } else {
      dispatch({ type: ACTIONS.ADD_SUPPLIER, payload: supplierData });
      addToast("Supplier added successfully", "success");
    }
    onClose();
  };

  return (
    <div className="space-y-4">
      <Input
        label="Supplier Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Input
        label="Company"
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
      />
      <Input
        label="Email"
        required
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <Input
        label="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />
      <Select
        label="Status"
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
      />
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>{supplier ? "Update" : "Create"}</Button>
      </div>
    </div>
  );
};

export default SupplierForm;
