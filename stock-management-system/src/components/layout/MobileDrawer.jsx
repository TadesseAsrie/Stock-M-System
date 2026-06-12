import React from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoStorefrontOutline } from "react-icons/io5";
import { menuItems } from "./Sidebar";

const MobileDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl animate-slide-in">
        <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <IoStorefrontOutline className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              StockMaster
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileDrawer;
