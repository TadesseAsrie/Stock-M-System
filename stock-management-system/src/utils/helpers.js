import { format } from "date-fns";

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return "-";
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatDateTime = (date) => {
  if (!date) return "-";
  return format(new Date(date), "MMM dd, yyyy hh:mm a");
};

export const getStockStatus = (quantity, reorderLevel) => {
  if (quantity <= 0) return { label: "Out of Stock", color: "red" };
  if (quantity <= reorderLevel) return { label: "Low Stock", color: "yellow" };
  return { label: "In Stock", color: "green" };
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "green";
    case "inactive":
      return "gray";
    case "pending":
      return "yellow";
    case "approved":
      return "blue";
    case "received":
      return "green";
    case "cancelled":
      return "red";
    default:
      return "gray";
  }
};

export const getRoleColor = (role) => {
  switch (role) {
    case "Admin":
      return "purple";
    case "Manager":
      return "blue";
    case "Staff":
      return "green";
    default:
      return "gray";
  }
};

export const truncateText = (text, length = 50) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

export const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const paginate = (items, page, perPage) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return items.slice(start, end);
};

export const searchFilter = (items, searchTerm, fields) => {
  if (!searchTerm) return items;
  const term = searchTerm.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(term);
    }),
  );
};

export const sortItems = (items, sortBy, sortOrder = "asc") => {
  if (!sortBy) return items;
  return [...items].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
};
