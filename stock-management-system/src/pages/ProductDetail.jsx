import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../utils/helpers";
import Card, { CardHeader, CardBody } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { IoArrowBack } from "react-icons/io5";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, suppliers, stockInEntries, stockOutEntries } =
    useApp();

  const product = products.find((p) => p.id === id);
  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const supplier = suppliers.find((s) => s.id === product.supplierId);

  const stockActivities = [
    ...stockInEntries
      .filter((s) => s.productId === id)
      .map((s) => ({ ...s, type: "in" })),
    ...stockOutEntries
      .filter((s) => s.productId === id)
      .map((s) => ({ ...s, type: "out" })),
  ].sort(
    (a, b) =>
      new Date(b.date || b.purchaseDate) - new Date(a.date || a.purchaseDate),
  );

  return (
    <div className="space-y-6">
      <Button variant="secondary" onClick={() => navigate("/products")}>
        <IoArrowBack className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="text-center">
              <img
                src={product.image || "https://via.placeholder.com/200"}
                alt={product.name}
                className="w-48 h-48 object-cover mx-auto rounded-lg"
              />
              <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{product.code}</p>
              <div className="mt-4">
                <Badge color={product.status === "active" ? "green" : "gray"}>
                  {product.status}
                </Badge>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Product Information</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">SKU:</span>{" "}
                  {product.sku || "-"}
                </div>
                <div>
                  <span className="text-gray-500">Barcode:</span>{" "}
                  {product.barcode || "-"}
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>{" "}
                  {category?.name || "-"}
                </div>
                <div>
                  <span className="text-gray-500">Supplier:</span>{" "}
                  {supplier?.name || "-"}
                </div>
                <div>
                  <span className="text-gray-500">Cost Price:</span>{" "}
                  {formatCurrency(product.costPrice)}
                </div>
                <div>
                  <span className="text-gray-500">Selling Price:</span>{" "}
                  {formatCurrency(product.sellingPrice)}
                </div>
                <div>
                  <span className="text-gray-500">Current Stock:</span>{" "}
                  {product.quantity} {product.unit}
                </div>
                <div>
                  <span className="text-gray-500">Reorder Level:</span>{" "}
                  {product.reorderLevel}
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Description:</span>{" "}
                  {product.description || "-"}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Stock Activities</h3>
            </CardHeader>
            <CardBody>
              {stockActivities.length === 0 ? (
                <p className="text-gray-500">No stock activities found</p>
              ) : (
                <div className="space-y-3">
                  {stockActivities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {activity.type === "in" ? "Stock In" : "Stock Out"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.type === "in"
                            ? activity.purchaseDate
                            : activity.date}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`font-semibold ${activity.type === "in" ? "text-green-600" : "text-red-600"}`}
                        >
                          {activity.type === "in" ? "+" : "-"}
                          {activity.quantity} units
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
