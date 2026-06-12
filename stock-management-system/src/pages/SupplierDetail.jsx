import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Card, { CardHeader, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { IoArrowBack } from "react-icons/io5";

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { suppliers, products, purchaseOrders } = useApp();

  const supplier = suppliers.find((s) => s.id === id);
  if (!supplier)
    return <div className="text-center py-12">Supplier not found</div>;

  const supplierProducts = products.filter((p) => p.supplierId === id);
  const supplierOrders = purchaseOrders.filter((po) => po.supplierId === id);

  return (
    <div className="space-y-6">
      <Button variant="secondary" onClick={() => navigate("/suppliers")}>
        <IoArrowBack className="w-4 h-4 mr-2" />
        Back to Suppliers
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Supplier Information</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 font-medium">Name:</span>{" "}
                {supplier.name}
              </div>
              <div>
                <span className="text-gray-500 font-medium">Company:</span>{" "}
                {supplier.company}
              </div>
              <div>
                <span className="text-gray-500 font-medium">Email:</span>{" "}
                {supplier.email}
              </div>
              <div>
                <span className="text-gray-500 font-medium">Phone:</span>{" "}
                {supplier.phone}
              </div>
              <div>
                <span className="text-gray-500 font-medium">Address:</span>{" "}
                {supplier.address}
              </div>
              <div>
                <span className="text-gray-500 font-medium">Status:</span>{" "}
                <Badge color={supplier.status === "active" ? "green" : "gray"}>
                  {supplier.status}
                </Badge>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Products Supplied ({supplierProducts.length})
            </h3>
          </CardHeader>
          <CardBody>
            {supplierProducts.length === 0 ? (
              <p className="text-gray-500">No products from this supplier</p>
            ) : (
              <div className="space-y-2">
                {supplierProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <span>{p.name}</span>
                    <span>{p.quantity} units</span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Purchase Orders ({supplierOrders.length})
            </h3>
          </CardHeader>
          <CardBody>
            {supplierOrders.length === 0 ? (
              <p className="text-gray-500">No purchase orders found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left">PO Number</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierOrders.map((po) => (
                      <tr key={po.id}>
                        <td>{po.poNumber}</td>
                        <td>{po.orderDate}</td>
                        <td>
                          <Badge
                            color={
                              po.status === "received"
                                ? "green"
                                : po.status === "pending"
                                  ? "yellow"
                                  : "gray"
                            }
                          >
                            {po.status}
                          </Badge>
                        </td>
                        <td>${po.totalCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDetail;
