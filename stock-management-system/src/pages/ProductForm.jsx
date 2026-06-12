import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../hooks/useToast";
import { generateRandomId } from "../../utils/helpers";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const ProductForm = ({ product, onClose }) => {
  const { categories, suppliers, dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    code: product?.code || "",
    sku: product?.sku || "",
    categoryId: product?.categoryId || "",
    supplierId: product?.supplierId || "",
    description: product?.description || "",
    costPrice: product?.costPrice || "",
    sellingPrice: product?.sellingPrice || "",
    quantity: product?.quantity || 0,
    unit: product?.unit || "pcs",
    barcode: product?.barcode || "",
    status: product?.status || "active",
    reorderLevel: product?.reorderLevel || 10,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      id: product?.id || generateRandomId(),
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      quantity: Number(formData.quantity),
      reorderLevel: Number(formData.reorderLevel),
      image: "https://via.placeholder.com/100",
    };

    if (product) {
      dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: productData });
      addToast("Product updated successfully", "success");
    } else {
      dispatch({ type: ACTIONS.ADD_PRODUCT, payload: productData });
      addToast("Product added successfully", "success");
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Product Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          label="Product Code"
          required
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        />
        <Input
          label="SKU"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        />
        <Select
          label="Category"
          required
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          value={formData.categoryId}
          onChange={(e) =>
            setFormData({ ...formData, categoryId: e.target.value })
          }
        />
        <Select
          label="Supplier"
          required
          options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
          value={formData.supplierId}
          onChange={(e) =>
            setFormData({ ...formData, supplierId: e.target.value })
          }
        />
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <Input
          label="Cost Price"
          type="number"
          step="0.01"
          required
          value={formData.costPrice}
          onChange={(e) =>
            setFormData({ ...formData, costPrice: e.target.value })
          }
        />
        <Input
          label="Selling Price"
          type="number"
          step="0.01"
          required
          value={formData.sellingPrice}
          onChange={(e) =>
            setFormData({ ...formData, sellingPrice: e.target.value })
          }
        />
        <Input
          label="Quantity"
          type="number"
          required
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
        />
        <Input
          label="Unit"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        />
        <Input
          label="Barcode"
          value={formData.barcode}
          onChange={(e) =>
            setFormData({ ...formData, barcode: e.target.value })
          }
        />
        <Input
          label="Reorder Level"
          type="number"
          value={formData.reorderLevel}
          onChange={(e) =>
            setFormData({ ...formData, reorderLevel: e.target.value })
          }
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
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{product ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
};

export default ProductForm;
