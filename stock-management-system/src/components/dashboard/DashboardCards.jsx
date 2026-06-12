import React from "react";
import {
  IoCubeOutline,
  IoListOutline,
  IoArchiveOutline,
  IoWarningOutline,
  IoCloseCircleOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import Card from "../ui/Card";

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: IoCubeOutline,
      color: "bg-blue-500",
    },
    {
      title: "Total Categories",
      value: stats.totalCategories,
      icon: IoListOutline,
      color: "bg-green-500",
    },
    {
      title: "Available Stock",
      value: stats.availableStock,
      icon: IoArchiveOutline,
      color: "bg-purple-500",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStock,
      icon: IoWarningOutline,
      color: "bg-yellow-500",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock,
      icon: IoCloseCircleOutline,
      color: "bg-red-500",
    },
    {
      title: "Suppliers",
      value: stats.totalSuppliers,
      icon: IoPeopleOutline,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                <card.icon
                  className={`w-6 h-6 ${card.color.replace("bg-", "text-")}`}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardCards;
