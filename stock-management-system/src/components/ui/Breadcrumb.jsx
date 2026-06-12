import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoHome } from "react-icons/io5";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getDisplayName = (path) => {
    const names = {
      dashboard: "Dashboard",
      products: "Products",
      categories: "Categories",
      inventory: "Inventory",
      "stock-in": "Stock In",
      "stock-out": "Stock Out",
      suppliers: "Suppliers",
      "purchase-orders": "Purchase Orders",
      reports: "Reports",
      notifications: "Notifications",
      users: "Users",
      settings: "Settings",
    };
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <Link
        to="/"
        className="hover:text-primary-600 dark:hover:text-primary-400"
      >
        <IoHome className="w-4 h-4" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return (
          <React.Fragment key={name}>
            <span>/</span>
            {isLast ? (
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {getDisplayName(name)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {getDisplayName(name)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
