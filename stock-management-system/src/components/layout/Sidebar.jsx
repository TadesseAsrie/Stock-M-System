import React from "react";
import { NavLink } from "react-router-dom";
import {
  IoGridOutline,
  IoCubeOutline,
  IoListOutline,
  IoArchiveOutline,
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoPeopleOutline,
  IoTicketOutline,
  IoBarChartOutline,
  IoNotificationsOutline,
  IoPersonAddOutline,
  IoSettingsOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoStorefrontOutline,
} from "react-icons/io5";

const menuItems = [
  { path: "/", name: "Dashboard", icon: IoGridOutline },
  { path: "/products", name: "Products", icon: IoCubeOutline },
  { path: "/categories", name: "Categories", icon: IoListOutline },
  { path: "/inventory", name: "Inventory", icon: IoArchiveOutline },
  { path: "/stock-in", name: "Stock In", icon: IoArrowDownOutline },
  { path: "/stock-out", name: "Stock Out", icon: IoArrowUpOutline },
  { path: "/suppliers", name: "Suppliers", icon: IoPeopleOutline },
  { path: "/purchase-orders", name: "Purchase Orders", icon: IoTicketOutline },
  { path: "/reports", name: "Reports", icon: IoBarChartOutline },
  {
    path: "/notifications",
    name: "Notifications",
    icon: IoNotificationsOutline,
  },
  { path: "/users", name: "Users", icon: IoPersonAddOutline },
  { path: "/settings", name: "Settings", icon: IoSettingsOutline },
];

const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <aside
      className={`fixed left-0 top-0 z-30 h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-700">
          {isOpen ? (
            <div className="flex items-center space-x-2">
              <IoStorefrontOutline className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                StockMaster
              </span>
            </div>
          ) : (
            <IoStorefrontOutline className="w-8 h-8 text-primary-600 mx-auto" />
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden lg:block"
          >
            {isOpen ? (
              <IoChevronBackOutline className="w-5 h-5" />
            ) : (
              <IoChevronForwardOutline className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    } ${!isOpen && "justify-center"}`
                  }
                  title={!isOpen ? item.name : ""}
                >
                  <item.icon className="w-5 h-5" />
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
