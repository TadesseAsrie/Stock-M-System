import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoMenu,
  IoSearch,
  IoNotificationsOutline,
  IoMoon,
  IoSunny,
  IoPersonCircleOutline,
  IoLogOutOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../hooks/useToast";
import Dropdown from "../ui/Dropdown";

const TopNavbar = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { settings, notifications, dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (localStorage.getItem("theme") === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const userMenuItems = [
    {
      label: "Profile",
      icon: IoPersonCircleOutline,
      onClick: () => navigate("/settings"),
    },
    {
      label: "Settings",
      icon: IoSettingsOutline,
      onClick: () => navigate("/settings"),
    },
    {
      label: "Logout",
      icon: IoLogOutOutline,
      onClick: () => addToast("Logged out (demo)", "info"),
    },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <IoMenu className="w-5 h-5" />
          </button>
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-80 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDark ? (
              <IoSunny className="w-5 h-5" />
            ) : (
              <IoMoon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => navigate("/notifications")}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <IoNotificationsOutline className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          <Dropdown items={userMenuItems}>
            <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <IoPersonCircleOutline className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                Admin User
              </span>
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
